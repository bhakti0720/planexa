import { useNavigate } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import heroEarth from '../../assets/hero-earth.jpg';

/**
 * HeroSection - Main hero section with Earth image and CTA
 */
function HeroSection() {
    const navigate = useNavigate();

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image - NO BLUR for HD quality */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${heroEarth})` }}
            >
                {/* Lighter gradient overlay to show image clearly */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#040c24]/60 via-[#0a205a]/40 to-[#040c24]/80"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                {/* Animated Logo/Icon */}
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <Rocket className="w-20 h-20 text-[#9da5bd] animate-float" />
                        <div className="absolute inset-0 bg-[#9da5bd]/20 blur-xl rounded-full animate-pulse"></div>
                    </div>
                </div>

                {/* Main Heading - PLANEXA */}
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
                    <span className="bg-gradient-to-r from-[#9da5bd] via-white to-[#9da5bd] bg-clip-text text-transparent">
                        Planexa
                    </span>
                </h1>

                {/* Subheading */}
                <p className="text-xl sm:text-2xl text-[#9da5bd] mb-12 animate-fade-in-1 max-w-3xl mx-auto">
                    Design Your Space Mission in Minutes with AI-Powered Orbit Optimization and Risk Analysis
                </p>

                {/* CTA Button */}
                <button
                    onClick={() => navigate('/planner')}
                    className="group relative px-8 py-4 bg-gradient-to-r from-[#3a4c7a] to-[#0a205a] hover:from-[#0a205a] hover:to-[#3a4c7a] text-white text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 animate-fade-in-2"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        Start Planning Your Mission
                        <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#9da5bd] to-[#3a4c7a] rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                </button>

                {/* Stats or badges */}
                <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in-3">
                    <div>
                        <div className="text-3xl font-bold text-[#9da5bd]">AI-Powered</div>
                        <div className="text-sm text-[#9da5bd]/70 mt-1">Natural Language</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-[#9da5bd]">Instant</div>
                        <div className="text-sm text-[#9da5bd]/70 mt-1">Results</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-[#9da5bd]">Complete</div>
                        <div className="text-sm text-[#9da5bd]/70 mt-1">Analysis</div>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-[#9da5bd]/50 rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-[#9da5bd] rounded-full mt-2 animate-pulse"></div>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;
