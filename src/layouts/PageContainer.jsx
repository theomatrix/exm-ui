function PageContainer({ children, className = '', withAnimatedBg = false }) {
    return (
        <div className={`page-container ${withAnimatedBg ? 'with-animated-bg' : ''} ${className}`}>
            {withAnimatedBg && (
                <div className="animated-bg">
                    <div className="orb-1"></div>
                    <div className="orb-2"></div>
                </div>
            )}
            {children}
        </div>
    )
}

export default PageContainer
