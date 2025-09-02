'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { CATEGORIES } from '@/lib/mockData';

interface BreadcrumbItem {
  label: string;
  href: string;
}

export function Breadcrumbs() {
  const pathname = usePathname();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Accueil', href: '/' }
    ];

    if (pathSegments.length === 0) return breadcrumbs;

    // Handle different route patterns
    if (pathSegments[0] === 'category' && pathSegments[1]) {
      const categorySlug = pathSegments[1];
      const category = CATEGORIES.find(cat => cat.slug === categorySlug);
      breadcrumbs.push({
        label: category ? category.name : categorySlug.replace('-', ' '),
        href: `/category/${categorySlug}`
      });
    } else if (pathSegments[0] === 'watch' && pathSegments[1]) {
      breadcrumbs.push(
        { label: 'Vidéos', href: '/videos' },
        { label: 'Lecture', href: `/watch/${pathSegments[1]}` }
      );
    } else if (pathSegments[0] === 'search') {
      breadcrumbs.push({ label: 'Recherche', href: '/search' });
    } else if (pathSegments[0] === 'shorts') {
      breadcrumbs.push({ label: 'Mode immersif', href: '/shorts' });
      if (pathSegments[1]) {
        const category = CATEGORIES.find(cat => cat.slug === pathSegments[1]);
        breadcrumbs.push({
          label: category ? category.name : pathSegments[1].replace('-', ' '),
          href: `/shorts/${pathSegments[1]}`
        });
      }
    } else if (pathSegments[0] === 'admin') {
      breadcrumbs.push({ label: 'Administration', href: '/admin' });
      if (pathSegments[1]) {
        const adminPages: Record<string, string> = {
          'sources': 'Sources',
          'moderation': 'Modération',
          'analytics': 'Analytics'
        };
        breadcrumbs.push({
          label: adminPages[pathSegments[1]] || pathSegments[1],
          href: `/admin/${pathSegments[1]}`
        });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav 
      className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6"
      aria-label="Breadcrumb navigation"
    >
      {breadcrumbs.map((item, index) => (
        <div key={item.href} className="flex items-center space-x-2">
          {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
          
          {index === breadcrumbs.length - 1 ? (
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className="hover:text-google-blue transition-colors duration-200 flex items-center space-x-1"
            >
              {index === 0 && <Home className="w-4 h-4" />}
              <span>{item.label}</span>
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}