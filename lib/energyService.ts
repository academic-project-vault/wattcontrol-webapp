export type RoomStatus = "Terisi" | "Kosong";
export type EnergyStatus = "AMAN" | "SIAGA" | "OVER LIMIT";

export interface Settings {
  tariffPerKwh: number;
  defaultQuota: number;
  waTemplate: string;
}

export interface Room {
  id: string;
  roomNumber: string;
  tenantName: string;
  whatsapp: string;
  status: RoomStatus;
  previousMeter: number;
  currentMeter: number;
}

export interface Bill {
  id: string;
  period: string;
  roomId: string;
  roomNumber: string;
  tenantName: string;
  whatsapp: string;
  usedKwh: number;
  excessKwh: number;
  totalFine: number;
  paid: boolean;
  createdAt: string;
}

// Default Seed Data from PRD Section 6
export const DEFAULT_SETTINGS: Settings = {
  tariffPerKwh: 1444.70,
  defaultQuota: 100,
  waTemplate:
    "Pemberitahuan Kelebihan Pemakaian Listrik - WattRoom\n\nHalo {nama} ({kamar}),\nBerikut rekap penggunaan energi listrik kamar kamu bulan ini:\n\n• Batas Kuota Standar : {kuota}\n• Pemakaian Terkini   : {total}\n• Kelebihan Daya      : +{kelebihan}\n\nAtas kelebihan pemakaian di atas batas standar, dikenakan cas denda sebesar:\n👉 {denda}\n\nMohon nominal denda ini ditransfer bersamaan dengan pembayaran sewa kos bulan ini. Terima kasih!",
};

export const DEFAULT_ROOMS: Room[] = [
  {
    id: "rm-01",
    roomNumber: "Kamar 01",
    tenantName: "Budi",
    whatsapp: "081234567890",
    status: "Terisi",
    previousMeter: 1420.5,
    currentMeter: 1465.5,
  },
  {
    id: "rm-02",
    roomNumber: "Kamar 02",
    tenantName: "Andi",
    whatsapp: "085712345678",
    status: "Terisi",
    previousMeter: 1300.0,
    currentMeter: 1385.0,
  },
  {
    id: "rm-03",
    roomNumber: "Kamar 03",
    tenantName: "Rian",
    whatsapp: "081987654321",
    status: "Terisi",
    previousMeter: 1100.0,
    currentMeter: 1212.0,
  },
  {
    id: "rm-04",
    roomNumber: "Kamar 04",
    tenantName: "Eko",
    whatsapp: "081399887766",
    status: "Terisi",
    previousMeter: 10.0,
    currentMeter: 22.0,
  },
  {
    id: "rm-05",
    roomNumber: "Kamar 05",
    tenantName: "Siti",
    whatsapp: "082144332211",
    status: "Terisi",
    previousMeter: 105.0,
    currentMeter: 210.0,
  },
  {
    id: "rm-06",
    roomNumber: "Kamar 06",
    tenantName: "",
    whatsapp: "",
    status: "Kosong",
    previousMeter: 500.0,
    currentMeter: 500.0,
  },
];

// Seed initial bills for over-limit rooms
export const DEFAULT_BILLS: Bill[] = [
  {
    id: "bill-01",
    period: "Nov 2026",
    roomId: "rm-03",
    roomNumber: "Kamar 03",
    tenantName: "Rian",
    whatsapp: "081987654321",
    usedKwh: 112.0,
    excessKwh: 12.0,
    totalFine: Math.round(12.0 * 1444.70),
    paid: false,
    createdAt: "2026-11-01T00:00:00.000Z",
  },
  {
    id: "bill-02",
    period: "Nov 2026",
    roomId: "rm-05",
    roomNumber: "Kamar 05",
    tenantName: "Siti",
    whatsapp: "082144332211",
    usedKwh: 105.0,
    excessKwh: 5.0,
    totalFine: Math.round(5.0 * 1444.70),
    paid: false,
    createdAt: "2026-11-01T00:00:00.000Z",
  },
  {
    id: "bill-03",
    period: "Okt 2026",
    roomId: "rm-01",
    roomNumber: "Kamar 01",
    tenantName: "Budi",
    whatsapp: "081234567890",
    usedKwh: 110.0,
    excessKwh: 10.0,
    totalFine: Math.round(10.0 * 1444.70),
    paid: true,
    createdAt: "2026-10-01T00:00:00.000Z",
  },
];

// Calculation Functions
export function calculateUsage(currentMeter: number, previousMeter: number): number {
  const diff = currentMeter - previousMeter;
  return Math.max(0, parseFloat(diff.toFixed(2)));
}

export function determineStatus(usedKwh: number, quota: number): EnergyStatus {
  if (quota <= 0) return "AMAN";
  const pct = (usedKwh / quota) * 100;
  if (pct > 100) return "OVER LIMIT";
  if (pct > 80) return "SIAGA";
  return "AMAN";
}

export function calculateExcess(usedKwh: number, quota: number): number {
  return usedKwh > quota ? parseFloat((usedKwh - quota).toFixed(2)) : 0;
}

export function calculateFine(excessKwh: number, tariffPerKwh: number): number {
  if (excessKwh <= 0) return 0;
  return Math.round(excessKwh * tariffPerKwh);
}

export function formatRupiah(amount: number): string {
  return "Rp " + Math.round(amount).toLocaleString("id-ID");
}

export function formatKwh(value: number): string {
  return value.toLocaleString("id-ID", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
    maximumFractionDigits: 1,
  }) + " kWh";
}

export function generateWaText(
  template: string,
  data: {
    tenantName: string;
    roomNumber: string;
    quota: number;
    usedKwh: number;
    excessKwh: number;
    fineRupiah: number;
  }
): string {
  return template
    .replace(/{nama}/g, data.tenantName || "Penghuni")
    .replace(/{kamar}/g, data.roomNumber)
    .replace(/{kuota}/g, `${data.quota} kWh`)
    .replace(/{total}/g, `${data.usedKwh.toFixed(1)} kWh`)
    .replace(/{kelebihan}/g, `${data.excessKwh.toFixed(1)} kWh`)
    .replace(/{denda}/g, formatRupiah(data.fineRupiah));
}

export function generateWaUrl(whatsapp: string, text: string): string {
  let cleanNumber = whatsapp.replace(/\D/g, "");
  if (cleanNumber.startsWith("0")) {
    cleanNumber = "62" + cleanNumber.slice(1);
  } else if (!cleanNumber.startsWith("62") && cleanNumber.length > 5) {
    cleanNumber = "62" + cleanNumber;
  }
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}

export function getCurrentPeriodName(): string {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
  ];
  const now = new Date();
  return `${months[now.getMonth()]} ${now.getFullYear()}`;
}

