import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import api from '../services/api'
import { Lock, CheckCircle, ArrowRight, AlertTriangle } from 'lucide-react'

function ResetPassword() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const token = searchParams.get('token')

    const [newPassword, setNewPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        if (!token) {
            setError('Invalid or missing reset token.')
        }
    }, [token])

    const handleReset = async (e) => {
        e.preventDefault()
        if (!token) return

        setLoading(true)
        setError('')
        try {
            const response = await api.post('/reset-password', {
                token,
                new_password: newPassword
            })

            if (response.data.success) {
                setSuccess('Password has been successfully reset!')
                setTimeout(() => navigate('/login'), 3000)
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Link may be expired.')
        } finally {
            setLoading(false)
        }
    }

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="glass-card p-6 w-full max-w-md text-center animate-slide-up">
                    <div className="text-red-500 mb-4 flex justify-center">
                        <AlertTriangle size={48} />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Invalid Link</h2>
                    <p className="text-muted mb-6">This password reset link is invalid or missing.</p>
                    <Link to="/forgot-password" className="btn btn-primary w-full">
                        Request New Link
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        }}>
            <div className="glass-card p-6 w-full max-w-md animate-slide-up">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div className="flex items-center justify-center gap-2 mb-2 text-accent">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-2xl font-bold mb-1">Set New Password</h1>
                    <p className="text-muted">Create a strong password for your account.</p>
                </div>

                {error && <div className="alert alert-danger mb-4">{error}</div>}

                {success ? (
                    <div className="text-center">
                        <div className="alert alert-success mb-6">
                            <CheckCircle size={20} className="inline mr-2" />
                            {success}
                        </div>
                        <p className="text-muted mb-4">Redirecting to login...</p>
                        <Link to="/login" className="btn btn-primary w-full">
                            Login Now
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleReset}>
                        <div className="form-group mb-6">
                            <label className="form-label">New Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                                <input
                                    type="password"
                                    className="form-input pl-10"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    placeholder="Min 8 chars, mixed case & symbols"
                                    minLength={8}
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                            {loading ? 'Reseting...' : (
                                <>
                                    Reset Password
                                    <CheckCircle size={18} />
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default ResetPassword
