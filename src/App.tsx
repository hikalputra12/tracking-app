import React, { useState, useEffect } from 'react';
import { 
  JobApplication, 
  Transaction, 
  AppSettings, 
  ActiveTab, 
  JobStatus, 
  TransactionType 
} from './types';
import { 
  getSettings, 
  saveSettings, 
  isSessionUnlocked, 
  setSessionUnlocked 
} from './services/storage';
import { 
  fetchJobs, 
  addJob, 
  updateJob, 
  deleteJob, 
  fetchTransactions, 
  addTransaction, 
  deleteTransaction 
} from './services/api';

import { PinScreen } from './components/PinScreen';
import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';
import { JobStats } from './components/jobs/JobStats';
import { JobBoardView } from './components/jobs/JobBoardView';
import { JobTableView } from './components/jobs/JobTableView';
import { JobModal } from './components/jobs/JobModal';
import { FinanceSummary } from './components/finance/FinanceSummary';
import { TransactionTable } from './components/finance/TransactionTable';
import { TransactionModal } from './components/finance/TransactionModal';
import { DashboardHub } from './components/dashboard/DashboardHub';
import { SettingsView } from './components/settings/SettingsView';

import { 
  Plus, 
  Kanban, 
  Table as TableIcon, 
  Lock, 
  Moon, 
  Sun, 
  RefreshCw, 
  Sparkles,
  ExternalLink 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function App() {
  const [settings, setAppSettings] = useState<AppSettings>(getSettings());
  const [isUnlocked, setIsUnlocked] = useState<boolean>(isSessionUnlocked());
  const [darkMode, setDarkMode] = useState<boolean>(settings.darkMode || false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Job view: board or table
  const [jobView, setJobView] = useState<'board' | 'table'>('board');
  const [isJobModalOpen, setIsJobModalOpen] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);
  const [initialJobStatus, setInitialJobStatus] = useState<JobStatus>('Applied');

  // Finance modal
  const [isFinanceModalOpen, setIsFinanceModalOpen] = useState<boolean>(false);
  const [financeModalType, setFinanceModalType] = useState<TransactionType>('Pengeluaran');

  // Apply dark mode class to root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Load data on init or unlock
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [jobsResult, txResult] = await Promise.all([
        fetchJobs(),
        fetchTransactions()
      ]);
      setJobs(jobsResult.jobs);
      setTransactions(txResult.transactions);
      setIsLive(jobsResult.isLive || txResult.isLive);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isUnlocked) {
      loadData();
    }
  }, [isUnlocked]);

  // Pin Unlock handler
  const handleUnlock = (verifiedPin?: string) => {
    if (verifiedPin && verifiedPin !== settings.pin) {
      const updated = { ...settings, pin: verifiedPin };
      setAppSettings(updated);
      saveSettings(updated);
    }
    setSessionUnlocked(true);
    setIsUnlocked(true);
  };

  // Lock handler
  const handleLock = () => {
    setSessionUnlocked(false);
    setIsUnlocked(false);
  };

  // Save Settings
  const handleSaveSettings = (newSettings: AppSettings) => {
    setAppSettings(newSettings);
    saveSettings(newSettings);
    loadData();
  };

  // Job Actions
  const handleOpenAddJob = (status: JobStatus = 'Applied') => {
    setSelectedJob(null);
    setInitialJobStatus(status);
    setIsJobModalOpen(true);
  };

  const handleSelectJob = (job: JobApplication) => {
    setSelectedJob(job);
    setIsJobModalOpen(true);
  };

  const handleSaveJob = async (job: JobApplication) => {
    const isNew = !selectedJob?.companyName && !selectedJob?.rowIndex;
    if (isNew) {
      await addJob(job);
    } else {
      await updateJob(job);
    }
    await loadData();
  };

  const handleStatusChange = async (job: JobApplication, newStatus: JobStatus) => {
    const updated = { ...job, status: newStatus };
    if (newStatus === 'Offer') {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
    await updateJob(updated);
    setJobs(prev => prev.map(j => (j.rowIndex === job.rowIndex ? updated : j)));
  };

  const handleDeleteJob = async (rowIndex: number) => {
    await deleteJob(rowIndex);
    await loadData();
  };

  // Finance Actions
  const handleOpenQuickFinance = (type: TransactionType = 'Pengeluaran') => {
    setFinanceModalType(type);
    setIsFinanceModalOpen(true);
  };

  const handleSaveTransaction = async (txData: Omit<Transaction, 'id'> & { id?: string }) => {
    await addTransaction(txData);
    await loadData();
  };

  const handleDeleteTransaction = async (id: string, rowIndex?: number) => {
    await deleteTransaction(id, rowIndex);
    await loadData();
  };

  // If locked, render PIN screen
  if (!isUnlocked) {
    return <PinScreen correctPin={settings.pin} webAppUrl={settings.webAppUrl} onSuccess={handleUnlock} />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#191919] text-[#37352f] dark:text-[#e6e5e3] flex flex-col md:flex-row font-sans">
      {/* Desktop Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLock={handleLock}
        darkMode={darkMode}
        setDarkMode={val => {
          setDarkMode(val);
          handleSaveSettings({ ...settings, darkMode: val });
        }}
        isLive={isLive}
        spreadsheetId={settings.spreadsheetId}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        {/* Mobile Top Bar */}
        <header className="md:hidden sticky top-0 z-30 bg-white/95 dark:bg-[#1f1f1f]/95 backdrop-blur-md border-b border-[#e9e9e7] dark:border-[#2f2f2f] px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🚀</span>
            <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100">TrackHub</span>
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={handleLock}
              className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              title="Kunci Aplikasi"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* TAB 1: DASHBOARD HUB */}
          {activeTab === 'dashboard' && (
            <DashboardHub
              jobs={jobs}
              transactions={transactions}
              setActiveTab={setActiveTab}
              onOpenAddJob={() => handleOpenAddJob('Applied')}
              onOpenQuickFinance={type => handleOpenQuickFinance(type)}
            />
          )}

          {/* TAB 2: JOB SEEKER TRACKER */}
          {activeTab === 'jobs' && (
            <div className="space-y-5">
              {/* Job Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <span>💼</span> Job Seeker Tracker
                  </h1>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Tersinkronisasi dengan Tab <b>Sheet1</b> di Google Sheet.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {/* View Switcher: Board vs Table */}
                  <div className="flex items-center p-0.5 rounded-lg border border-[#e9e9e7] dark:border-[#2f2f2f] bg-[#fbfbfa] dark:bg-[#202020]">
                    <button
                      onClick={() => setJobView('board')}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                        jobView === 'board'
                          ? 'bg-white dark:bg-[#2a2a2a] text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                          : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                      }`}
                    >
                      <Kanban className="w-3.5 h-3.5" />
                      <span>Board</span>
                    </button>
                    <button
                      onClick={() => setJobView('table')}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                        jobView === 'table'
                          ? 'bg-white dark:bg-[#2a2a2a] text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                          : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                      }`}
                    >
                      <TableIcon className="w-3.5 h-3.5" />
                      <span>Table</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleOpenAddJob('Applied')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 shadow transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Lamaran</span>
                  </button>
                </div>
              </div>

              {/* Stats Scorecards */}
              <JobStats jobs={jobs} />

              {/* View Rendering */}
              {jobView === 'board' ? (
                <JobBoardView
                  jobs={jobs}
                  onSelectJob={handleSelectJob}
                  onStatusChange={handleStatusChange}
                  onAddNewWithStatus={handleOpenAddJob}
                />
              ) : (
                <JobTableView
                  jobs={jobs}
                  onSelectJob={handleSelectJob}
                  onStatusChange={handleStatusChange}
                />
              )}
            </div>
          )}

          {/* TAB 3: KEUANGAN TRACKER */}
          {activeTab === 'finance' && (
            <div className="space-y-5">
              {/* Finance Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <span>💰</span> Tracking Keuangan Pribadi
                  </h1>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Tersinkronisasi dengan Tab <b>Keuangan_Transaksi</b> (ID terbuat otomatis).
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => handleOpenQuickFinance('Pengeluaran')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 shadow transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Catat Pengeluaran</span>
                  </button>
                  <button
                    onClick={() => handleOpenQuickFinance('Pemasukan')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Catat Pemasukan</span>
                  </button>
                </div>
              </div>

              {/* Summary Cards */}
              <FinanceSummary
                transactions={transactions}
                onOpenQuickAdd={type => handleOpenQuickFinance(type)}
              />

              {/* Transactions Table */}
              <TransactionTable
                transactions={transactions}
                onDeleteTransaction={handleDeleteTransaction}
              />
            </div>
          )}

          {/* TAB 4: SETTINGS */}
          {activeTab === 'settings' && (
            <SettingsView
              settings={settings}
              onSaveSettings={handleSaveSettings}
              onRefreshData={loadData}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Modals */}
      <JobModal
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        job={selectedJob}
        initialStatus={initialJobStatus}
        onSave={handleSaveJob}
        onDelete={handleDeleteJob}
      />

      <TransactionModal
        isOpen={isFinanceModalOpen}
        onClose={() => setIsFinanceModalOpen(false)}
        initialType={financeModalType}
        onSave={handleSaveTransaction}
      />
    </div>
  );
}

export default App;
