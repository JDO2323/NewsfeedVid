'use client';

import { Search, RefreshCw } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { t } from '@/lib/i18n';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  const { language } = useStore();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
        <Search className="w-12 h-12 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {title || t('noResults', language)}
      </h3>
      
      {description && (
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
          {description}
        </p>
      )}

      {action && (
        <button
          onClick={action.onClick}
          className="flex items-center space-x-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{action.label}</span>
        </button>
      )}
    </div>
  );
}