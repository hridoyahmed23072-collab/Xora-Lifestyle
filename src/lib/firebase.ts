import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';

const getSavedFirebaseConfig = () => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem('xora_firebase_config');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const savedConfig = getSavedFirebaseConfig();

const DEFAULT_FIREBASE_CONFIG = {
  apiKey: 'AIzaSyCe0-fEWu2j_8soF_ibl865m5zmEAi-CyM',
  authDomain: 'xora-lifestyle.firebaseapp.com',
  projectId: 'xora-lifestyle',
  storageBucket: 'xora-lifestyle.firebasestorage.app',
  messagingSenderId: '714371115229',
  appId: '1:714371115229:web:6cfe4c71c984c1b1cdd334',
};

const firebaseConfig = {
  apiKey: (import.meta.env.VITE_FIREBASE_API_KEY || savedConfig.apiKey || DEFAULT_FIREBASE_CONFIG.apiKey).trim(),
  authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || savedConfig.authDomain || DEFAULT_FIREBASE_CONFIG.authDomain).trim(),
  projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID || savedConfig.projectId || DEFAULT_FIREBASE_CONFIG.projectId).trim(),
  storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || savedConfig.storageBucket || DEFAULT_FIREBASE_CONFIG.storageBucket).trim(),
  messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || savedConfig.messagingSenderId || DEFAULT_FIREBASE_CONFIG.messagingSenderId).trim(),
  appId: (import.meta.env.VITE_FIREBASE_APP_ID || savedConfig.appId || DEFAULT_FIREBASE_CONFIG.appId).trim(),
};

// Check if critical Firebase env variables are provided
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey.trim() !== '' &&
  firebaseConfig.projectId.trim() !== ''
);

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (error) {
    console.warn('Firebase initialization error, falling back to localStorage DEMO mode:', error);
  }
}

export { app, db, auth, firebaseConfig };
export const ADMIN_EMAILS = [
  'hridoyahmed23072@gmail.com',
  'xoralifestyle21@gmail.com',
  'xoralifestyle21@gamil.com',
  'mdmadara999@gmail.com',
  (import.meta.env.VITE_ADMIN_EMAIL || '').toLowerCase().trim(),
].filter(Boolean);
export const ADMIN_EMAIL = ADMIN_EMAILS[0];
export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
export const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

export function saveFirebaseConfig(config: {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('xora_firebase_config', JSON.stringify(config));
    window.location.reload();
  }
}

export function clearFirebaseConfig() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('xora_firebase_config');
    window.location.reload();
  }
}
