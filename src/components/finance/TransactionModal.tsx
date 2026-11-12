import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType } from '../../types';
import { X, Save, ArrowRightLeft, TrendingDown, TrendingUp, Sparkles } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: TransactionType;
  onSave: (tx: Omit<Transaction, 'id'> & { id?: string }) => Promise<void>;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  initialType = 'Pengeluaran',
  onSave
}) => {
  const [tipe, setTipe] = useState<TransactionType>(initialType);
  const [nominalRaw, setNominalRaw] = useState<string>('');
  const [kategori, setKategori] = useState<string>('Makanan & Minuman');
  const [dariAkun, setDariAkun] = useState<string>('GoPay');
  const [keAkun, setKeAkun] = useState<string>('BCA');
  const [tanggal, setTanggal] = useState<string>(new Date().toISOString().split('T')[0]);
  const [catatan, setCatatan] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setTipe(initialType);
    if (initialType === 'Pemasukan') {
      setKategori('Gaji / Honor');
      setDariAkun('BCA');
    } else {
      setKategori('Makanan & Minuman');
      setDariAkun('GoPay');
    }
    setNominalRaw('');
    setCatatan('');
  }, [initialType, isOpen]);

  if (!isOpen) return null;

  const categoriesExpense = [
    'Makanan & Minuman',
    'Transportasi',
    'Belanja Harian',
    'Tagihan & Pulsa',
    'Karir & Kursus',
    'Hiburan & Santai',
    'Kesehatan',
    'Lainnya'
  ];

  const categoriesIncome = [
    'Gaji / Honor',
    'Freelance',
    'Beasiswa / Uang Saku',
    'Investasi / Bunga',
    'Bonus / Hadiah',
    'Lainnya'
  ];

  const accounts = ['BCA', 'Mandiri', 'BRI', 'BNI', 'GoPay', 'OVO', 'ShopeePay', 'Dana', 'Tunai (Cash)'];

  const handleNominalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only numbers
    const val = e.target.value.replace(/\D/g, '');
    setNominalRaw(val);
  };

  const formattedNominalDisplay = nominalRaw
    ? new Intl.NumberFormat('id-ID').format(Number(nominalRaw))
    : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nominal = Number(nominalRaw);
    if (!nominal || nominal <= 0) {
      alert('Masukkan nominal yang valid.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        tanggal,
        tipe,
        kategori: tipe === 'Transfer' ? 'Transfer Antar Dompet' : kategori,
        nominal,
        dariAkun,
        keAkun: tipe === 'Transfer' ? keAkun : '',
        catatan: catatan.trim()
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-md bg-white dark:bg-[#1f1f1f] border border-[#e9e9e7] dark:border-[#2f2f2f] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#e9e9e7] dark:border-[#2f2f2f] bg-[#fbfbfa] dark:bg-[#252525]">
          <div className="flex items-center gap-2">
            <span className="text-lg">💰</span>
            <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              Catat Transaksi Keuangan
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 text-xs">
          {/* Tipe Selector Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setTipe('Pengeluaran');
                setKategori('Makanan & Minuman');
              }}
              className={`py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                tipe === 'Pengeluaran'
                  ? 'bg-white dark:bg-[#262626] text-rose-600 dark:text-rose-400 font-semibold shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setTipe('Pemasukan');
                setKategori('Gaji / Honor');
              }}
              className={`py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                tipe === 'Pemasukan'
                  ? 'bg-white dark:bg-[#262626] text-emerald-600 dark:text-emerald-400 font-semibold shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Masuk</span>
            </button>

            <button
              type="button"
              onClick={() => setTipe('Transfer')}
              className={`py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                tipe === 'Transfer'
                  ? 'bg-white dark:bg-[#262626] text-blue-600 dark:text-blue-400 font-semibold shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Transfer</span>
            </button>
          </div>

          {/* Nominal Input */}
          <div>
            <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Nominal (Rp) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 font-bold text-neutral-400 text-sm">
                Rp
              </span>
              <input
                type="text"
                inputMode="numeric"
                required
                autoFocus
                placeholder="0"
                value={formattedNominalDisplay}
                onChange={handleNominalChange}
                className="w-full pl-11 pr-3 py-2 text-lg font-bold rounded-lg border border-[#e9e9e7] dark:border-[#2f2f2f] bg-white dark:bg-[#262626] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              />
            </div>
          </div>

          {/* Kategori (if not transfer) */}
          {tipe !== 'Transfer' && (
            <div>
              <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Kategori
              </label>
              <select
                value={kategori}
                onChange={e => setKategori(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#e9e9e7] dark:border-[#2f2f2f] bg-white dark:bg-[#262626] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              >
                {(tipe === 'Pengeluaran' ? categoriesExpense : categoriesIncome).map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Dompet / Akun */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                {tipe === 'Transfer' ? 'Dari Dompet/Akun' : 'Akun / Dompet'}
              </label>
              <select
                value={dariAkun}
                onChange={e => setDariAkun(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#e9e9e7] dark:border-[#2f2f2f] bg-white dark:bg-[#262626] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              >
                {accounts.map(acc => (
                  <option key={acc} value={acc}>
                    {acc}
                  </option>
                ))}
              </select>
            </div>

            {tipe === 'Transfer' ? (
              <div>
                <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Ke Dompet/Akun
                </label>
                <select
                  value={keAkun}
                  onChange={e => setKeAkun(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#e9e9e7] dark:border-[#2f2f2f] bg-white dark:bg-[#262626] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                >
                  {accounts.map(acc => (
                    <option key={acc} value={acc}>
                      {acc}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Tanggal
                </label>
                <input
                  type="date"
                  value={tanggal}
                  onChange={e => setTanggal(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#e9e9e7] dark:border-[#2f2f2f] bg-white dark:bg-[#262626] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                />
              </div>
            )}
          </div>

          {tipe === 'Transfer' && (
            <div>
              <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Tanggal
              </label>
              <input
                type="date"
                value={tanggal}
                onChange={e => setTanggal(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-[#e9e9e7] dark:border-[#2f2f2f] bg-white dark:bg-[#262626] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              />
            </div>
          )}

          {/* Catatan / Keterangan */}
          <div>
            <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Catatan / Nama Toko / Keterangan
            </label>
            <input
              type="text"
              placeholder="Contoh: Makan siang nasi padang"
              value={catatan}
              onChange={e => setCatatan(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#e9e9e7] dark:border-[#2f2f2f] bg-white dark:bg-[#262626] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
            />
          </div>

          {/* Auto ID Notice */}
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 dark:text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50 p-2 rounded-lg">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>ID Transaksi otomatis dibuat & disimpan ke tab <b>Keuangan_Transaksi</b></span>
          </div>

          {/* Submit Buttons */}
          <div className="pt-2 border-t border-[#e9e9e7] dark:border-[#2f2f2f] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 shadow transition-colors disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Transaksi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
