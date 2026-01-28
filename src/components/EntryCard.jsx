import { Clock, Users, MoreVertical } from 'lucide-react'

function EntryCard({
    title,
    subtitle,
    hours,
    badge,
    badgeType = 'normal',
    participants,
    onClick
}) {
    return (
        <div className="glass-card entry-card" onClick={onClick}>
            <div className="entry-card-header">
                <div>
                    <h4 className="entry-title">{title}</h4>
                    <p className="entry-subtitle">{subtitle}</p>
                </div>
                <div className="flex items-center gap-2">
                    {badge && (
                        <span className={`entry-badge ${badgeType === 'urgent' ? 'urgent' : ''}`}>
                            {badge}
                        </span>
                    )}
                    <button className="btn btn-ghost btn-icon" style={{ width: 32, height: 32 }}>
                        <MoreVertical size={18} />
                    </button>
                </div>
            </div>

            <div className="entry-footer">
                <div className="entry-meta">
                    <Clock size={16} />
                    <span>{hours} Hrs</span>
                </div>
                {participants && (
                    <div className="entry-meta">
                        <Users size={16} />
                        <span>{participants}</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default EntryCard
