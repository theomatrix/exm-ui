import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, ArrowRight, LayoutDashboard, Loader2, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

// Google Icon SVG component
const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
)

function Login() {
    const navigate = useNavigate()
    const { login, loginWithGoogle, isFirebaseEnabled } = useAuth()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const [lockoutSeconds, setLockoutSeconds] = useState(0)
    const lockoutTimerRef = useRef(null)

    // Countdown timer for lockout
    useEffect(() => {
        if (lockoutSeconds > 0) {
            lockoutTimerRef.current = setInterval(() => {
                setLockoutSeconds(prev => {
                    if (prev <= 1) {
                        clearInterval(lockoutTimerRef.current)
                        setError('')
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }
        return () => {
            if (lockoutTimerRef.current) clearInterval(lockoutTimerRef.current)
        }
    }, [lockoutSeconds > 0])

    const formatLockoutTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (lockoutSeconds > 0) return

        setError('')
        setLoading(true)

        const result = await login(formData.email, formData.password)

        if (result.success) {
            navigate('/dashboard')
        } else if (result.needsProfile) {
            // Firebase user needs to complete profile
            navigate('/signup', {
                state: {
                    firebaseUser: true,
                    email: result.email,
                    name: result.name
                }
            })
        } else {
            // Check if this is a lockout response
            if (result.isLocked && result.secondsRemaining) {
                setLockoutSeconds(result.secondsRemaining)
            }
            setError(result.error)
        }
        setLoading(false)
    }

    const handleGoogleLogin = async () => {
        setError('')
        setGoogleLoading(true)

        const result = await loginWithGoogle()

        if (result.success) {
            navigate('/dashboard')
        } else if (result.needsProfile) {
            navigate('/signup', {
                state: {
                    firebaseUser: true,
                    email: result.email,
                    name: result.name
                }
            })
        } else {
            setError(result.error)
        }
        setGoogleLoading(false)
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
                        <LayoutDashboard size={32} />
                    </motion.div>
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Sign in to your Expense Manager</p>
                </div>

                {lockoutSeconds > 0 ? (
                    <motion.div
                        className="alert alert-warning"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15), rgba(234, 179, 8, 0.05))',
                            border: '1px solid rgba(234, 179, 8, 0.3)',
                            color: '#eab308'
                        }}
                    >
                        <Clock size={20} className="animate-pulse" />
                        <div>
                            <strong>Account Locked</strong>
                            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                                Too many failed attempts. Try again in{' '}
                                <span style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>
                                    {formatLockoutTime(lockoutSeconds)}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ) : error && (
                    <motion.div
                        className="alert alert-danger"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        {error}
                    </motion.div>
                )}

                {/* Google OAuth Button */}
                {isFirebaseEnabled && (
                    <>
                        <motion.button
                            type="button"
                            className="btn-google"
                            onClick={handleGoogleLogin}
                            disabled={googleLoading || loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {googleLoading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <GoogleIcon />
                            )}
                            <span>Continue with Google</span>
                        </motion.button>

                        <div className="auth-divider">
                            <span>or continue with email</span>
                        </div>
                    </>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <div className="input-wrapper">
                            <Mail size={18} className="input-icon" />
                            <input
                                type="email"
                                className="form-input"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="input-wrapper">
                            <Lock size={18} className="input-icon" />
                            <input
                                type="password"
                                className="form-input"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                    </div>

                    <div className="auth-forgot">
                        <Link to="/forgot-password">Forgot Password?</Link>
                    </div>

                    <motion.button
                        type="submit"
                        className="btn btn-primary btn-auth"
                        disabled={loading || googleLoading || lockoutSeconds > 0}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Signing In...
                            </>
                        ) : (
                            <>
                                Sign In
                                <ArrowRight size={18} />
                            </>
                        )}
                    </motion.button>
                </form>

                <div className="auth-footer-text">
                    Don't have an account?{' '}
                    <Link to="/signup">Create Account</Link>
                </div>
            </motion.div>
        </div>
    )
}

export default Login
