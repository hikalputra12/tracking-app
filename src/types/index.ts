export type JobStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected' | 'Bookmarked';

export type JobType = 'Full-Time' | 'Part-Time' | 'Internship' | 'Freelance' | 'Contract';

export interface JobApplication {
  rowIndex?: number;
  companyName: string;
  jobLink: string;
  cvVersion: string;
  jobTitle: string;
  dateApplied: string;
  deadline: string;
  jobType: JobType | string;
  salary: string;
  contact: string;
  location: string;
  status: JobStatus | string;
  interviewDate: string;
  notes: string;
}

export type TransactionType = 'Pemasukan' | 'Pengeluaran' | 'Transfer';

export interface Transaction {
  rowIndex?: number;
  id: string;
  tanggal: string;
  tipe: TransactionType;
  kategori: string;
  nominal: number;
  dariAkun: string;
  keAkun?: string;
  catatan?: string;
}

export interface AppSettings {
  pin: string;
  webAppUrl: string;
  darkMode: boolean;
  spreadsheetId: string;
}

export type ActiveTab = 'dashboard' | 'jobs' | 'finance' | 'settings';
