import { useConversationStore } from '@/store/conversation';
import { useAIStore } from '@/store/ai';
import { useSystemStore } from '@/store/system';
import { MessageCircle, Mic, Send, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function MainContent() {
  const { messages, setMessages, addMessage } = useConversationStore();
  const { state, isListening, setListening } = useAIStore();
  const { isConnected, connectionMessage } = useSystemStore();
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    if (!isConnected) {
      toast.error('Not connected to server');
      return;
    }

    // Add user message
    addMessage({
      id: Math.random().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    });

    // Simulate AI response
    setTimeout(() => {
      addMessage({
        id: Math.random().toString(),
        role: 'assistant',
        content: 'This is a simulated response from RAKIB AI Assistant.',
        timestamp: new Date(),
      });
    }, 1000);

    setInputValue('');
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-800 border-r border-slate-700">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <MessageCircle size={48} className="text-slate-600 mb-4" />
            <h2 className="text-xl font-semibold text-slate-300 mb-2">Start a Conversation</h2>
            <p className="text-slate-400 max-w-md">
              Chat with RAKIB to ask questions, get help, or just have a conversation.
            </p>
            {!isConnected && (
              <div className="mt-4 flex items-center gap-2 text-yellow-500 text-sm">
                <AlertCircle size={16} />
                <span>{connectionMessage}</span>
              </div>
            )}
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-100'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {msg.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-700 bg-slate-900">
        <div className="flex gap-2">
          <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition">
            <Mic size={20} />
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || !isConnected}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
