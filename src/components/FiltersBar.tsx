'use client';

import { DurationBucket, Source } from '@/types';
import { useStore } from '@/store/useStore';
import { t } from '@/lib/i18n';
import { Filter, X, Clock, Globe, Calendar } from 'lucide-react';
import clsx from 'clsx';

interface FiltersBarProps {
  onFilterChange: (filters: any) => void;
  activeFilters: {
    duration?: DurationBucket;
    source?: Source;
    dateRange?: 'today' | 'week' | 'month';
  };
}

export function FiltersBar({ onFilterChange, activeFilters }: FiltersBarProps) {
  const { language } = useStore();

  const durationOptions = [
    { value: undefined, label: 'Toute durée' },
    { value: 'short' as DurationBucket, label: 'Court (< 5min)' },
    { value: 'medium' as DurationBucket, label: 'Moyen (5-20min)' },
    { value: 'long' as DurationBucket, label: 'Long (> 20min)' },
  ];

  const sourceOptions = [
    { value: undefined, label: 'Toutes sources' },
    { value: 'youtube' as Source, label: 'YouTube' },
    { value: 'vimeo' as Source, label: 'Vimeo' },
    { value: 'dailymotion' as Source, label: 'Dailymotion' },
    { value: 'rss' as Source, label: 'Flux RSS' },
    { value: 'creator' as Source, label: 'Créateurs' },
  ];

  const dateOptions = [
    { value: undefined, label: 'Toutes dates' },
    { value: 'today' as const, label: 'Aujourd\'hui' },
    { value: 'week' as const, label: 'Cette semaine' },
    { value: 'month' as const, label: 'Ce mois' },
  ];

  const FilterGroup = ({ 
    value, 
    options, 
    onChange, 
    label,
    icon: Icon
  }: { 
    value: any; 
    options: Array<{ value: any; label: string }>; 
    onChange: (value: any) => void;
    label: string;
    icon: any;
  }) => (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Icon className="w-4 h-4 text-gray-400" />
        <label className="text-sm font-medium text-white">
          {label}
        </label>
      </div>
      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option.value || 'all'}
            onClick={() => onChange(option.value)}
            className={clsx(
              'w-full text-left px-4 py-2 rounded-lg transition-all duration-200 text-sm',
              value === option.value
                ? 'bg-white text-netflix-black font-medium'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );

  const hasActiveFilters = Object.values(activeFilters).some(Boolean);

  return (
    <div className="glass-netflix rounded-xl p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Filter className="w-6 h-6 text-white" />
          <h3 className="text-xl font-bold text-white">
            Filtres avancés
          </h3>
        </div>

        {hasActiveFilters && (
          <button
            onClick={() => onFilterChange({})}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:border-white hover:text-white transition-all duration-200"
          >
            <X className="w-4 h-4" />
            <span className="text-sm font-medium">Réinitialiser</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FilterGroup
          value={activeFilters.duration}
          options={durationOptions}
          onChange={(duration) => onFilterChange({ ...activeFilters, duration })}
          label="Durée"
          icon={Clock}
        />
        
        <FilterGroup
          value={activeFilters.source}
          options={sourceOptions}
          onChange={(source) => onFilterChange({ ...activeFilters, source })}
          label="Source"
          icon={Globe}
        />
        
        <FilterGroup
          value={activeFilters.dateRange}
          options={dateOptions}
          onChange={(dateRange) => onFilterChange({ ...activeFilters, dateRange })}
          label="Période"
          icon={Calendar}
        />
      </div>
    </div>
  );
}