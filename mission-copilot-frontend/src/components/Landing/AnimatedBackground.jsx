/**
 * AnimatedBackground - Animated starfield background for landing page
 */
function AnimatedBackground() {
    // Generate random stars
    const stars = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 3,
    }));

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {/* Animated stars */}
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="absolute rounded-full bg-white animate-twinkle"
                    style={{
                        left: star.left,
                        top: star.top,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        animationDelay: `${star.delay}s`,
                    }}
                />
            ))}
        </div>
    );
}

export default AnimatedBackground;
