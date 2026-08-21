import { create } from 'zustand';

interface ThemeStore {
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setAccentColor: (color: string) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'dark',
  accentColor: '#3b82f6',
  setTheme: (theme) => set({ theme }),
  setAccentColor: (accentColor) => set({ accentColor }),
}));
