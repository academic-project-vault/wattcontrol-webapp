"use client";

import React, { useState } from "react";
import {
  BedSingle,
  Check,
  Edit2,
  Pencil,
  Plus,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";
import { useEnergy } from "@/context/EnergyContext";
import RoomModal from "@/components/RoomModal";
import { Room, formatKwh } from "@/lib/energyService";

export default function RoomsPage() {
  const { rooms, deleteRoom, settings } = useEnergy();
  const [modalOpen, setModalOpen] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

  const handleOpenAdd = () => {
    setRoomToEdit(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (room: Room) => {
    setRoomToEdit(room);
    setModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (roomToDelete) {
      deleteRoom(roomToDelete.id);
      setRoomToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#A6A6A6]">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#353A3E] tracking-tight">
            Kelola Data Kamar dan Penghuni
          </h1>
          <p className="text-xs text-gray-700 mt-1">
            Master data kamar kos, nomor WhatsApp penghuni, dan status hunian
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#353A3E] hover:bg-black text-white font-bold text-sm rounded-xl shadow-md transition-all transform hover:-translate-y-0.5"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Tambah Kamar Baru</span>
        </button>
      </div>

      {/* Main Panel */}
      <div className="bg-[#D9D9D9] border border-[#353A3E] rounded-xl p-5 md:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#A6A6A6]">
          <h2 className="text-lg md:text-xl font-bold text-[#353A3E]">
            Daftar Master Kamar ({rooms.length} Kamar)
          </h2>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 bg-[#16A34A]/20 text-[#16A34A] border border-[#16A34A]/40 font-bold rounded-full">
              {rooms.filter((r) => r.status === "Terisi").length} Terisi
            </span>
            <span className="px-2.5 py-1 bg-gray-300 text-gray-700 border border-gray-400 font-bold rounded-full">
              {rooms.filter((r) => r.status === "Kosong").length} Kosong
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-[#BFBFBF] text-[#353A3E] text-xs font-bold uppercase tracking-wider border-b border-[#A6A6A6]">
                <th className="py-3 px-4 rounded-l-lg">No Kamar</th>
                <th className="py-3 px-4">Nama Penghuni</th>
                <th className="py-3 px-4">No. WhatsApp</th>
                <th className="py-3 px-4">Kuota Standar</th>
                <th className="py-3 px-4">Meteran Terakhir</th>
                <th className="py-3 px-4">Status Hunian</th>
                <th className="py-3 px-4 text-center rounded-r-lg">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#A6A6A6]/60">
              {rooms.map((room) => {
                const isTerisi = room.status === "Terisi";

                return (
                  <tr
                    key={room.id}
                    className="hover:bg-white/30 transition-colors"
                  >
                    {/* No Kamar */}
                    <td className="py-3 px-4 font-bold text-[#353A3E]">
                      {room.roomNumber}
                    </td>

                    {/* Nama Penghuni */}
                    <td className="py-3 px-4">
                      {isTerisi ? (
                        <span className="font-semibold text-gray-900">
                          {room.tenantName}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Belum berpenghuni</span>
                      )}
                    </td>

                    {/* No. WhatsApp */}
                    <td className="py-3 px-4 font-mono text-xs">
                      {isTerisi && room.whatsapp ? (
                        <span className="text-gray-700">{room.whatsapp}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>

                    {/* Kuota Standar */}
                    <td className="py-3 px-4 text-xs font-semibold text-gray-700">
                      {settings.defaultQuota} kWh / bln
                    </td>

                    {/* Meteran Terakhir */}
                    <td className="py-3 px-4 font-mono font-medium text-gray-800">
                      {formatKwh(room.currentMeter)}
                    </td>

                    {/* Status Hunian */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full ${
                          isTerisi
                            ? "bg-[#16A34A]/20 text-[#16A34A] border border-[#16A34A]/40"
                            : "bg-gray-300 text-gray-600 border border-gray-400"
                        }`}
                      >
                        {isTerisi ? (
                          <>
                            <UserCheck size={13} />
                            <span>Terisi</span>
                          </>
                        ) : (
                          <>
                            <UserX size={13} />
                            <span>Kosong</span>
                          </>
                        )}
                      </span>
                    </td>

                    {/* Aksi */}
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(room)}
                          title="Edit Kamar"
                          className="p-1.5 rounded-lg bg-[#BFBFBF] hover:bg-gray-300 text-[#353A3E] border border-gray-400 transition"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setRoomToDelete(room)}
                          title="Hapus Kamar"
                          className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-[#DC2626] border border-red-300 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Room Modal (Add / Edit) */}
      <RoomModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        roomToEdit={roomToEdit}
      />

      {/* Delete Confirmation Modal */}
      {roomToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setRoomToDelete(null)}
        >
          <div
            className="w-full max-w-sm bg-[#E0E0E0] border-2 border-[#DC2626] rounded-xl shadow-2xl p-6 relative animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-100 text-[#DC2626] flex items-center justify-center mx-auto mb-3 shadow">
              <Trash2 size={24} />
            </div>
            <h3 className="text-lg font-bold text-center text-[#353A3E]">
              Hapus {roomToDelete.roomNumber}?
            </h3>
            <p className="text-xs text-center text-gray-700 mt-2">
              Kamar ini beserta seluruh riwayat pemakaiannya akan dihapus dari sistem. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setRoomToDelete(null)}
                className="flex-1 py-2 px-3 bg-[#BFBFBF] hover:bg-gray-300 text-[#353A3E] font-bold text-xs rounded-lg transition"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2 px-3 bg-[#DC2626] hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow transition"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
