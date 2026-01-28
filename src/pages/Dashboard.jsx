import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { entriesAPI } from '../services/api'
import PageContainer from '../layouts/PageContainer'
import { Plus, Clock, TrendingUp, Calendar, ChevronRight } from 'lucide-react'

// Color palette for activity cards
const ACTIVITY_COLORS = ['#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4']

function Dashboard() {
    const { user } = useAuth()
    const [entries, setEntries] = useState([])
    const [stats, setStats] = useState({
        totalOvertime: '0h 0m',
        estimatedExtra: 0,
        completionPercentage: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await entriesAPI.getEntries()
                const data = response.data

                setStats({
                    totalOvertime: data.stats.total_overtime,
                    estimatedExtra: data.stats.estimated_extra,
                    completionPercentage: data.stats.completion_percentage
                })

                setEntries(data.recent_entries || [])
            } catch (error) {
                console.error('Failed to fetch dashboard:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboard()
    }, [])

    const completionPercentage = stats.completionPercentage || 0

    // Get greeting based on time
    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Good Morning'
        if (hour < 17) return 'Good Afternoon'
        return 'Good Evening'
    }

    // Get performance label based on percentage
    const getPerformanceLabel = () => {
        if (completionPercentage >= 80) return { text: 'Excellent', color: '#10b981' }
        if (completionPercentage >= 60) return { text: 'Good', color: '#22c55e' }
        if (completionPercentage >= 40) return { text: 'Okay', color: '#f59e0b' }
        return { text: 'Low', color: '#ef4444' }
    }

    const performance = getPerformanceLabel()

    return (
        <PageContainer withAnimatedBg>
            {/* Header with Greeting */}
            <div style={{
                textAlign: 'center',
                padding: '1.5rem 0 1rem',
                marginBottom: '1rem'
            }}>
                <div className="flex items-center justify-center gap-2 mb-2">
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {getGreeting()}, {user?.first_name || 'User'} 👋
                    </span>
                </div>
                <Link to="/settings" className="avatar" style={{
                    position: 'absolute',
                    right: '1.5rem',
                    top: '1.5rem'
                }}>
                    {user?.first_name?.[0] || 'U'}
                </Link>
            </div>

            {/* Performance/Character Section */}
            <div style={{
                textAlign: 'center',
                padding: '1rem 0',
                marginBottom: '1.5rem'
            }}>
                {/* Animated Character */}
                <div style={{
                    width: '180px',
                    height: '180px',
                    margin: '0 auto 1rem',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    border: '1px solid var(--glass-border)',
                    boxShadow: 'var(--shadow-lg)'
                }}>
                    <img
                        src="https://api.dicebear.com/9.x/thumbs/svg?seed=Easton"
                        alt="Working Character"
                        className="animate-float"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
            </div>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                marginBottom: '1.5rem'
            }}>
                <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
                    <Clock size={20} style={{ color: 'var(--accent)', marginBottom: '0.5rem' }} />
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{stats.totalOvertime}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Overtime</div>
                </div>
                <div className="glass-card glass-card-highlight" style={{ padding: '1rem', textAlign: 'center' }}>
                    <TrendingUp size={20} style={{ color: 'var(--accent)', marginBottom: '0.5rem' }} />
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }} className="text-gradient">₹{stats.estimatedExtra}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Est. Extra</div>
                </div>
            </div>

            {/* Create Entry Button */}
            <Link
                to="/add-entry"
                className="glass-card"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 1.25rem',
                    marginBottom: '1.5rem',
                    textDecoration: 'none',
                    color: 'inherit'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        background: 'var(--accent)',
                        borderRadius: '50%',
                        padding: '0.5rem',
                        display: 'flex'
                    }}>
                        <Plus size={18} color="white" />
                    </div>
                    <div>
                        <div style={{ fontWeight: '500' }}>Create Daily Entry</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Track your work hours</div>
                    </div>
                </div>
                <ChevronRight size={20} style={{ color: 'var(--text-muted)' }} />
            </Link>

            {/* Recent Activities Section */}
            <div style={{ marginBottom: '1rem' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                }}>
                    <h3 style={{ fontWeight: '500', fontSize: '1rem' }}>Recent Entries</h3>
                    <Link to="/entries" style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>View All</Link>
                </div>

                {loading ? (
                    <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
                    </div>
                ) : entries.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {entries.slice(0, 4).map((entry, index) => (
                            <div
                                key={entry.id}
                                className="glass-card"
                                style={{
                                    padding: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '50%',
                                        background: ACTIVITY_COLORS[index % ACTIVITY_COLORS.length],
                                        boxShadow: `0 0 8px ${ACTIVITY_COLORS[index % ACTIVITY_COLORS.length]}`
                                    }} />
                                    <div>
                                        <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>{entry.title.replace('Work Entry - ', '')}</div>
                                        <div style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--text-muted)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem'
                                        }}>
                                            <Calendar size={12} />
                                            {entry.subtitle}
                                        </div>
                                    </div>
                                </div>
                                <div style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    color: ACTIVITY_COLORS[index % ACTIVITY_COLORS.length]
                                }}>
                                    {entry.hours?.replace('h ', '.').replace('m', '') || '0'}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-muted)' }}>No entries yet. Create your first entry!</p>
                    </div>
                )}
            </div>
        </PageContainer>
    )
}

export default Dashboard
