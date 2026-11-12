import { AppSettings, JobApplication, Transaction } from '../types';

const SETTINGS_KEY = 'trackhub_settings';
const JOBS_KEY = 'trackhub_jobs_cache';
const TRANSACTIONS_KEY = 'trackhub_transactions_cache';
const AUTH_KEY = 'trackhub_auth_session';

export const DEFAULT_SETTINGS: AppSettings = {
  pin: '123456',
  webAppUrl: '',
  darkMode: false,
  spreadsheetId: '1SuemDrT6nbkoFR2fsMhP-ebHDj3F_pcvl3Wa-xqNMLA',
};

// Data riil dari Google Sheet pengguna sebagai initial cache
export const INITIAL_JOBS: JobApplication[] = [
  {
    rowIndex: 8,
    companyName: 'PT Global Tiket Network',
    jobLink: 'https://maganghub.kemnaker.go.id/magang-nasional/dasbor/peserta/riwayat-magang',
    cvVersion: 'https://portofolio-website-sooty-one.vercel.app/',
    jobTitle: 'Machine Learning Engineer Intern',
    dateApplied: '2026-09-08',
    deadline: '2026-09-08',
    jobType: 'Internship',
    salary: '5.729.876',
    contact: '',
    location: 'Jakarta Barat',
    status: 'Rejected',
    interviewDate: '',
    notes: 'i hope that i can get the internship'
  },
  {
    rowIndex: 9,
    companyName: 'Git Gow Ayo',
    jobLink: 'https://maganghub.kemnaker.go.id/magang-nasional/dasbor/peserta/riwayat-magang',
    cvVersion: 'https://portofolio-website-sooty-one.vercel.app/',
    jobTitle: 'Data Engineer Intern',
    dateApplied: '2026-09-08',
    deadline: '2026-09-08',
    jobType: 'Internship',
    salary: '5.729.876',
    contact: 'www.mamikos.com',
    location: 'Jakarta Selatan',
    status: 'Rejected',
    interviewDate: '2026-09-15',
    notes: 'i should to practice for job interview. i make a lot of mistake when doing this interview.'
  },
  {
    rowIndex: 10,
    companyName: 'Apple Developer Academy Indonesia',
    jobLink: 'https://apply.developeracademy.apps.binus.ac.id/application/additional',
    cvVersion: 'https://drive.google.com/file/d/1evbIYBaoM-HSdYXvtFpOz10pedGqbuq6/view?usp=drive_link',
    jobTitle: 'learner of Apple Developer Academy Indonesia',
    dateApplied: '2026-09-13',
    deadline: '2026-09-14',
    jobType: 'Part-Time',
    salary: 'unpaid (or low salary)',
    contact: 'contact@developeracademy.id',
    location: 'Jakarta',
    status: 'Rejected',
    interviewDate: '',
    notes: 'i had been taken the logic and programming test of this program'
  },
  {
    rowIndex: 11,
    companyName: 'Dicoding',
    jobLink: 'https://docs.google.com/forms/d/e/1FAIpQLSc8tMJqdslSF1jpVo_M2n63PDfAtcWOeboloHlUYTtOjnDkFg/alreadyresponded?pli=1&pli=1',
    cvVersion: '',
    jobTitle: 'Fasilitator Beasiswa Pemula Pijak 2027',
    dateApplied: '2026-09-23',
    deadline: '2026-09-28',
    jobType: 'Freelance',
    salary: 'unpaid',
    contact: '',
    location: 'Work From Home',
    status: 'Offer',
    interviewDate: '',
    notes: 'i hope when i got accepted, i can do the task they are given to me'
  },
  {
    rowIndex: 12,
    companyName: 'Telkomsel',
    jobLink: 'https://www.virtuship.id/programs/cb31d00e-b3c1-4cb2-8cdb-64204ebb2f3b/directorates/bedee446-0c71-49be-a04a-2da636174550',
    cvVersion: 'https://drive.google.com/file/d/1A8rdSCEOG07kLdTxs5kSYC_TXWoZscns/view?usp=sharing',
    jobTitle: 'Telkomsel Virtual Internship for Universitas Hasanuddin',
    dateApplied: '2026-09-27',
    deadline: '2026-10-01',
    jobType: 'Internship',
    salary: 'unpaid',
    contact: '',
    location: 'WFH / Jakarta',
    status: 'Offer',
    interviewDate: '',
    notes: 'this is just like a study independent'
  },
  {
    rowIndex: 13,
    companyName: 'Bank Syariah Nasional',
    jobLink: '',
    cvVersion: '',
    jobTitle: 'Branch Performance Monitoring & Data Analyst Intern',
    dateApplied: '2026-11-04',
    deadline: '2026-11-04',
    jobType: 'Internship',
    salary: 'UMR Jakarta',
    contact: '',
    location: 'Jakarta Pusat',
    status: 'Applied',
    interviewDate: '',
    notes: ''
  },
  {
    rowIndex: 14,
    companyName: 'PT Telekomunikasi Indonesia',
    jobLink: '',
    cvVersion: '',
    jobTitle: 'Data Scientist 01 - DDP',
    dateApplied: '2026-11-04',
    deadline: '2026-11-04',
    jobType: 'Internship',
    salary: 'UMR Jakarta',
    contact: '',
    location: 'Jakarta Selatan',
    status: 'Applied',
    interviewDate: '',
    notes: ''
  },
  {
    rowIndex: 15,
    companyName: 'PT Pama Persada',
    jobLink: '',
    cvVersion: '',
    jobTitle: 'FGDP',
    dateApplied: '2026-11-10',
    deadline: '',
    jobType: 'Full-Time',
    salary: '',
    contact: '',
    location: 'Indonesia',
    status: 'Applied',
    interviewDate: '',
    notes: ''
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TX-20261111-001',
    tanggal: '2026-11-11',
    tipe: 'Pemasukan',
    kategori: 'Freelance & Honor',
    nominal: 1500000,
    dariAkun: 'BCA',
    catatan: 'Honor Project Web'
  },
  {
    id: 'TX-20261112-002',
    tanggal: '2026-11-12',
    tipe: 'Pengeluaran',
    kategori: 'Makanan & Minuman',
    nominal: 45000,
    dariAkun: 'GoPay',
    catatan: 'Makan siang & es kopi'
  },
  {
    id: 'TX-20261112-003',
    tanggal: '2026-11-12',
    tipe: 'Pengeluaran',
    kategori: 'Transportasi',
    nominal: 25000,
    dariAkun: 'GoPay',
    catatan: 'Ojek online interview'
  }
];

export function getSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function getCachedJobs(): JobApplication[] {
  try {
    const raw = localStorage.getItem(JOBS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_JOBS;
}

export function saveCachedJobs(jobs: JobApplication[]): void {
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
}

export function getCachedTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(TRANSACTIONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_TRANSACTIONS;
}

export function saveCachedTransactions(txs: Transaction[]): void {
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(txs));
}

export function isSessionUnlocked(): boolean {
  return sessionStorage.getItem(AUTH_KEY) === 'unlocked';
}

export function setSessionUnlocked(unlocked: boolean): void {
  if (unlocked) {
    sessionStorage.setItem(AUTH_KEY, 'unlocked');
  } else {
    sessionStorage.removeItem(AUTH_KEY);
  }
}
