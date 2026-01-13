import { Brain, Satellite, BarChart3, Map, Zap, Database } from 'lucide-react';

/**
 * FeaturesSection - Showcase key features of the platform
 */
function FeaturesSection() {
    const features = [
        {
            icon: Brain,
            title: 'AI-Powered Design',
            description: 'Describe your mission in natural language and let AI generate comprehensive mission concepts instantly.',
        },
        {
            icon: Satellite,
            title: 'Orbit Optimization',
            description: 'Automated orbit and constellation design with altitude, inclination, and revisit time calculations.',
        },
        {
            icon: BarChart3,
            title: 'Risk Analysis',
            description: 'Comprehensive technical, financial, and timeline risk assessment with mitigation strategies.',
        },
        {
            icon: Map,
            title: 'Coverage Visualization',
            description: 'Interactive coverage maps showing ground tracks, station locations, and revisit patterns.',
        },
        {
            icon: Zap,
            title: 'Instant Results',
            description: 'Generate complete mission concepts in seconds with detailed specifications and recommendations.',
        },
        {
            icon: Database,
            title: 'Data Operations',
            description: 'Complete data volume estimates, downlink rates, storage requirements, and ground segment design.',
        },
    ];

    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#040c24]/50">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                        Powerful Features for
                        <span className="bg-gradient-to-r from-[#9da5bd] to-white bg-clip-text text-transparent"> Mission Planning</span>
                    </h2>
                    <p className="text-xl text-[#9da5bd] max-w-3xl mx-auto">
                        Everything you need to design, analyze, and optimize your space mission in one intelligent platform
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="group relative bg-[#0a205a]/30 backdrop-blur-sm border border-[#3a4c7a]/30 rounded-lg p-6 hover:border-[#9da5bd]/50 transition-all duration-300 hover:transform hover:scale-105"
                                style={{
                                    animation: `fadeIn 0.5s ease-out ${index * 0.1}s forwards`,
                                    opacity: 0,
                                }}
                            >
                                {/* Icon */}
                                <div className="mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#3a4c7a]/20 to-[#0a205a]/20 rounded-lg flex items-center justify-center group-hover:from-[#3a4c7a]/30 group-hover:to-[#0a205a]/30 transition-colors">
                                        <Icon className="w-6 h-6 text-[#9da5bd]" />
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#9da5bd] transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-[#9da5bd]/80 leading-relaxed">
                                    {feature.description}
                                </p>

                                {/* Hover glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-[#9da5bd]/0 via-[#9da5bd]/5 to-[#3a4c7a]/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default FeaturesSection;
