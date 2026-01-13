import { useState } from 'react';
import PropTypes from 'prop-types';
import { Send } from 'lucide-react';

/**
 * InputBox - Text input with send button
 */
function InputBox({ onSend, disabled }) {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !disabled) {
            onSend(input.trim());
            setInput('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={disabled}
                placeholder="e.g., Monitor crops in Punjab with daily coverage using optical camera..."
                className="flex-1 px-4 py-3 bg-slate-800 border border-blue-800/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
                type="submit"
                disabled={disabled || !input.trim()}
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
            >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
            </button>
        </form>
    );
}

InputBox.propTypes = {
    onSend: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

export default InputBox;
