"use client";

import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  RotateCcw,
  Save,
  Sliders,
} from "lucide-react";
import { useEnergy } from "@/context/EnergyContext";

export default function SettingsPage() {
  const { settings, updateSettings, resetSimulation } = useEnergy();

  const [tariff, setTariff] = useState<number>(settings.tariffPerKwh);
  const [quota, setQuota] = useState<number>(settings.defaultQuota);
  const [template, setTemplate] = useState<string>(settings.waTemplate);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  useEffect(() => {
    setTariff(settings.tariffPerKwh);
    setQuota(settings.defaultQuota);
    setTemplate(settings.waTemplate);
  }, [settings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      tariffPerKwh: tariff,
      defaultQuota: quota,
      waTemplate: template,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleResetConfirm = () => {
    resetSimulation();
    setResetModalOpen(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const insertVariable = (varName: string) => {
    setTemplate((prev) => prev + varName);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="pb-2 border-b border-[#A6A6A6]">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#353A3E] tracking-tight">
          Pengaturan Sistem
        </h1>
        <p className="text-xs text-gray-700 mt-1">
          Konfigurasi global tarif PLN, kuota standar kamar, dan template pesan penagihan
        </p>
      </div>

      {/* Success Notification */}
      {savedSuccess && (
        <div className="p-4 bg-emerald-100 border-2 border-[#16A34A] rounded-xl flex items-center gap-3 text-sm text-emerald-900 shadow animate-fadeIn">
          <CheckCircle2 size={20} className="text-[#16A34A] flex-shrink-0" />
          <p className="font-bold">Pengaturan berhasil diperbarui dan disimpan secara lokal!</p>
        </div>
      )}

      {/* Form Panel */}
      <form onSubmit={handleSave} className="bg-[#D9D9D9] border border-[#353A3E] rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#A6A6A6]">
          <div className="w-8 h-8 rounded-lg bg-[#353A3E] text-white flex items-center justify-center">
            <Sliders size={18} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#353A3E]">Konfigurasi Tarif &amp; Kuota Default</h2>
            <p className="text-xs text-gray-600">Nilai ini dijadikan acuan perhitungan di seluruh sistem</p>
          </div>
        </div>

        {/* Tarif Dasar PLN */}
        <div>
          <label className="block text-xs font-bold text-[#353A3E] uppercase tracking-wider mb-1.5">
            Tarif Dasar PLN / kWh (Rupiah)
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-sm font-bold text-gray-500">Rp</span>
            <input
              type="number"
              step="0.01"
              value={tariff}
              onChange={(e) => setTariff(parseFloat(e.target.value) || 0)}
              className="w-full pl-10 pr-12 py-2.5 bg-white border border-[#353A3E] rounded-lg font-bold text-base text-[#353A3E] focus:outline-none focus:ring-2 focus:ring-[#353A3E]"
            />
            <div className="absolute right-2 flex flex-col">
              <button
                type="button"
                onClick={() => setTariff((t) => parseFloat((t + 10).toFixed(2)))}
                className="p-0.5 text-gray-500 hover:text-black"
              >
                <ChevronUp size={14} />
              </button>
              <button
                type="button"
                onClick={() => setTariff((t) => Math.max(0, parseFloat((t - 10).toFixed(2))))}
                className="p-0.5 text-gray-500 hover:text-black"
              >
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
          <p className="text-[11px] text-gray-600 mt-1">
            Standar tarif PLN non-subsidi golongan R-1/TR (2.200 VA): Rp 1.444,70 / kWh
          </p>
        </div>

        {/* Batas Kuota Standar */}
        <div>
          <label className="block text-xs font-bold text-[#353A3E] uppercase tracking-wider mb-1.5">
            Batas Kuota Standar Rata Default (kWh / Kamar / Bulan)
          </label>
          <div className="relative flex items-center">
            <input
              type="number"
              step="1"
              value={quota}
              onChange={(e) => setQuota(parseInt(e.target.value, 10) || 0)}
              className="w-full px-4 pr-12 py-2.5 bg-white border border-[#353A3E] rounded-lg font-bold text-base text-[#353A3E] focus:outline-none focus:ring-2 focus:ring-[#353A3E]"
            />
            <span className="absolute right-10 text-xs font-bold text-gray-500">kWh</span>
            <div className="absolute right-2 flex flex-col">
              <button
                type="button"
                onClick={() => setQuota((q) => q + 5)}
                className="p-0.5 text-gray-500 hover:text-black"
              >
                <ChevronUp size={14} />
              </button>
              <button
                type="button"
                onClick={() => setQuota((q) => Math.max(1, q - 5))}
                className="p-0.5 text-gray-500 hover:text-black"
              >
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
          <p className="text-[11px] text-gray-600 mt-1">
            Kamar yang pemakaiannya melampaui batas ini akan ditandai OVER LIMIT dan dikenai denda.
          </p>
        </div>

        {/* Template Nota WhatsApp */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-[#353A3E] uppercase tracking-wider">
              Template Nota Denda WhatsApp
            </label>
            <span className="text-[11px] text-gray-600">Mendukung format Markdown WhatsApp</span>
          </div>

          {/* Quick variable tags */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {[
              { tag: "{nama}", desc: "Nama Penghuni" },
              { tag: "{kamar}", desc: "Nomor Kamar" },
              { tag: "{kuota}", desc: "Kuota Standar" },
              { tag: "{total}", desc: "Total Pemakaian" },
              { tag: "{kelebihan}", desc: "Kelebihan kWh" },
              { tag: "{denda}", desc: "Nominal Denda" },
            ].map(({ tag, desc }) => (
              <button
                key={tag}
                type="button"
                onClick={() => insertVariable(tag)}
                title={`Klik untuk menyisipkan ${desc}`}
                className="px-2 py-0.5 bg-[#BFBFBF] hover:bg-gray-300 border border-[#A6A6A6] text-[#353A3E] text-[11px] font-mono font-bold rounded transition"
              >
                + {tag}
              </button>
            ))}
          </div>

          <textarea
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            rows={8}
            className="w-full p-3 bg-white border border-[#353A3E] rounded-lg font-mono text-xs leading-relaxed text-[#353A3E] focus:outline-none focus:ring-2 focus:ring-[#353A3E] resize-y"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-[#A6A6A6] flex flex-col sm:flex-row gap-3 justify-between items-center">
          <button
            type="button"
            onClick={() => setResetModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#BFBFBF] hover:bg-red-100 hover:text-[#DC2626] border border-gray-400 rounded-xl text-xs font-bold text-[#353A3E] transition"
          >
            <RotateCcw size={15} />
            <span>Reset Data Simulasi Demo</span>
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-[#353A3E] hover:bg-black text-white font-bold text-sm rounded-xl shadow-md transition transform hover:-translate-y-0.5"
          >
            <Save size={16} />
            <span>Simpan Pengaturan</span>
          </button>
        </div>
      </form>

      {/* Reset Confirmation Modal */}
      {resetModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setResetModalOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-[#E0E0E0] border-2 border-[#DC2626] rounded-xl shadow-2xl p-6 relative animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-100 text-[#DC2626] flex items-center justify-center mx-auto mb-3 shadow">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold text-center text-[#353A3E]">
              Reset Data ke Kondisi Awal?
            </h3>
            <p className="text-xs text-center text-gray-700 mt-2">
              Seluruh data kamar, meteran, riwayat tagihan, dan pengaturan akan dikembalikan ke data awal sesuai PRD (Kamar 01 s/d 06).
            </p>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setResetModalOpen(false)}
                className="flex-1 py-2 px-3 bg-[#BFBFBF] hover:bg-gray-300 text-[#353A3E] font-bold text-xs rounded-lg transition"
              >
                Batal
              </button>
              <button
                onClick={handleResetConfirm}
                className="flex-1 py-2 px-3 bg-[#DC2626] hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow transition"
              >
                Ya, Reset Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
