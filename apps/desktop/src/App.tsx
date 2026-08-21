import { createContext, useContext, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useThemeStore } from '@/store/theme';
import { useSystemStore } from '@/store/system';
import { AppShell } from '@/components/layout/AppShell';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useInitialize } from '@/hooks/useInitialize';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const theme = useThemeStore((state) => state.theme);
  const { isInitialized, initializeApp } = useInitialize();

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen w-screen overflow-hidden">
        <AppShell />
        <Toaster position="top-right" />
      </div>
    </QueryClientProvider>
  );
}

export default App;
