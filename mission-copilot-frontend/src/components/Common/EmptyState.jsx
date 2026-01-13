import { Satellite } from 'lucide-react';

/**
 * EmptyState - Displayed when no mission has been generated yet
 */
function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-6">
            <Satellite className="w-24 h-24 text-slate-700 mb-6" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No mission generated yet</h3>
            <p className="text-sm text-gray-500">Start by describing your mission in the chat</p>
        </div>
    );
}

export default EmptyState;
