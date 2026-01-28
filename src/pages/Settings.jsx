import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PageContainer from '../layouts/PageContainer'
import api, { settingsAPI } from '../services/api'
import { User, Mail, Briefcase, Wallet, LogOut, Trash2, Save, AlertTriangle, Clock } from 'lucide-react'

function Settings() {
    const navigate = useNavigate()
    const { user, logout, updateUser } = useAuth()

    const [formData, setFormData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        position: user?.position || '',
        monthly_salary: user?.monthly_salary || '',
        working_hours: user?.working_hours || 9
    })
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setError('')
        setSuccess('')
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        setError('')
        setSuccess('')

        try {
            const response = await settingsAPI.update({
                ...formData,
                monthly_salary: parseFloat(formData.monthly_salary),
                working_hours: parseInt(formData.working_hours)
            })

            if (response.data.success) {
                updateUser(response.data.user)
                setSuccess('Settings saved successfully!')
            } else {
                setError(response.data.message || 'Failed to update profile')
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating settings')
        } finally {
            setSaving(false)
        }
    }

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    const handleDeleteAccount = async () => {
        setDeleting(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        await logout()
        navigate('/signup')
    }

    return (
        <PageContainer withAnimatedBg>
            <div className="page-header">
                <h1 className="page-title">Settings</h1>
                <div className="avatar avatar-lg">
                    {formData.first_name?.[0] || 'U'}
                </div>
            </div>

            {error && <div className="alert alert-danger mb-4">{error}</div>}
            {success && <div className="alert alert-success mb-4">{success}</div>}

            <form onSubmit={handleSave}>
                {/* Profile Section */}
                <div className="glass-card p-4 mb-4">
                    <h3 className="font-medium mb-4 flex items-center gap-2">
                        <User size={20} className="text-accent" />
                        Profile Information
                    </h3>

                    <div className="space-y-4 mb-4">
                        <div className="form-group">
                            <label className="form-label">First Name</label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Last Name</label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group mb-4">
                        <label className="form-label">Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail
                                size={18}
                                style={{
                                    position: 'absolute',
                                    left: 12,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--text-muted)'
                                }}
                            />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="form-input"
                                style={{ paddingLeft: 40 }}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="form-group mb-4">
                        <label className="form-label">Position</label>
                        <div style={{ position: 'relative' }}>
                            <Briefcase
                                size={18}
                                style={{
                                    position: 'absolute',
                                    left: 12,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--text-muted)'
                                }}
                            />
                            <input
                                type="text"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                className="form-input"
                                style={{ paddingLeft: 40 }}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="form-group">
                            <label className="form-label">Monthly Salary (₹)</label>
                            <div style={{ position: 'relative' }}>
                                <Wallet
                                    size={18}
                                    style={{
                                        position: 'absolute',
                                        left: 12,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'var(--text-muted)'
                                    }}
                                />
                                <input
                                    type="number"
                                    name="monthly_salary"
                                    value={formData.monthly_salary}
                                    onChange={handleChange}
                                    className="form-input"
                                    style={{ paddingLeft: 40 }}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Daily Work Hours</label>
                            <div style={{ position: 'relative' }}>
                                <Clock
                                    size={18}
                                    style={{
                                        position: 'absolute',
                                        left: 12,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'var(--text-muted)'
                                    }}
                                />
                                <input
                                    type="number"
                                    name="working_hours"
                                    value={formData.working_hours}
                                    onChange={handleChange}
                                    className="form-input"
                                    style={{ paddingLeft: 40 }}
                                    min="1"
                                    max="24"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <button
                    type="submit"
                    className="btn btn-primary w-full mb-4"
                    disabled={saving}
                >
                    {saving ? 'Saving...' : (
                        <>
                            <Save size={18} />
                            Save Changes
                        </>
                    )}
                </button>
            </form>
            {/* Account Actions */}
            <div className="glass-card p-4 mb-4">
                <h3 className="font-medium mb-4">Account Actions</h3>

                <button
                    onClick={handleLogout}
                    className="btn btn-secondary w-full mb-3"
                >
                    <LogOut size={18} />
                    Sign Out
                </button>

                <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="btn w-full"
                    style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: 'var(--danger)',
                        border: '1px solid rgba(239, 68, 68, 0.3)'
                    }}
                >
                    <Trash2 size={18} />
                    Delete Account
                </button>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem',
                        zIndex: 200
                    }}
                    onClick={() => setShowDeleteConfirm(false)}
                >
                    <div
                        className="glass-card p-6 animate-slide-up"
                        style={{ maxWidth: 400, width: '100%' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--danger)' }}>
                            <AlertTriangle size={24} />
                            <h3 className="font-bold">Delete Account?</h3>
                        </div>

                        <p className="text-muted mb-6">
                            This action cannot be undone. All your data including entries, reports, and profile information will be permanently deleted.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="btn btn-secondary flex-1"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className="btn flex-1"
                                style={{
                                    background: 'var(--danger)',
                                    color: 'white'
                                }}
                                disabled={deleting}
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </PageContainer>
    )
}

export default Settings
