'use client';

import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Home,
  Globe,
  MapPin,
  Building,
  Cpu,
  Palette,
  Trophy,
  Heart,
  TrendingUp
} from 'lucide-react';

const categories = [
  { 
    id: 'pour-vous', 
    label: 'Pour vous', 
    href: '/', 
    icon: Home,
    description: 'Contenu personnalisé'
  },
  { 
    id: 'monde', 
    label: 'Monde', 
    href: '/category/monde', 
    icon: Globe,
    description: 'Actualités internationales'
  },
  { 
    id: 'france', 
    label: 'France', 
    href: '/category/france', 
    icon: MapPin,
    description: 'Actualités françaises'
  },
  { 
    id: 'economie', 
    label: 'Économie', 
    href: '/category/economie', 
    icon: Building,
    description: 'Finance et business'
  },
  { 
    id: 'technologie', 
    label: 'Tech', 
    href: '/category/technologie', 
    icon: Cpu,
    description: 'Innovation et numérique'
  },
  { 
    id: 'culture', 
    label: 'Culture', 
    href: '/category/culture', 
    icon: Palette,
    description: 'Arts et divertissement'
  },
  { 
    id: 'sport', 
    label: 'Sports', 
    href: '/category/sport', 
    icon: Trophy,
    description: 'Actualités sportives'
  },
  { 
    id: 'sante', 
    label: 'Santé', 
    href: '/category/sante', 
    icon: Heart,
    description: 'Santé et bien-être'
  },
];

interface CategoryNavigationProps {
  className?: string;
  variant?: 'horizontal' | 'sidebar';
}

export function CategoryNavigation({ className = '', variant = 'horizontal' }: CategoryNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  if (variant === 'sidebar') {
    return (
      <aside className={`w-64 bg-white dark:bg-dark-surface border-r border-google-gray-200 dark:border-dark-border ${className}`}>
        <div className="p-6">
          <h2 className="heading-2 mb-6">Catégories</h2>
          
          <nav className="space-y-2">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => router.push(category.href)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
                  isActive(category.href)
                    ? 'bg-google-blue-light dark:bg-google-blue/20 text-google-blue border-l-4 border-google-blue'
                    : 'hover:bg-google-gray-100 dark:hover:bg-google-gray-700 text-google-gray-700 dark:text-dark-text-secondary'
                }`}
              >
                <category.icon className={`w-5 h-5 ${
                  isActive(category.href) ? 'text-google-blue' : 'text-google-gray-500'
                }`} />
                <div className="flex-1">
                  <div className="font-medium">{category.label}</div>
                  <div className="text-xs text-google-gray-500 dark:text-google-gray-400">
                    {category.description}
                  </div>
                </div>
              </motion.button>
            ))}
          </nav>
        </div>
      </aside>
    );
  }

  return (
    <div className={`bg-white dark:bg-dark-surface border-b border-google-gray-200 dark:border-dark-border ${className}`}>
      <div className="container-main">
        <div className="flex items-center space-x-2 py-4 overflow-x-auto scrollbar-hide">
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(category.href)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 ${
                isActive(category.href)
                  ? 'bg-google-blue text-white shadow-md'
                  : 'bg-google-gray-100 dark:bg-dark-surface text-google-gray-700 dark:text-dark-text-secondary hover:bg-google-gray-200 dark:hover:bg-google-gray-700 border border-google-gray-300 dark:border-dark-border'
              }`}
            >
              <category.icon className="w-4 h-4" />
              <span className="font-medium">{category.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}