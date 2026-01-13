import { useState, useEffect } from 'react';
import { generateMission } from '../services/api';
import ChatHistory from '../components/ChatHistory';
import { missionStorage } from '../hooks/useLocalStorage';
import { Download, RefreshCw, MessageSquare, Plus, Trash2, Send, Loader2, X, Menu, Rocket, Lightbulb, Database, BarChart3, Clock, DollarSign, Map, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import CostEstimator from '../components/CostEstimator';
import CoverageMap from '../components/CoverageMap';

export default function PlannerPage() {
  // Chat state
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);

  // Load chats from localStorage on mount
  useEffect(() => {
    const savedMissions = missionStorage.getAll();

    if (savedMissions.length > 0) {
      // Convert old missions to chat format
      const convertedChats = savedMissions.map(mission => ({
        id: mission.id,
        name: mission.query?.substring(0, 40) + '...' || 'Mission Chat',
        messages: [
          {
            id: `${mission.id}-user`,
            role: 'user',
            content: mission.query,
            timestamp: mission.timestamp
          },
          {
            id: `${mission.id}-assistant`,
            role: 'assistant',
            content: 'Mission generated successfully!',
            missionData: mission.data,
            timestamp: mission.timestamp
          }
        ],
        createdAt: mission.timestamp
      }));
      setChats(convertedChats);
      setActiveChat(convertedChats[0].id);
    } else {
      // Create initial empty chat
      const initialChat = {
        id: Date.now(),
        name: 'New Chat',
        messages: [],
        createdAt: new Date()
      };
      setChats([initialChat]);
      setActiveChat(initialChat.id);
    }
  }, []);

  // Get current active chat
  const currentChat = chats.find(c => c.id === activeChat);

  // Create new chat
  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      name: 'New Chat',
      messages: [],
      createdAt: new Date()
    };
    setChats([newChat, ...chats]);
    setActiveChat(newChat.id);
    setError('');
  };

  // Delete chat
  const handleDeleteChat = (chatId, e) => {
    if (e) e.stopPropagation();

    if (chats.length === 1) {
      alert('Cannot delete the last chat');
      return;
    }

    if (window.confirm('Delete this chat?')) {
      const updatedChats = chats.filter(c => c.id !== chatId);
      setChats(updatedChats);

      // Delete from localStorage
      missionStorage.delete(chatId);

      // Switch to first available chat
      if (activeChat === chatId) {
        setActiveChat(updatedChats[0].id);
      }
    }
  };

  // Clear all chats
  const handleClearAll = () => {
    if (window.confirm('Clear all chat history? This cannot be undone.')) {
      missionStorage.clear();
      const newChat = {
        id: Date.now(),
        name: 'New Chat',
        messages: [],
        createdAt: new Date()
      };
      setChats([newChat]);
      setActiveChat(newChat.id);
    }
  };

  // Send message and generate mission
  const handleSendMessage = async (customInput = null) => {
    const messageContent = customInput || inputMessage;
    if (!messageContent.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: messageContent,
      timestamp: new Date()
    };

    // Add user message to chat
    const updatedChats = chats.map(chat => {
      if (chat.id === activeChat) {
        return {
          ...chat,
          name: chat.messages.length === 0 ? messageContent.substring(0, 40) + '...' : chat.name,
          messages: [...chat.messages, userMessage]
        };
      }
      return chat;
    });
    setChats(updatedChats);
    setInputMessage('');
    setLoading(true);
    setError('');

    try {
      // Call API to generate mission
      const missionData = await generateMission(messageContent);

      // Add assistant response with mission data
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Mission generated successfully!',
        missionData: missionData,
        timestamp: new Date()
      };

      const finalChats = chats.map(chat => {
        if (chat.id === activeChat) {
          return {
            ...chat,
            messages: [...chat.messages, userMessage, assistantMessage]
          };
        }
        return chat;
      });

      setChats(finalChats);

      // Save to localStorage
      const chatToSave = finalChats.find(c => c.id === activeChat);
      missionStorage.save({
        id: activeChat,
        query: messageContent,
        data: missionData,
        timestamp: new Date()
      });

    } catch (err) {
      console.error('❌ Mission error:', err);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `Error: ${err.message}`,
        isError: true,
        timestamp: new Date()
      };

      setChats(prevChats => prevChats.map(chat => {
        if (chat.id === activeChat) {
          return {
            ...chat,
            messages: [...chat.messages, userMessage, errorMessage]
          };
        }
        return chat;
      }));
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Export chat as JSON
  const handleExportChat = () => {
    const dataStr = JSON.stringify(currentChat, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentChat.name.replace(/\s+/g, '_')}_${Date.now()}.json`;
    link.click();
  };

  // Demo scenarios
  const demos = [
    { label: 'Agriculture Monitor', input: 'Design a 3U CubeSat for South India agriculture with daily revisit' },
    { label: 'Broadband Coverage', input: 'Create satellite constellation for European broadband internet' },
    { label: 'Disaster Response', input: 'Design polar orbit constellation for disaster monitoring with 6-hour revisit' }
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">

      {/* Sidebar - Chat List */}
      <div className={`${showSidebar ? 'w-80' : 'w-0'} bg-slate-800/50 backdrop-blur-xl border-r border-cyan-500/20 transition-all duration-300 overflow-hidden flex flex-col`}>

        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Rocket className="w-6 h-6 text-cyan-400" />
              Planexa AI
            </h2>
            <button
              onClick={() => setShowSidebar(false)}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close sidebar"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handleNewChat}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all font-medium"
          >
            <Plus className="w-5 h-5" />
            New Chat
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {chats.map(chat => (
            <div
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={`group p-3 rounded-lg cursor-pointer transition-all ${activeChat === chat.id
                  ? 'bg-cyan-600/30 border border-cyan-500/50'
                  : 'bg-slate-700/30 hover:bg-slate-700/50 border border-transparent'
                }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium truncate text-sm">
                    {chat.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {chat.messages.length} messages
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(chat.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <button
                  onClick={(e) => handleDeleteChat(chat.id, e)}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-700 space-y-2">
          <button
            onClick={handleClearAll}
            className="w-full text-xs text-red-400 hover:text-red-300 py-2 hover:bg-red-900/20 rounded transition-all"
          >
            Clear All Chats
          </button>
          <p className="text-xs text-gray-400 text-center">
            {chats.length} chat{chats.length !== 1 ? 's' : ''} • Live Data Powered
          </p>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Chat Header */}
        <div className="bg-slate-800/50 backdrop-blur-xl border-b border-cyan-500/20 p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {!showSidebar && (
                <button
                  onClick={() => setShowSidebar(true)}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Open sidebar"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
              <div>
                <h1 className="text-xl font-bold text-white">
                  {currentChat?.name || 'New Chat'}
                </h1>
                <p className="text-xs text-gray-400">
                  AI Mission Planner • Real-time Space Data
                </p>
              </div>
            </div>

            <button
              onClick={handleExportChat}
              disabled={!currentChat || currentChat?.messages.length === 0}
              className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm transition-all"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Welcome Message */}
          {currentChat?.messages.length === 0 && !loading && (
            <div className="text-center max-w-3xl mx-auto mt-10">
              <div className="mb-4">
                <Rocket className="w-16 h-16 mx-auto text-cyan-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome to Planexa AI
              </h2>
              <p className="text-gray-400 mb-8">
                Powered by Gemini AI + Live Orbital Data (14,121+ satellites tracked)
              </p>

              {/* Quick Start Examples */}
              <div className="text-left">
                <h3 className="text-lg font-semibold text-cyan-400 mb-4">Quick Start Scenarios</h3>
                <div className="grid grid-cols-1 gap-3">
                  {demos.map((demo, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(demo.input)}
                      disabled={loading}
                      className="p-4 bg-slate-800/50 hover:bg-slate-700/50 border border-cyan-500/20 hover:border-cyan-500/50 rounded-xl text-left transition-all group disabled:opacity-50"
                    >
                      <div className="flex items-start gap-3">
                        <Lightbulb className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-semibold text-cyan-400 mb-1">{demo.label}</p>
                          <p className="text-sm text-gray-400 group-hover:text-gray-300">
                            {demo.input}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          {currentChat?.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-4xl ${message.role === 'user' ? 'w-auto' : 'w-full'}`}>

                {/* User Message */}
                {message.role === 'user' && (
                  <div className="bg-cyan-600/30 border border-cyan-500/50 rounded-2xl px-6 py-4">
                    <p className="text-white leading-relaxed">{message.content}</p>
                    <p className="text-xs text-cyan-300 mt-2">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                )}

                {/* Assistant Message */}
                {message.role === 'assistant' && (
                  <div className="space-y-4">

                    {/* Error Message */}
                    {message.isError ? (
                      <div className="bg-red-900/30 border border-red-500/50 rounded-2xl px-6 py-4">
                        <p className="text-red-300">{message.content}</p>
                      </div>
                    ) : (
                      <>
                        {/* Success Message Header */}
                        <div className="bg-slate-800/50 border border-slate-600 rounded-2xl px-6 py-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                              <Rocket className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-semibold text-white">Planexa AI</span>
                          </div>
                          <p className="text-gray-300">{message.content}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>

                        {/* Mission Data Display */}
                        {message.missionData && (
                          <div className="space-y-4">

                            {/* Mission Summary */}
                            <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 rounded-xl p-5 border border-cyan-500/30">
                              <h3 className="text-2xl font-bold text-cyan-300 mb-2">
                                {message.missionData.mission_name}
                              </h3>
                              <p className="text-gray-200 leading-relaxed">
                                {message.missionData.summary}
                              </p>
                            </div>

                            {/* Live Data Sources */}
                            {message.missionData.live_data_sources?.length > 0 && (
                              <div className="bg-green-900/20 rounded-xl p-4 border border-green-500/30">
                                <h3 className="font-semibold text-green-400 mb-3 flex items-center gap-2">
                                  <Database className="w-5 h-5" /> Live Data Sources
                                </h3>
                                <div className="grid grid-cols-1 gap-2">
                                  {message.missionData.live_data_sources.map((source, i) => (
                                    <div key={i} className="bg-slate-700/50 p-3 rounded-lg border border-slate-600 text-sm">
                                      <div className="flex items-center justify-between">
                                        <span className="font-medium text-white">{source.name}</span>
                                        <span className="text-xs font-semibold text-green-400">{source.status}</span>
                                      </div>
                                      {source.note && (
                                        <p className="text-xs text-gray-400 mt-1">{source.note}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Quick Stats Grid */}
                            {message.missionData.orbit && (
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600">
                                  <p className="text-xs text-gray-400">Altitude</p>
                                  <p className="text-lg font-bold text-white">
                                    {message.missionData.orbit.altitude_km} km
                                  </p>
                                </div>
                                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600">
                                  <p className="text-xs text-gray-400">Inclination</p>
                                  <p className="text-lg font-bold text-white">
                                    {message.missionData.orbit.inclination_deg}°
                                  </p>
                                </div>
                                {message.missionData.constellation && (
                                  <>
                                    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600">
                                      <p className="text-xs text-gray-400">Satellites</p>
                                      <p className="text-lg font-bold text-white">
                                        {message.missionData.constellation.satellites}
                                      </p>
                                    </div>
                                    {message.missionData.constellation.coverage_percent && (
                                      <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600">
                                        <p className="text-xs text-gray-400">Coverage</p>
                                        <p className="text-lg font-bold text-green-400">
                                          {message.missionData.constellation.coverage_percent}%
                                        </p>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            )}

                            {/* Live Data Summary */}
                            {message.missionData.live_data_summary && (
                              <div className="bg-blue-900/20 rounded-xl p-4 border border-blue-500/30">
                                <h3 className="font-semibold text-blue-400 mb-3 flex items-center gap-2">
                                  <BarChart3 className="w-5 h-5" /> Real-Time Space Data
                                </h3>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                  <div className="bg-slate-800/30 p-2 rounded">
                                    <span className="text-gray-400 block text-xs">Active Satellites</span>
                                    <span className="font-medium text-blue-300">
                                      {message.missionData.live_data_summary.active_satellites?.toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="bg-slate-800/30 p-2 rounded">
                                    <span className="text-gray-400 block text-xs">Solar Flux</span>
                                    <span className="font-medium text-blue-300">
                                      {message.missionData.live_data_summary.solar_flux_sfu} SFU
                                    </span>
                                  </div>
                                  <div className="bg-slate-800/30 p-2 rounded">
                                    <span className="text-gray-400 block text-xs">Debris Risk</span>
                                    <span className={`font-medium ${message.missionData.live_data_summary.debris_risk === 'High' ? 'text-red-400' :
                                        message.missionData.live_data_summary.debris_risk === 'Medium' ? 'text-yellow-400' :
                                          'text-green-400'
                                      }`}>
                                      {message.missionData.live_data_summary.debris_risk}
                                    </span>
                                  </div>
                                  {message.missionData.live_data_summary.crowded_altitudes_km?.length > 0 && (
                                    <div className="bg-slate-800/30 p-2 rounded">
                                      <span className="text-gray-400 block text-xs">Crowded Zones</span>
                                      <span className="text-orange-400 text-xs">
                                        {message.missionData.live_data_summary.crowded_altitudes_km.slice(0, 3).join(', ')} km
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Mission Lifetime */}
                            {message.missionData.mission_lifetime && (
                              <div className="bg-purple-900/20 rounded-xl p-4 border border-purple-500/30">
                                <h3 className="font-semibold text-purple-400 mb-2 flex items-center gap-2">
                                  <Clock className="w-5 h-5" /> Mission Lifetime
                                </h3>
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-gray-400 text-sm">Expected Duration:</span>
                                  <span className="font-bold text-purple-300 text-xl">
                                    {message.missionData.mission_lifetime.expected_years} years
                                  </span>
                                </div>
                                <p className="text-xs text-gray-400">{message.missionData.mission_lifetime.reasoning}</p>
                              </div>
                            )}

                            {/* Cost Estimator */}
                            <div className="bg-slate-800/50 rounded-xl p-5 border border-cyan-500/30">
                              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-cyan-400" /> Cost Analysis
                              </h4>
                              <CostEstimator missionData={message.missionData} />
                            </div>

                            {/* Coverage Map */}
                            <div className="bg-slate-800/50 rounded-xl p-5 border border-cyan-500/30">
                              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Map className="w-5 h-5 text-cyan-400" /> Coverage Map
                              </h4>
                              <CoverageMap missionData={message.missionData} />
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800/50 border border-slate-600 rounded-2xl px-6 py-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                  <span className="text-gray-300">Analyzing with Gemini AI + Live Space Data...</span>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-300">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-slate-800/50 backdrop-blur-xl border-t border-cyan-500/20 p-4 flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your satellite mission requirements..."
                className="flex-1 bg-slate-900/50 border border-slate-600 focus:border-cyan-500 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none resize-none"
                rows="3"
                disabled={loading}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || loading}
                className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 rounded-xl transition-all flex items-center justify-center"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
