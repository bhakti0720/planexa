import PropTypes from 'prop-types';
import { AlertTriangle, Wrench, DollarSign, Clock } from 'lucide-react';
import MissionCard from './MissionCard';

/**
 * RiskProgressBar - Reusable progress bar component with color-coded gradients
 */
function RiskProgressBar({ label, value, maxValue = 100 }) {
    const percentage = (value / maxValue) * 100;

    // Determine gradient based on value
    let gradient;
    if (value <= 35) {
        gradient = 'bg-gradient-to-r from-green-600 to-green-400';
    } else if (value <= 55) {
        gradient = 'bg-gradient-to-r from-yellow-600 to-orange-400';
    } else {
        gradient = 'bg-gradient-to-r from-orange-600 to-red-500';
    }

    return (
        <div className="mb-3">
            <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-400">{label}</span>
                <span className="text-sm font-semibold text-white">{value}/{maxValue}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
                <div
                    className={`h-full ${gradient} transition-all duration-1000 ease-out`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

RiskProgressBar.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    maxValue: PropTypes.number,
};

/**
 * RiskAnalysisTab - Displays risk assessment with progress bars and factors
 */
function RiskAnalysisTab({ mission }) {
    if (!mission || !mission.risk_assessment) return null;

    const { risk_assessment } = mission;
    const { technical_risk, financial_risk, timeline_risk, overall_risk, risk_factors, mitigations } = risk_assessment;

    return (
        <div className="space-y-4">
            {/* Overall Risk Badge */}
            <MissionCard className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 animate-fade-in-1">
                <div className="flex items-center gap-3">
                    <AlertTriangle className="w-8 h-8 text-yellow-400" />
                    <div>
                        <p className="text-sm text-gray-300">Overall Risk Level</p>
                        <p className="text-2xl font-bold text-yellow-400">{overall_risk}</p>
                    </div>
                </div>
            </MissionCard>

            {/* Technical Risk Card */}
            <MissionCard
                title="Technical Risk"
                icon={Wrench}
                className="border-cyan-800/50 animate-fade-in-2"
            >
                <RiskProgressBar label="Risk Score" value={technical_risk} />
                <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">Key Factors:</p>
                    <ul className="space-y-1">
                        {risk_factors.technical.map((factor, index) => (
                            <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                                <span className="text-cyan-400 mt-1">•</span>
                                <span>{factor}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </MissionCard>

            {/* Financial Risk Card */}
            <MissionCard
                title="Financial Risk"
                icon={DollarSign}
                className="border-purple-800/50 animate-fade-in-3"
            >
                <RiskProgressBar label="Risk Score" value={financial_risk} />
                <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">Key Factors:</p>
                    <ul className="space-y-1">
                        {risk_factors.financial.map((factor, index) => (
                            <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                                <span className="text-purple-400 mt-1">•</span>
                                <span>{factor}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Mitigation Strategies */}
                {mitigations && mitigations.length > 0 && (
                    <div className="mt-4 p-3 bg-purple-900/30 border border-purple-700/50 rounded-lg">
                        <p className="text-sm font-semibold text-purple-300 mb-2">Mitigation Strategies:</p>
                        <ul className="space-y-1">
                            {mitigations.map((mitigation, index) => (
                                <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                                    <span className="text-purple-400 mt-1">✓</span>
                                    <span>{mitigation}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </MissionCard>

            {/* Timeline Risk Card */}
            <MissionCard
                title="Timeline Risk"
                icon={Clock}
                className="border-blue-800/50 animate-fade-in-4"
            >
                <RiskProgressBar label="Risk Score" value={timeline_risk} />
                <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">Key Factors:</p>
                    <ul className="space-y-1">
                        {risk_factors.timeline.map((factor, index) => (
                            <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                                <span className="text-blue-400 mt-1">•</span>
                                <span>{factor}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </MissionCard>
        </div>
    );
}

RiskAnalysisTab.propTypes = {
    mission: PropTypes.shape({
        risk_assessment: PropTypes.shape({
            technical_risk: PropTypes.number.isRequired,
            financial_risk: PropTypes.number.isRequired,
            timeline_risk: PropTypes.number.isRequired,
            overall_risk: PropTypes.string.isRequired,
            risk_factors: PropTypes.shape({
                technical: PropTypes.arrayOf(PropTypes.string).isRequired,
                financial: PropTypes.arrayOf(PropTypes.string).isRequired,
                timeline: PropTypes.arrayOf(PropTypes.string).isRequired,
            }).isRequired,
            mitigations: PropTypes.arrayOf(PropTypes.string),
        }).isRequired,
    }),
};

export default RiskAnalysisTab;
