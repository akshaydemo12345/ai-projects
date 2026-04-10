require('dotenv').config(); // API Key Fixed (Leading dash removed)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
require('./config/passport');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const pageRoutes = require('./routes/pageRoutes');
const projectRoutes = require('./routes/projectRoutes');
const aiRoutes = require('./routes/aiRoutes');
const adminRoutes = require('./routes/adminRoutes');
const publicRoutes = require('./routes/publicRoutes');
const leadRoutes = require('./routes/leadRoutes');
const { errorMiddleware } = require('./middleware/errorMiddleware');
const { sanitizeInput } = require('./middleware/sanitizeInput');
const { cookieParser } = require('./middleware/cookieParser');
const logger = require('./utils/logger');

const path = require('path');
const app = express();

// STATIC SERVING
app.use(express.static(path.join(__dirname, '../public')));

// MIDDLEWARES
app.use(logger.httpLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser);
app.use(sanitizeInput);
const allowedOrigins = [
  'http://localhost:8080',
  'http://127.0.0.1:8080',
  'http://localhost:3000',
  ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : [])
];

app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-token']
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
app.get('/', (req, res) => {
  res.json({ message: 'AI Landing Page API is running' });
});

// ROUTES
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/projects', projectRoutes);
app.use('/pages', pageRoutes);
app.use('/ai', aiRoutes);
app.use('/admin', adminRoutes);
app.use('/api/leads', leadRoutes);
app.use('/', publicRoutes);

// ERROR MIDDLEWARE
app.use(errorMiddleware);

// DATABASE CONNECTION
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ai-landing-page';

mongoose
  .connect(MONGO_URI)
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

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      logger.info(`🚀 Server running on port ${PORT}`);
    });
    server.timeout = 120000; // Increase server timeout to match AI generation time
  })
  .catch((err) => {
    logger.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });
