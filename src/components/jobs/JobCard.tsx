import React from 'react';
import { JobApplication, JobStatus } from '../../types';
import { Badge, getStatusBadgeVariant } from '../common/Badge';
import { MapPin, Calendar, Clock, DollarSign, ExternalLink } from 'lucide-react';

interface JobCardProps {
  job: JobApplication;
  onSelect: (job: JobApplication) => void;
  onStatusChange: (job: JobApplication, newStatus: JobStatus) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onSelect, onStatusChange }) => {
  const statuses: JobStatus[] = ['Applied', 'Interview', 'Offer', 'Rejected', 'Bookmarked'];

  return (
    <div
      onClick={() => onSelect(job)}
      className="group relative p-3 rounded-lg border border-[#e9e9e7] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] hover:border-neutral-400 dark:hover:border-neutral-500 shadow-sm transition-all duration-150 cursor-pointer flex flex-col gap-2"
    >
      {/* Header: Company & Quick Status Dropdown */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
          {job.companyName}
        </h3>

        <div onClick={e => e.stopPropagation()}>
          <select
            value={job.status}
            onChange={e => onStatusChange(job, e.target.value as JobStatus)}
            className="text-[11px] font-medium rounded px-1.5 py-0.5 border border-transparent hover:border-neutral-300 dark:hover:border-neutral-600 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 cursor-pointer outline-none focus:ring-1 focus:ring-neutral-400"
          >
            {statuses.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Job Title */}
      <div className="text-xs text-neutral-600 dark:text-neutral-300 font-medium">
        {job.jobTitle || 'Posisi belum ditentukan'}
      </div>

      {/* Badges: Type & Salary */}
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        {job.jobType && (
          <Badge variant="gray">
            {job.jobType}
          </Badge>
        )}
        {job.salary && (
          <span className="inline-flex items-center gap-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
            <DollarSign className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span className="truncate max-w-[120px]">{job.salary}</span>
          </span>
        )}
      </div>

      {/* Footer Info: Location & Dates */}
      <div className="flex items-center justify-between text-[11px] text-neutral-400 dark:text-neutral-500 pt-1 border-t border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-1 truncate max-w-[150px]">
          {job.location && (
            <>
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{job.location}</span>
            </>
          )}
        </div>

        {job.interviewDate ? (
          <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
            <Calendar className="w-3 h-3" />
            {job.interviewDate}
          </span>
        ) : job.dateApplied ? (
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {job.dateApplied}
          </span>
        ) : null}
      </div>

      {/* Link Quick Preview if available */}
      {job.jobLink && (
        <a
          href={job.jobLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-white/90 dark:bg-neutral-800/90 rounded text-neutral-400 hover:text-blue-500 shadow-sm"
          title="Buka Link Lowongan"
        >
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
};
