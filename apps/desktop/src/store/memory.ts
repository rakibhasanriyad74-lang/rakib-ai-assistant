import { create } from 'zustand';

interface Memory {
  id: string;
  category: string;
  title: string;
  content: string;
  timestamp: Date;
}

interface MemoryStore {
  memories: Memory[];
  isLoading: boolean;
  error: string | null;
  addMemory: (memory: Memory) => void;
  removeMemory: (id: string) => void;
  setMemories: (memories: Memory[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  searchMemories: (query: string) => Memory[];
}

export const useMemoryStore = create<MemoryStore>((set, get) => ({
  memories: [],
  isLoading: false,
  error: null,
  addMemory: (memory) =>
    set((state) => ({
      memories: [...state.memories, memory],
    })),
  removeMemory: (id) =>
    set((state) => ({
      memories: state.memories.filter((m) => m.id !== id),
    })),
  setMemories: (memories) => set({ memories }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  searchMemories: (query: string) => {
    const state = get();
    const lowerQuery = query.toLowerCase();
    return state.memories.filter(
      (m) =>
        m.title.toLowerCase().includes(lowerQuery) ||
        m.content.toLowerCase().includes(lowerQuery) ||
        m.category.toLowerCase().includes(lowerQuery)
    );
  },
}));
