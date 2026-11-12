import React from 'react';
import { ActiveTab } from '../../types';
import { Briefcase, Wallet, LayoutDashboard, Settings } from 'lucide-react';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const items: { id: ActiveTab; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Hub', icon: LayoutDashboard },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'finance', label: 'Keuangan', icon: Wallet },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#1f1f1f]/95 backdrop-blur-md border-t border-[#e9e9e7] dark:border-[#2f2f2f] px-2 py-1.5 flex items-center justify-around pb-safe">
      {items.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              isActive
                ? 'text-neutral-900 dark:text-neutral-100 font-semibold scale-105'
                : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
