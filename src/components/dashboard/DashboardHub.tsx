import React from 'react';
import { JobApplication, Transaction, ActiveTab } from '../../types';
import { Briefcase, Wallet, Plus, Calendar, ArrowRight, TrendingUp, Sparkles, Award } from 'lucide-react';
import { Badge } from '../common/Badge';

interface DashboardHubProps {
  jobs: JobApplication[];
  transactions: Transaction[];
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddJob: () => void;
  onOpenQuickFinance: (type: 'Pengeluaran' | 'Pemasukan') => void;
}

export const DashboardHub: React.FC<DashboardHubProps> = ({
  jobs,
  transactions,
  setActiveTab,
  onOpenAddJob,
  onOpenQuickFinance
}) => {
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const totalIncome = transactions
    .filter(t => t.tipe === 'Pemasukan')
    .reduce((sum, t) => sum + (Number(t.nominal) || 0), 0);

  const totalExpense = transactions
    .filter(t => t.tipe === 'Pengeluaran')
    .reduce((sum, t) => sum + (Number(t.nominal) || 0), 0);

  const netBalance = totalIncome - totalExpense;

  const upcomingInterviews = jobs.filter(j => j.interviewDate);
  const offers = jobs.filter(j => j.status.toLowerCase().includes('offer'));

  return (
    <div className="space-y-6">
      {/* Cover / Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-white text-xs font-medium mb-3 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Personal Notion Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Selamat Datang di TrackHub
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-5">
            Satu tempat terpusat untuk memantau progres karir impian Anda dan mengendalikan kesehatan finansial harian Anda.
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenAddJob}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white text-neutral-900 hover:bg-neutral-100 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Lamaran</span>
            </button>
            <button
              onClick={() => onOpenQuickFinance('Pengeluaran')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/15 text-white hover:bg-white/20 transition-colors backdrop-blur-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Pengeluaran</span>
            </button>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial from-blue-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Grid Overview: Job Seeker & Keuangan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Job Seeker Widget */}
        <div className="p-5 rounded-2xl border border-[#e9e9e7] dark:border-[#2f2f2f] bg-white dark:bg-[#1f1f1f] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">💼</span>
                <h2 className="font-semibold text-sm text-neutral-800 dark:text-neutral-200">
                  Job Seeker Tracker
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('jobs')}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Buka Board</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 text-center">
                <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{jobs.length}</div>
                <div className="text-[10px] text-neutral-400">Total Lamaran</div>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-center">
                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{offers.length}</div>
                <div className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80">Tawaran Kerja</div>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 text-center">
                <div className="text-lg font-bold text-amber-600 dark:text-amber-400">{upcomingInterviews.length}</div>
                <div className="text-[10px] text-amber-600/80 dark:text-amber-400/80">Interview</div>
              </div>
            </div>

            {/* Upcoming / Active highlights */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                Lamaran Terbaru
              </h4>
              {jobs.slice(0, 3).map((job, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveTab('jobs')}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/40 cursor-pointer transition-colors"
                >
                  <div className="truncate mr-2">
                    <p className="font-semibold text-xs text-neutral-800 dark:text-neutral-200 truncate">
                      {job.companyName}
                    </p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                      {job.jobTitle || 'Posisi'}
                    </p>
                  </div>
                  <Badge variant={job.status.toLowerCase().includes('offer') ? 'green' : job.status.toLowerCase().includes('interview') ? 'yellow' : 'gray'}>
                    {job.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Keuangan Widget */}
        <div className="p-5 rounded-2xl border border-[#e9e9e7] dark:border-[#2f2f2f] bg-white dark:bg-[#1f1f1f] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">💰</span>
                <h2 className="font-semibold text-sm text-neutral-800 dark:text-neutral-200">
                  Keuangan Harian
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('finance')}
                className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>Buka Transaksi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 mb-4">
              <div className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                Sisa Saldo Kas Bersih
              </div>
              <div className={`text-2xl font-bold tracking-tight ${netBalance >= 0 ? 'text-neutral-900 dark:text-neutral-100' : 'text-rose-600'}`}>
                {formatRupiah(netBalance)}
              </div>
              <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-neutral-200/60 dark:border-neutral-700">
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Masuk: {formatRupiah(totalIncome)}</span>
                <span className="text-rose-600 dark:text-rose-400 font-medium">Keluar: {formatRupiah(totalExpense)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                Transaksi Terkini
              </h4>
              {transactions.slice(0, 3).map((tx) => (
                <div
                  key={tx.id}
                  onClick={() => setActiveTab('finance')}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/40 cursor-pointer transition-colors"
                >
                  <div className="truncate mr-2">
                    <p className="font-semibold text-xs text-neutral-800 dark:text-neutral-200 truncate">
                      {tx.kategori}
                    </p>
                    <p className="text-[11px] text-neutral-400 truncate">
                      {tx.catatan || tx.dariAkun} • {tx.tanggal}
                    </p>
                  </div>
                  <span className={`text-xs font-bold whitespace-nowrap ${tx.tipe === 'Pemasukan' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {tx.tipe === 'Pemasukan' ? `+${formatRupiah(tx.nominal)}` : `-${formatRupiah(tx.nominal)}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
