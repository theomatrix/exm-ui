import { Link } from 'react-router-dom'
import { ArrowRight, Clock, Wallet, FileText } from 'lucide-react'

function Landing() {
    return (
        <div className="auth-container animate-slide-up">
            <div className="animated-bg">
                <div className="orb-1"></div>
                <div className="orb-2"></div>
            </div>
            <div className="auth-logo">
                <h1 className="text-gradient" style={{ fontSize: '2.5rem' }}>Ex Man</h1>
                <p className="text-muted mt-2">Your Smart Expense Manager</p>
            </div>

            <div className="glass-card p-6 mb-6">
                <div className="stagger-children">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="btn btn-primary btn-icon" style={{ width: 48, height: 48 }}>
                            <Clock size={24} />
                        </div>
                        <div>
                            <h4 className="font-medium">Track Work Hours</h4>
                            <p className="text-sm text-muted">Log your daily in/out times</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="btn btn-primary btn-icon" style={{ width: 48, height: 48 }}>
                            <Wallet size={24} />
                        </div>
                        <div>
                            <h4 className="font-medium">Manage Expenses</h4>
                            <p className="text-sm text-muted">Travel and food allowances</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="btn btn-primary btn-icon" style={{ width: 48, height: 48 }}>
                            <FileText size={24} />
                        </div>
                        <div>
                            <h4 className="font-medium">Generate Reports</h4>
                            <p className="text-sm text-muted">Weekly & monthly summaries</p>
                        </div>
                    </div>
                </div>
            </div>

            <Link to="/login" className="btn btn-primary btn-lg w-full mb-4">
                Get Started
                <ArrowRight size={20} />
            </Link>

            <p className="text-center text-muted">
                Don't have an account?{' '}
                <Link to="/signup" className="text-accent">Sign up</Link>
            </p>
        </div>
    )
}

export default Landing
