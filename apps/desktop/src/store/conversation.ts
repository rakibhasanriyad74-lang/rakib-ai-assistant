import { create } from 'zustand';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ConversationStore {
  conversationId: string | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  setConversationId: (id: string) => void;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearConversation: () => void;
}

export const useConversationStore = create<ConversationStore>((set) => ({
  conversationId: null,
  messages: [],
  isLoading: false,
  error: null,
  setConversationId: (conversationId) => set({ conversationId }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  setMessages: (messages) => set({ messages }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearConversation: () =>
    set({
      conversationId: null,
      messages: [],
      error: null,
    }),
}));
