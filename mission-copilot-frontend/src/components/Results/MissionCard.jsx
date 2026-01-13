import PropTypes from 'prop-types';

/**
 * MissionCard - Reusable card component for displaying mission information
 */
function MissionCard({ title, icon: Icon, children, className = '' }) {
    return (
        <div className={`bg-slate-900/50 border border-blue-800/30 rounded-lg p-5 ${className}`}>
            {(title || Icon) && (
                <div className="flex items-center gap-2 mb-4">
                    {Icon && <Icon className="w-5 h-5 text-cyan-400" />}
                    {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
                </div>
            )}
            {children}
        </div>
    );
}

MissionCard.propTypes = {
    title: PropTypes.string,
    icon: PropTypes.elementType,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default MissionCard;
