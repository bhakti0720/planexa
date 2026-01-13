import PropTypes from 'prop-types';
import { Globe, MapPin, AlertTriangle } from 'lucide-react';

/**
 * TabNavigation - Three tabs for switching between Overview, Coverage Map, and Risk Analysis
 */
function TabNavigation({ activeTab, onTabChange }) {
    const tabs = [
        { id: 'overview', label: 'Overview', icon: Globe },
        { id: 'coverage', label: 'Coverage Map', icon: MapPin },
        { id: 'risk', label: 'Risk Analysis', icon: AlertTriangle },
    ];

    return (
        <div className="flex gap-1 border-b border-blue-800/30 mb-6">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${isActive
                                ? 'text-cyan-400 border-cyan-400'
                                : 'text-gray-400 border-transparent hover:text-gray-300'
                            }`}
                    >
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );
}

TabNavigation.propTypes = {
    activeTab: PropTypes.string.isRequired,
    onTabChange: PropTypes.func.isRequired,
};

export default TabNavigation;
