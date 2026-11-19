"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Gauge,
  HelpCircle,
  RotateCcw,
  Save,
} from "lucide-react";
import { useEnergy } from "@/context/EnergyContext";
import Badge from "@/components/Badge";
import {
  calculateExcess,
  calculateFine,
  calculateUsage,
  determineStatus,
  formatKwh,
  formatRupiah,
} from "@/lib/energyService";

export default function MeterInputPage() {
  const { rooms, settings, saveBatchReadings } = useEnergy();

  // Active rooms only
  const activeRooms = rooms.filter((r) => r.status === "Terisi");

  // Local state for batch inputs: map of roomId -> number
  const [readings, setReadings] = useState<{ [id: string]: number }>({});
  const [errors, setErrors] = useState<{ [id: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Initialize inputs from current rooms
  useEffect(() => {
    const initial: { [id: string]: number } = {};
    activeRooms.forEach((r) => {
      initial[r.id] = r.currentMeter;
    });
    setReadings(initial);
  }, [rooms]);

  const handleInputChange = (id: string, val: string, previousMeter: number) => {
    const num = parseFloat(val);
    const updated = { ...readings, [id]: isNaN(num) ? 0 : num };
    setReadings(updated);

    // Validate
    if (isNaN(num) || num < previousMeter) {
      setErrors((prev) => ({
        ...prev,
        [id]: `Nilai meteran baru tidak boleh lebih kecil dari ${previousMeter} kWh`,
      }));
    } else {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  const handleReset = () => {
    const initial: { [id: string]: number } = {};
    activeRooms.forEach((r) => {
      initial[r.id] = r.currentMeter;
    });
    setReadings(initial);
    setErrors({});
    setSuccessMessage(null);
  };

  const hasErrors = Object.keys(errors).length > 0;

  const handleSave = () => {
    if (hasErrors) return;

    const payload = activeRooms.map((r) => ({
      id: r.id,
      currentMeter: readings[r.id] ?? r.currentMeter,
    }));

    saveBatchReadings(payload);

    // Count over-limits
    let overLimitCount = 0;
    payload.forEach((p) => {
      const room = activeRooms.find((r) => r.id === p.id);
      if (room) {
        const used = calculateUsage(p.currentMeter, room.previousMeter);
        if (determineStatus(used, settings.defaultQuota) === "OVER LIMIT") {
          overLimitCount++;
        }
      }
    });

    setSuccessMessage(
      `Berhasil menyimpan pencatatan untuk ${payload.length} kamar! ${
        overLimitCount > 0
          ? `${overLimitCount} kamar terdeteksi OVER LIMIT dan otomatis ditambahkan ke Riwayat Tagihan.`
          : "Semua kamar dalam batas aman kuota."
      }`
    );

    setTimeout(() => {
      setSuccessMessage(null);
    }, 6000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#A6A6A6]">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#353A3E] tracking-tight">
            Input Catat Meter
          </h1>
          <p className="text-xs text-gray-700 mt-1">
            Pencatatan batch angka meteran kWh seluruh kamar pada akhir bulan
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#BFBFBF] hover:bg-gray-300 text-[#353A3E] font-bold text-xs rounded-xl border border-[#A6A6A6] transition"
          >
            <RotateCcw size={15} />
            <span>Reset Input</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="p-4 bg-emerald-100 border-2 border-[#16A34A] rounded-xl flex items-start gap-3 text-sm text-emerald-900 shadow animate-fadeIn">
          <CheckCircle2 size={22} className="text-[#16A34A] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Pencatatan Berhasil Disimpan</p>
            <p className="text-xs text-emerald-800 mt-0.5">{successMessage}</p>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-xs font-bold text-white bg-[#16A34A] hover:bg-[#15803d] px-3 py-1.5 rounded-lg shadow-sm transition"
          >
            <span>Lihat Dashboard</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Main Panel */}
      <div className="bg-[#D9D9D9] border border-[#353A3E] rounded-xl p-5 md:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#A6A6A6]">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-[#353A3E]">
              Form Batch Input Meteran Kamar
            </h2>
            <p className="text-xs text-gray-600">
              Ketik angka meteran baru pada kolom input. Total terpakai dan status dihitung otomatis secara realtime.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs bg-[#BFBFBF] px-3 py-1.5 rounded-lg border border-[#A6A6A6]">
            <Gauge size={14} className="text-[#353A3E]" />
            <span className="font-semibold text-[#353A3E]">
              Kuota Standar: {settings.defaultQuota} kWh
            </span>
          </div>
        </div>

        {activeRooms.length === 0 ? (
          <div className="p-8 text-center bg-white/40 rounded-xl border border-[#A6A6A6]">
            <p className="font-bold text-[#353A3E]">Tidak ada kamar berstatus Terisi</p>
            <p className="text-xs text-gray-600 mt-1">
              Tambahkan kamar baru atau ubah status hunian menjadi &quot;Terisi&quot; di menu Kelola Kamar.
            </p>
            <Link
              href="/rooms"
              className="inline-block mt-3 px-4 py-2 bg-[#353A3E] text-white text-xs font-bold rounded-lg shadow"
            >
              Buka Kelola Kamar
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-[#BFBFBF] text-[#353A3E] text-xs font-bold uppercase tracking-wider border-b border-[#A6A6A6]">
                  <th className="py-3 px-4 rounded-l-lg">No Kamar</th>
                  <th className="py-3 px-4">Penghuni</th>
                  <th className="py-3 px-4">Meteran Lalu</th>
                  <th className="py-3 px-4 w-44">Meteran Baru (kWh)</th>
                  <th className="py-3 px-4">Total Terpakai</th>
                  <th className="py-3 px-4">Status Indikator</th>
                  <th className="py-3 px-4 rounded-r-lg">Kelebihan / Denda</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#A6A6A6]/60">
                {activeRooms.map((room) => {
                  const currentVal = readings[room.id] ?? room.currentMeter;
                  const hasError = !!errors[room.id];
                  const used = calculateUsage(currentVal, room.previousMeter);
                  const status = determineStatus(used, settings.defaultQuota);
                  const excess = calculateExcess(used, settings.defaultQuota);
                  const fine = calculateFine(excess, settings.tariffPerKwh);

                  return (
                    <tr
                      key={room.id}
                      className={`hover:bg-white/30 transition-colors ${
                        hasError ? "bg-red-50" : ""
                      }`}
                    >
                      {/* No Kamar */}
                      <td className="py-3 px-4 font-bold text-[#353A3E]">
                        {room.roomNumber}
                      </td>

                      {/* Penghuni */}
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-800">{room.tenantName}</span>
                        <span className="block text-[11px] text-gray-500">{room.whatsapp}</span>
                      </td>

                      {/* Meteran Lalu */}
                      <td className="py-3 px-4 font-mono font-medium text-gray-700">
                        {formatKwh(room.previousMeter)}
                      </td>

                      {/* Meteran Baru Input */}
                      <td className="py-3 px-4">
                        <div>
                          <input
                            type="number"
                            step="0.1"
                            value={currentVal}
                            onChange={(e) =>
                              handleInputChange(room.id, e.target.value, room.previousMeter)
                            }
                            className={`w-36 px-3 py-1.5 bg-white border-2 rounded-lg font-mono font-bold text-sm text-[#353A3E] focus:outline-none transition ${
                              hasError
                                ? "border-[#DC2626] bg-red-50 text-[#DC2626]"
                                : "border-[#353A3E] focus:ring-2 focus:ring-[#353A3E]"
                            }`}
                          />
                          {hasError && (
                            <span className="flex items-center gap-1 text-[11px] text-[#DC2626] font-semibold mt-1">
                              <AlertCircle size={12} /> {errors[room.id]}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Total Terpakai */}
                      <td className="py-3 px-4 font-mono font-bold text-base text-[#353A3E]">
                        {formatKwh(used)}
                      </td>

                      {/* Status Indikator */}
                      <td className="py-3 px-4">
                        <Badge status={status} size="sm" />
                      </td>

                      {/* Kelebihan / Denda */}
                      <td className="py-3 px-4 text-xs font-semibold">
                        {status === "OVER LIMIT" ? (
                          <div className="text-[#DC2626]">
                            <span className="font-bold">+{excess.toFixed(1)} kWh</span>
                            <span className="block font-black text-sm">{formatRupiah(fine)}</span>
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Action Button Section */}
        {activeRooms.length > 0 && (
          <div className="mt-6 pt-4 border-t border-[#A6A6A6] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-gray-700 flex items-center gap-1.5">
              <HelpCircle size={16} className="text-[#353A3E]" />
              <span>
                Menyimpan data akan memperbarui angka meteran terkini dan otomatis membuat tagihan denda untuk kamar OVER LIMIT.
              </span>
            </div>

            <button
              onClick={handleSave}
              disabled={hasErrors}
              className={`flex items-center justify-center gap-2 px-6 py-3 font-bold text-sm rounded-xl shadow-md transition ${
                hasErrors
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-[#353A3E] hover:bg-black text-white transform hover:-translate-y-0.5"
              }`}
            >
              <Save size={18} />
              <span>Simpan Semua Data Input</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

