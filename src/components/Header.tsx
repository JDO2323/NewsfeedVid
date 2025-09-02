'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Menu, 
  X,
  Sun, 
  Moon, 
  Settings,
  Globe,
  Play,
  BookmarkIcon
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Header() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, _hasHydrated } = useStore();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchSuggestions([]);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    
    // Mock autocomplétion
    if (value.length > 2) {
      const mockSuggestions = [
        'actualité politique France',
        'économie européenne 2024',
        'technologies IA innovation',
        'climat environnement',
        'sport JO Paris 2024'
      ].filter(suggestion => 
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setSearchSuggestions(mockSuggestions);
    } else {
      setSearchSuggestions([]);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container-main">
        {/* Main Header */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/')}
            className="flex items-center space-x-3"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                NewsfeedVid
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                Actualités vidéo
              </p>
            </div>
          </motion.button>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8 relative">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Rechercher des actualités vidéo..."
                  className="pl-12 pr-4 h-12 bg-gray-50 dark:bg-gray-800 border-0 shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200"
                />
              </div>
            </form>

            {/* Search Suggestions */}
            <AnimatePresence>
              {searchSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl mt-2 py-2 z-50"
                >
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchQuery(suggestion);
                        setSearchSuggestions([]);
                        router.push(`/search?q=${encodeURIComponent(suggestion)}`);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center space-x-3 transition-colors"
                    >
                      <Search className="w-4 h-4 text-gray-400" />
                      <span>{suggestion}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            {/* Mobile Search */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="w-5 h-5" />
            </Button>

            {/* Language Toggle */}
            {_hasHydrated ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
                className="hidden sm:flex items-center space-x-1"
              >
                <Globe className="w-4 h-4" />
                <span className="uppercase font-medium">{language}</span>
              </Button>
            ) : (
              <div className="hidden sm:flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Globe className="w-4 h-4" />
                <span className="uppercase">FR</span>
              </div>
            )}

            {/* Theme Toggle */}
            {mounted ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>
            ) : (
              <Button variant="ghost" size="icon">
                <Sun className="w-5 h-5" />
              </Button>
            )}

            {/* Saved Videos */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/saved')}
              className="hidden sm:flex"
            >
              <BookmarkIcon className="w-5 h-5" />
            </Button>

            {/* Admin */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/admin')}
              className="hidden sm:flex"
            >
              <Settings className="w-5 h-5" />
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setShowMobileMenu(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Menu</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Rechercher..."
                      className="pl-10 h-10"
                    />
                  </div>
                </form>

                {/* Mobile Actions */}
                <div className="space-y-3">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      router.push('/saved');
                      setShowMobileMenu(false);
                    }}
                  >
                    <BookmarkIcon className="w-4 h-4 mr-3" />
                    Mes vidéos sauvées
                  </Button>
                  
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      router.push('/admin');
                      setShowMobileMenu(false);
                    }}
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Administration
                  </Button>

                  {_hasHydrated && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
                    >
                      <Globe className="w-4 h-4 mr-3" />
                      Langue: {language.toUpperCase()}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}