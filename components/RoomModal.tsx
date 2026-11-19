"use client";

import React, { useState, useEffect } from "react";
import { BedSingle, X } from "lucide-react";
import { Room, RoomStatus } from "@/lib/energyService";
import { useEnergy } from "@/context/EnergyContext";

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomToEdit?: Room | null;
}

export default function RoomModal({ isOpen, onClose, roomToEdit }: RoomModalProps) {
  const { addRoom, updateRoom, settings } = useEnergy();

  const [roomNumber, setRoomNumber] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [status, setStatus] = useState<RoomStatus>("Terisi");
  const [previousMeter, setPreviousMeter] = useState(0);
  const [currentMeter, setCurrentMeter] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (roomToEdit) {
      setRoomNumber(roomToEdit.roomNumber);
      setTenantName(roomToEdit.tenantName);
      setWhatsapp(roomToEdit.whatsapp);
      setStatus(roomToEdit.status);
      setPreviousMeter(roomToEdit.previousMeter);
      setCurrentMeter(roomToEdit.currentMeter);
    } else {
      setRoomNumber("");
      setTenantName("");
      setWhatsapp("");
      setStatus("Terisi");
      setPreviousMeter(0);
      setCurrentMeter(0);
    }
    setError("");
  }, [roomToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumber.trim()) {
      setError("Nomor kamar wajib diisi");
      return;
    }

    if (status === "Terisi" && !tenantName.trim()) {
      setError("Nama penghuni wajib diisi jika kamar berstatus Terisi");
      return;
    }

    if (currentMeter < previousMeter) {
      setError("Meteran baru tidak boleh lebih kecil dari meteran lalu");
      return;
    }

    if (roomToEdit) {
      updateRoom(roomToEdit.id, {
        roomNumber: roomNumber.trim(),
        tenantName: status === "Terisi" ? tenantName.trim() : "",
        whatsapp: status === "Terisi" ? whatsapp.trim() : "",
        status,
        previousMeter: Number(previousMeter) || 0,
        currentMeter: Number(currentMeter) || 0,
      });
    } else {
      addRoom({
        roomNumber: roomNumber.trim(),
        tenantName: status === "Terisi" ? tenantName.trim() : "",
        whatsapp: status === "Terisi" ? whatsapp.trim() : "",
        status,
        previousMeter: Number(previousMeter) || 0,
        currentMeter: Number(currentMeter) || 0,
      });
    }

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
            <BedSingle size={22} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#353A3E]">
              {roomToEdit ? "Edit Data Kamar" : "Tambah Kamar Baru"}
            </h3>
            <p className="text-xs text-gray-700">Master konfigurasi kamar & penghuni</p>
          </div>
        </div>

        {error && (
          <div className="mb-3 p-2.5 bg-red-100 border border-red-300 rounded text-xs text-[#DC2626] font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#353A3E] uppercase mb-1">
              Nomor Kamar <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Kamar 07"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#353A3E] rounded-lg text-sm text-[#353A3E] focus:outline-none focus:ring-2 focus:ring-[#353A3E]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#353A3E] uppercase mb-1">
              Status Hunian
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus("Terisi")}
                className={`py-2 px-3 text-xs font-bold rounded-lg border transition ${
                  status === "Terisi"
                    ? "bg-[#16A34A] text-white border-[#16A34A] shadow"
                    : "bg-[#BFBFBF] text-[#353A3E] border-gray-400 hover:bg-gray-300"
                }`}
              >
                ✓ Terisi
              </button>
              <button
                type="button"
                onClick={() => setStatus("Kosong")}
                className={`py-2 px-3 text-xs font-bold rounded-lg border transition ${
                  status === "Kosong"
                    ? "bg-[#353A3E] text-white border-[#353A3E] shadow"
                    : "bg-[#BFBFBF] text-[#353A3E] border-gray-400 hover:bg-gray-300"
                }`}
              >
                Kosong
              </button>
            </div>
            {status === "Kosong" && (
              <p className="text-[11px] text-gray-600 mt-1 italic">
                * Kamar kosong tidak muncul di form input bulanan dan tidak dihitung kamar aktif di dashboard.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#353A3E] uppercase mb-1">
              Nama Penghuni {status === "Terisi" && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              placeholder="Contoh: Budi Santoso"
              value={tenantName}
              disabled={status === "Kosong"}
              onChange={(e) => setTenantName(e.target.value)}
              className="w-full px-3 py-2 bg-white disabled:bg-gray-200 border border-[#353A3E] rounded-lg text-sm text-[#353A3E] focus:outline-none focus:ring-2 focus:ring-[#353A3E]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#353A3E] uppercase mb-1">
              Nomor WhatsApp
            </label>
            <input
              type="text"
              placeholder="Contoh: 081234567890"
              value={whatsapp}
              disabled={status === "Kosong"}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full px-3 py-2 bg-white disabled:bg-gray-200 border border-[#353A3E] rounded-lg text-sm text-[#353A3E] focus:outline-none focus:ring-2 focus:ring-[#353A3E]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label className="block text-xs font-bold text-[#353A3E] uppercase mb-1">
                Meteran Lalu (kWh)
              </label>
              <input
                type="number"
                step="0.1"
                value={previousMeter}
                onChange={(e) => setPreviousMeter(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white border border-[#353A3E] rounded-lg text-sm text-[#353A3E]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#353A3E] uppercase mb-1">
                Meteran Baru (kWh)
              </label>
              <input
                type="number"
                step="0.1"
                value={currentMeter}
                onChange={(e) => setCurrentMeter(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white border border-[#353A3E] rounded-lg text-sm text-[#353A3E]"
              />
            </div>
          </div>

          <div className="pt-3 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-[#BFBFBF] hover:bg-gray-400 text-[#353A3E] font-semibold rounded-lg text-sm transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-[#353A3E] hover:bg-black text-white font-semibold rounded-lg text-sm shadow transition"
            >
              {roomToEdit ? "Perbarui Kamar" : "Simpan Kamar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

