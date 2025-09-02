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
  Bookmark,
  Globe
} from 'lucide-react';
import { useStore } from '@/store/useStore';

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
        'politique française',
        'économie européenne',
        'technologie IA',
        'climat COP28',
        'sport JO 2024'
      ].filter(suggestion => 
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setSearchSuggestions(mockSuggestions);
    } else {
      setSearchSuggestions([]);
    }
  };

  const categories = [
    { id: 'pour-vous', label: 'Pour vous', href: '/' },
    { id: 'monde', label: 'Monde', href: '/category/monde' },
    { id: 'france', label: 'France', href: '/category/france' },
    { id: 'politique', label: 'Politique', href: '/category/politique' },
    { id: 'economie', label: 'Économie', href: '/category/economie' },
    { id: 'technologie', label: 'Tech', href: '/category/technologie' },
    { id: 'culture', label: 'Culture', href: '/category/culture' },
    { id: 'sport', label: 'Sports', href: '/category/sport' },
    { id: 'sante', label: 'Santé', href: '/category/sante' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-dark-bg/95 backdrop-blur-md border-b border-google-gray-200 dark:border-dark-border">
      <div className="container-main">
        {/* Main Header */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/')}
            className="flex items-center space-x-3"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-google-blue to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">NV</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-google-blue to-blue-600 bg-clip-text text-transparent">
              NewsfeedVid
            </h1>
          </motion.button>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8 relative">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-google-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Rechercher des vidéos d'actualité..."
                  className="input-search pl-12 pr-4"
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
                  className="absolute top-full left-0 right-0 bg-white dark:bg-dark-surface border border-google-gray-200 dark:border-dark-border rounded-lg shadow-google-lg mt-1 py-2 z-50"
                >
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchQuery(suggestion);
                        setSearchSuggestions([]);
                        router.push(`/search?q=${encodeURIComponent(suggestion)}`);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-google-gray-100 dark:hover:bg-google-gray-700 text-google-gray-700 dark:text-dark-text-primary flex items-center space-x-2"
                    >
                      <Search className="w-4 h-4 text-google-gray-400" />
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
            <button className="p-2 hover:bg-google-gray-100 dark:hover:bg-dark-surface rounded-md md:hidden">
              <Search className="w-5 h-5" />
            </button>

            {/* Language Toggle */}
            {_hasHydrated ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
                className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-google-gray-700 dark:text-dark-text-secondary hover:bg-google-gray-100 dark:hover:bg-dark-surface rounded-md transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span className="uppercase">{language}</span>
              </motion.button>
            ) : (
              <div className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-google-gray-700 dark:text-dark-text-secondary">
                <Globe className="w-4 h-4" />
                <span className="uppercase">FR</span>
              </div>
            )}

            {/* Theme Toggle */}
            {mounted ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 hover:bg-google-gray-100 dark:hover:bg-dark-surface rounded-md transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </motion.button>
            ) : (
              <div className="p-2">
                <Sun className="w-5 h-5 text-google-gray-700 dark:text-dark-text-secondary" />
              </div>
            )}

            {/* Saved Videos */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/saved')}
              className="p-2 hover:bg-google-gray-100 dark:hover:bg-dark-surface rounded-md transition-colors"
            >
              <Bookmark className="w-5 h-5" />
            </motion.button>

            {/* Admin */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/admin')}
              className="p-2 hover:bg-google-gray-100 dark:hover:bg-dark-surface rounded-md transition-colors"
            >
              <Settings className="w-5 h-5" />
            </motion.button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 hover:bg-google-gray-100 dark:hover:bg-dark-surface rounded-md lg:hidden"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Navigation Categories - Desktop */}
        <div className="hidden lg:block border-t border-google-gray-200 dark:border-dark-border">
          <div className="flex items-center space-x-1 py-3 overflow-x-auto scrollbar-hide">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(category.href)}
                className="nav-item whitespace-nowrap"
              >
                {category.label}
              </motion.button>
            ))}
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
              className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-dark-surface border-l border-google-gray-200 dark:border-dark-border z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Navigation</h2>
                  <button
                    onClick={() => setShowMobileMenu(false)}
                    className="p-2 hover:bg-google-gray-100 dark:hover:bg-google-gray-700 rounded-md"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-google-gray-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Rechercher..."
                      className="w-full pl-10 pr-4 py-2 border border-google-gray-300 dark:border-dark-border rounded-md bg-white dark:bg-dark-bg text-sm"
                    />
                  </div>
                </form>

                {/* Mobile Categories */}
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        router.push(category.href);
                        setShowMobileMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-google-gray-100 dark:hover:bg-google-gray-700 rounded-md font-medium transition-colors"
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}