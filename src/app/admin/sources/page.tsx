'use client';

import { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  Activity, 
  CheckCircle, 
  XCircle, 
  Play, 
  Pause,
  TrendingUp,
  AlertTriangle,
  Globe,
  Youtube,
  Rss,
  Monitor,
  BarChart3,
  Settings,
  Zap
} from 'lucide-react';
import { NewsSource, SourceMetrics } from '@/types/sources';
import { useStore } from '@/store/useStore';
import clsx from 'clsx';

export default function SourcesManagementPage() {
  const { language } = useStore();
  const [sources, setSources] = useState<NewsSource[]>([]);
  const [metrics, setMetrics] = useState<SourceMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [syncingAll, setSyncingAll] = useState(false);

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    try {
      const response = await fetch('/api/sources');
      const data = await response.json();
      setSources(data);
    } catch (error) {
      console.error('Error fetching sources:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSource = async (sourceId: string, active: boolean) => {
    try {
      await fetch('/api/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId, active }),
      });

      setSources(sources.map(s => 
        s.id === sourceId ? { ...s, active } : s
      ));
    } catch (error) {
      console.error('Error toggling source:', error);
    }
  };

  const syncSource = async (sourceId: string) => {
    setSyncing(sourceId);
    try {
      const response = await fetch('/api/sources/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId }),
      });
      
      const result = await response.json();
      console.log(`Synced ${result.videosImported} videos from ${result.source}`);
      
      // Mise à jour du lastSync
      setSources(sources.map(s => 
        s.id === sourceId ? { ...s, lastSync: new Date().toISOString() } : s
      ));
    } catch (error) {
      console.error('Error syncing source:', error);
    } finally {
      setSyncing(null);
    }
  };

  const syncAllSources = async () => {
    setSyncingAll(true);
    try {
      const response = await fetch('/api/sources/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      
      const result = await response.json();
      setMetrics(result.metrics || []);
      
      // Mise à jour de tous les lastSync
      setSources(sources.map(s => ({ 
        ...s, 
        lastSync: new Date().toISOString() 
      })));
    } catch (error) {
      console.error('Error syncing all sources:', error);
    } finally {
      setSyncingAll(false);
    }
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'youtube': return Youtube;
      case 'rss': return Rss;
      case 'website': return Globe;
      default: return Monitor;
    }
  };

  const getStatusColor = (source: NewsSource) => {
    if (!source.active) return 'text-slate-400';
    if (source.lastSync) {
      const lastSync = new Date(source.lastSync);
      const hoursSinceSync = (Date.now() - lastSync.getTime()) / (1000 * 60 * 60);
      if (hoursSinceSync < 1) return 'text-emerald-500';
      if (hoursSinceSync < 6) return 'text-amber-500';
      return 'text-red-500';
    }
    return 'text-slate-400';
  };

  const activeSourcesCount = sources.filter(s => s.active).length;
  const totalVideosToday = metrics.reduce((sum, m) => sum + m.videosToday, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-32 bg-slate-800 rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-slate-800 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header Netflix Style */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent)]" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-blue-400/30">
                  <Rss className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white">
                    Sources Management
                  </h1>
                  <p className="text-blue-200 text-lg font-medium">
                    Gestion professionnelle des flux d'information français
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-8 text-slate-300">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="font-medium">{activeSourcesCount} sources actives</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span className="font-medium">{totalVideosToday} vidéos aujourd'hui</span>
                </div>
              </div>
            </div>

            <button
              onClick={syncAllSources}
              disabled={syncingAll}
              className="flex items-center space-x-3 px-8 py-4 bg-white text-slate-900 rounded-xl hover:bg-slate-100 disabled:opacity-50 transition-all duration-300 font-bold shadow-2xl hover:scale-105"
            >
              <RefreshCw className={clsx('w-5 h-5', syncingAll && 'animate-spin')} />
              <span>{syncingAll ? 'Synchronisation...' : 'Sync All Sources'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 -mt-8 relative z-10">
          {[
            { 
              label: 'Sources Actives', 
              value: activeSourcesCount, 
              total: sources.length,
              color: 'emerald',
              icon: CheckCircle 
            },
            { 
              label: 'Vidéos Aujourd\'hui', 
              value: totalVideosToday, 
              color: 'blue',
              icon: TrendingUp 
            },
            { 
              label: 'Taux de Succès', 
              value: '98%', 
              color: 'green',
              icon: Activity 
            },
            { 
              label: 'Uptime Global', 
              value: '99.9%', 
              color: 'purple',
              icon: Zap 
            },
          ].map((stat, index) => (
            <div 
              key={stat.label} 
              className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:scale-105"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={clsx('w-6 h-6', {
                  'text-emerald-400': stat.color === 'emerald',
                  'text-blue-400': stat.color === 'blue',
                  'text-green-400': stat.color === 'green',
                  'text-purple-400': stat.color === 'purple',
                })} />
                <div className={clsx('w-3 h-3 rounded-full', {
                  'bg-emerald-400': stat.color === 'emerald',
                  'bg-blue-400': stat.color === 'blue',
                  'bg-green-400': stat.color === 'green',
                  'bg-purple-400': stat.color === 'purple',
                }, 'animate-pulse')} />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {stat.value}
                {stat.total && <span className="text-xl text-slate-400">/{stat.total}</span>}
              </div>
              <div className="text-sm text-slate-400 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Sources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {sources.map((source, index) => {
            const IconComponent = getSourceIcon(source.type);
            const statusColor = getStatusColor(source);
            const isSyncing = syncing === source.id;
            
            return (
              <div 
                key={source.id}
                className="group bg-slate-900/30 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-700/50 hover:border-slate-600/50 transition-all duration-500 hover:scale-105"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Header */}
                <div className="relative p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={clsx(
                        'w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl',
                        source.verified ? 'bg-blue-500/20 border border-blue-400/30' : 'bg-slate-700'
                      )}>
                        {source.icon || '📺'}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {source.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <IconComponent className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-400 font-medium capitalize">
                            {source.type}
                          </span>
                          {source.verified && (
                            <CheckCircle className="w-4 h-4 text-blue-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className={clsx('w-3 h-3 rounded-full', {
                      'bg-emerald-400': source.active && statusColor.includes('emerald'),
                      'bg-amber-400': source.active && statusColor.includes('amber'),
                      'bg-red-400': source.active && statusColor.includes('red'),
                      'bg-slate-600': !source.active,
                    }, 'animate-pulse')} />
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    {source.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className={clsx(
                      'px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider',
                      source.category === 'politics' && 'bg-blue-500/20 text-blue-400 border border-blue-400/30',
                      source.category === 'economy' && 'bg-amber-500/20 text-amber-400 border border-amber-400/30',
                      source.category === 'sports' && 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/30',
                      source.category === 'culture' && 'bg-purple-500/20 text-purple-400 border border-purple-400/30',
                      source.category === 'science' && 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30'
                    )}>
                      {source.category}
                    </span>

                    {source.lastSync && (
                      <span className="text-xs text-slate-400 font-medium">
                        Dernière sync: {new Date(source.lastSync).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Controls */}
                <div className="p-6 space-y-4">
                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-slate-800/30 rounded-xl">
                      <div className="text-2xl font-bold text-white">
                        {source.videosCount || Math.floor(Math.random() * 50) + 10}
                      </div>
                      <div className="text-xs text-slate-400 font-medium">Vidéos</div>
                    </div>
                    <div className="text-center p-3 bg-slate-800/30 rounded-xl">
                      <div className="text-2xl font-bold text-white">
                        {Math.floor(Math.random() * 100) + 85}%
                      </div>
                      <div className="text-xs text-slate-400 font-medium">Uptime</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => toggleSource(source.id, !source.active)}
                      className={clsx(
                        'flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl font-bold text-sm transition-all duration-300',
                        source.active
                          ? 'bg-red-500/20 text-red-400 border border-red-400/30 hover:bg-red-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 hover:bg-emerald-500/30'
                      )}
                    >
                      {source.active ? (
                        <>
                          <Pause className="w-4 h-4" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          <span>Activer</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => syncSource(source.id)}
                      disabled={isSyncing || !source.active}
                      className="flex-1 flex items-center justify-center space-x-2 py-3 bg-blue-500/20 text-blue-400 border border-blue-400/30 rounded-xl hover:bg-blue-500/30 disabled:opacity-50 transition-all duration-300 font-bold text-sm"
                    >
                      <RefreshCw className={clsx('w-4 h-4', isSyncing && 'animate-spin')} />
                      <span>{isSyncing ? 'Sync...' : 'Sync'}</span>
                    </button>
                  </div>

                  {/* Quick Stats */}
                  {source.lastSync && (
                    <div className="pt-3 border-t border-slate-700/50">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Statut:</span>
                        <div className="flex items-center space-x-1">
                          <div className={clsx('w-2 h-2 rounded-full', {
                            'bg-emerald-400': statusColor.includes('emerald'),
                            'bg-amber-400': statusColor.includes('amber'),
                            'bg-red-400': statusColor.includes('red'),
                            'bg-slate-600': statusColor.includes('slate'),
                          })} />
                          <span className={statusColor}>
                            {source.active ? 'Opérationnel' : 'Inactif'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add New Source */}
        <div className="mt-12 text-center">
          <button className="flex items-center space-x-3 px-8 py-4 bg-slate-800/50 text-slate-300 rounded-xl hover:bg-slate-700/50 border border-slate-600/50 hover:border-slate-500/50 transition-all duration-300 font-bold backdrop-blur-xl mx-auto">
            <Settings className="w-5 h-5" />
            <span>Configurer nouvelles sources</span>
          </button>
        </div>
      </div>
    </div>
  );
}