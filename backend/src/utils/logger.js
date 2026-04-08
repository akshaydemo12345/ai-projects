'use strict';

const fs = require('fs');
const path = require('path');

// ─── Ensure logs directory exists ─────────────────────────────────────────────
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// ─── Log Levels ───────────────────────────────────────────────────────────────
const LEVELS = { error: 0, warn: 1, info: 2, http: 3, debug: 4 };
const COLORS = {
  error: '\x1b[31m', // red
  warn:  '\x1b[33m', // yellow
  info:  '\x1b[36m', // cyan
  http:  '\x1b[35m', // magenta
  debug: '\x1b[90m', // gray
  reset: '\x1b[0m',
};

const ENV = process.env.NODE_ENV || 'development';
const MIN_LEVEL = ENV === 'production' ? LEVELS.warn : LEVELS.debug;

// ─── Streams ──────────────────────────────────────────────────────────────────
const errorStream = fs.createWriteStream(path.join(logsDir, 'error.log'), { flags: 'a' });
const combinedStream = fs.createWriteStream(path.join(logsDir, 'combined.log'), { flags: 'a' });

// ─── Core Logger ──────────────────────────────────────────────────────────────
const log = (level, message, meta = {}) => {
  if (LEVELS[level] > MIN_LEVEL) return;

  const timestamp = new Date().toISOString();
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
  const coloredEntry = `${COLORS[level]}${logEntry}${COLORS.reset}`;

  // Console output (colored in dev, plain in prod)
  if (ENV !== 'production') {
    process.stdout.write(coloredEntry + '\n');
  } else {
    process.stdout.write(logEntry + '\n');
  }

  // File output (always plain text)
  combinedStream.write(logEntry + '\n');
  if (level === 'error') {
    errorStream.write(logEntry + '\n');
  }
};

// ─── HTTP Request Logger Middleware ───────────────────────────────────────────
const httpLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'http';
    log(level, `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`, {
      ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
      userAgent: req.headers['user-agent'],
    });
  });
  next();
};

// ─── Public Logger API ────────────────────────────────────────────────────────
const logger = {
  error: (msg, meta)  => log('error', msg, meta),
  warn:  (msg, meta)  => log('warn',  msg, meta),
  info:  (msg, meta)  => log('info',  msg, meta),
  http:  (msg, meta)  => log('http',  msg, meta),
  debug: (msg, meta)  => log('debug', msg, meta),
  httpLogger,
};

module.exports = logger;
