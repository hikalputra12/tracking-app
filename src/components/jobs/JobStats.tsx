import React from 'react';
import { JobApplication } from '../../types';
import { Briefcase, Clock, CalendarCheck, Award, XCircle, TrendingUp } from 'lucide-react';

interface JobStatsProps {
  jobs: JobApplication[];
}

export const JobStats: React.FC<JobStatsProps> = ({ jobs }) => {
  const total = jobs.length;
  const waiting = jobs.filter(j => j.status === 'Applied' || !j.status).length;
  const interviewing = jobs.filter(j => j.status.toLowerCase().includes('interview')).length;
  const offered = jobs.filter(j => j.status.toLowerCase().includes('offer')).length;
  const rejected = jobs.filter(j => j.status.toLowerCase().includes('reject')).length;

  const responded = total - waiting;
  const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0;

  const cards = [
    { label: 'Total Lamaran', value: total, desc: 'Perusahaan terdata', icon: Briefcase, color: 'text-neutral-700 dark:text-neutral-300' },
    { label: 'Menunggu Kabar', value: waiting, desc: 'Menunggu respons', icon: Clock, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Tahap Interview', value: interviewing, desc: 'Wawancara aktif', icon: CalendarCheck, color: 'text-amber-600 dark:text-amber-400' },
    { label: 'Tawaran Kerja', value: offered, desc: 'Offer diterima', icon: Award, color: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Tidak Lolos', value: rejected, desc: 'Ditolak seleksi', icon: XCircle, color: 'text-rose-600 dark:text-rose-400' },
    { label: 'Response Rate', value: `${responseRate}%`, desc: `${responded} dari ${total} merespons`, icon: TrendingUp, color: 'text-purple-600 dark:text-purple-400' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-6">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="p-3 rounded-lg border border-[#e9e9e7] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors shadow-sm"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 truncate">
                {c.label}
              </span>
              <Icon className={`w-3.5 h-3.5 ${c.color}`} />
            </div>
            <div className={`text-xl font-bold tracking-tight ${c.color}`}>
              {c.value}
            </div>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 truncate mt-0.5">
              {c.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
};
