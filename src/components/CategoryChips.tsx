'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Category } from '@/types';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
    <div className={cn('bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800', className)}>
      <div className="container-main">
        <div className="flex space-x-3 overflow-x-auto scrollbar-hide py-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                variant={activeCategory === category.slug ? "default" : "secondary"}
                onClick={() => handleCategoryClick(category)}
                className="whitespace-nowrap flex items-center space-x-2 h-12 px-6"
              >
                {category.icon && <span className="text-lg">{category.icon}</span>}
                <span className="font-medium">{category.name}</span>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}