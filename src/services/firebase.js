/**
 * Firebase Configuration
 * 
 * Initialize Firebase app and export auth services.
 * Configure these values in your Vite environment (.env file):
 * 
 * VITE_FIREBASE_API_KEY=your-api-key
 * VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
 * VITE_FIREBASE_PROJECT_ID=your-project-id
 * VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
 * VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
 * VITE_FIREBASE_APP_ID=your-app-id
 */

import { initializeApp } from 'firebase/app'
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    signOut,
    onAuthStateChanged
} from 'firebase/auth'

// Firebase configuration from environment variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Check if Firebase is configured
const isFirebaseConfigured = firebaseConfig.apiKey && firebaseConfig.projectId

// Initialize Firebase
let app = null
let auth = null
let googleProvider = null

if (isFirebaseConfigured) {
    try {
        app = initializeApp(firebaseConfig)
        auth = getAuth(app)
        googleProvider = new GoogleAuthProvider()
        googleProvider.addScope('email')
        googleProvider.addScope('profile')
    } catch (error) {
        console.error('Firebase initialization error:', error)
    }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email, password) {
    if (!auth) throw new Error('Firebase not configured')
    return signInWithEmailAndPassword(auth, email, password)
}

/**
 * Create account with email and password
 */
export async function createAccountWithEmail(email, password) {
    if (!auth) throw new Error('Firebase not configured')
    return createUserWithEmailAndPassword(auth, email, password)
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle() {
    if (!auth || !googleProvider) throw new Error('Firebase not configured')
    return signInWithPopup(auth, googleProvider)
}

/**
 * Send password reset email
 */
export async function sendResetEmail(email) {
    if (!auth) throw new Error('Firebase not configured')
    return sendPasswordResetEmail(auth, email)
}

/**
 * Sign out
 */
export async function firebaseSignOut() {
    if (!auth) return
    return signOut(auth)
}

/**
 * Get the current user's ID token
 */
export async function getIdToken() {
    if (!auth || !auth.currentUser) return null
    return auth.currentUser.getIdToken()
}

/**
 * Subscribe to auth state changes
 */
export function onAuthChange(callback) {
    if (!auth) {
        callback(null)
        return () => { }
    }
    return onAuthStateChanged(auth, callback)
}

// Export for use in components
export { auth, isFirebaseConfigured }
