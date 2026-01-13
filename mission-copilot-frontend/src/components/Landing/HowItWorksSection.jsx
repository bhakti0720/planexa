import { MessageSquare, Cpu, LineChart } from 'lucide-react';

/**
 * HowItWorksSection - 3-step process visualization
 */
function HowItWorksSection() {
    const steps = [
        {
            number: '01',
            icon: MessageSquare,
            title: 'Describe Your Mission',
            description: 'Enter your mission requirements in natural language - target area, payload type, revisit time, and objectives.',
        },
        {
            number: '02',
            icon: Cpu,
            title: 'AI Generates Concept',
            description: 'Our AI analyzes your requirements and generates optimized orbit design, constellation sizing, and coverage analysis.',
        },
        {
            number: '03',
            icon: LineChart,
            title: 'Review & Refine',
            description: 'Explore comprehensive results across multiple tabs - overview, coverage maps, and detailed risk assessment.',
        },
    ];

    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                        How It <span className="bg-gradient-to-r from-[#9da5bd] to-white bg-clip-text text-transparent">Works</span>
                    </h2>
                    <p className="text-xl text-[#9da5bd] max-w-2xl mx-auto">
                        From concept to comprehensive mission plan in three simple steps
                    </p>
                </div>

                {/* Steps */}
                <div className="relative">
                    {/* Connection line */}
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#9da5bd]/20 via-[#3a4c7a]/40 to-[#9da5bd]/20 transform -translate-y-1/2"></div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <div key={index} className="relative">
                                    {/* Step Card */}
                                    <div className="bg-[#0a205a]/30 backdrop-blur-sm border border-[#3a4c7a]/30 rounded-lg p-8 text-center hover:border-[#9da5bd]/50 transition-all duration-300 hover:transform hover:-translate-y-2">
                                        {/* Number Badge */}
                                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                                            <div className="w-12 h-12 bg-gradient-to-br from-[#3a4c7a] to-[#0a205a] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-[#9da5bd]/50">
                                                {step.number}
                                            </div>
                                        </div>

                                        {/* Icon */}
                                        <div className="mt-8 mb-6 flex justify-center">
                                            <div className="w-16 h-16 bg-gradient-to-br from-[#3a4c7a]/20 to-[#0a205a]/20 rounded-lg flex items-center justify-center">
                                                <Icon className="w-8 h-8 text-[#9da5bd]" />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <h3 className="text-xl font-semibold text-white mb-3">
                                            {step.title}
                                        </h3>
                                        <p className="text-[#9da5bd]/80 leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>

                                    {/* Arrow (desktop only) */}
                                    {index < steps.length - 1 && (
                                        <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
                                            <div className="w-12 h-12 flex items-center justify-center">
                                                <svg className="w-6 h-6 text-[#9da5bd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HowItWorksSection;
