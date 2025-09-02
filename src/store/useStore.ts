import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserPreferences, Language } from '@/types';

interface StoreState extends UserPreferences {
  likeVideo: (id: string) => void;
  toggleSubscribe: (key: string) => void;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  rememberCategory: (slug: string) => void;
  clearHistory: () => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      language: 'en',
      theme: 'system',
      subscriptions: ['technology', 'sports'],
      lastViewedCategories: ['technology', 'politics'],
      likedVideos: [],
      _hasHydrated: false,

      likeVideo: (id: string) => {
        const { likedVideos } = get();
        const isLiked = likedVideos.includes(id);
        
        set({
          likedVideos: isLiked
            ? likedVideos.filter(videoId => videoId !== id)
            : [...likedVideos, id]
        });
      },

      toggleSubscribe: (key: string) => {
        const { subscriptions } = get();
        const isSubscribed = subscriptions.includes(key);
        
        set({
          subscriptions: isSubscribed
            ? subscriptions.filter(sub => sub !== key)
            : [...subscriptions, key]
        });
      },

      setLanguage: (language: Language) => {
        set({ language });
      },

      setTheme: (theme: 'light' | 'dark' | 'system') => {
        set({ theme });
      },

      rememberCategory: (slug: string) => {
        const { lastViewedCategories } = get();
        const updated = [slug, ...lastViewedCategories.filter(cat => cat !== slug)].slice(0, 10);
        
        set({ lastViewedCategories: updated });
      },

      clearHistory: () => {
        set({ lastViewedCategories: [], likedVideos: [] });
      },

      setHasHydrated: (state: boolean) => {
        set({
          _hasHydrated: state
        });
      },
    }),
    {
      name: 'video-actus-preferences',
      onRehydrateStorage: (state) => {
        return (state, error) => {
          if (error) {
            console.log('an error happened during hydration', error);
          } else {
            state?.setHasHydrated(true);
          }
        };
      },
    }
  )
);