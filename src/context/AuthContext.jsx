import { createContext, useContext, useState, useEffect, useRef } from 'react'
import api from '../services/api'
import {
    signInWithEmail,
    createAccountWithEmail,
    signInWithGoogle,
    firebaseSignOut,
    getIdToken,
    onAuthChange,
    isFirebaseConfigured
} from '../services/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [firebaseUser, setFirebaseUser] = useState(null)
    const isLoggingIn = useRef(false)  // Flag to prevent auth check during login

    // Check if user is logged in on mount
    useEffect(() => {
        let unsubscribe = () => { }

        // Subscribe to Firebase auth state if configured
        if (isFirebaseConfigured) {
            unsubscribe = onAuthChange((fbUser) => {
                setFirebaseUser(fbUser)
                // Only check session if not currently logging in
                if (!isLoggingIn.current) {
                    checkAuth()
                }
            })
        } else {
            // No Firebase, just check backend session
            checkAuth()
        }

        return () => unsubscribe()
    }, [])

    const checkAuth = async () => {
        try {
            const response = await api.get('/auth/verify-session')
            if (response.data.authenticated) {
                setUser(response.data.user)
            } else {
                setUser(null)
            }
        } catch (error) {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    /**
     * Login with email and password
     * Uses Firebase if configured, otherwise falls back to legacy auth
     */
    const login = async (email, password) => {
        try {
            if (isFirebaseConfigured) {
                // Firebase authentication
                const userCredential = await signInWithEmail(email, password)
                const idToken = await userCredential.user.getIdToken()

                // Send token to backend to create session
                const response = await api.post('/firebase-login', { id_token: idToken })

                if (response.data.success) {
                    setUser(response.data.user)
                    return { success: true }
                } else if (response.data.needs_profile) {
                    return {
                        success: false,
                        needsProfile: true,
                        email: response.data.email,
                        name: response.data.name
                    }
                }
                return { success: false, error: response.data.message }
            } else {
                // Legacy authentication
                const response = await api.post('/login', { email, password })
                if (response.data?.user) {
                    setUser(response.data.user)
                    return { success: true }
                }
                return { success: false, error: 'Invalid credentials' }
            }
        } catch (error) {
            console.error('Login error:', error)

            // Handle Firebase-specific errors
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                return { success: false, error: 'Invalid email or password' }
            }
            if (error.code === 'auth/too-many-requests') {
                return { success: false, error: 'Too many failed attempts. Please try again later.' }
            }
            if (error.code === 'auth/invalid-credential') {
                return { success: false, error: 'Invalid email or password' }
            }

            // Handle backend lockout response
            const responseData = error.response?.data
            if (responseData?.isLocked) {
                return {
                    success: false,
                    error: responseData.message,
                    isLocked: true,
                    secondsRemaining: responseData.secondsRemaining
                }
            }

            return {
                success: false,
                error: responseData?.message || error.message || 'Login failed'
            }
        }
    }

    /**
     * Login with Google OAuth
     */
    const loginWithGoogle = async () => {
        if (!isFirebaseConfigured) {
            return { success: false, error: 'Google login not available' }
        }

        isLoggingIn.current = true  // Prevent onAuthChange from overwriting user

        try {
            const result = await signInWithGoogle()
            const idToken = await result.user.getIdToken()

            // Send token to backend
            const response = await api.post('/firebase-login', { id_token: idToken })

            if (response.data.success) {
                setUser(response.data.user)
                return { success: true }
            } else if (response.data.needs_profile) {
                return {
                    success: false,
                    needsProfile: true,
                    email: response.data.email,
                    name: response.data.name
                }
            }
            return { success: false, error: response.data.message }
        } catch (error) {
            console.error('Google login error:', error)
            if (error.code === 'auth/popup-closed-by-user') {
                return { success: false, error: 'Sign-in cancelled' }
            }
            return { success: false, error: error.message || 'Google login failed' }
        }
    }

    /**
     * Sign up new user
     */
    const signup = async (userData) => {
        try {
            if (isFirebaseConfigured) {
                // Check if already authenticated (from Google OAuth flow)
                const currentToken = await getIdToken()

                if (currentToken) {
                    // Complete profile for existing Firebase user
                    const response = await api.post('/firebase-signup', {
                        id_token: currentToken,
                        ...userData
                    })

                    if (response.data.success) {
                        setUser(response.data.user)
                        return { success: true, user: response.data.user }
                    }
                    return { success: false, error: response.data.message }
                }

                // Create new Firebase user with email/password
                const userCredential = await createAccountWithEmail(userData.email, userData.password)
                const idToken = await userCredential.user.getIdToken()

                // Create user profile in backend
                const response = await api.post('/firebase-signup', {
                    id_token: idToken,
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                    position: userData.position,
                    monthly_salary: userData.monthly_salary
                })

                if (response.data.success) {
                    setUser(response.data.user)
                    return { success: true, user: response.data.user }
                }
                return { success: false, error: response.data.message }
            } else {
                // Legacy signup
                const response = await api.post('/signup', userData)
                if (response.data?.success) {
                    return { success: true }
                }
                return { success: false, error: response.data?.message || 'Signup failed' }
            }
        } catch (error) {
            console.error('Signup error:', error)

            // Handle Firebase-specific errors
            if (error.code === 'auth/email-already-in-use') {
                return { success: false, error: 'Email already registered. Please login instead.' }
            }
            if (error.code === 'auth/weak-password') {
                return { success: false, error: 'Password is too weak. Please use at least 6 characters.' }
            }

            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Signup failed'
            }
        }
    }

    /**
     * Sign up with Google OAuth
     * Unlike login, this will reject if user already exists
     */
    const signupWithGoogle = async () => {
        if (!isFirebaseConfigured) {
            return { success: false, error: 'Google signup not available' }
        }

        isLoggingIn.current = true

        try {
            const result = await signInWithGoogle()
            const idToken = await result.user.getIdToken()

            // Send token to backend with signup mode - will reject if user exists
            const response = await api.post('/firebase-login', {
                id_token: idToken,
                mode: 'signup'
            })

            if (response.data.success) {
                setUser(response.data.user)
                return { success: true }
            } else if (response.data.needs_profile) {
                return {
                    success: false,
                    needsProfile: true,
                    email: response.data.email,
                    name: response.data.name
                }
            }
            return { success: false, error: response.data.message }
        } catch (error) {
            console.error('Google signup error:', error)
            if (error.code === 'auth/popup-closed-by-user') {
                return { success: false, error: 'Sign-up cancelled' }
            }
            // Handle backend error for existing user
            if (error.response?.status === 400) {
                return { success: false, error: error.response.data.message || 'Account already exists' }
            }
            return { success: false, error: error.message || 'Google signup failed' }
        } finally {
            isLoggingIn.current = false
        }
    }

    /**
     * Logout
     */
    const logout = async () => {
        try {
            // Sign out from Firebase
            if (isFirebaseConfigured) {
                await firebaseSignOut()
            }
            // Sign out from backend
            await api.post('/logout')
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            setUser(null)
            setFirebaseUser(null)
        }
    }

    const updateUser = (updatedUser) => {
        setUser(updatedUser)
    }

    const value = {
        user,
        loading,
        login,
        loginWithGoogle,
        signup,
        signupWithGoogle,
        logout,
        updateUser,
        isFirebaseEnabled: isFirebaseConfigured
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export default AuthContext
