import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, User, Briefcase, Wallet, ArrowRight, Loader2 } from 'lucide-react'
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

function Signup() {
    const navigate = useNavigate()
    const location = useLocation()
    const { signup, signupWithGoogle, isFirebaseEnabled } = useAuth()

    // Check if coming from OAuth flow (needs profile completion)
    const fromOAuth = location.state?.firebaseUser || false
    const oauthEmail = location.state?.email || ''
    const oauthName = location.state?.name || ''

    const [step, setStep] = useState(fromOAuth ? 2 : 1) // Skip to profile if from OAuth
    const [formData, setFormData] = useState({
        email: oauthEmail,
        password: '',
        confirmPassword: '',
        first_name: oauthName?.split(' ')[0] || '',
        last_name: oauthName?.split(' ').slice(1).join(' ') || '',
        position: '',
        monthly_salary: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleGoogleSignup = async () => {
        setError('')
        setGoogleLoading(true)

        const result = await signupWithGoogle()

        if (result.success) {
            navigate('/dashboard')
        } else if (result.needsProfile) {
            // Move to profile completion step
            setFormData(prev => ({
                ...prev,
                email: result.email,
                first_name: result.name?.split(' ')[0] || '',
                last_name: result.name?.split(' ').slice(1).join(' ') || ''
            }))
            setStep(2)
        } else {
            setError(result.error)
        }
        setGoogleLoading(false)
    }

    const handleStep1Submit = (e) => {
        e.preventDefault()
        setError('')

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters')
            return
        }

        setStep(2)
    }

    const handleFinalSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const result = await signup({
            email: formData.email,
            password: formData.password,
            first_name: formData.first_name,
            last_name: formData.last_name,
            position: formData.position,
            monthly_salary: parseFloat(formData.monthly_salary)
        })

        if (result.success) {
            if (result.user) {
                // Already logged in (Firebase flow)
                navigate('/dashboard')
            } else {
                // Legacy flow - go to login
                navigate('/login')
            }
        } else {
            setError(result.error)
        }
        setLoading(false)
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
                className="auth-card auth-card-signup"
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
                        <User size={32} />
                    </motion.div>
                    <h1 className="auth-title">
                        {step === 1 ? 'Create Account' : 'Complete Your Profile'}
                    </h1>
                    <p className="auth-subtitle">
                        {step === 1 ? 'Start tracking your work hours' : 'Just a few more details'}
                    </p>

                    {/* Step indicator */}
                    {!fromOAuth && (
                        <div className="step-indicator">
                            <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
                            <div className="step-line"></div>
                            <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
                        </div>
                    )}
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

                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        {/* Google OAuth Button */}
                        {isFirebaseEnabled && (
                            <>
                                <motion.button
                                    type="button"
                                    className="btn-google"
                                    onClick={handleGoogleSignup}
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
                                    <span>or sign up with email</span>
                                </div>
                            </>
                        )}

                        <form onSubmit={handleStep1Submit}>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <div className="input-wrapper">
                                    <Mail size={18} className="input-icon" />
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-input"
                                        value={formData.email}
                                        onChange={handleChange}
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
                                        name="password"
                                        className="form-input"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Create a password (min 8 chars)"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Confirm Password</label>
                                <div className="input-wrapper">
                                    <Lock size={18} className="input-icon" />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        className="form-input"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm your password"
                                        required
                                    />
                                </div>
                            </div>

                            <motion.button
                                type="submit"
                                className="btn btn-primary btn-auth"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Continue
                                <ArrowRight size={18} />
                            </motion.button>
                        </form>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <form onSubmit={handleFinalSubmit}>
                            <div className="form-group">
                                <label className="form-label">First Name</label>
                                <div className="input-wrapper">
                                    <User size={18} className="input-icon" />
                                    <input
                                        type="text"
                                        name="first_name"
                                        className="form-input"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        placeholder="John"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Last Name</label>
                                <div className="input-wrapper">
                                    <User size={18} className="input-icon" />
                                    <input
                                        type="text"
                                        name="last_name"
                                        className="form-input"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        placeholder="Doe"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Position</label>
                                <div className="input-wrapper">
                                    <Briefcase size={18} className="input-icon" />
                                    <input
                                        type="text"
                                        name="position"
                                        className="form-input"
                                        value={formData.position}
                                        onChange={handleChange}
                                        placeholder="e.g. Software Developer"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Monthly Salary (₹)</label>
                                <div className="input-wrapper">
                                    <Wallet size={18} className="input-icon" />
                                    <input
                                        type="number"
                                        name="monthly_salary"
                                        className="form-input"
                                        value={formData.monthly_salary}
                                        onChange={handleChange}
                                        placeholder="e.g. 50000"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                {!fromOAuth && (
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setStep(1)}
                                    >
                                        Back
                                    </button>
                                )}
                                <motion.button
                                    type="submit"
                                    className="btn btn-primary btn-auth"
                                    disabled={loading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{ flex: fromOAuth ? 1 : 'none' }}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Creating Account...
                                        </>
                                    ) : (
                                        <>
                                            Create Account
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                )}

                <div className="auth-footer-text">
                    Already have an account?{' '}
                    <Link to="/login">Sign In</Link>
                </div>
            </motion.div>
        </div>
    )
}

export default Signup
