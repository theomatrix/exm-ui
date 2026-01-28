import { motion } from 'framer-motion'
import { LayoutDashboard } from 'lucide-react'

function LoadingScreen() {
    return (
        <div className="loading-screen">
            {/* Background gradient orbs */}
            <div className="loading-bg">
                <div className="loading-orb loading-orb-1"></div>
                <div className="loading-orb loading-orb-2"></div>
            </div>

            {/* Center content */}
            <motion.div
                className="loading-content"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Animated logo */}
                <motion.div
                    className="loading-logo"
                    animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <LayoutDashboard size={48} />
                </motion.div>

                {/* App name */}
                <motion.h1
                    className="loading-title"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    EX<span>MAN</span>
                </motion.h1>

                {/* Loading dots */}
                <div className="loading-dots">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="loading-dot"
                            animate={{
                                y: [0, -8, 0],
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: i * 0.15,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    )
}

export default LoadingScreen
