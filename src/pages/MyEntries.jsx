import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { entriesAPI } from '../services/api'
import PageContainer from '../layouts/PageContainer'
import { Clock, Calendar, DollarSign, Car, UtensilsCrossed, FileText, Trash2, X } from 'lucide-react'

function MyEntries() {
    const { user } = useAuth()
    const [entries, setEntries] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedEntry, setSelectedEntry] = useState(null)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        fetchEntries()
    }, [])

    const fetchEntries = async () => {
        try {
            const response = await entriesAPI.getEntries()
            setEntries(response.data.recent_entries || [])
        } catch (error) {
            console.error('Failed to fetch entries:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleEntryClick = async (entry) => {
        setSelectedEntry(entry)
    }

    const handleDeleteEntry = async (entryId) => {
        if (!confirm('Are you sure you want to delete this entry? This cannot be undone.')) {
            return
        }

        setDeleting(true)
        try {
            const response = await entriesAPI.deleteEntry(entryId)
            if (response.data.success) {
                setEntries(entries.filter(e => e.id !== entryId))
                setSelectedEntry(null)
            }
        } catch (error) {
            console.error('Failed to delete entry:', error)
            alert('Failed to delete entry')
        } finally {
            setDeleting(false)
        }
    }

    return (
        <PageContainer withAnimatedBg>
            <div className="page-header">
                <h1 className="page-title">My Entries</h1>
                <div className="avatar">
                    {user?.first_name?.[0] || 'U'}
                </div>
            </div>

            {/* Entry List */}
            <div className="stagger-children">
                {loading ? (
                    <div className="glass-card p-6 text-center">
                        <p className="text-muted">Loading entries...</p>
                    </div>
                ) : entries.length > 0 ? (
                    entries.map(entry => (
                        <div
                            key={entry.id}
                            className="glass-card p-4 mb-3 animate-slide-up cursor-pointer hover:bg-opacity-15"
                            onClick={() => handleEntryClick(entry)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium">{entry.title}</h4>
                                {entry.badge && (
                                    <span
                                        className="badge"
                                        style={{
                                            background: 'rgba(139, 92, 246, 0.2)',
                                            color: '#a78bfa',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem'
                                        }}
                                    >
                                        {entry.badge}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted mb-2">
                                <Calendar size={16} />
                                <span>{entry.subtitle}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                                <Clock size={16} className="text-accent" />
                                <span className="text-accent font-medium">{entry.hours}</span>
                            </div>

                            {entry.description && (
                                <div className="text-sm text-muted mt-2" style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    <FileText size={14} className="inline mr-1" style={{ verticalAlign: 'middle' }} />
                                    {entry.description}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="glass-card p-6 text-center">
                        <p className="text-muted">No entries yet. Create your first entry!</p>
                    </div>
                )}
            </div>

            {/* Entry Detail Modal */}
            {selectedEntry && (
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
                    onClick={() => setSelectedEntry(null)}
                >
                    <div
                        className="glass-card p-6 animate-slide-up"
                        style={{ maxWidth: 500, width: '100%' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg">{selectedEntry.title}</h3>
                                <p className="text-sm text-muted mt-1">{selectedEntry.subtitle}</p>
                            </div>
                            <button
                                onClick={() => setSelectedEntry(null)}
                                className="btn btn-ghost"
                                style={{ padding: '0.5rem' }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Entry Details */}
                        <div className="space-y-4">
                            {/* Work Hours */}
                            <div className="glass-card p-4">
                                <div className="flex items-center gap-2 mb-2 text-accent">
                                    <Clock size={18} />
                                    <span className="text-sm font-medium">Work Hours</span>
                                </div>
                                <div className="text-2xl font-bold">{selectedEntry.hours}</div>
                            </div>

                            {/* Overtime */}
                            <div className="glass-card p-4">
                                <div className="flex items-center gap-2 mb-2 text-accent">
                                    <DollarSign size={18} />
                                    <span className="text-sm font-medium">Overtime & Extra Pay</span>
                                </div>
                                <div className="text-sm">
                                    <div className="mb-1">OT Hours: <span className="font-medium">{selectedEntry.overtime || '0h 0m'}</span></div>
                                    <div className="text-lg font-bold text-accent">₹{selectedEntry.overtime_pay || 0}</div>
                                </div>
                            </div>

                            {/* Travel */}
                            <div className="glass-card p-4">
                                <div className="flex items-center gap-2 mb-2 text-accent">
                                    <Car size={18} />
                                    <span className="text-sm font-medium">Travel</span>
                                </div>
                                <div className="text-sm">
                                    {selectedEntry.travel_km > 0 ? (
                                        <div className="font-medium">{selectedEntry.travel_km} km</div>
                                    ) : (
                                        <div className="text-muted">No travel</div>
                                    )}
                                </div>
                            </div>

                            {/* Food */}
                            <div className="glass-card p-4">
                                <div className="flex items-center gap-2 mb-2 text-accent">
                                    <UtensilsCrossed size={18} />
                                    <span className="text-sm font-medium">Food Allowance</span>
                                </div>
                                <div className="text-sm">
                                    {selectedEntry.food_expense > 0 ? (
                                        <div className="font-medium">₹{selectedEntry.food_expense}</div>
                                    ) : (
                                        <div className="text-muted">No expenses</div>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            {selectedEntry.description && (
                                <div className="glass-card p-4">
                                    <div className="flex items-center gap-2 mb-2 text-accent">
                                        <FileText size={18} />
                                        <span className="text-sm font-medium">Description</span>
                                    </div>
                                    <div className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>
                                        {selectedEntry.description}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button
                                onClick={() => handleDeleteEntry(selectedEntry.id)}
                                className="btn btn-ghost"
                                style={{ flex: 1, color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                                disabled={deleting}
                            >
                                <Trash2 size={18} />
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                            <button
                                onClick={() => setSelectedEntry(null)}
                                className="btn btn-primary"
                                style={{ flex: 1 }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </PageContainer>
    )
}

export default MyEntries
