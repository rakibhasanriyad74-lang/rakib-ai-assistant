import { create } from 'zustand';
import { SYSTEM_STATUS } from '@rakib/shared';

export type SystemStatus = (typeof SYSTEM_STATUS)[keyof typeof SYSTEM_STATUS];

interface SystemStore {
  status: SystemStatus;
  isConnected: boolean;
  connectionMessage: string;
  voiceState: 'ready' | 'listening' | 'processing' | 'speaking' | 'error';
  setStatus: (status: SystemStatus) => void;
  setConnected: (connected: boolean) => void;
  setConnectionMessage: (message: string) => void;
  setVoiceState: (state: 'ready' | 'listening' | 'processing' | 'speaking' | 'error') => void;
}

export const useSystemStore = create<SystemStore>((set) => ({
  status: SYSTEM_STATUS.CONNECTING,
  isConnected: false,
  connectionMessage: 'Connecting...',
  voiceState: 'ready',
  setStatus: (status) => set({ status }),
  setConnected: (isConnected) => set({ isConnected }),
  setConnectionMessage: (connectionMessage) => set({ connectionMessage }),
  setVoiceState: (voiceState) => set({ voiceState }),
}));
