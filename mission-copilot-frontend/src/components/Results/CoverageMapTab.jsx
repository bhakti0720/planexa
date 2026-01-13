import PropTypes from 'prop-types';
import { Radio } from 'lucide-react';
import MissionCard from './MissionCard';

/**
 * CoverageMapTab - CSS-only coverage visualization with pulsing points
 */
function CoverageMapTab({ mission }) {
    if (!mission || !mission.coverage_map) return null;

    const { coverage_map, ground_segment } = mission;
    const { coverage_points, avg_coverage_percentage, max_revisit_gap_hours } = coverage_map;

    // Calculate position for coverage points (simple distribution)
    const getPosition = (lat, lng) => {
        // Convert lat/lng to percentage positions
        // Lat: -90 to 90 -> 0% to 100%
        // Lng: -180 to 180 -> 0% to 100%
        const top = ((90 - lat) / 180) * 100;
        const left = ((lng + 180) / 360) * 100;
        return { top: `${top}%`, left: `${left}%` };
    };

    // Position ground stations evenly
    const getStationPosition = (index, total) => {
        const top = 20 + (index * 60) / Math.max(total - 1, 1);
        const left = 15 + (index % 3) * 35;
        return { top: `${top}%`, left: `${left}%` };
    };

    return (
        <div className="space-y-4">
            {/* Coverage Visualization */}
            <MissionCard title="Coverage Visualization" className="animate-fade-in">
                <div className="relative h-[400px] bg-gradient-to-br from-blue-950 to-slate-900 rounded-lg overflow-hidden">
                    {/* Coverage Points */}
                    {coverage_points.map((point, index) => {
                        const position = getPosition(point.lat, point.lng);
                        const opacity = point.intensity;

                        return (
                            <div
                                key={index}
                                className="absolute animate-pulse-slow"
                                style={{
                                    ...position,
                                    transform: 'translate(-50%, -50%)',
                                }}
                            >
                                <div
                                    className="w-20 h-20 rounded-full"
                                    style={{
                                        background: `radial-gradient(circle, rgba(6, 182, 212, ${opacity}) 0%, rgba(6, 182, 212, ${opacity * 0.5}) 50%, transparent 100%)`,
                                    }}
                                />
                            </div>
                        );
                    })}

                    {/* Ground Stations */}
                    {ground_segment.station_locations.map((location, index) => {
                        const position = getStationPosition(index, ground_segment.station_locations.length);

                        return (
                            <div
                                key={index}
                                className="absolute"
                                style={{
                                    ...position,
                                    transform: 'translate(-50%, -50%)',
                                }}
                            >
                                <div className="flex flex-col items-center">
                                    <Radio className="w-6 h-6 text-green-400" />
                                    <span className="text-xs text-green-300 mt-1 whitespace-nowrap bg-slate-900/80 px-2 py-1 rounded">
                                        {location}
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                    {/* Legend */}
                    <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm border border-blue-800/30 rounded-lg p-3 space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-cyan-400"></div>
                            <span className="text-xs text-gray-300">High Coverage</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-cyan-400/50"></div>
                            <span className="text-xs text-gray-300">Medium Coverage</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Radio className="w-4 h-4 text-green-400" />
                            <span className="text-xs text-gray-300">Ground Station</span>
                        </div>
                    </div>
                </div>
            </MissionCard>

            {/* Coverage Statistics */}
            <MissionCard title="Coverage Statistics" className="animate-fade-in-1">
                <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                        <p className="text-sm text-gray-400 mb-2">Average Coverage</p>
                        <p className="text-4xl font-bold text-cyan-400">{avg_coverage_percentage}%</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-400 mb-2">Max Revisit Gap</p>
                        <p className="text-4xl font-bold text-green-400">{max_revisit_gap_hours} hrs</p>
                    </div>
                </div>
            </MissionCard>
        </div>
    );
}

CoverageMapTab.propTypes = {
    mission: PropTypes.shape({
        coverage_map: PropTypes.shape({
            coverage_points: PropTypes.arrayOf(
                PropTypes.shape({
                    lat: PropTypes.number.isRequired,
                    lng: PropTypes.number.isRequired,
                    intensity: PropTypes.number.isRequired,
                })
            ).isRequired,
            avg_coverage_percentage: PropTypes.number.isRequired,
            max_revisit_gap_hours: PropTypes.number.isRequired,
        }).isRequired,
        ground_segment: PropTypes.shape({
            station_locations: PropTypes.arrayOf(PropTypes.string).isRequired,
        }).isRequired,
    }),
};

export default CoverageMapTab;
