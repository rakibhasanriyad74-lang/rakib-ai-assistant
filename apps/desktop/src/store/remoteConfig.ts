// Remote configuration store
import { create } from 'zustand';
import { RemoteConfig, HotFix } from '@rakib/shared';

interface RemoteConfigStore {
  config: RemoteConfig | null;
  isLoading: boolean;
  isSyncing: boolean;
  lastSyncTime: Date | null;
  error: string | null;
  hotfixes: HotFix[];
  
  // Actions
  setConfig: (config: RemoteConfig) => void;
  setLoading: (loading: boolean) => void;
  setSyncing: (syncing: boolean) => void;
  setLastSyncTime: (time: Date) => void;
  setError: (error: string | null) => void;
  setHotfixes: (hotfixes: HotFix[]) => void;
  addHotfix: (hotfix: HotFix) => void;
  removeHotfix: (id: string) => void;
  getFeatureStatus: (featureName: string) => boolean;
  getPrompt: (promptKey: string) => string | undefined;
  getHotfixOverride: (moduleName: string) => Record<string, any> | null;
  shouldApplyHotfix: (hotfixId: string) => boolean;
  reset: () => void;
}

export const useRemoteConfigStore = create<RemoteConfigStore>((set, get) => ({
  config: null,
  isLoading: false,
  isSyncing: false,
  lastSyncTime: null,
  error: null,
  hotfixes: [],
  
  setConfig: (config) => set({ config }),
  setLoading: (isLoading) => set({ isLoading }),
  setSyncing: (isSyncing) => set({ isSyncing }),
  setLastSyncTime: (lastSyncTime) => set({ lastSyncTime }),
  setError: (error) => set({ error }),
  setHotfixes: (hotfixes) => set({ hotfixes }),
  
  addHotfix: (hotfix) =>
    set((state) => ({
      hotfixes: [...state.hotfixes, hotfix],
    })),
  
  removeHotfix: (id) =>
    set((state) => ({
      hotfixes: state.hotfixes.filter((hf) => hf.id !== id),
    })),
  
  getFeatureStatus: (featureName: string) => {
    const state = get();
    const feature = state.config?.features[featureName];
    if (!feature) return true; // Default to enabled if not found
    
    if (!feature.enabled) return false;
    
    // Check rollout percentage
    const rolloutHash = Math.random();
    return rolloutHash * 100 <= feature.rolloutPercentage;
  },
  
  getPrompt: (promptKey: string) => {
    const state = get();
    return state.config?.prompts[promptKey];
  },
  
  getHotfixOverride: (moduleName: string) => {
    const state = get();
    const applicableHotfix = state.hotfixes.find(
      (hf) => hf.enabled && hf.affectedModules.includes(moduleName)
    );
    return applicableHotfix?.override || null;
  },
  
  shouldApplyHotfix: (hotfixId: string) => {
    const state = get();
    const hotfix = state.hotfixes.find((hf) => hf.id === hotfixId);
    if (!hotfix?.enabled) return false;
    if (hotfix.expiresAt && new Date() > hotfix.expiresAt) return false;
    return true;
  },
  
  reset: () =>
    set({
      config: null,
      isLoading: false,
      isSyncing: false,
      lastSyncTime: null,
      error: null,
      hotfixes: [],
    }),
}));
