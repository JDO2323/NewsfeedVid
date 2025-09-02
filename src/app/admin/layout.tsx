'use client';

import { useRouter, usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Rss, 
  Settings, 
  Shield, 
  Users,
  Activity,
  ArrowLeft
} from 'lucide-react';
import clsx from 'clsx';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: BarChart3,
      description: 'Vue d\'ensemble'
    },
    {
      label: 'Sources',
      href: '/admin/sources',
      icon: Rss,
      description: 'Gestion des flux'
    },
    {
      label: 'Modération',
      href: '/admin/moderation',
      icon: Shield,
      description: 'Contrôle qualité'
    },
    {
      label: 'Analytics',
      href: '/admin/analytics',
      icon: Activity,
      description: 'Métriques détaillées'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Netflix-style admin sidebar */}
      <div className="fixed inset-y-0 left-0 w-72 bg-slate-900/50 backdrop-blur-xl border-r border-slate-700/50 z-40">
        <div className="p-6 space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center space-x-3 text-slate-300 hover:text-white transition-colors duration-300 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Retour à l'accueil</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Admin Panel</h2>
                <p className="text-sm text-slate-400">Centre de contrôle</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              
              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={clsx(
                    'w-full flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-300 group text-left',
                    isActive
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-400/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  )}
                >
                  <item.icon className={clsx(
                    'w-5 h-5 transition-transform duration-300',
                    isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-white group-hover:scale-110'
                  )} />
                  <div className="flex-1">
                    <div className="font-bold text-sm">
                      {item.label}
                    </div>
                    <div className="text-xs opacity-75">
                      {item.description}
                    </div>
                  </div>
                  {isActive && (
                    <div className="w-2 h-8 bg-blue-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-72">
        {children}
      </div>
    </div>
  );
}