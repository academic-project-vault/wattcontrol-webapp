"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BedSingle,
  LayoutDashboard,
  PencilLine,
  ReceiptText,
  Search,
  Settings,
  Zap,
  Menu,
  X,
  Gauge,
} from "lucide-react";
import { useEnergy } from "@/context/EnergyContext";

const navItems = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/meter-input", label: "Input Catat Meter", Icon: PencilLine },
  { href: "/rooms", label: "Kelola Kamar", Icon: BedSingle },
  { href: "/billing", label: "Riwayat & Tagihan", Icon: ReceiptText },
  { href: "/settings", label: "Pengaturan", Icon: Settings },
];

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { searchQuery, setSearchQuery, unpaidCount, settings } = useEnergy();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isNavActive = (href: string) => {
    if (href === "/dashboard" && (pathname === "/dashboard" || pathname === "/")) return true;
    if (href === "/meter-input" && (pathname === "/meter-input" || pathname === "/input")) return true;
    if (href === "/billing" && (pathname === "/billing" || pathname === "/history")) return true;
    return pathname === href;
  };

  return (
    <div className="shell-container">
      {/* Mobile Top Header (only visible on mobile screens < 768px) */}
      <div className="mobile-header">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-[#353A3E] font-extrabold shadow">
            <Zap size={18} fill="#353A3E" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-white">WattRoom</span>
            <span className="block text-[10px] text-gray-300 -mt-1">Energy Metering</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/billing" className="relative p-1.5 rounded-full hover:bg-white/10 transition text-white">
            <Bell size={20} />
            {unpaidCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#DC2626] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                {unpaidCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-white hover:bg-white/10 transition"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Backdrop for mobile drawer */}
      {mobileMenuOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`sidebar-container ${mobileMenuOpen ? "open" : ""}`}>
        <div className="flex flex-col">
          {/* Logo Header */}
          <div className="px-6 py-6 border-b border-gray-700/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-[#353A3E] shadow-md flex-shrink-0">
              <Zap size={24} fill="#353A3E" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white leading-none">
                WattRoom
              </h1>
              <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">
                Energy &amp; Billing
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map(({ href, label, Icon }) => {
              const active = isNavActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                    active
                      ? "bg-white/15 text-white shadow-sm border-l-4 border-amber-500 pl-3"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={20} className={active ? "text-amber-400" : "text-gray-400"} />
                  <span>{label}</span>
                  {href === "/billing" && unpaidCount > 0 && (
                    <span className="ml-auto bg-[#DC2626] text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                      {unpaidCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Info Card */}
        <div className="p-4 m-4 bg-black/25 rounded-xl border border-gray-700/50">
          <div className="flex items-center gap-2 mb-1.5 text-amber-400">
            <Gauge size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Kuota Standar Aktif</span>
          </div>
          <p className="text-sm font-bold text-white">
            {settings.defaultQuota} kWh <span className="text-xs text-gray-400 font-normal">/ kamar / bln</span>
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5 font-mono">
            Tarif: Rp {settings.tariffPerKwh.toLocaleString("id-ID")}/kWh
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-container">
        {/* Top Header */}
        <header className="topbar-container">
          {/* Live Search */}
          <div className="relative w-72 md:w-80">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600"
            />
            <input
              type="text"
              placeholder="Cari kamar atau penghuni..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2 bg-white/80 hover:bg-white focus:bg-white border border-[#353A3E]/30 rounded-xl text-sm text-[#353A3E] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#353A3E] transition shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>

          {/* User Profile & Notifications */}
          <div className="flex items-center gap-5">
            <Link
              href="/billing"
              className="relative p-2 rounded-xl text-[#353A3E] hover:bg-black/5 transition"
              title="Notifikasi Tagihan Denda"
            >
              <Bell size={22} />
              {unpaidCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#DC2626] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {unpaidCount}
                </span>
              )}
            </Link>

            <div className="h-6 w-px bg-gray-400/50" />

            <div className="flex items-center gap-3">
              <div className="flex flex-col text-right">
                <span className="text-sm font-bold text-[#353A3E] leading-tight">
                  Ibu Kos (Admin)
                </span>
                <span className="text-[11px] text-gray-600 font-medium leading-tight mt-0.5">
                  Pengelola Rumah Kos
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#353A3E] text-white font-bold text-sm flex items-center justify-center shadow flex-shrink-0">
                IK
              </div>
            </div>
          </div>
        </header>

        {/* Page Container */}
        <main className="content-container">
          {children}
        </main>
      </div>
    </div>
  );
}
