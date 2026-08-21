import { create } from 'zustand';

interface SettingsStore {
  language: 'en' | 'bn';
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  voiceEnabled: boolean;
  voiceLanguage: 'en' | 'bn';
  voiceGender: 'male' | 'female';
  speechRate: number;
  volume: number;
  setLanguage: (lang: 'en' | 'bn') => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setAccentColor: (color: string) => void;
  setVoiceEnabled: (enabled: boolean) => void;
  setVoiceLanguage: (lang: 'en' | 'bn') => void;
  setVoiceGender: (gender: 'male' | 'female') => void;
  setSpeechRate: (rate: number) => void;
  setVolume: (volume: number) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  language: 'en',
  theme: 'dark',
  accentColor: '#3b82f6',
  voiceEnabled: true,
  voiceLanguage: 'en',
  voiceGender: 'male',
  speechRate: 1.0,
  volume: 1.0,
  setLanguage: (language) => set({ language }),
  setTheme: (theme) => set({ theme }),
  setAccentColor: (accentColor) => set({ accentColor }),
  setVoiceEnabled: (voiceEnabled) => set({ voiceEnabled }),
  setVoiceLanguage: (voiceLanguage) => set({ voiceLanguage }),
  setVoiceGender: (voiceGender) => set({ voiceGender }),
  setSpeechRate: (speechRate) => set({ speechRate }),
  setVolume: (volume) => set({ volume }),
}));
