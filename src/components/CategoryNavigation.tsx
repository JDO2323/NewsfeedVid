'use client';

import { useRouter, usePathname } from 'next/navigation';

const categories = [
  { id: 'a-la-une', label: 'À la une', href: '/' },
  { id: 'politique', label: 'Politique', href: '/category/france' },
  { id: 'international', label: 'International', href: '/category/monde' },
  { id: 'economie', label: 'Économie', href: '/category/economie' },
  { id: 'sport', label: 'Sport', href: '/category/sport' },
  { id: 'tech', label: 'Tech', href: '/category/technologie' },
  { id: 'sante', label: 'Santé', href: '/category/sante' },
  { id: 'div', label: 'Div', href: '/category/divertissement' },
];

export function CategoryNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center space-x-12 py-4 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => router.push(category.href)}
              className={`whitespace-nowrap text-base font-medium py-2 relative transition-colors ${
                isActive(category.href)
                  ? 'text-gray-900 dark:text-gray-100'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {category.label}
              {isActive(category.href) && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}