/**
 * Firebase Configuration
 * Centralized Firebase setup for authentication and services
 */

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

/**
 * Firebase Authentication Configuration
 */
export const firebaseAuthConfig = {
  // Google OAuth providers
  googleProvider: {
    scopes: [
      'profile',
      'email'
    ],
    customParameters: {
      prompt: 'select_account'
    }
  },

  // Session persistence
  persistence: 'LOCAL', // LOCAL, SESSION, or NONE

  // Google Sign-In button display
  googleSignIn: {
    text: 'signin',
    size: 'large',
    theme: 'outline'
  }
};

/**
 * Validate Firebase configuration
 */
export const isFirebaseConfigValid = (): boolean => {
  return Object.values(firebaseConfig).every(value => value && String(value).trim() !== '');
};

/**
 * Get Firebase configuration status
 */
export const getFirebaseConfigStatus = () => {
  return {
    isValid: isFirebaseConfigValid(),
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    isDevelopment: import.meta.env.MODE === 'development'
  };
};