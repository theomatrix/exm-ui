import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowRight, Key, CheckCircle, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { sendResetEmail, isFirebaseConfigured } from '../services/firebase'
import api from '../services/api'

function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleSendLink = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        try {
            if (isFirebaseConfigured) {
                // Use Firebase password reset
                await sendResetEmail(email)
                setSuccess('Password reset email sent! Check your inbox.')
            } else {
                // Fallback to backend API
                const response = await api.post('/forgot-password', { email })
                if (response.data.success) {
                    setSuccess(response.data.message)
                }
            }
            setEmail('')
        } catch (err) {
            // Handle Firebase errors
            if (err.code === 'auth/user-not-found') {
                // Don't reveal if email exists
                setSuccess('If this email exists, you will receive a password reset link.')
            } else if (err.code === 'auth/invalid-email') {
                setError('Please enter a valid email address')
            } else if (err.code === 'auth/too-many-requests') {
                setError('Too many requests. Please try again later.')
            } else {
                setError(err.response?.data?.message || err.message || 'Failed to send reset link')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            {/* Animated background */}
            <div className="auth-bg">
                <div className="auth-bg-gradient"></div>
                <div className="auth-bg-orbs">
                    <div className="orb orb-1"></div>
                    <div className="orb orb-2"></div>
                    <div className="orb orb-3"></div>
                </div>
            </div>

            <motion.div
                className="auth-card"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="auth-header">
                    <motion.div
                        className="auth-icon"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                        <Key size={32} />
                    </motion.div>
                    <h1 className="auth-title">Reset Password</h1>
                    <p className="auth-subtitle">
                        Enter your email to receive a secure reset link
                    </p>
                </div>

                {error && (
                    <motion.div
                        className="alert alert-danger"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        {error}
                    </motion.div>
                )}

                {success ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="success-state"
                    >
                        <div className="alert alert-success">
                            <CheckCircle size={20} />
                            {success}
                        </div>
                        <p className="text-muted mt-4 mb-6">
                            Check your inbox (and spam folder) for the link.
                        </p>
                        <Link to="/login" className="btn btn-primary btn-auth">
                            Back to Login
                            <ArrowRight size={18} />
                        </Link>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSendLink}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <div className="input-wrapper">
                                <Mail size={18} className="input-icon" />
                                <input
                                    type="email"
                                    className="form-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <motion.button
                            type="submit"
                            className="btn btn-primary btn-auth"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Sending Link...
                                </>
                            ) : (
                                <>
                                    Send Reset Link
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </motion.button>
                    </form>
                )}

                {!success && (
                    <div className="auth-footer-text">
                        <Link to="/login">Back to Login</Link>
                    </div>
                )}
            </motion.div>
        </div>
    )
}

export default ForgotPassword
