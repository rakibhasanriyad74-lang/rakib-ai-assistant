import { create } from 'zustand';
import { AI_STATES } from '@rakib/shared';

export type AIState = (typeof AI_STATES)[keyof typeof AI_STATES];

interface AIStore {
  state: AIState;
  isListening: boolean;
  isSpeaking: boolean;
  currentMessage: string;
  error: string | null;
  setState: (state: AIState) => void;
  setListening: (listening: boolean) => void;
  setSpeaking: (speaking: boolean) => void;
  setCurrentMessage: (message: string) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAIStore = create<AIStore>((set) => ({
  state: AI_STATES.IDLE,
  isListening: false,
  isSpeaking: false,
  currentMessage: '',
  error: null,
  setState: (state) => set({ state }),
  setListening: (isListening) => set({ isListening }),
  setSpeaking: (isSpeaking) => set({ isSpeaking }),
  setCurrentMessage: (currentMessage) => set({ currentMessage }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      state: AI_STATES.IDLE,
      isListening: false,
      isSpeaking: false,
      currentMessage: '',
      error: null,
    }),
}));
