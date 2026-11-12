import React, { useState } from 'react';
import { Transaction, TransactionType } from '../../types';
import { Search, Trash2, ArrowRightLeft, TrendingDown, TrendingUp } from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string, rowIndex?: number) => Promise<void>;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onDeleteTransaction
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const filtered = transactions.filter(t => {
    const matchSearch =
      (t.catatan || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.kategori.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.dariAkun.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === 'all' || t.tipe === typeFilter;
    return matchSearch && matchType;
  });

  const handleDelete = (tx: Transaction) => {
    if (confirm(`Hapus transaksi ${tx.id} (${tx.kategori} - ${formatRupiah(tx.nominal)})?`)) {
      onDeleteTransaction(tx.id, tx.rowIndex);
    }
  };

  return (
    <div className="space-y-3">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Cari transaksi, kategori, akun..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-[#202020] border border-[#e9e9e7] dark:border-[#2f2f2f] rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-400 text-neutral-800 dark:text-neutral-200"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {['all', 'Pengeluaran', 'Pemasukan', 'Transfer'].map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                typeFilter === t
                  ? 'bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {t === 'all' ? 'Semua' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Notion Database Style Table */}
      <div className="border border-[#e9e9e7] dark:border-[#2f2f2f] rounded-lg overflow-hidden bg-white dark:bg-[#1f1f1f] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#e9e9e7] dark:border-[#2f2f2f] bg-[#fbfbfa] dark:bg-[#252525] text-neutral-500 dark:text-neutral-400 font-medium">
                <th className="py-2.5 px-3">ID Transaksi</th>
                <th className="py-2.5 px-3">Tanggal</th>
                <th className="py-2.5 px-3">Tipe</th>
                <th className="py-2.5 px-3">Kategori</th>
                <th className="py-2.5 px-3">Akun</th>
                <th className="py-2.5 px-3">Nominal</th>
                <th className="py-2.5 px-3">Catatan</th>
                <th className="py-2.5 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e9e9e7] dark:divide-[#2f2f2f]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-400 dark:text-neutral-500">
                    Belum ada riwayat transaksi
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-neutral-50 dark:hover:bg-[#262626] transition-colors"
                  >
                    <td className="py-2.5 px-3 font-mono text-[11px] text-neutral-400 dark:text-neutral-500">
                      {tx.id}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
                      {tx.tanggal}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                        tx.tipe === 'Pemasukan'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : tx.tipe === 'Pengeluaran'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                          : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                      }`}>
                        {tx.tipe === 'Pemasukan' && <TrendingUp className="w-3 h-3" />}
                        {tx.tipe === 'Pengeluaran' && <TrendingDown className="w-3 h-3" />}
                        {tx.tipe === 'Transfer' && <ArrowRightLeft className="w-3 h-3" />}
                        {tx.tipe}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-neutral-800 dark:text-neutral-200">
                      {tx.kategori}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-600 dark:text-neutral-400">
                      {tx.tipe === 'Transfer' ? `${tx.dariAkun} ➔ ${tx.keAkun}` : tx.dariAkun}
                    </td>
                    <td className={`py-2.5 px-3 font-bold whitespace-nowrap ${
                      tx.tipe === 'Pemasukan'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : tx.tipe === 'Pengeluaran'
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-neutral-700 dark:text-neutral-300'
                    }`}>
                      {tx.tipe === 'Pemasukan' ? `+ ${formatRupiah(tx.nominal)}` : tx.tipe === 'Pengeluaran' ? `- ${formatRupiah(tx.nominal)}` : formatRupiah(tx.nominal)}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-500 dark:text-neutral-400 truncate max-w-[180px]">
                      {tx.catatan || '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => handleDelete(tx)}
                        className="p-1 rounded text-neutral-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Hapus transaksi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
