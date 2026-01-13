import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import MessageBubble from './MessageBubble';
import InputBox from './InputBox';
import DemoButtons from './DemoButtons';
import LoadingSpinner from '../Common/LoadingSpinner';

/**
 * ChatInterface - Main chat container
 */
function ChatInterface({ onGenerateMission, loading, error }) {
    const [messages, setMessages] = useState([
        {
            role: 'bot',
            content: 'Welcome to the AI Mission Planning Copilot! Describe your space mission requirements, and I\'ll generate a complete mission concept including orbit design, constellation sizing, and risk assessment.',
        },
    ]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSendMessage = (userInput) => {
        // Add user message
        setMessages((prev) => [...prev, { role: 'user', content: userInput }]);

        // Call API
        onGenerateMission(userInput);
    };

    const handleDemoSelect = (demoText) => {
        handleSendMessage(demoText);
    };

    // Add success or error message after API call
    useEffect(() => {
        if (!loading && error) {
            setMessages((prev) => [
                ...prev,
                { role: 'bot', content: `Error: ${error}. Please try again.` },
            ]);
        } else if (!loading && messages[messages.length - 1]?.role === 'user') {
            // Only add success message if the last message was from user and we're not loading
            const lastUserMessage = messages[messages.length - 1];
            if (lastUserMessage && !error) {
                setMessages((prev) => [
                    ...prev,
                    { role: 'bot', content: 'Mission concept generated successfully! Check the results panel on the right.' },
                ]);
            }
        }
    }, [loading, error]);

    return (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-800/30 rounded-lg p-6 flex flex-col h-[calc(100vh-200px)]">
            {/* Demo Buttons */}
            <DemoButtons onSelectDemo={handleDemoSelect} disabled={loading} />

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto mb-4 pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {messages.map((message, index) => (
                    <MessageBubble key={index} role={message.role} content={message.content} />
                ))}

                {loading && <LoadingSpinner />}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Box */}
            <InputBox onSend={handleSendMessage} disabled={loading} />
        </div>
    );
}

ChatInterface.propTypes = {
    onGenerateMission: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.string,
};

export default ChatInterface;
