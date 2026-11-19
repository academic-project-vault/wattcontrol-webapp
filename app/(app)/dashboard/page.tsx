"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  Gauge,
  MessageCircle,
  Plus,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useEnergy } from "@/context/EnergyContext";
import Badge from "@/components/Badge";
import WaModal from "@/components/WaModal";
import QuickMeterModal from "@/components/QuickMeterModal";
import {
  Room,
  calculateExcess,
  calculateFine,
  calculateUsage,
  determineStatus,
  formatKwh,
  formatRupiah,
  generateWaText,
} from "@/lib/energyService";

export default function DashboardPage() {
  const { rooms, settings, searchQuery } = useEnergy();

  // Modals state
  const [selectedRoomForWa, setSelectedRoomForWa] = useState<Room | null>(null);
  const [selectedRoomForQuickMeter, setSelectedRoomForQuickMeter] = useState<Room | null>(null);

  // Active rooms only
  const activeRooms = rooms.filter((r) => r.status === "Terisi");
  const totalRooms = rooms.length;

  // Filtered by search
  const filteredRooms = activeRooms.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.roomNumber.toLowerCase().includes(q) ||
      r.tenantName.toLowerCase().includes(q)
    );
  });

  // Calculate statistics
  let amanCount = 0;
  let siagaCount = 0;
  let overLimitCount = 0;

  activeRooms.forEach((r) => {
    const used = calculateUsage(r.currentMeter, r.previousMeter);
    const status = determineStatus(used, settings.defaultQuota);
    if (status === "AMAN") amanCount++;
    else if (status === "SIAGA") siagaCount++;
    else if (status === "OVER LIMIT") overLimitCount++;
  });

  const handleOpenWaModal = (room: Room) => {
    setSelectedRoomForWa(room);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#A6A6A6]">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#353A3E] tracking-tight">
            Dashboard Monitoring Energi
          </h1>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#BFBFBF] border border-[#A6A6A6] rounded-full text-xs font-semibold text-[#353A3E]">
              <Gauge size={14} />
              Batas Kuota Standar Rata: {settings.defaultQuota} kWh / Kamar
            </span>
            <span className="text-xs text-gray-600 font-medium font-mono">
              Tarif: Rp {settings.tariffPerKwh.toLocaleString("id-ID")} / kWh
            </span>
          </div>
        </div>

        <Link
          href="/meter-input"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#353A3E] hover:bg-black text-white font-bold text-sm rounded-xl shadow-md transition transform hover:-translate-y-0.5 flex-shrink-0"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Catat Meteran Baru</span>
        </Link>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Total Occupied */}
        <div className="bg-[#BFBFBF] border border-[#A6A6A6] rounded-xl p-4 flex flex-col justify-between shadow-sm min-h-[110px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#353A3E] uppercase tracking-wider">
              Total Kamar Terisi
            </span>
            <span className="p-1.5 bg-[#353A3E]/10 rounded-lg text-[#353A3E]">
              <ShieldCheck size={18} />
            </span>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-black text-[#353A3E]">
              {activeRooms.length} <span className="text-sm font-semibold text-gray-700">/ {totalRooms} Kamar</span>
            </p>
            <p className="text-[11px] text-gray-600 mt-0.5">
              {totalRooms - activeRooms.length} kamar kosong
            </p>
          </div>
        </div>

        {/* Aman */}
        <div className="bg-[#BFBFBF] border border-[#A6A6A6] rounded-xl p-4 flex flex-col justify-between shadow-sm min-h-[110px]">
          <div className="flex items-center justify-between">
            <Badge status="AMAN" size="sm" />
            <span className="text-xs font-bold text-gray-600">≤ 80%</span>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-black text-[#16A34A]">{amanCount} Kamar</p>
            <p className="text-[11px] text-gray-600 mt-0.5">Penggunaan hemat &amp; aman</p>
          </div>
        </div>

        {/* Siaga */}
        <div className="bg-[#BFBFBF] border border-[#A6A6A6] rounded-xl p-4 flex flex-col justify-between shadow-sm min-h-[110px]">
          <div className="flex items-center justify-between">
            <Badge status="SIAGA" size="sm" />
            <span className="text-xs font-bold text-gray-600">81 - 100%</span>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-black text-[#B45309]">{siagaCount} Kamar</p>
            <p className="text-[11px] text-gray-600 mt-0.5">Mendekati batas kuota</p>
          </div>
        </div>

        {/* Over Limit */}
        <div className="bg-[#BFBFBF] border-2 border-[#DC2626] rounded-xl p-4 flex flex-col justify-between shadow-sm min-h-[110px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#DC2626]/10 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between">
            <Badge status="OVER LIMIT" size="sm" />
            <span className="text-xs font-bold text-[#DC2626]">&gt; 100%</span>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-black text-[#DC2626]">{overLimitCount} Kamar</p>
            <p className="text-[11px] text-[#DC2626] font-semibold mt-0.5">
              Dikenakan cas denda!
            </p>
          </div>
        </div>
      </div>

      {/* Room Cards Grid Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-[#353A3E]">
            Daftar Kamar Aktif ({filteredRooms.length})
          </h2>
          {searchQuery && (
            <span className="text-xs text-gray-600 bg-white/70 px-2.5 py-1 rounded-md border border-[#A6A6A6]">
              Filter: &quot;{searchQuery}&quot;
            </span>
          )}
        </div>

        {filteredRooms.length === 0 ? (
          <div className="bg-[#BFBFBF]/40 border-2 border-dashed border-[#A6A6A6] rounded-xl p-8 text-center">
            <p className="text-[#353A3E] font-bold text-base">Tidak ada kamar ditemukan</p>
            <p className="text-xs text-gray-600 mt-1">
              {searchQuery
                ? `Tidak ada kamar yang cocok dengan kata kunci "${searchQuery}".`
                : "Belum ada kamar aktif berstatus Terisi."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms.map((room) => {
              const used = calculateUsage(room.currentMeter, room.previousMeter);
              const status = determineStatus(used, settings.defaultQuota);
              const percentage = Math.round((used / settings.defaultQuota) * 100);
              const excess = calculateExcess(used, settings.defaultQuota);
              const fine = calculateFine(excess, settings.tariffPerKwh);

              const borderClass =
                status === "AMAN"
                  ? "border-[#16A34A]"
                  : status === "SIAGA"
                  ? "border-[#F59E0B]"
                  : "border-[#DC2626]";

              const barColor =
                status === "AMAN"
                  ? "bg-[#16A34A]"
                  : status === "SIAGA"
                  ? "bg-[#F59E0B]"
                  : "bg-[#DC2626]";

              return (
                <div
                  key={room.id}
                  className={`bg-[#D9D9D9] border-2 ${borderClass} rounded-xl p-4 flex flex-col justify-between shadow transition hover:shadow-md`}
                >
                  {/* Top: Room Number, Tenant, Badge */}
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-extrabold text-lg text-[#353A3E] leading-tight">
                          {room.roomNumber}
                        </h3>
                        <p className="text-sm font-semibold text-gray-800">
                          {room.tenantName}
                        </p>
                        <p className="text-[11px] text-gray-500 font-mono">{room.whatsapp}</p>
                      </div>
                      <Badge status={status} size="sm" />
                    </div>

                    {/* Usage Progress */}
                    <div className="mt-4">
                      <div className="flex items-baseline justify-between text-xs font-bold text-[#353A3E] mb-1">
                        <span>{percentage}% dari kuota</span>
                        <span>
                          {formatKwh(used)} / {settings.defaultQuota} kWh
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-[#BFBFBF] rounded-full overflow-hidden border border-[#A6A6A6]">
                        <div
                          className={`h-full ${barColor} rounded-full transition-all duration-500`}
                          style={{ width: `${Math.min(100, percentage)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                        <span>Lalu: {formatKwh(room.previousMeter)}</span>
                        <span>Kini: {formatKwh(room.currentMeter)}</span>
                      </div>
                    </div>

                    {/* OVER LIMIT Alert Box */}
                    {status === "OVER LIMIT" && (
                      <div className="mt-3.5 p-3 bg-red-100 border border-red-300 rounded-lg">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#DC2626] mb-1">
                          <AlertTriangle size={15} />
                          <span>Peringatan Kelebihan Kuota!</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-800">
                          <span>Kelebihan Energi:</span>
                          <span className="font-bold text-[#DC2626]">
                            +{excess.toFixed(1)} kWh
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-800 mt-0.5">
                          <span>Tagihan Denda:</span>
                          <span className="font-black text-sm text-[#DC2626]">
                            {formatRupiah(fine)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Bottom Bar */}
                  <div className="mt-4 pt-3 border-t border-[#A6A6A6] flex gap-2">
                    <button
                      onClick={() => setSelectedRoomForQuickMeter(room)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-[#BFBFBF] hover:bg-gray-300 border border-[#353A3E] rounded-lg text-xs font-bold text-[#353A3E] transition shadow-sm"
                    >
                      <Plus size={16} />
                      <span>Catat kWh</span>
                    </button>

                    {status === "OVER LIMIT" && (
                      <button
                        onClick={() => handleOpenWaModal(room)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-[#16A34A] hover:bg-[#15803d] text-white rounded-lg text-xs font-bold transition shadow-sm"
                      >
                        <MessageCircle size={15} fill="white" />
                        <span>Salin Nota WA</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* WhatsApp Modal */}
      {selectedRoomForWa && (
        <WaModal
          isOpen={!!selectedRoomForWa}
          onClose={() => setSelectedRoomForWa(null)}
          tenantName={selectedRoomForWa.tenantName}
          roomNumber={selectedRoomForWa.roomNumber}
          whatsapp={selectedRoomForWa.whatsapp}
          notaText={generateWaText(settings.waTemplate, {
            tenantName: selectedRoomForWa.tenantName,
            roomNumber: selectedRoomForWa.roomNumber,
            quota: settings.defaultQuota,
            usedKwh: calculateUsage(
              selectedRoomForWa.currentMeter,
              selectedRoomForWa.previousMeter
            ),
            excessKwh: calculateExcess(
              calculateUsage(
                selectedRoomForWa.currentMeter,
                selectedRoomForWa.previousMeter
              ),
              settings.defaultQuota
            ),
            fineRupiah: calculateFine(
              calculateExcess(
                calculateUsage(
                  selectedRoomForWa.currentMeter,
                  selectedRoomForWa.previousMeter
                ),
                settings.defaultQuota
              ),
              settings.tariffPerKwh
            ),
          })}
        />
      )}

      {/* Quick Meter Record Modal */}
      {selectedRoomForQuickMeter && (
        <QuickMeterModal
          room={selectedRoomForQuickMeter}
          onClose={() => setSelectedRoomForQuickMeter(null)}
        />
      )}
    </div>
  );
}
