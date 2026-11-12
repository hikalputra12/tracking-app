import React, { useState, useEffect } from 'react';
import { JobApplication, JobStatus, JobType } from '../../types';
import { X, Trash2, ExternalLink, Save, Calendar, Building2, MapPin, DollarSign, FileText } from 'lucide-react';

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobApplication | null;
  initialStatus?: JobStatus;
  onSave: (job: JobApplication) => Promise<void>;
  onDelete?: (rowIndex: number) => Promise<void>;
}

export const JobModal: React.FC<JobModalProps> = ({
  isOpen,
  onClose,
  job,
  initialStatus = 'Applied',
  onSave,
  onDelete
}) => {
  const [formData, setFormData] = useState<JobApplication>({
    companyName: '',
    jobTitle: '',
    jobLink: '',
    cvVersion: '',
    dateApplied: new Date().toISOString().split('T')[0],
    deadline: '',
    jobType: 'Full-Time',
    salary: '',
    contact: '',
    location: '',
    status: initialStatus,
    interviewDate: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (job) {
      setFormData(job);
    } else {
      setFormData({
        companyName: '',
        jobTitle: '',
        jobLink: '',
        cvVersion: '',
        dateApplied: new Date().toISOString().split('T')[0],
        deadline: '',
        jobType: 'Full-Time',
        salary: '',
        contact: '',
        location: '',
        status: initialStatus,
        interviewDate: '',
        notes: '',
      });
    }
  }, [job, initialStatus, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName.trim()) {
      alert('Nama perusahaan wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (job?.rowIndex && onDelete) {
      if (confirm(`Yakin ingin menghapus lamaran di "${job.companyName}"?`)) {
        setIsSubmitting(true);
        try {
          await onDelete(job.rowIndex);
          onClose();
        } finally {
          setIsSubmitting(false);
        }
      }
    }
  };

  const isEditing = Boolean(job?.rowIndex || job?.companyName);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-xl max-h-[90vh] bg-white dark:bg-[#1f1f1f] border border-[#e9e9e7] dark:border-[#2f2f2f] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#e9e9e7] dark:border-[#2f2f2f] bg-[#fbfbfa] dark:bg-[#252525]">
          <div className="flex items-center gap-2">
            <span className="text-lg">💼</span>
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              {isEditing ? 'Detail Lamaran Pekerjaan' : 'Tambah Lamaran Baru'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {isEditing && job?.rowIndex && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Hapus Lamaran"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
          {/* Company & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Nama Perusahaan *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: PT Telkom Indonesia"
                value={formData.companyName}
                onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-3 py-2 text-sm font-semibold rounded-lg border border-[#e9e9e7] dark:border-[#2f2f2f] bg-white dark:bg-[#262626] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Posisi / Job Title
              </label>
              <input
                type="text"
                placeholder="Contoh: Frontend Developer"
                value={formData.jobTitle}
                onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-[#e9e9e7] dark:border-[#2f2f2f] bg-white dark:bg-[#262626] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              />
            </div>
          </div>

          {/* Status & Job Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Status Lamaran
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as JobStatus })}
                className="w-full px-3 py-2 rounded-lg border border-[#e9e9e7] dark:border-[#2f2f2f] bg-white dark:bg-[#262626] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              >
                <option value="Applied">Applied (Menunggu)</option>
                <option value="Interview">Interview (Wawancara)</option>
                <option value="Offer">Offer (Tawaran Kerja)</option>
                <option value="Rejected">Rejected (Tidak Lolos)</option>
                <option value="Bookmarked">Bookmarked (Disimpan)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Tipe Pekerjaan
              </label>
              <select
                value={formData.jobType}
                onChange={e => setFormData({ ...formData, jobType: e.target.value as JobType })}
                className="w-full px-3 py-2 rounded-lg border border-[#e9e9e7] dark:border-[#2f2f2f] bg-white dark:bg-[#262626] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Internship">Internship (Magang)</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Freelance">Freelance</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>

          {/* Dates: Applied, Deadline, Interview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Tanggal Lamar
              </label>
              <input
                type="date"
                value={formData.dateApplied}
                onChange={e => setFormData({ ...formData, dateApplied: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg border border-[#e9e9e7] dark:border-[#2f2f2f] bg-white dark:bg-[#262626] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Batas Lamaran (Deadline)
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg border border-[#e9e9e7] dark:border-[#2f2f2f] bg-white dark:bg-[#262626] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-amber-600 dark:text-amber-400 mb-1">
                Jadwal Interview
              </label>
              <input
                type="date"
                value={formData.interviewDate}
                onChange={e => setFormData({ ...formData, interviewDate: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Salary & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Ekspektasi Gaji / Honor
              </label>
              <input
                type="text"
                placeholder="Contoh: 5.700.000 atau UMR Jakarta"
                value={formData.salary}
                onChange={e => setFormData({ ...formData, salary: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#e9e9e7] dark:border-[#2f2f2f] bg-white dark:bg-[#262626] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Lokasi / Kerja
              </label>
              <input
                type="text"
                placeholder="Contoh: Jakarta Selatan (WFH / Onsite)"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#e9e9e7] dark:border-[#2f2f2f] bg-white dark:bg-[#262626] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              />
            </div>
          </div>

          {/* Links: Job Link & CV */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Link Lowongan Pekerjaan
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={formData.jobLink}
                onChange={e => setFormData({ ...formData, jobLink: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#e9e9e7] dark:border-[#2f2f2f] bg-white dark:bg-[#262626] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                Versi CV / Portofolio Terkirim
              </label>
              <input
                type="text"
                placeholder="Link Drive CV atau Portofolio"
                value={formData.cvVersion}
                onChange={e => setFormData({ ...formData, cvVersion: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#e9e9e7] dark:border-[#2f2f2f] bg-white dark:bg-[#262626] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              />
            </div>
          </div>

          {/* Contact Recruiter */}
          <div>
            <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Kontak Recruiter / Email / LinkedIn
            </label>
            <input
              type="text"
              placeholder="hr@perusahaan.com / profil linkedin"
              value={formData.contact}
              onChange={e => setFormData({ ...formData, contact: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#e9e9e7] dark:border-[#2f2f2f] bg-white dark:bg-[#262626] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Catatan & Evaluasi Interview
            </label>
            <textarea
              rows={3}
              placeholder="Tuliskan catatan teknis, pertanyaan saat interview, atau hal yang perlu dipelajari..."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#e9e9e7] dark:border-[#2f2f2f] bg-white dark:bg-[#262626] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400 resize-none"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-[#e9e9e7] dark:border-[#2f2f2f] flex items-center justify-end gap-2">
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
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan ke Sheet'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
