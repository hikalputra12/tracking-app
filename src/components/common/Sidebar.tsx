import React from 'react';
import { ActiveTab } from '../../types';
import { 
  Briefcase, 
  Wallet, 
  LayoutDashboard, 
  Settings, 
  Lock, 
  Moon, 
  Sun, 
  ExternalLink,
  ChevronRight,
  Database
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onLock: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  isLive: boolean;
  spreadsheetId: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onLock,
  darkMode,
  setDarkMode,
  isLive,
  spreadsheetId
}) => {
  const navItems: { id: ActiveTab; label: string; icon: any; emoji: string }[] = [
    { id: 'dashboard', label: 'Dashboard Hub', icon: LayoutDashboard, emoji: '🏠' },
    { id: 'jobs', label: 'Job Seeker', icon: Briefcase, emoji: '💼' },
    { id: 'finance', label: 'Keuangan', icon: Wallet, emoji: '💰' },
    { id: 'settings', label: 'Pengaturan & Sheet', icon: Settings, emoji: '⚙️' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-[#e9e9e7] dark:border-[#2f2f2f] bg-[#fbfbfa] dark:bg-[#202020] h-screen select-none sticky top-0">
      {/* Workspace Header */}
      <div className="p-3 border-b border-[#e9e9e7] dark:border-[#2f2f2f] flex items-center justify-between">
        <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
          <span className="text-xl">🚀</span>
          <div>
            <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 leading-tight">
              TrackHub
            </h2>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Personal Notion OS
            </p>
          </div>
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle Dark Mode"
          className="p-1.5 rounded hover:bg-neutral-200/60 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 transition-colors"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        <div className="px-3 py-1 text-[11px] font-semibold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase">
          Trackers
        </div>

        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-neutral-200/80 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">{item.emoji}</span>
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />}
            </button>
          );
        })}

        {/* Google Sheet Quick Link */}
        <div className="pt-4">
          <div className="px-3 py-1 text-[11px] font-semibold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase">
            Database
          </div>
          <a
            href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/60 transition-colors group"
          >
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Google Sheet</span>
            </div>
            <ExternalLink className="w-3 h-3 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-200" />
          </a>
        </div>
      </div>

      {/* Sync Status & Lock Footer */}
      <div className="p-3 border-t border-[#e9e9e7] dark:border-[#2f2f2f] bg-[#f7f7f5] dark:bg-[#1c1c1c] space-y-2">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="text-neutral-500 dark:text-neutral-400">Status Sync:</span>
          <span className={`inline-flex items-center gap-1.5 font-medium ${isLive ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            {isLive ? 'Live Sheet' : 'Local Mode'}
          </span>
        </div>

        <button
          onClick={onLock}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors border border-neutral-300 dark:border-neutral-700"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Kunci Aplikasi (Logout)</span>
        </button>
      </div>
    </aside>
  );
};
