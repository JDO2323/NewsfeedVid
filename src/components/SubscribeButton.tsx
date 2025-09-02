'use client';

import { UserPlus, UserCheck } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { t } from '@/lib/i18n';
import clsx from 'clsx';

interface SubscribeButtonProps {
  targetId: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
}

export function SubscribeButton({ targetId, size = 'md', variant = 'primary' }: SubscribeButtonProps) {
  const { language, subscriptions, toggleSubscribe } = useStore();
  const isSubscribed = subscriptions.includes(targetId);

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleSubscribe(targetId);
      }}
      className={clsx(
        'flex items-center space-x-2 rounded-full font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary-500',
        sizeClasses[size],
        isSubscribed
          ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          : variant === 'primary'
            ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg hover:shadow-xl'
            : 'bg-secondary-500 text-white hover:bg-secondary-600 shadow-lg hover:shadow-xl'
      )}
    >
      {isSubscribed ? (
        <>
          <UserCheck className={iconSizes[size]} />
          <span>{t('subscribed', language)}</span>
        </>
      ) : (
        <>
          <UserPlus className={iconSizes[size]} />
          <span>{t('subscribe', language)}</span>
        </>
      )}
    </button>
  );
}