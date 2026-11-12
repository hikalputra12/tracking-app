import React from 'react';
import { Transaction } from '../../types';
import { TrendingUp, TrendingDown, Wallet, ArrowRightLeft, CreditCard } from 'lucide-react';

interface FinanceSummaryProps {
  transactions: Transaction[];
  onOpenQuickAdd: (type: 'Pengeluaran' | 'Pemasukan') => void;
}

export const FinanceSummary: React.FC<FinanceSummaryProps> = ({ transactions, onOpenQuickAdd }) => {
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

  // Akun Breakdown
  const accountBalances: { [key: string]: number } = {};
  transactions.forEach(t => {
    const nominal = Number(t.nominal) || 0;
    if (t.tipe === 'Pemasukan') {
      accountBalances[t.dariAkun] = (accountBalances[t.dariAkun] || 0) + nominal;
    } else if (t.tipe === 'Pengeluaran') {
      accountBalances[t.dariAkun] = (accountBalances[t.dariAkun] || 0) - nominal;
    } else if (t.tipe === 'Transfer' && t.keAkun) {
      accountBalances[t.dariAkun] = (accountBalances[t.dariAkun] || 0) - nominal;
      accountBalances[t.keAkun] = (accountBalances[t.keAkun] || 0) + nominal;
    }
  });

  return (
    <div className="space-y-4 mb-6">
      {/* 3 Main Cashflow Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Pemasukan */}
        <div className="p-4 rounded-xl border border-[#e9e9e7] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Total Pemasukan
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            {formatRupiah(totalIncome)}
          </div>
          <button
            onClick={() => onOpenQuickAdd('Pemasukan')}
            className="mt-3 text-left text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            + Catat Pemasukan Baru
          </button>
        </div>

        {/* Pengeluaran */}
        <div className="p-4 rounded-xl border border-[#e9e9e7] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Total Pengeluaran
            </span>
            <span className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
              <TrendingDown className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
            {formatRupiah(totalExpense)}
          </div>
          <button
            onClick={() => onOpenQuickAdd('Pengeluaran')}
            className="mt-3 text-left text-[11px] font-medium text-rose-600 dark:text-rose-400 hover:underline"
          >
            + Catat Pengeluaran Baru
          </button>
        </div>

        {/* Sisa Saldo Bersih */}
        <div className="p-4 rounded-xl border border-[#e9e9e7] dark:border-[#2f2f2f] bg-white dark:bg-[#202020] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Sisa Saldo Kas Bersih
            </span>
            <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <Wallet className="w-4 h-4" />
            </span>
          </div>
          <div className={`text-xl sm:text-2xl font-bold tracking-tight ${netBalance >= 0 ? 'text-neutral-900 dark:text-neutral-100' : 'text-rose-600'}`}>
            {formatRupiah(netBalance)}
          </div>
          <p className="mt-3 text-[11px] text-neutral-400 dark:text-neutral-500 truncate">
            {netBalance >= 0 ? 'Cashflow sehat & positif' : 'Pengeluaran melebihi pemasukan'}
          </p>
        </div>
      </div>

      {/* Saldo Akun / Dompet Row */}
      {Object.keys(accountBalances).length > 0 && (
        <div className="p-3 rounded-lg border border-[#e9e9e7] dark:border-[#2f2f2f] bg-[#fbfbfa] dark:bg-[#1f1f1f] flex flex-wrap items-center gap-4 text-xs">
          <span className="font-semibold text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5" /> Dompet:
          </span>
          {Object.entries(accountBalances).map(([akun, saldo]) => (
            <div key={akun} className="flex items-center gap-1.5 bg-white dark:bg-[#262626] px-2.5 py-1 rounded-md border border-[#e9e9e7] dark:border-[#2f2f2f] shadow-xs">
              <span className="font-medium text-neutral-700 dark:text-neutral-300">{akun}:</span>
              <span className={`font-semibold ${saldo >= 0 ? 'text-neutral-900 dark:text-neutral-100' : 'text-rose-500'}`}>
                {formatRupiah(saldo)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
