"use client";

import React, { useState, useEffect } from "react";
import { AlertCircle, Gauge, X } from "lucide-react";
import { Room, calculateUsage, determineStatus, formatKwh } from "@/lib/energyService";
import { useEnergy } from "@/context/EnergyContext";
import Badge from "./Badge";

interface QuickMeterModalProps {
  room: Room | null;
  onClose: () => void;
}

export default function QuickMeterModal({ room, onClose }: QuickMeterModalProps) {
  const { settings, saveSingleReading } = useEnergy();
  const [newMeter, setNewMeter] = useState<number>(0);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (room) {
      setNewMeter(room.currentMeter);
      setError("");
    }
  }, [room]);

  if (!room) return null;

  const currentUsage = calculateUsage(newMeter, room.previousMeter);
  const status = determineStatus(currentUsage, settings.defaultQuota);
  const isInvalid = newMeter < room.previousMeter;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isInvalid) {
      setError(`Meteran baru tidak boleh lebih kecil dari meteran lalu (${room.previousMeter} kWh)`);
      return;
    }
    saveSingleReading(room.id, newMeter);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#E0E0E0] border-2 border-[#353A3E] rounded-xl shadow-2xl p-6 relative animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#353A3E] hover:text-black p-1 rounded-lg hover:bg-black/10 transition"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 pb-3 border-b border-[#353A3E]/30 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#353A3E] text-white flex items-center justify-center shadow">
            <Gauge size={22} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#353A3E]">
              Catat Meteran - {room.roomNumber}
            </h3>
            <p className="text-xs text-gray-700">Penghuni: {room.tenantName}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-[#BFBFBF] p-3 rounded-lg border border-[#A6A6A6] text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-700">Meteran Lalu:</span>
              <span className="font-semibold">{formatKwh(room.previousMeter)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Kuota Standar Bulanan:</span>
              <span className="font-semibold">{settings.defaultQuota} kWh</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#353A3E] uppercase mb-1">
              Angka Meteran Baru (kWh)
            </label>
            <input
              type="number"
              step="0.1"
              value={newMeter}
              onChange={(e) => {
                setNewMeter(parseFloat(e.target.value) || 0);
                if (parseFloat(e.target.value) >= room.previousMeter) {
                  setError("");
                }
              }}
              className="w-full px-3 py-2 bg-white border border-[#353A3E] rounded-lg font-bold text-lg text-[#353A3E] focus:outline-none focus:ring-2 focus:ring-[#353A3E]"
              autoFocus
            />
            {error && (
              <p className="flex items-center gap-1 text-xs text-[#DC2626] font-semibold mt-1">
                <AlertCircle size={14} /> {error}
              </p>
            )}
          </div>

          {/* Realtime calculation preview */}
          <div className="p-3 bg-white border border-[#A6A6A6] rounded-lg space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600">Total Pemakaian Terkini:</span>
              <span className="font-bold text-sm text-[#353A3E]">
                {formatKwh(currentUsage)}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600">Status Pemakaian:</span>
              <Badge status={status} size="sm" />
            </div>
            {status === "OVER LIMIT" && (
              <div className="pt-2 border-t border-red-200 text-xs text-[#DC2626]">
                ⚠️ Melebihi batas kuota! Tagihan denda otomatis dibuat saat disimpan.
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-[#BFBFBF] hover:bg-gray-400 text-[#353A3E] font-semibold rounded-lg transition text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isInvalid}
              className={`flex-1 py-2 px-4 font-semibold rounded-lg text-white text-sm shadow transition ${
                isInvalid
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#353A3E] hover:bg-black"
              }`}
            >
              Simpan Pencatatan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

