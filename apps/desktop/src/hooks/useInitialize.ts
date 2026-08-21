import { useCallback } from 'react';
import { useSystemStore } from '@/store/system';
import { useSettingsStore } from '@/store/settings';
import { apiClient } from '@/api/client';
import toast from 'react-hot-toast';

export function useInitialize() {
  const { setConnected, setConnectionMessage } = useSystemStore();
  const { setLanguage, setTheme, setAccentColor, setVoiceEnabled } = useSettingsStore();

  const initializeApp = useCallback(async () => {
    try {
      // Check server health
      const healthResponse = await apiClient.healthCheck();
      console.log('Server health:', healthResponse);

      // Load settings
      try {
        const settings = await apiClient.getSettings();
        if (settings.data) {
          setLanguage(settings.data.language || 'en');
          setTheme(settings.data.theme || 'dark');
          setAccentColor(settings.data.accentColor || '#3b82f6');
          setVoiceEnabled(settings.data.voiceEnabled !== false);
        }
      } catch (error) {
        console.log('Settings not loaded, using defaults');
      }

      setConnected(true);
      setConnectionMessage('Connected');
      toast.success('Application initialized');
    } catch (error) {
      console.error('Initialization error:', error);
      setConnected(false);
      setConnectionMessage('Connection failed');
      toast.error('Failed to initialize application');
    }
  }, [setConnected, setConnectionMessage, setLanguage, setTheme, setAccentColor, setVoiceEnabled]);

  return { initializeApp, isInitialized: true };
}
