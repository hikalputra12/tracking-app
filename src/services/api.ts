import { JobApplication, Transaction } from '../types';
import { getSettings, getCachedJobs, saveCachedJobs, getCachedTransactions, saveCachedTransactions } from './storage';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  spreadsheetName?: string;
  jobs?: JobApplication[];
  transactions?: Transaction[];
  id?: string;
  rowIndex?: number;
}

export async function pingAppsScript(url: string, pin: string): Promise<ApiResponse> {
  try {
    const targetUrl = new URL(url);
    targetUrl.searchParams.set('action', 'ping');
    targetUrl.searchParams.set('pin', pin);

    const res = await fetch(targetUrl.toString(), {
      method: 'GET',
      mode: 'cors',
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Gagal menghubungi Google Apps Script URL. Pastikan URL benar dan access diatur ke "Anyone".'
    };
  }
}

export async function fetchJobs(): Promise<{ jobs: JobApplication[]; isLive: boolean; error?: string }> {
  const settings = getSettings();
  if (!settings.webAppUrl) {
    // Mode Offline / Lokal Cache
    return { jobs: getCachedJobs(), isLive: false };
  }

  try {
    const targetUrl = new URL(settings.webAppUrl);
    targetUrl.searchParams.set('action', 'getJobs');
    targetUrl.searchParams.set('pin', settings.pin);

    const res = await fetch(targetUrl.toString(), { method: 'GET', mode: 'cors' });
    const data: ApiResponse = await res.json();

    if (data.success && data.jobs) {
      saveCachedJobs(data.jobs);
      return { jobs: data.jobs, isLive: true };
    } else {
      return { jobs: getCachedJobs(), isLive: false, error: data.error || 'Gagal mengambil data' };
    }
  } catch (err: any) {
    console.warn('Fallback to local cache:', err);
    return { jobs: getCachedJobs(), isLive: false, error: err.message };
  }
}

export async function addJob(job: JobApplication): Promise<{ success: boolean; job: JobApplication; error?: string }> {
  const settings = getSettings();
  const currentJobs = getCachedJobs();

  // Optimistic update locally
  const updatedJobs = [job, ...currentJobs];
  saveCachedJobs(updatedJobs);

  if (!settings.webAppUrl) {
    return { success: true, job };
  }

  try {
    const res = await fetch(settings.webAppUrl, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain' }, // Menggunakan text/plain mencegah CORS preflight issues di Google Apps Script
      body: JSON.stringify({
        action: 'addJob',
        pin: settings.pin,
        job
      })
    });

    const data: ApiResponse = await res.json();
    if (data.success) {
      if (data.rowIndex) {
        job.rowIndex = data.rowIndex;
      }
      return { success: true, job };
    } else {
      return { success: false, job, error: data.error };
    }
  } catch (err: any) {
    console.error('Add job to Google Sheets error:', err);
    return { success: true, job, error: 'Disimpan lokal (Google Sheet offline)' };
  }
}

export async function updateJob(job: JobApplication): Promise<{ success: boolean; error?: string }> {
  const settings = getSettings();
  const currentJobs = getCachedJobs();

  const idx = currentJobs.findIndex(j => 
    (job.rowIndex && j.rowIndex === job.rowIndex) || 
    (j.companyName === job.companyName && j.jobTitle === job.jobTitle)
  );

  if (idx !== -1) {
    currentJobs[idx] = { ...currentJobs[idx], ...job };
    saveCachedJobs([...currentJobs]);
  }

  if (!settings.webAppUrl) {
    return { success: true };
  }

  try {
    const res = await fetch(settings.webAppUrl, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        action: 'updateJob',
        pin: settings.pin,
        rowIndex: job.rowIndex,
        job
      })
    });

    const data: ApiResponse = await res.json();
    return { success: !!data.success, error: data.error };
  } catch (err: any) {
    console.error('Update job error:', err);
    return { success: true, error: 'Tersimpan di cache lokal' };
  }
}

export async function deleteJob(rowIndex: number): Promise<{ success: boolean; error?: string }> {
  const settings = getSettings();
  const currentJobs = getCachedJobs().filter(j => j.rowIndex !== rowIndex);
  saveCachedJobs(currentJobs);

  if (!settings.webAppUrl) {
    return { success: true };
  }

  try {
    const res = await fetch(settings.webAppUrl, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        action: 'deleteJob',
        pin: settings.pin,
        rowIndex
      })
    });
    const data: ApiResponse = await res.json();
    return { success: !!data.success, error: data.error };
  } catch (err: any) {
    return { success: true, error: 'Dihapus dari cache lokal' };
  }
}

export function sanitizeTransactions(txs: any[]): Transaction[] {
  if (!Array.isArray(txs)) return [];
  return txs
    .filter(t => {
      if (!t || !t.id) return false;
      const idUpper = String(t.id).trim().toUpperCase();
      // Filter out scorecards, formulas, and header row labels
      if (
        idUpper.includes('TOTAL') ||
        idUpper.includes('TRANSAKSI') ||
        idUpper.includes('ID') ||
        idUpper === '1' ||
        idUpper === '0' ||
        idUpper === '-'
      ) {
        return false;
      }
      return true;
    })
    .map(t => {
      let nominal = Number(t.nominal);
      if (isNaN(nominal) || nominal === 0) {
        const cleaned = String(t.nominal || '').replace(/[^0-9]/g, '');
        nominal = cleaned ? parseInt(cleaned, 10) : 0;
      }
      return {
        ...t,
        nominal
      };
    });
}

export async function fetchTransactions(): Promise<{ transactions: Transaction[]; isLive: boolean; error?: string }> {
  const settings = getSettings();
  if (!settings.webAppUrl) {
    return { transactions: sanitizeTransactions(getCachedTransactions()), isLive: false };
  }

  try {
    const targetUrl = new URL(settings.webAppUrl);
    targetUrl.searchParams.set('action', 'getTransactions');
    targetUrl.searchParams.set('pin', settings.pin);

    const res = await fetch(targetUrl.toString(), { method: 'GET', mode: 'cors' });
    const data: ApiResponse = await res.json();

    if (data.success && data.transactions) {
      const sanitized = sanitizeTransactions(data.transactions);
      saveCachedTransactions(sanitized);
      return { transactions: sanitized, isLive: true };
    } else {
      return { transactions: sanitizeTransactions(getCachedTransactions()), isLive: false, error: data.error };
    }
  } catch (err: any) {
    return { transactions: sanitizeTransactions(getCachedTransactions()), isLive: false, error: err.message };
  }
}

export async function addTransaction(tx: Omit<Transaction, 'id'> & { id?: string }): Promise<{ success: boolean; transaction: Transaction; error?: string }> {
  const settings = getSettings();
  const now = new Date();
  const id = tx.id || `TX-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  const newTx: Transaction = {
    ...tx,
    id,
  };

  const currentTxs = [newTx, ...getCachedTransactions()];
  saveCachedTransactions(currentTxs);

  if (!settings.webAppUrl) {
    return { success: true, transaction: newTx };
  }

  try {
    const res = await fetch(settings.webAppUrl, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        action: 'addTransaction',
        pin: settings.pin,
        transaction: newTx
      })
    });

    const data: ApiResponse = await res.json();
    return { success: !!data.success, transaction: newTx, error: data.error };
  } catch (err: any) {
    return { success: true, transaction: newTx, error: 'Disimpan di cache lokal' };
  }
}

export async function updateTransaction(tx: Transaction): Promise<{ success: boolean; error?: string }> {
  const settings = getSettings();
  const currentTxs = getCachedTransactions();

  const idx = currentTxs.findIndex(t => t.id === tx.id || (tx.rowIndex && t.rowIndex === tx.rowIndex));
  if (idx !== -1) {
    currentTxs[idx] = { ...currentTxs[idx], ...tx };
    saveCachedTransactions([...currentTxs]);
  }

  if (!settings.webAppUrl) {
    return { success: true };
  }

  try {
    const res = await fetch(settings.webAppUrl, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        action: 'updateTransaction',
        pin: settings.pin,
        rowIndex: tx.rowIndex,
        transaction: tx
      })
    });

    const data: ApiResponse = await res.json();
    return { success: !!data.success, error: data.error };
  } catch (err: any) {
    console.error('Update transaction error:', err);
    return { success: true, error: 'Tersimpan di cache lokal' };
  }
}

export async function deleteTransaction(id: string, rowIndex?: number): Promise<{ success: boolean; error?: string }> {
  const settings = getSettings();
  const filtered = getCachedTransactions().filter(t => t.id !== id);
  saveCachedTransactions(filtered);

  if (!settings.webAppUrl) {
    return { success: true };
  }

  try {
    const res = await fetch(settings.webAppUrl, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        action: 'deleteTransaction',
        pin: settings.pin,
        id,
        rowIndex
      })
    });
    const data: ApiResponse = await res.json();
    return { success: !!data.success, error: data.error };
  } catch (err: any) {
    return { success: true, error: 'Dihapus dari cache lokal' };
  }
}
