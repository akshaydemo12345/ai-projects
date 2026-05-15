import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { firebaseConfig, firebaseAuthConfig, isFirebaseConfigValid } from '../config/firebase.config';

let firebaseApp;
let auth;
let googleProvider;
let isFirebaseConfigured = false;

try {
  // Check if all required config values are present
  const hasValidConfig = isFirebaseConfigValid();

  if (hasValidConfig && !getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
    auth = getAuth(firebaseApp);

    // Configure Google Provider with custom parameters for "Continue with Google"
    googleProvider = new GoogleAuthProvider();
    firebaseAuthConfig.googleProvider.scopes.forEach((scope) => googleProvider.addScope(scope));
    googleProvider.setCustomParameters(firebaseAuthConfig.googleProvider.customParameters);

    isFirebaseConfigured = true;
    console.log('✓ Firebase initialized successfully', { project: firebaseConfig.projectId });
  } else if (getApps().length > 0) {
    firebaseApp = getApps()[0];
    auth = getAuth(firebaseApp);

    googleProvider = new GoogleAuthProvider();
    googleProvider.addScope('profile');
    googleProvider.addScope('email');
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });

    isFirebaseConfigured = true;
    console.log('✓ Firebase already initialized');
  } else {
    console.warn('⚠ Firebase configuration incomplete. Some features will be disabled.');
    isFirebaseConfigured = false;
  }
} catch (error) {
  console.error('✗ Failed to initialize Firebase:', error);
  isFirebaseConfigured = false;
}

/**
 * Sign in with Google Popup
 * Implements "Continue with Google" functionality
 */
export const signInWithGooglePopup = async () => {
  if (!isFirebaseConfigured || !auth || !googleProvider) {
    throw new Error('Firebase is not properly configured for Google Sign-In');
  }

  try {
    await setPersistence(auth, browserLocalPersistence);
    const result = await signInWithPopup(auth, googleProvider);
    console.log('✓ Google Sign-In successful', { user: result.user.email });
    return result;
  } catch (error: any) {
    if (error.code === 'auth/popup-closed-by-user') {
      console.log('Google Sign-In cancelled by user');
    } else if (error.code === 'auth/popup-blocked' || error.message?.includes('Cross-Origin-Opener-Policy')) {
      console.warn('Google Sign-In popup was blocked or blocked by COOP. Falling back to redirect...');
      // Fallback to redirect method
      const { signInWithRedirect } = await import('firebase/auth');
      await signInWithRedirect(auth, googleProvider);
      return null;
    }
    throw error;
  }
};

/**
 * Sign out current user
 */
export const signOutUser = async () => {
  if (!auth) {
    throw new Error('Firebase auth is not initialized');
  }

  try {
    await auth.signOut();
    console.log('✓ User signed out successfully');
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = () => {
  return auth?.currentUser || null;
};

/**
 * Listen to authentication state changes
 */
export const onAuthStateChanged = (callback: (user: any) => void) => {
  if (!auth) {
    console.error('Firebase auth is not initialized');
    return () => {};
  }

  return auth.onAuthStateChanged(callback);
};

export const firebaseAuth = auth;
export const isFirebaseReady = isFirebaseConfigured;
export const getGoogleProvider = () => googleProvider;