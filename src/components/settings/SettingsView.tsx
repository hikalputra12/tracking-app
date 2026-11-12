import React, { useState } from 'react';
import { AppSettings } from '../../types';
import { pingAppsScript } from '../../services/api';
import { Database, KeyRound, CheckCircle2, AlertCircle, Save, ExternalLink, RefreshCw, Copy, Check } from 'lucide-react';

interface SettingsViewProps {
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  onRefreshData: () => Promise<void>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  onRefreshData
}) => {
  const [webAppUrl, setWebAppUrl] = useState(settings.webAppUrl || '');
  const [pin, setPin] = useState(settings.pin || '123456');
  const [pingStatus, setPingStatus] = useState<{ testing: boolean; message?: string; isError?: boolean } | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTestPing = async () => {
    if (!webAppUrl.trim()) {
      setPingStatus({ testing: false, isError: true, message: 'Harap masukkan URL Web App Google Apps Script terlebih dahulu.' });
      return;
    }

    setPingStatus({ testing: true });
    const res = await pingAppsScript(webAppUrl.trim(), pin.trim());
    if (res.success) {
      setPingStatus({
        testing: false,
        isError: false,
        message: `Terhubung! ${res.message || ''} (${res.spreadsheetName || ''})`
      });
    } else {
      setPingStatus({
        testing: false,
        isError: true,
        message: res.error || 'Gagal terhubung. Pastikan URL benar dan Access diatur ke "Anyone".'
      });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 6 || !/^\d+$/.test(pin)) {
      alert('PIN harus terdiri dari tepat 6 angka.');
      return;
    }

    const updated = {
      ...settings,
      webAppUrl: webAppUrl.trim(),
      pin: pin.trim(),
    };

    onSaveSettings(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleManualSync = async () => {
    setIsRefreshing(true);
    try {
      await onRefreshData();
      alert('Sinkronisasi data Google Sheet selesai!');
    } catch (e) {
      alert('Sinkronisasi gagal.');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <span>⚙️</span> Pengaturan & Integrasi Sheet
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Hubungkan aplikasi ke Google Sheet Anda dan atur keamanan PIN personal.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Google Apps Script Web App URL */}
        <div className="p-5 rounded-2xl border border-[#e9e9e7] dark:border-[#2f2f2f] bg-white dark:bg-[#1f1f1f] shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              Koneksi Google Sheets
            </h2>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Google Apps Script Web App URL
            </label>
            <input
              type="url"
              placeholder="https://script.google.com/macros/s/AKfycb.../exec"
              value={webAppUrl}
              onChange={e => setWebAppUrl(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-[#e9e9e7] dark:border-[#2f2f2f] bg-white dark:bg-[#262626] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
            />
            <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1.5 leading-relaxed">
              Dapatkan URL ini dengan menempelkan kode <code>Code.gs</code> ke menu <b>Extensions ➔ Apps Script</b> di spreadsheet Anda lalu klik <b>Deploy ➔ New deployment (Web app)</b>.
            </p>
          </div>

          {/* Test Ping Button & Status */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleTestPing}
              disabled={pingStatus?.testing}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${pingStatus?.testing ? 'animate-spin' : ''}`} />
              <span>{pingStatus?.testing ? 'Menguji...' : 'Uji Koneksi (Test Ping)'}</span>
            </button>

            <button
              type="button"
              onClick={handleManualSync}
              disabled={isRefreshing}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Menyinkronkan...' : 'Sinkron Ulang Data'}</span>
            </button>

            <a
              href={`https://docs.google.com/spreadsheets/d/${settings.spreadsheetId}/edit`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors flex items-center gap-1.5 ml-auto"
            >
              <span>Buka Google Sheet</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {pingStatus && (
            <div className={`p-2.5 rounded-lg text-xs flex items-start gap-2 ${
              pingStatus.isError
                ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900'
                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900'
            }`}>
              {pingStatus.isError ? (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span className="leading-snug">{pingStatus.message}</span>
            </div>
          )}
        </div>

        {/* Section 2: Keamanan PIN Personal */}
        <div className="p-5 rounded-2xl border border-[#e9e9e7] dark:border-[#2f2f2f] bg-white dark:bg-[#1f1f1f] shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <KeyRound className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              PIN Keamanan Personal
            </h2>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              PIN Master (6 Angka)
            </label>
            <input
              type="password"
              maxLength={6}
              value={pin}
              onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
              className="w-40 px-3 py-2 text-base tracking-widest text-center font-bold rounded-lg border border-[#e9e9e7] dark:border-[#2f2f2f] bg-white dark:bg-[#262626] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
            />
            <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1.5">
              PIN ini digunakan untuk membuka aplikasi di HP dan memvalidasi akses request ke Google Apps Script.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3">
          {isSaved && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-4 h-4" /> Pengaturan Tersimpan!
            </span>
          )}

          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 shadow transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Pengaturan</span>
          </button>
        </div>
      </form>
    </div>
  );
};
