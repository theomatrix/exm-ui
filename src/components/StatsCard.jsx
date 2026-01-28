function StatsCard({ title, value, icon: Icon, highlight = false }) {
    return (
        <div className={`glass-card p-4 ${highlight ? 'glass-card-highlight' : ''}`}>
            <div className="flex items-center gap-3 mb-2">
                {Icon && (
                    <div className="text-accent">
                        <Icon size={20} />
                    </div>
                )}
                <h4 className="text-sm text-muted font-medium">{title}</h4>
            </div>
            <div className={`text-lg font-bold ${highlight ? 'text-gradient' : ''}`}>
                {value}
            </div>
        </div>
    )
}

export default StatsCard
