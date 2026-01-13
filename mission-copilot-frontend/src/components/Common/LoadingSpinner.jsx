import PropTypes from 'prop-types';

/**
 * LoadingSpinner - Three bouncing cyan dots animation
 */
function LoadingSpinner({ message = 'Generating mission concept...' }) {
    return (
        <div className="flex flex-col items-center justify-center py-8">
            <div className="flex gap-2 mb-3">
                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce-dot"></div>
                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce-dot-delay-1"></div>
                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce-dot-delay-2"></div>
            </div>
            {message && <p className="text-sm text-gray-400">{message}</p>}
        </div>
    );
}

LoadingSpinner.propTypes = {
    message: PropTypes.string,
};

export default LoadingSpinner;
