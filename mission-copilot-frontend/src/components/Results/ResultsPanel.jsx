import { useState } from 'react';
import PropTypes from 'prop-types';
import TabNavigation from './TabNavigation';
import OverviewTab from './OverviewTab';
import CoverageMapTab from './CoverageMapTab';
import RiskAnalysisTab from './RiskAnalysisTab';
import EmptyState from '../Common/EmptyState';
import LoadingSpinner from '../Common/LoadingSpinner';

/**
 * ResultsPanel - Main results container with tabs
 */
function ResultsPanel({ mission, loading }) {
    const [activeTab, setActiveTab] = useState('overview');

    const renderTabContent = () => {
        if (loading) {
            return <LoadingSpinner message="Generating mission concept..." />;
        }

        if (!mission) {
            return <EmptyState />;
        }

        switch (activeTab) {
            case 'overview':
                return <OverviewTab mission={mission} />;
            case 'coverage':
                return <CoverageMapTab mission={mission} />;
            case 'risk':
                return <RiskAnalysisTab mission={mission} />;
            default:
                return <OverviewTab mission={mission} />;
        }
    };

    return (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-800/30 rounded-lg p-6 h-[calc(100vh-200px)] flex flex-col">
            {/* Tab Navigation - only show when mission exists */}
            {mission && !loading && (
                <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
            )}

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {renderTabContent()}
            </div>
        </div>
    );
}

ResultsPanel.propTypes = {
    mission: PropTypes.object,
    loading: PropTypes.bool,
};

export default ResultsPanel;
