import PropTypes from 'prop-types';
import { Sprout, Radio, AlertCircle } from 'lucide-react';

/**
 * DemoButtons - Quick start scenario buttons
 */
function DemoButtons({ onSelectDemo, disabled }) {
    const demos = [
        {
            id: 'agriculture',
            icon: Sprout,
            title: '🌾 Agriculture Monitor',
            description: 'Design a 3U CubeSat to monitor agricultural areas in South India with daily revisit. Payload is a medium-resolution optical camera.',
        },
        {
            id: 'broadband',
            icon: Radio,
            title: '📡 Broadband Coverage',
            description: 'Create a satellite constellation to provide broadband internet coverage over Europe with low latency.',
        },
        {
            id: 'disaster',
            icon: AlertCircle,
            title: '🚨 Disaster Response',
            description: 'Design a polar orbit constellation for disaster response monitoring with 6-hour revisit using SAR payload.',
        },
    ];

    return (
        <div className="mb-6">
            <p className="text-sm text-gray-400 mb-3">Quick start scenarios:</p>
            <div className="grid grid-cols-1 gap-3">
                {demos.map((demo) => {
                    const Icon = demo.icon;
                    return (
                        <button
                            key={demo.id}
                            onClick={() => onSelectDemo(demo.description)}
                            disabled={disabled}
                            className="text-left p-4 bg-slate-800/50 hover:bg-slate-800 border border-blue-800/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            <div className="flex items-start gap-3">
                                <Icon className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="text-sm font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                                        {demo.title}
                                    </h4>
                                    <p className="text-xs text-gray-400 leading-relaxed">
                                        {demo.description}
                                    </p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

DemoButtons.propTypes = {
    onSelectDemo: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

export default DemoButtons;
