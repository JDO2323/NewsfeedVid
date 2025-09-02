'use client';

import { useRouter } from 'next/navigation';
import { Category } from '@/types';
import { useStore } from '@/store/useStore';
import clsx from 'clsx';

interface CategoryChipsProps {
  categories: Category[];
  activeCategory?: string;
  className?: string;
}

export function CategoryChips({ 
  categories, 
  activeCategory, 
  className 
}: CategoryChipsProps) {
  const router = useRouter();
  const { rememberCategory } = useStore();

  const handleCategoryClick = (category: Category) => {
    rememberCategory(category.slug);
    if (category.slug === 'pour-vous') {
      router.push('/');
    } else {
      router.push(`/category/${category.slug}`);
    }
  };

  return (
    <div className={clsx('border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900', className)}>
      <div className="news-layout">
        <div className="flex space-x-1 overflow-x-auto scrollbar-hide py-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className={clsx(
                'category-chip whitespace-nowrap',
                activeCategory === category.slug && 'active'
              )}
            >
              <span className="flex items-center space-x-1">
                {category.icon && <span className="text-sm">{category.icon}</span>}
                <span>{category.name}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}