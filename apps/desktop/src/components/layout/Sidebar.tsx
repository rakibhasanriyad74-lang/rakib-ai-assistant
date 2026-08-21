import { useConversationStore } from '@/store/conversation';
import { useAIStore } from '@/store/ai';
import { MessageCircle, Plus, Settings, LogOut } from 'lucide-react';
import { useState } from 'react';

export function Sidebar() {
  const [conversations, setConversations] = useState([
    { id: '1', title: 'Welcome to RAKIB' },
    { id: '2', title: 'Previous Conversation' },
  ]);
  const { setConversationId } = useConversationStore();

  return (
    <div className="w-64 border-r border-slate-700 bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <div>
            <h1 className="font-bold text-white">RAKIB</h1>
            <p className="text-xs text-slate-400">AI Assistant</p>
          </div>
        </div>
        <button className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
          <Plus size={18} />
          <span>New Chat</span>
        </button>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setConversationId(conv.id)}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 text-sm transition group"
            >
              <div className="flex items-center gap-2">
                <MessageCircle size={16} />
                <span className="truncate">{conv.title}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-slate-700 space-y-1">
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 text-sm transition">
          <Settings size={18} />
          <span>Settings</span>
        </button>
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 text-sm transition">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
