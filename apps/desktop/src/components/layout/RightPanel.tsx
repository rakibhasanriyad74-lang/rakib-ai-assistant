import { useSystemStore } from '@/store/system';
import { useMemoryStore } from '@/store/memory';
import { Brain, Zap, BarChart3, Settings } from 'lucide-react';
import { useState } from 'react';

export function RightPanel() {
  const [activeTab, setActiveTab] = useState<'memory' | 'tools' | 'stats' | 'settings'>('memory');
  const { status, isConnected, voiceState } = useSystemStore();
  const { memories } = useMemoryStore();

  return (
    <div className="w-80 bg-slate-900 border-l border-slate-700 flex flex-col">
      {/* System Status */}
      <div className="p-4 border-b border-slate-700 bg-slate-950">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">System Status</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Connection:</span>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
                {isConnected ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Voice:</span>
            <span className="text-blue-400 capitalize">{voiceState}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Status:</span>
            <span className="text-blue-400 text-xs">{status}</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-700 bg-slate-800">
        <button
          onClick={() => setActiveTab('memory')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm transition ${
            activeTab === 'memory'
              ? 'border-b-2 border-blue-500 text-blue-400'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <Brain size={16} />
        </button>
        <button
          onClick={() => setActiveTab('tools')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm transition ${
            activeTab === 'tools'
              ? 'border-b-2 border-blue-500 text-blue-400'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <Zap size={16} />
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm transition ${
            activeTab === 'stats'
              ? 'border-b-2 border-blue-500 text-blue-400'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <BarChart3 size={16} />
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm transition ${
            activeTab === 'settings'
              ? 'border-b-2 border-blue-500 text-blue-400'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <Settings size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'memory' && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Memories</h3>
            {memories.length === 0 ? (
              <p className="text-xs text-slate-500">No memories stored yet</p>
            ) : (
              memories.map((mem) => (
                <div key={mem.id} className="p-2 bg-slate-800 rounded text-xs">
                  <p className="font-semibold text-slate-300">{mem.title}</p>
                  <p className="text-slate-400 text-xs mt-1">{mem.category}</p>
                </div>
              ))
            )}
          </div>
        )}
        {activeTab === 'tools' && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Tools</h3>
            <p className="text-xs text-slate-500">No tools available</p>
          </div>
        )}
        {activeTab === 'stats' && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Statistics</h3>
            <div className="space-y-2 text-xs">
              <p className="text-slate-400">Messages: 0</p>
              <p className="text-slate-400">Memories: {memories.length}</p>
            </div>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Settings</h3>
            <p className="text-xs text-slate-500">Settings panel</p>
          </div>
        )}
      </div>
    </div>
  );
}
