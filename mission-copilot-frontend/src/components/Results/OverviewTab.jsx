import PropTypes from 'prop-types';
import { Satellite, TrendingUp, Database, Radio } from 'lucide-react';
import MissionCard from './MissionCard';

/**
 * OverviewTab - Displays mission overview with 5 cards
 */
function OverviewTab({ mission }) {
    if (!mission) return null;

    const { mission_name, executive_summary, orbit, constellation, data_operations, ground_segment } = mission;

    return (
        <div className="space-y-4">
            {/* Mission Header Card */}
            <MissionCard className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 animate-fade-in-1">
                <h2 className="text-2xl font-bold text-white mb-2">{mission_name}</h2>
                <p className="text-gray-300 leading-relaxed">{executive_summary}</p>
            </MissionCard>

            {/* Orbit Design Card */}
            <MissionCard title="Orbit Design" icon={Satellite} className="animate-fade-in-2">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-400">Orbit Type</p>
                        <p className="text-base font-semibold text-white">{orbit.orbit_type}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Altitude</p>
                        <p className="text-base font-semibold text-white">{orbit.altitude_km} km</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Inclination</p>
                        <p className="text-base font-semibold text-white">{orbit.inclination_deg}°</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Orbital Period</p>
                        <p className="text-base font-semibold text-white">{orbit.period_minutes} min</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-sm text-gray-400">Revisit Time</p>
                        <p className="text-base font-semibold text-cyan-400">{orbit.revisit_hours} hours</p>
                    </div>
                </div>
            </MissionCard>

            {/* Constellation Design Card */}
            <MissionCard title="Constellation Design" icon={TrendingUp} className="animate-fade-in-3">
                <div className="space-y-3">
                    <div className="flex items-baseline gap-2">
                        <span className="text-sm text-gray-400">Satellites Required:</span>
                        <span className="text-3xl font-bold text-cyan-400">{constellation.satellites}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-400">Phase Separation</p>
                            <p className="text-base font-semibold text-white">{constellation.phasing_degrees}°</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Configuration</p>
                            <p className="text-base font-semibold text-white">{constellation.configuration}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Coverage</p>
                        <p className="text-2xl font-bold text-green-400">{constellation.coverage_percentage}%</p>
                    </div>
                </div>
            </MissionCard>

            {/* Data Operations Card */}
            <MissionCard title="Data Operations" icon={Database} className="animate-fade-in-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-400">Daily Volume</p>
                        <p className="text-base font-semibold text-white">{data_operations.daily_volume_gb} GB</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Images/Day</p>
                        <p className="text-base font-semibold text-white">{data_operations.images_per_day}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Downlink Rate</p>
                        <p className="text-base font-semibold text-white">{data_operations.downlink_rate_mbps} Mbps</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Annual Storage</p>
                        <p className="text-base font-semibold text-white">{data_operations.annual_storage_tb} TB</p>
                    </div>
                </div>
            </MissionCard>

            {/* Ground Segment Card */}
            <MissionCard title="Ground Segment" icon={Radio} className="animate-fade-in-5">
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-400">Passes per Day</p>
                            <p className="text-base font-semibold text-white">{ground_segment.passes_per_day}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Ground Stations Required</p>
                            <p className="text-base font-semibold text-white">{ground_segment.stations_required}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-2">Recommended Locations</p>
                        <div className="flex flex-wrap gap-2">
                            {ground_segment.station_locations.map((location, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-blue-900/50 border border-blue-700/50 rounded-full text-sm text-blue-300"
                                >
                                    {location}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </MissionCard>
        </div>
    );
}

OverviewTab.propTypes = {
    mission: PropTypes.shape({
        mission_name: PropTypes.string.isRequired,
        executive_summary: PropTypes.string.isRequired,
        orbit: PropTypes.shape({
            orbit_type: PropTypes.string.isRequired,
            altitude_km: PropTypes.number.isRequired,
            inclination_deg: PropTypes.number.isRequired,
            period_minutes: PropTypes.number.isRequired,
            revisit_hours: PropTypes.number.isRequired,
        }).isRequired,
        constellation: PropTypes.shape({
            satellites: PropTypes.number.isRequired,
            phasing_degrees: PropTypes.number.isRequired,
            configuration: PropTypes.string.isRequired,
            coverage_percentage: PropTypes.number.isRequired,
        }).isRequired,
        data_operations: PropTypes.shape({
            daily_volume_gb: PropTypes.number.isRequired,
            images_per_day: PropTypes.number.isRequired,
            downlink_rate_mbps: PropTypes.number.isRequired,
            annual_storage_tb: PropTypes.number.isRequired,
        }).isRequired,
        ground_segment: PropTypes.shape({
            passes_per_day: PropTypes.number.isRequired,
            stations_required: PropTypes.number.isRequired,
            station_locations: PropTypes.arrayOf(PropTypes.string).isRequired,
        }).isRequired,
    }),
};

export default OverviewTab;
