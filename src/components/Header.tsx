'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { 
  Search, 
  Menu, 
  Sun, 
  Moon, 
  Settings,
  User,
  Globe
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import clsx from 'clsx';

export function Header() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, _hasHydrated } = useStore();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
      <div className="news-layout">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-google-blue rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">VA</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                  Video Actus
                </h1>
              </div>
            </button>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-2xl mx-8 hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher des vidéos d'actualité..."
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-full bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-google-blue focus:border-transparent transition-all duration-200"
                />
              </div>
            </form>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            {/* Mobile search */}
            <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md md:hidden">
              <Search className="w-5 h-5" />
            </button>

            {/* Language */}
            {_hasHydrated ? (
              <button
                onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
                className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span className="uppercase">{language}</span>
              </button>
            ) : (
              <div className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                <Globe className="w-4 h-4" />
                <span className="uppercase">FR</span>
              </div>
            )}

            {/* Theme toggle */}
            {mounted ? (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            ) : (
              <div className="p-2">
                <Sun className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
              </div>
            )}

            {/* Admin */}
            <button
              onClick={() => router.push('/admin')}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Profile */}
            <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}