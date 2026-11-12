import React from 'react';
import { JobApplication, JobStatus } from '../../types';
import { JobCard } from './JobCard';
import { Plus } from 'lucide-react';

interface JobBoardViewProps {
  jobs: JobApplication[];
  onSelectJob: (job: JobApplication) => void;
  onStatusChange: (job: JobApplication, newStatus: JobStatus) => void;
  onAddNewWithStatus: (status: JobStatus) => void;
}

export const JobBoardView: React.FC<JobBoardViewProps> = ({
  jobs,
  onSelectJob,
  onStatusChange,
  onAddNewWithStatus
}) => {
  const columns: { id: JobStatus; title: string; emoji: string; color: string }[] = [
    { id: 'Applied', title: 'Applied', emoji: '📥', color: 'border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400' },
    { id: 'Interview', title: 'Interview', emoji: '🗓️', color: 'border-amber-200 dark:border-amber-900 text-amber-600 dark:text-amber-400' },
    { id: 'Offer', title: 'Offer', emoji: '🎉', color: 'border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400' },
    { id: 'Rejected', title: 'Rejected', emoji: '❌', color: 'border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400' },
    { id: 'Bookmarked', title: 'Bookmarked', emoji: '🔖', color: 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400' },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 pt-2 scrollbar-thin select-none snap-x snap-mandatory">
      {columns.map(col => {
        const colJobs = jobs.filter(j => {
          const s = (j.status || 'Applied').toLowerCase();
          if (col.id === 'Interview') return s.includes('interview');
          if (col.id === 'Offer') return s.includes('offer');
          if (col.id === 'Rejected') return s.includes('reject');
          if (col.id === 'Bookmarked') return s.includes('bookmark');
          return s === 'applied' || (!s.includes('interview') && !s.includes('offer') && !s.includes('reject') && !s.includes('bookmark'));
        });

        return (
          <div
            key={col.id}
            className="flex-shrink-0 w-72 sm:w-80 flex flex-col bg-[#fbfbfa] dark:bg-[#1f1f1f] rounded-xl border border-[#e9e9e7] dark:border-[#2f2f2f] max-h-[calc(100vh-230px)] snap-start shadow-sm"
          >
            {/* Column Header */}
            <div className="p-3 border-b border-[#e9e9e7] dark:border-[#2f2f2f] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">{col.emoji}</span>
                <span className="font-semibold text-xs text-neutral-800 dark:text-neutral-200">
                  {col.title}
                </span>
                <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 bg-neutral-200/60 dark:bg-neutral-800 px-1.5 py-0.2 rounded-full">
                  {colJobs.length}
                </span>
              </div>

              <button
                onClick={() => onAddNewWithStatus(col.id)}
                title={`Tambah lamaran baru di kolom ${col.title}`}
                className="p-1 rounded hover:bg-neutral-200/60 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Column Cards List */}
            <div className="flex-1 p-2 space-y-2.5 overflow-y-auto">
              {colJobs.length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-400 dark:text-neutral-500 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg">
                  Belum ada lamaran
                </div>
              ) : (
                colJobs.map((job, idx) => (
                  <JobCard
                    key={`${job.companyName}-${idx}`}
                    job={job}
                    onSelect={onSelectJob}
                    onStatusChange={onStatusChange}
                  />
                ))
              )}
            </div>

            {/* Column Bottom Add Button */}
            <div className="p-2 border-t border-[#e9e9e7] dark:border-[#2f2f2f]">
              <button
                onClick={() => onAddNewWithStatus(col.id)}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 rounded-lg transition-colors font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Baru</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
