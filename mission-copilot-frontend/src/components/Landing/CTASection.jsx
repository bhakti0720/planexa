import { useNavigate } from 'react-router-dom';
import { Rocket, ArrowRight } from 'lucide-react';

/**
 * CTASection - Final call-to-action section
 */
function CTASection() {
    const navigate = useNavigate();

    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#040c24] to-[#040c24]/50">
            <div className="max-w-4xl mx-auto text-center">
                {/* Icon */}
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#3a4c7a]/20 to-[#0a205a]/20 rounded-full flex items-center justify-center">
                            <Rocket className="w-10 h-10 text-[#9da5bd] animate-float" />
                        </div>
                        <div className="absolute inset-0 bg-[#9da5bd]/20 blur-2xl rounded-full animate-pulse"></div>
                    </div>
                </div>

                {/* Heading */}
                <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                    Ready to Design Your
                    <br />
                    <span className="bg-gradient-to-r from-[#9da5bd] to-white bg-clip-text text-transparent">
                        Space Mission?
                    </span>
                </h2>

                {/* Description */}
                <p className="text-xl text-[#9da5bd] mb-10 max-w-2xl mx-auto">
                    Join the future of space mission planning. Start creating comprehensive mission concepts in minutes with AI-powered analysis.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate('/planner')}
                        className="group relative px-8 py-4 bg-gradient-to-r from-[#3a4c7a] to-[#0a205a] hover:from-[#0a205a] hover:to-[#3a4c7a] text-white text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            Start Planning Now
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#9da5bd] to-[#3a4c7a] rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    </button>

                    <button
                        onClick={() => {
                            document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-8 py-4 bg-[#0a205a]/50 hover:bg-[#0a205a] border border-[#9da5bd]/30 hover:border-[#9da5bd]/50 text-white text-lg font-semibold rounded-lg transition-all duration-300"
                    >
                        Learn More
                    </button>
                </div>

                {/* Trust indicators */}
                <div className="mt-16 pt-8 border-t border-[#3a4c7a]/30">
                    <p className="text-sm text-[#9da5bd]/60 mb-4">Trusted by space mission planners worldwide</p>
                    <div className="flex justify-center gap-8 text-[#9da5bd]/70">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#9da5bd] rounded-full"></div>
                            <span className="text-sm">AI-Powered</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#9da5bd] rounded-full"></div>
                            <span className="text-sm">Instant Results</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#9da5bd] rounded-full"></div>
                            <span className="text-sm">Comprehensive Analysis</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CTASection;
