import PropTypes from 'prop-types';

/**
 * MessageBubble - Individual chat message component
 * @param {string} role - 'user' or 'bot'
 * @param {string} content - Message text
 */
function MessageBubble({ role, content }) {
    const isUser = role === 'user';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}>
            <div
                className={`max-w-[80%] px-4 py-3 rounded-lg ${isUser
                        ? 'bg-cyan-600 text-white'
                        : 'bg-slate-700 text-gray-100'
                    }`}
            >
                <p className="text-sm leading-relaxed">{content}</p>
            </div>
        </div>
    );
}

MessageBubble.propTypes = {
    role: PropTypes.oneOf(['user', 'bot']).isRequired,
    content: PropTypes.string.isRequired,
};

export default MessageBubble;
