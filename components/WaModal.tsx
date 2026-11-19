"use client";

import React, { useState } from "react";
import { Check, Copy, ExternalLink, MessageCircle, X } from "lucide-react";
import { generateWaUrl } from "@/lib/energyService";

interface WaModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantName: string;
  roomNumber: string;
  whatsapp: string;
  notaText: string;
}

export default function WaModal({
  isOpen,
  onClose,
  tenantName,
  roomNumber,
  whatsapp,
  notaText,
}: WaModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(notaText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    handleCopy();
    const url = generateWaUrl(whatsapp, notaText);
    window.open(url, "_blank");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#E0E0E0] border-2 border-[#353A3E] rounded-xl shadow-2xl overflow-hidden p-6 relative animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#353A3E] hover:text-black p-1 rounded-lg hover:bg-black/10 transition"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 pb-3 border-b border-[#353A3E]/30 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#16A34A] text-white flex items-center justify-center shadow">
            <MessageCircle size={22} fill="white" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#353A3E]">
              Nota Denda WhatsApp - {roomNumber}
            </h3>
            <p className="text-xs text-gray-700">
              Penerima: {tenantName || "Penghuni"} ({whatsapp || "No WA belum diatur"})
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-600 mb-3">
          Teks nota di bawah ini otomatis terformat sesuai template. Kamu dapat menyalin ke clipboard atau langsung membuka WhatsApp:
        </p>

        <div className="relative mb-5">
          <pre className="w-full p-4 bg-white border border-[#A6A6A6] rounded-lg text-xs leading-relaxed text-gray-800 font-mono whitespace-pre-wrap max-h-60 overflow-y-auto select-all shadow-inner">
            {notaText}
          </pre>
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-[#BFBFBF] hover:bg-gray-300 text-[#353A3E] border border-gray-400 rounded shadow-sm transition"
          >
            {copied ? (
              <>
                <Check size={14} className="text-[#16A34A]" /> Tersalin!
              </>
            ) : (
              <>
                <Copy size={14} /> Salin Teks
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleOpenWhatsApp}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-[#16A34A] hover:bg-[#15803d] text-white font-semibold rounded-lg shadow transition"
          >
            <MessageCircle size={18} fill="white" />
            <span>Kirim via WhatsApp</span>
            <ExternalLink size={14} />
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 bg-[#353A3E] hover:bg-black text-white font-semibold rounded-lg transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

