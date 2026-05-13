'use strict';

const admin = require('firebase-admin');
const logger = require('../utils/logger');

const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  // Private key may include escaped newlines that need to be converted back
  privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
};

let app;

try {
  const isFirebaseConfigured = firebaseConfig.projectId && firebaseConfig.clientEmail && firebaseConfig.privateKey;
  
  if (!isFirebaseConfigured) {
    logger.warn('Firebase Admin SDK is not fully configured. Skipping initialization. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in environment variables.');
    app = null;
  } else if (!admin.apps.length) {
    app = admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
    });
    logger.info('Firebase Admin SDK initialized successfully');
  } else {
    app = admin.app();
  }
} catch (error) {
  logger.error('Failed to initialize Firebase Admin:', error.message);
  app = null;
}

module.exports = app;
