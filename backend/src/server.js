require('dotenv').config(); // API Key Fixed (Leading dash removed)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
require('./config/passport');
const config = require('./config'); // Import centralized config

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const pageRoutes = require('./routes/pageRoutes');
const projectRoutes = require('./routes/projectRoutes');
const aiRoutes = require('./routes/aiRoutes');
const adminRoutes = require('./routes/adminRoutes');
const publicRoutes = require('./routes/publicRoutes');
const leadRoutes = require('./routes/leadRoutes');
const formRoutes = require('./routes/formRoutes');
const thankYouRoutes = require('./routes/thankYouRoutes');
const proxyRoutes = require('./routes/proxyRoutes');
const { errorMiddleware } = require('./middleware/errorMiddleware');
const { sanitizeInput } = require('./middleware/sanitizeInput');
const { cookieParser } = require('./middleware/cookieParser');
const { rateLimiter } = require('./middleware/rateLimiter');
const logger = require('./utils/logger');

const path = require('path');
const app = express();

// STATIC SERVING
app.use(express.static(path.join(__dirname, '../public')));

// MIDDLEWARES
app.use(logger.httpLogger);
// app.use(compression()); // Moved to specific routes to avoid proxy corruption
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser);
app.use(sanitizeInput);
const allowedOrigins = [
  'http://localhost:8080',
  'http://127.0.0.1:8080',
  'http://localhost:3000',
  ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : [])
];

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-token', 'x-api-key', 'api-key', 'bypass-tunnel-reminder']
}));

// Adjusted Helmet to allow iframes and cross-site content
app.use(helmet({
  contentSecurityPolicy: false, // For development and dynamic AI content
  crossOriginResourcePolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(morgan('dev'));

// SESSION
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: false,
}));

// PASSPORT
app.use(passport.initialize());
app.use(passport.session());

// TEST ROUTE
app.get('/index.php', (req, res) => {
  res.json({ message: 'AI Landing Page API is running' });
});

app.get('/', (req, res) => {
  res.json({ message: 'AI Landing Page API is running' });
});

// ROUTES

// 1. Auth & User
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

// 2. Dashboard Logic
app.use('/projects', projectRoutes);
app.use('/pages', pageRoutes);
app.use('/ai', aiRoutes);
app.post('/api/pages/project-suggestions', require('./middleware/authMiddleware').protect, require('./controllers/aiController').getProjectSuggestions);
app.use('/admin', adminRoutes);

// 3. Functional APIs (Compression applied)
app.use('/api/leads', compression(), leadRoutes);
app.use('/api/forms', compression(), formRoutes);
app.use('/api/thank-you', compression(), thankYouRoutes);

// 4. Proxy Engine (Isolated Prefix) - Must be BEFORE public catch-all
app.use('/api/v1/proxy', rateLimiter({ windowMs: 60000, max: 100 }), proxyRoutes);

// 5. Public Landing Pages (Catch-all)
app.use('/pages', compression(), publicRoutes);

// ERROR MIDDLEWARE
app.use(errorMiddleware);

// DATABASE CONNECTION
mongoose
  .connect(config.database.uri)
  .then(async () => {
    console.log('✅ MongoDB Connected Successfully');
    logger.info('✅ MongoDB Connected Successfully');

    // Auto-drop unique domain index to support multi-page WordPress mapping
    try {
      const collection = mongoose.connection.collection('pages');
      await collection.dropIndex('domain_1');
      console.log('🛠️ Dropped unique domain index');
      logger.info('🛠️ Dropped unique domain index for multi-page support');
    } catch (err) {
      // Index likely already doesn't exist
    }

    const server = app.listen(config.port, config.host, () => {
      console.log(`🚀 Server running on port ${config.port}`);
      logger.info(`🚀 Server running on port ${config.port}`);
      console.log(`🌍 Environment: ${config.env}`);
      console.log(`🔗 API Base URL: ${config.api.baseUrl}`);
    });
    server.timeout = 300000; // Increase server timeout to 5 minutes for AI generation
  })
  .catch((err) => {
    logger.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });
