"use client";

import React, { useState } from "react";
import {
  Check,
  CheckCircle2,
  Clock,
  Filter,
  MessageCircle,
  ReceiptText,
  RotateCcw,
} from "lucide-react";
import { useEnergy } from "@/context/EnergyContext";
import WaModal from "@/components/WaModal";
import { Bill, formatKwh, formatRupiah, generateWaText } from "@/lib/energyService";

export default function BillingPage() {
  const { bills, toggleBillPaid, settings } = useEnergy();
  const [activeTab, setActiveTab] = useState<"all" | "unpaid" | "paid">("all");
  const [selectedBillForWa, setSelectedBillForWa] = useState<Bill | null>(null);

  const unpaidCount = bills.filter((b) => !b.paid).length;
  const paidCount = bills.filter((b) => b.paid).length;

  const filteredBills = bills.filter((b) => {
    if (activeTab === "unpaid") return !b.paid;
    if (activeTab === "paid") return b.paid;
    return true;
  });

  // Calculate totals
  const totalFineAmount = bills.reduce((acc, curr) => acc + curr.totalFine, 0);
  const unpaidFineAmount = bills
    .filter((b) => !b.paid)
    .reduce((acc, curr) => acc + curr.totalFine, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#A6A6A6]">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#353A3E] tracking-tight">
            Riwayat &amp; Tagihan Denda
          </h1>
          <p className="text-xs text-gray-700 mt-1">
            Buku kas rekap denda over limit dan status pelunasan penghuni kos
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 bg-[#BFBFBF] p-1 rounded-xl border border-[#A6A6A6] self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              activeTab === "all"
                ? "bg-[#353A3E] text-white shadow-sm"
                : "text-[#353A3E] hover:bg-black/10"
            }`}
          >
            Semua Tagihan ({bills.length})
          </button>
          <button
            onClick={() => setActiveTab("unpaid")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              activeTab === "unpaid"
                ? "bg-[#DC2626] text-white shadow-sm"
                : "text-[#353A3E] hover:bg-black/10"
            }`}
          >
            <span>Belum Lunas</span>
            {unpaidCount > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  activeTab === "unpaid"
                    ? "bg-white text-[#DC2626]"
                    : "bg-[#DC2626] text-white"
                }`}
              >
                {unpaidCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("paid")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              activeTab === "paid"
                ? "bg-[#16A34A] text-white shadow-sm"
                : "text-[#353A3E] hover:bg-black/10"
            }`}
          >
            Lunas ({paidCount})
          </button>
        </div>
      </div>

      {/* Mini Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-[#BFBFBF] border border-[#A6A6A6] rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
              Total Denda Tertagih
            </span>
            <p className="text-xl font-black text-[#353A3E] mt-0.5">
              {formatRupiah(totalFineAmount)}
            </p>
          </div>
          <span className="p-2 bg-white/40 rounded-lg text-[#353A3E]">
            <ReceiptText size={20} />
          </span>
        </div>

        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider">
              Piutang Denda Belum Lunas
            </span>
            <p className="text-xl font-black text-[#DC2626] mt-0.5">
              {formatRupiah(unpaidFineAmount)}
            </p>
          </div>
          <span className="p-2 bg-red-100 rounded-lg text-[#DC2626]">
            <Clock size={20} />
          </span>
        </div>
      </div>

      {/* Main Table Panel */}
      <div className="bg-[#D9D9D9] border border-[#353A3E] rounded-xl p-5 md:p-6 shadow-sm">
        <div className="pb-4 mb-4 border-b border-[#A6A6A6] flex justify-between items-center">
          <h2 className="text-lg md:text-xl font-bold text-[#353A3E]">
            Rekap Buku Tagihan Cas Over Limit
          </h2>
          <span className="text-xs text-gray-600 font-medium">
            Menampilkan {filteredBills.length} data
          </span>
        </div>

        {filteredBills.length === 0 ? (
          <div className="p-8 text-center bg-white/40 rounded-xl border border-[#A6A6A6]">
            <p className="font-bold text-[#353A3E]">Tidak ada tagihan dalam kategori ini</p>
            <p className="text-xs text-gray-600 mt-1">
              {activeTab === "unpaid"
                ? "Semua tagihan denda sudah lunas! Tidak ada tunggakan."
                : "Belum ada riwayat tagihan denda yang tercatat."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-[#BFBFBF] text-[#353A3E] text-xs font-bold uppercase tracking-wider border-b border-[#A6A6A6]">
                  <th className="py-3 px-4 rounded-l-lg">Periode</th>
                  <th className="py-3 px-4">Kamar &amp; Penghuni</th>
                  <th className="py-3 px-4">Kelebihan kWh</th>
                  <th className="py-3 px-4">Total Cas Denda</th>
                  <th className="py-3 px-4">Status Payment</th>
                  <th className="py-3 px-4 text-center rounded-r-lg">Aksi Penagihan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#A6A6A6]/60">
                {filteredBills.map((bill) => {
                  return (
                    <tr
                      key={bill.id}
                      className="hover:bg-white/30 transition-colors"
                    >
                      {/* Periode */}
                      <td className="py-3.5 px-4 font-bold text-xs text-gray-700">
                        {bill.period}
                      </td>

                      {/* Kamar & Penghuni */}
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-[#353A3E] block">
                          {bill.roomNumber}
                        </span>
                        <span className="text-xs font-semibold text-gray-700">
                          {bill.tenantName || "Penghuni"}
                        </span>
                        <span className="text-[11px] text-gray-500 block font-mono">
                          {bill.whatsapp}
                        </span>
                      </td>

                      {/* Kelebihan kWh */}
                      <td className="py-3.5 px-4 font-mono font-bold text-sm text-[#DC2626]">
                        +{bill.excessKwh.toFixed(1)} kWh
                      </td>

                      {/* Total Cas Denda */}
                      <td className="py-3.5 px-4 font-mono font-black text-base text-[#353A3E]">
                        {formatRupiah(bill.totalFine)}
                      </td>

                      {/* Status Payment */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full ${
                            bill.paid
                              ? "bg-[#16A34A]/20 text-[#16A34A] border border-[#16A34A]/40"
                              : "bg-red-100 text-[#DC2626] border border-red-300"
                          }`}
                        >
                          {bill.paid ? (
                            <>
                              <CheckCircle2 size={13} />
                              <span>Lunas</span>
                            </>
                          ) : (
                            <>
                              <Clock size={13} />
                              <span>Belum Lunas</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Aksi Penagihan */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedBillForWa(bill)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-[#16A34A] hover:bg-[#15803d] text-white text-xs font-bold rounded-lg shadow-sm transition"
                            title="Salin nota WhatsApp"
                          >
                            <MessageCircle size={14} fill="white" />
                            <span>Salin Nota</span>
                          </button>

                          <button
                            onClick={() => toggleBillPaid(bill.id)}
                            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                              bill.paid
                                ? "bg-[#BFBFBF] hover:bg-gray-300 text-gray-700 border-gray-400"
                                : "bg-[#353A3E] hover:bg-black text-white border-[#353A3E] shadow-sm"
                            }`}
                            title={bill.paid ? "Tandai Belum Lunas" : "Tandai Sudah Lunas"}
                          >
                            <Check size={14} strokeWidth={2.5} />
                            <span>{bill.paid ? "Batal Lunas" : "Tandai Lunas"}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* WhatsApp Modal */}
      {selectedBillForWa && (
        <WaModal
          isOpen={!!selectedBillForWa}
          onClose={() => setSelectedBillForWa(null)}
          tenantName={selectedBillForWa.tenantName}
          roomNumber={selectedBillForWa.roomNumber}
          whatsapp={selectedBillForWa.whatsapp}
          notaText={generateWaText(settings.waTemplate, {
            tenantName: selectedBillForWa.tenantName,
            roomNumber: selectedBillForWa.roomNumber,
            quota: settings.defaultQuota,
            usedKwh: selectedBillForWa.usedKwh,
            excessKwh: selectedBillForWa.excessKwh,
            fineRupiah: selectedBillForWa.totalFine,
          })}
        />
      )}
    </div>
  );
}

