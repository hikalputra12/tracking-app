import React, { useState } from 'react';
import { JobApplication, JobStatus } from '../../types';
import { Badge, getStatusBadgeVariant } from '../common/Badge';
import { Search, ExternalLink, ArrowUpDown } from 'lucide-react';

interface JobTableViewProps {
  jobs: JobApplication[];
  onSelectJob: (job: JobApplication) => void;
  onStatusChange: (job: JobApplication, newStatus: JobStatus) => void;
}

export const JobTableView: React.FC<JobTableViewProps> = ({
  jobs,
  onSelectJob,
  onStatusChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof JobApplication>('dateApplied');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const statuses: JobStatus[] = ['Applied', 'Interview', 'Offer', 'Rejected', 'Bookmarked'];

  const filteredJobs = jobs
    .filter(j => {
      const matchSearch =
        j.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'all' || j.status.toLowerCase().includes(statusFilter.toLowerCase());
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      const valA = String(a[sortField] || '').toLowerCase();
      const valB = String(b[sortField] || '').toLowerCase();
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

  const toggleSort = (field: keyof JobApplication) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-3">
      {/* Search & Quick Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Cari perusahaan, posisi, lokasi..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-[#202020] border border-[#e9e9e7] dark:border-[#2f2f2f] rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 text-neutral-800 dark:text-neutral-200"
          />
        </div>

        {/* Status Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              statusFilter === 'all'
                ? 'bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
          >
            Semua ({jobs.length})
          </button>
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Notion Database Table */}
      <div className="border border-[#e9e9e7] dark:border-[#2f2f2f] rounded-lg overflow-hidden bg-white dark:bg-[#1f1f1f] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#e9e9e7] dark:border-[#2f2f2f] bg-[#fbfbfa] dark:bg-[#252525] text-neutral-500 dark:text-neutral-400 font-medium">
                <th
                  onClick={() => toggleSort('companyName')}
                  className="py-2.5 px-3 cursor-pointer hover:text-neutral-800 dark:hover:text-neutral-200"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Perusahaan</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th className="py-2.5 px-3">Posisi</th>
                <th
                  onClick={() => toggleSort('status')}
                  className="py-2.5 px-3 cursor-pointer hover:text-neutral-800 dark:hover:text-neutral-200"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th className="py-2.5 px-3">Tipe</th>
                <th
                  onClick={() => toggleSort('dateApplied')}
                  className="py-2.5 px-3 cursor-pointer hover:text-neutral-800 dark:hover:text-neutral-200"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Tgl Lamar</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th className="py-2.5 px-3">Tgl Interview</th>
                <th className="py-2.5 px-3">Gaji</th>
                <th className="py-2.5 px-3">Lokasi</th>
                <th className="py-2.5 px-3 text-right">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e9e9e7] dark:divide-[#2f2f2f]">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-neutral-400 dark:text-neutral-500">
                    Tidak ada lamaran yang cocok dengan pencarian
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job, idx) => (
                  <tr
                    key={`${job.companyName}-${idx}`}
                    onClick={() => onSelectJob(job)}
                    className="hover:bg-neutral-50 dark:hover:bg-[#262626] cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 px-3 font-semibold text-neutral-900 dark:text-neutral-100">
                      {job.companyName}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-700 dark:text-neutral-300">
                      {job.jobTitle || '-'}
                    </td>
                    <td className="py-2.5 px-3" onClick={e => e.stopPropagation()}>
                      <select
                        value={job.status}
                        onChange={e => onStatusChange(job, e.target.value as JobStatus)}
                        className={`text-xs font-medium rounded px-2 py-0.5 border-none outline-none cursor-pointer ${
                          getStatusBadgeVariant(job.status) === 'green'
                            ? 'bg-[#edf6ee] text-[#2e683b] dark:bg-[#1a3320] dark:text-[#8bd99b]'
                            : getStatusBadgeVariant(job.status) === 'yellow'
                            ? 'bg-[#fdf3d8] text-[#89632a] dark:bg-[#3d3119] dark:text-[#f3d386]'
                            : getStatusBadgeVariant(job.status) === 'red'
                            ? 'bg-[#fdebee] text-[#932f38] dark:bg-[#3e1b1f] dark:text-[#f49ba3]'
                            : 'bg-[#e8f3fa] text-[#205b82] dark:bg-[#192b3a] dark:text-[#8ac5ec]'
                        }`}
                      >
                        {statuses.map(s => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2.5 px-3">
                      {job.jobType ? (
                        <Badge variant="gray">{job.jobType}</Badge>
                      ) : (
                        <span className="text-neutral-400">-</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                      {job.dateApplied || '-'}
                    </td>
                    <td className="py-2.5 px-3 text-amber-600 dark:text-amber-400 font-medium whitespace-nowrap">
                      {job.interviewDate || '-'}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-600 dark:text-neutral-300">
                      {job.salary || '-'}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-500 dark:text-neutral-400 truncate max-w-[120px]">
                      {job.location || '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right" onClick={e => e.stopPropagation()}>
                      {job.jobLink ? (
                        <a
                          href={job.jobLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-500 hover:text-blue-600 p-1"
                          title="Buka Link Lowongan"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <span className="text-neutral-300 dark:text-neutral-600">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
