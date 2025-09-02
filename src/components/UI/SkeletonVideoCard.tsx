'use client';

interface SkeletonVideoCardProps {
  variant?: 'default' | 'hero';
}

export function SkeletonVideoCard({ variant = 'default' }: SkeletonVideoCardProps) {
  if (variant === 'hero') {
    return (
      <div className="video-card animate-pulse p-0 overflow-hidden">
        <div className="aspect-video skeleton"></div>
        <div className="p-6 space-y-4">
          <div className="skeleton h-8 w-full"></div>
          <div className="skeleton h-6 w-3/4"></div>
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <div className="skeleton h-4 w-1/2"></div>
              <div className="skeleton h-3 w-1/3"></div>
            </div>
            <div className="flex space-x-2">
              <div className="skeleton w-8 h-8 rounded-full"></div>
              <div className="skeleton w-8 h-8 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="video-card animate-pulse">
      <div className="aspect-video skeleton rounded-t-lg"></div>
      <div className="p-4 space-y-3">
        <div className="skeleton h-6 w-full"></div>
        <div className="skeleton h-4 w-3/4"></div>
        <div className="flex items-center justify-between">
          <div className="skeleton h-3 w-1/3"></div>
          <div className="flex space-x-1">
            <div className="skeleton w-6 h-6 rounded-full"></div>
            <div className="skeleton w-6 h-6 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}