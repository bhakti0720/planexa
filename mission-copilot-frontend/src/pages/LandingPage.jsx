import AnimatedBackground from '../components/Landing/AnimatedBackground';
import HeroSection from '../components/Landing/HeroSection';
import FeaturesSection from '../components/Landing/FeaturesSection';
import HowItWorksSection from '../components/Landing/HowItWorksSection';
import CTASection from '../components/Landing/CTASection';

/**
 * LandingPage - Main landing page with all sections
 */
function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#040c24] via-[#0a205a] to-[#040c24]">
            <AnimatedBackground />

            <HeroSection />

            <div id="features">
                <FeaturesSection />
            </div>

            <HowItWorksSection />

            <CTASection />

            {/* Footer */}
            <footer className="py-8 px-4 border-t border-[#3a4c7a]/30 bg-[#040c24]/50">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-[#9da5bd]/60 text-sm">
                        © 2026 Planexa. Powered by Advanced AI Technology.
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;
