import { useState } from 'react';
import { Trash2, Clock, Satellite, X } from 'lucide-react';

export default function ChatHistory({ missions, onLoadMission, onDeleteMission, onClearAll }) {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-xl shadow-lg border border-cyan-500/30 transition-all"
      >
        <Clock className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-slate-900/95 backdrop-blur-xl border-r border-cyan-500/20 shadow-2xl z-40 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Satellite className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Mission History</h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Missions List */}
        <div className="overflow-y-auto h-[calc(100%-140px)]">
          {missions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6">
              <Satellite className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-sm text-center">No missions yet. Generate your first mission!</p>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {missions.map((mission) => (
                <div
                  key={mission.id}
                  className="relative bg-slate-800/50 hover:bg-slate-700/70 p-3 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition-all group"
                >
                  {/* Clickable area for loading mission */}
                  <div
                    onClick={() => {
                      onLoadMission(mission);
                      setIsOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0 pr-8">
                        <h3 className="font-semibold text-white text-sm truncate group-hover:text-cyan-400 transition-colors">
                          {mission.data.mission_name || 'Unnamed Mission'}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {mission.query}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500">{formatDate(mission.timestamp)}</span>
                          {mission.data.live_data_sources && (
                            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                              {mission.data.live_data_sources[0]?.name.split(' ')[0]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Delete button - positioned absolutely */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteMission(mission.id);
                    }}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {missions.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700 bg-slate-900">
            <button
              onClick={onClearAll}
              className="w-full bg-red-900/30 hover:bg-red-900/50 text-red-400 py-2 rounded-lg text-sm font-medium transition-all border border-red-500/30"
            >
              Clear All History
            </button>
          </div>
        )}
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-30"
        />
      )}
    </>
  );
}
