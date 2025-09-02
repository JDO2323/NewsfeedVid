'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Home, 
  TrendingUp, 
  Globe, 
  MapPin, 
  DollarSign, 
  Microscope, 
  Heart, 
  Cpu, 
  Palette, 
  Trophy, 
  Gamepad2,
  Search,
  Menu,
  X,
  ChevronDown,
  Settings
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import clsx from 'clsx';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: any;
  badge?: string;
  children?: NavigationItem[];
  shortcut?: string;
}

const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: 'pour-vous',
    label: 'Pour vous',
    href: '/',
    icon: Home,
    shortcut: 'H',
  },
  {
    id: 'actualites',
    label: 'Actualités',
    href: '/actualites',
    icon: TrendingUp,
    children: [
      { id: 'actualite-locale', label: 'Actualité locale', href: '/category/actualite-locale', icon: MapPin },
      { id: 'france', label: 'France', href: '/category/france', icon: Globe },
      { id: 'monde', label: 'Monde', href: '/category/monde', icon: Globe },
    ]
  },
  {
    id: 'economie',
    label: 'Économie',
    href: '/category/economie',
    icon: DollarSign,
    shortcut: 'E',
  },
  {
    id: 'sciences',
    label: 'Sciences & Tech',
    href: '/sciences',
    icon: Microscope,
    children: [
      { id: 'science', label: 'Science', href: '/category/science', icon: Microscope },
      { id: 'technologie', label: 'Technologie', href: '/category/technologie', icon: Cpu },
      { id: 'sante', label: 'Santé', href: '/category/sante', icon: Heart },
    ]
  },
  {
    id: 'culture-sport',
    label: 'Culture & Sport',
    href: '/culture-sport',
    icon: Palette,
    children: [
      { id: 'culture', label: 'Culture', href: '/category/culture', icon: Palette },
      { id: 'sport', label: 'Sport', href: '/category/sport', icon: Trophy },
      { id: 'divertissement', label: 'Divertissement', href: '/category/divertissement', icon: Gamepad2 },
    ]
  },
];

export function MainNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { _hasHydrated } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        const shortcutItem = NAVIGATION_ITEMS.find(item => 
          item.shortcut?.toLowerCase() === e.key.toLowerCase()
        );
        if (shortcutItem) {
          e.preventDefault();
          router.push(shortcutItem.href);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const hasActiveChild = (children: NavigationItem[] = []) => {
    return children.some(child => isActive(child.href));
  };

  const NavigationLink = ({ item, level = 0 }: { item: NavigationItem; level?: number }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const active = isActive(item.href);
    const childActive = hasActiveChild(item.children);

    return (
      <div className="relative">
        <div className="flex items-center">
          <button
            onClick={() => {
              if (hasChildren) {
                toggleExpanded(item.id);
              } else {
                router.push(item.href);
                setIsMobileMenuOpen(false);
              }
            }}
            className={clsx(
              'flex items-center space-x-3 w-full px-4 py-3 text-left rounded-lg transition-all duration-200 group',
              level === 0 && 'font-medium',
              level > 0 && 'ml-4 text-sm',
              active || childActive
                ? 'bg-google-blue text-white shadow-md'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800',
            )}
          >
            <item.icon className={clsx(
              'flex-shrink-0',
              level === 0 ? 'w-5 h-5' : 'w-4 h-4'
            )} />
            <span className="flex-1">{item.label}</span>
            
            {item.shortcut && level === 0 && (
              <kbd className={clsx(
                'hidden sm:inline-block px-2 py-1 text-xs rounded border',
                active
                  ? 'bg-white/20 text-white border-white/30'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600'
              )}>
                Alt+{item.shortcut}
              </kbd>
            )}
            
            {hasChildren && (
              <ChevronDown className={clsx(
                'w-4 h-4 transition-transform duration-200',
                isExpanded && 'rotate-180'
              )} />
            )}
          </button>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => (
              <NavigationLink key={child.id} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
        aria-label="Toggle navigation menu"
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Navigation Sidebar */}
      <nav className={clsx(
        'fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Navigation Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg text-gray-900 dark:text-gray-100">
              Navigation
            </h2>
            <button
              onClick={() => router.push('/admin')}
              className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Administration"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {NAVIGATION_ITEMS.map((item) => (
              <NavigationLink key={item.id} item={item} />
            ))}
          </div>

          {/* Keyboard shortcuts help */}
          <div className="mt-8 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Raccourcis clavier
            </h3>
            <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
              <div>Alt + H : Accueil</div>
              <div>Alt + E : Économie</div>
              <div>/ : Recherche</div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}