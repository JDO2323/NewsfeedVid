'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Zap, 
  Bookmark, 
  History, 
  TrendingUp,
  Play,
  Grid3X3
} from 'lucide-react';
import { useStore } from '@/store/useStore';

export function QuickActions() {
  const router = useRouter();
  const { lastViewedCategories, likedVideos, _hasHydrated } = useStore();
  const [showQuickSearch, setShowQuickSearch] = useState(false);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowQuickSearch(true);
        setTimeout(() => {
          const searchInput = document.getElementById('quick-search-input') as HTMLInputElement;
          searchInput?.focus();
        }, 100);
      }
      
      if (e.key === 'Escape') {
        setShowQuickSearch(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const quickActions = [
    {
      id: 'trending',
      label: 'Tendances',
      icon: TrendingUp,
      shortcut: 'T',
      action: () => router.push('/?sort=popular'),
      color: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
    },
    {
      id: 'shorts',
      label: 'Mode immersif',
      icon: Play,
      shortcut: 'S',
      action: () => router.push('/shorts/pour-vous'),
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
    },
    {
      id: 'categories',
      label: 'Toutes les catégories',
      icon: Grid3X3,
      shortcut: 'C',
      action: () => router.push('/categories'),
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
    },
    {
      id: 'bookmarks',
      label: _hasHydrated ? `Favoris (${likedVideos.length})` : 'Favoris',
      icon: Bookmark,
      action: () => router.push('/favorites'),
      color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
    },
  ];

  return (
    <>
      {/* Quick Actions Toolbar */}
      <div className="sticky top-16 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              {quickActions.slice(0, 3).map((action) => (
                <button
                  key={action.id}
                  onClick={action.action}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${action.color}`}
                  title={action.shortcut ? `Raccourci: Alt+${action.shortcut}` : ''}
                >
                  <action.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{action.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowQuickSearch(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Recherche rapide</span>
              <kbd className="hidden md:inline-block px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded border">
                /
              </kbd>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Search Modal */}
      {showQuickSearch && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
          <div 
            className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  id="quick-search-input"
                  type="text"
                  placeholder="Rechercher des vidéos, catégories, créateurs..."
                  className="flex-1 text-lg bg-transparent border-0 outline-0 text-gray-900 dark:text-gray-100"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      router.push(`/search?q=${encodeURIComponent(e.currentTarget.value.trim())}`);
                      setShowQuickSearch(false);
                    }
                  }}
                />
                <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">ESC</kbd>
              </div>

              {/* Recent Categories */}
              {_hasHydrated && lastViewedCategories.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                    <History className="w-4 h-4 mr-1" />
                    Catégories récentes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {lastViewedCategories.slice(0, 5).map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          router.push(`/category/${category}`);
                          setShowQuickSearch(false);
                        }}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        {category.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                  <Zap className="w-4 h-4 mr-1" />
                  Actions rapides
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => {
                        action.action();
                        setShowQuickSearch(false);
                      }}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-left transition-colors"
                    >
                      <action.icon className="w-5 h-5 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {action.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}