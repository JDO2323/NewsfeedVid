'use client';

import { useState, useEffect } from 'react';
import { 
  Eye, 
  EyeOff, 
  Edit, 
  RefreshCw, 
  Search, 
  Filter, 
  BarChart3,
  Activity,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Globe,
  Play
} from 'lucide-react';
import { Video, Category } from '@/types';
import { formatRelativeTime, formatViewCount, isFresh } from '@/lib/videoUtils';
import { CATEGORIES } from '@/lib/mockData';
import { t } from '@/lib/i18n';
import { useStore } from '@/store/useStore';
import clsx from 'clsx';

export default function AdminPage() {
  const { language } = useStore();
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHidden, setShowHidden] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    let filtered = videos;

    if (!showHidden) {
      filtered = filtered.filter(v => v.visible);
    }

    if (searchQuery) {
      filtered = filtered.filter(v => 
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.creator?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(v => v.category === selectedCategory);
    }

    setFilteredVideos(filtered);
  }, [videos, showHidden, searchQuery, selectedCategory]);

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/admin/videos');
      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (videoId: string, visible: boolean) => {
    try {
      await fetch('/api/admin/toggle-visibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: videoId, visible }),
      });

      setVideos(videos.map(v => 
        v.id === videoId ? { ...v, visible } : v
      ));
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  const assignCategory = async (videoId: string, category: string) => {
    try {
      await fetch('/api/admin/assign-category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: videoId, category }),
      });

      setVideos(videos.map(v => 
        v.id === videoId ? { ...v, category } : v
      ));
    } catch (error) {
      console.error('Error assigning category:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded-3xl w-1/2" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
              ))}
            </div>
            <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  const stats = {
    total: videos.length,
    visible: videos.filter(v => v.visible).length,
    hidden: videos.filter(v => !v.visible).length,
    fresh: videos.filter(v => isFresh(v.publishedAt)).length,
    stale: videos.filter(v => !isFresh(v.publishedAt)).length,
    totalViews: videos.reduce((sum, v) => sum + v.views, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Professional Admin Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-primary-900 to-primary-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(124,58,237,0.3),transparent)]" />
        
        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-xl shadow-netflix">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold text-white tracking-tight">
                    News Control Center
                  </h1>
                  <p className="text-white/80 text-xl font-medium mt-2">
                    Professional content management and analytics dashboard
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 text-white/90">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 animate-pulse" />
                  <span className="font-semibold">Real-time monitoring</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Verified sources only</span>
                </div>
              </div>
            </div>

            <button
              onClick={fetchVideos}
              className="flex items-center space-x-3 px-8 py-4 bg-white text-gray-900 rounded-2xl hover:bg-gray-100 transition-all duration-400 font-bold text-lg shadow-netflix hover:scale-105 tracking-tight"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Refresh Feed</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Professional Stats Dashboard */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 mb-12 -mt-8 relative z-10">
          {[
            { label: 'Total Content', value: stats.total, color: 'primary', icon: BarChart3 },
            { label: 'Live Content', value: stats.visible, color: 'green', icon: Eye },
            { label: 'Moderated', value: stats.hidden, color: 'red', icon: EyeOff },
            { label: 'Fresh News', value: stats.fresh, color: 'blue', icon: Activity },
            { label: 'Archive', value: stats.stale, color: 'orange', icon: AlertTriangle },
            { label: 'Total Views', value: formatViewCount(stats.totalViews), color: 'purple', icon: TrendingUp },
          ].map((stat, index) => (
            <div key={stat.label} className="glass-premium rounded-2xl p-6 shadow-netflix border border-gray-200/30 dark:border-gray-800/30 animate-scale-in hover:scale-105 transition-all duration-400" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-center justify-between mb-3">
                <stat.icon className={clsx("w-6 h-6", {
                  'text-primary-600': stat.color === 'primary',
                  'text-accent-green-600': stat.color === 'green',
                  'text-accent-red-600': stat.color === 'red',
                  'text-accent-purple-600': stat.color === 'purple',
                  'text-blue-600': stat.color === 'blue',
                  'text-accent-orange-600': stat.color === 'orange',
                })} />
                <div className={clsx("w-3 h-3 rounded-full animate-pulse", {
                  'bg-primary-500': stat.color === 'primary',
                  'bg-accent-green-500': stat.color === 'green',
                  'bg-accent-red-500': stat.color === 'red',
                  'bg-accent-purple-500': stat.color === 'purple',
                  'bg-blue-500': stat.color === 'blue',
                  'bg-accent-orange-500': stat.color === 'orange',
                })} />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold tracking-tight">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Professional Controls */}
        <div className="glass-premium rounded-3xl p-8 shadow-netflix mb-12 border border-gray-200/30 dark:border-gray-800/30">
          <div className="flex flex-wrap gap-6 items-center">
            <div className="relative flex-1 min-w-80">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search content by title, creator, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-14 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-4 focus:ring-primary-500/30 transition-all duration-300 font-medium text-base tracking-tight shadow-card focus:shadow-card-hover"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-4 focus:ring-primary-500/30 transition-all duration-300 font-semibold tracking-tight shadow-card focus:shadow-card-hover"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat.slug} value={cat.slug}>{cat.name}</option>
              ))}
            </select>

            <button
              onClick={() => setShowHidden(!showHidden)}
              className={clsx(
                'flex items-center space-x-3 px-8 py-4 rounded-2xl transition-all duration-400 font-bold tracking-tight shadow-card hover:shadow-card-hover hover:scale-105',
                showHidden
                  ? 'bg-gradient-to-r from-accent-red-500 to-accent-red-600 text-white shadow-glow-red'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              )}
            >
              {showHidden ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              <span>{showHidden ? 'Hide Moderated' : 'Show All Content'}</span>
            </button>
          </div>
        </div>

        {/* Professional Content Table */}
        <div className="glass-premium rounded-3xl shadow-netflix overflow-hidden border border-gray-200/30 dark:border-gray-800/30">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Content
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Analytics
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredVideos.map((video, index) => (
                  <tr 
                    key={video.id} 
                    className={clsx(
                      'hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300 animate-fade-in',
                      !video.visible && 'opacity-60 bg-gray-50/50 dark:bg-gray-800/20'
                    )}
                    style={{ animationDelay: `${index * 0.03}s` }}
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-5">
                        <div className="relative group">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-32 h-18 object-cover rounded-2xl shadow-card group-hover:shadow-card-hover transition-all duration-300"
                          />
                          <div className="absolute bottom-1.5 right-1.5 px-2 py-1 bg-gray-900/90 text-white text-xs font-bold rounded backdrop-blur-sm">
                            {Math.floor(video.durationSec / 60)}:{(video.durationSec % 60).toString().padStart(2, '0')}
                          </div>
                          {/* Source badge */}
                          <div className="absolute top-1.5 left-1.5 px-2 py-1 bg-primary-600 text-white text-xs font-bold rounded uppercase">
                            {video.source}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1 space-y-2">
                          <div className="font-bold text-gray-900 dark:text-gray-100 line-clamp-2 text-lg leading-tight tracking-tight">
                            {video.title}
                          </div>
                          <div className="flex items-center space-x-3">
                            {video.creator && (
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-gradient-to-br from-primary-600 to-accent-purple-600 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">
                                    {video.creator.name.charAt(0)}
                                  </span>
                                </div>
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                  {video.creator.name}
                                </span>
                                <CheckCircle className="w-4 h-4 text-primary-500" />
                              </div>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                            Published {formatRelativeTime(video.publishedAt)}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-8 py-6">
                      <select
                        value={video.category}
                        onChange={(e) => assignCategory(video.id, e.target.value)}
                        className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold focus:outline-none focus:ring-4 focus:ring-primary-500/30 transition-all duration-300 shadow-card focus:shadow-card-hover"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                        ))}
                      </select>
                    </td>
                    
                    <td className="px-8 py-6">
                      <div className="flex flex-col space-y-3">
                        <span className={clsx(
                          'inline-flex items-center px-4 py-2 text-sm font-bold rounded-2xl tracking-wide',
                          isFresh(video.publishedAt)
                            ? 'bg-accent-green-100 dark:bg-accent-green-950/50 text-accent-green-700 dark:text-accent-green-300'
                            : 'bg-accent-orange-100 dark:bg-accent-orange-950/50 text-accent-orange-700 dark:text-accent-orange-300'
                        )}>
                          <div className={clsx(
                            'w-2 h-2 rounded-full mr-2',
                            isFresh(video.publishedAt) ? 'bg-accent-green-500 animate-pulse' : 'bg-accent-orange-500'
                          )} />
                          {isFresh(video.publishedAt) ? 'FRESH NEWS' : 'ARCHIVE'}
                        </span>
                        
                        <span className={clsx(
                          'inline-flex items-center px-4 py-2 text-sm font-bold rounded-2xl tracking-wide',
                          video.visible
                            ? 'bg-primary-100 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300'
                            : 'bg-accent-red-100 dark:bg-accent-red-950/50 text-accent-red-700 dark:text-accent-red-300'
                        )}>
                          <div className={clsx(
                            'w-2 h-2 rounded-full mr-2',
                            video.visible ? 'bg-primary-500' : 'bg-accent-red-500'
                          )} />
                          {video.visible ? 'LIVE' : 'MODERATED'}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-8 py-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Views</span>
                          <span className="text-lg font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                            {formatViewCount(video.views)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Engagement</span>
                          <span className="text-lg font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                            {video.likes ? formatViewCount(video.likes) : '0'}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-primary-500 to-accent-purple-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((video.views / 100000) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => toggleVisibility(video.id, !video.visible)}
                          className={clsx(
                            'p-3 rounded-xl transition-all duration-300 group hover:scale-110 shadow-card hover:shadow-card-hover',
                            video.visible
                              ? 'bg-accent-red-100 dark:bg-accent-red-950/50 text-accent-red-600 hover:bg-accent-red-200 dark:hover:bg-accent-red-900/70'
                              : 'bg-accent-green-100 dark:bg-accent-green-950/50 text-accent-green-600 hover:bg-accent-green-200 dark:hover:bg-accent-green-900/70'
                          )}
                          title={video.visible ? 'Moderate content' : 'Approve content'}
                        >
                          {video.visible ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                        
                        <button
                          onClick={() => window.open(`/watch/${video.id}`, '_blank')}
                          className="p-3 rounded-xl bg-primary-100 dark:bg-primary-950/50 text-primary-600 hover:bg-primary-200 dark:hover:bg-primary-900/70 transition-all duration-300 hover:scale-110 shadow-card hover:shadow-card-hover"
                          title="Preview content"
                        >
                          <Play className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredVideos.length === 0 && !loading && (
            <div className="p-16 text-center">
              <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-card">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 tracking-tight">
                No content matches your criteria
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg font-medium">
                Try adjusting your search terms or filters to find the content you're looking for
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                  setShowHidden(false);
                }}
                className="px-8 py-4 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition-all duration-300 font-bold text-lg shadow-netflix hover:scale-105 tracking-tight"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}