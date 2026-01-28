import { useMemo } from 'react'

function CircularProgress({
    value = 0,
    max = 100,
    size = 200,
    strokeWidth = 12,
    label = 'Complete'
}) {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100))

    const { circumference, dashOffset, radius } = useMemo(() => {
        const r = (size - strokeWidth) / 2
        const c = 2 * Math.PI * r
        const offset = c - (percentage / 100) * c
        return { circumference: c, dashOffset: offset, radius: r }
    }, [size, strokeWidth, percentage])

    const center = size / 2

    return (
        <div className="progress-ring-container" style={{ width: size, height: size }}>
            <svg
                className="progress-ring"
                width={size}
                height={size}
            >
                <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#fb923c" />
                    </linearGradient>
                </defs>

                {/* Background circle */}
                <circle
                    className="progress-ring-bg"
                    cx={center}
                    cy={center}
                    r={radius}
                    strokeWidth={strokeWidth}
                />

                {/* Progress circle */}
                <circle
                    className="progress-ring-fill"
                    cx={center}
                    cy={center}
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                />
            </svg>

            <div className="progress-text">
                <div className="progress-value text-gradient">{Math.round(percentage)}%</div>
                <div className="progress-label">{label}</div>
            </div>
        </div>
    )
}

export default CircularProgress
