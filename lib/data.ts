export type Status = "Aman" | "Siaga" | "Over Use";
export type Room = { no: number; name: string; wa: string; used: number; prev: number };

export const TARIF = 1444.7;
export const QUOTA = 100;

export const initialRooms: Room[] = [
  { no: 1, name: "Budi", wa: "081254789027", used: 45, prev: 1420.5 },
  { no: 2, name: "Andi", wa: "087647527253", used: 85, prev: 1300 },
  { no: 3, name: "Rian", wa: "087533623564", used: 112, prev: 1100 },
  { no: 4, name: "Eko", wa: "083252635262", used: 10, prev: 10 },
  { no: 5, name: "Joko", wa: "0827372512673", used: 130, prev: 105 },
  { no: 6, name: "Opi", wa: "081200000006", used: 25, prev: 300 },
  { no: 7, name: "Seto", wa: "081200000007", used: 50, prev: 410 },
  { no: 8, name: "Iman", wa: "081200000008", used: 90, prev: 520 },
  { no: 9, name: "Helmi", wa: "081200000009", used: 70, prev: 230 },
  { no: 10, name: "Ahmad", wa: "081200000010", used: 0, prev: 80 },
  { no: 11, name: "Fazil", wa: "081200000011", used: 45, prev: 150 },
  { no: 12, name: "Toni", wa: "081200000012", used: 45, prev: 600 },
];

export const statusOf = (used: number, quota = QUOTA): Status =>
  used > quota ? "Over Use" : used >= quota * 0.8 ? "Siaga" : "Aman";

export const pad = (n: number) => String(n).padStart(2, "0");
export const rupiah = (n: number) => "Rp " + Math.round(n).toLocaleString("id-ID");
export const denda = (kwh: number, tarif = TARIF) => Math.round(Math.max(0, kwh) * tarif);

export const notaText = (r: Room, quota = QUOTA, tarif = TARIF) => {
  const lebih = r.used - quota;
  return `Pemberitahuan Kelebihan Pemakaian Listrik - KostEnergy

Halo ${r.name} (Kamar ${pad(r.no)}),
Berikut rekap penggunaan energi listrik kamar kamu bulan ini:

• Batas Kuota Standar : ${quota} kWh
• Pemakaian Terkini : ${r.used} kWh
• Kelebihan Daya : +${lebih} kWh

Atas kelebihan pemakaian di atas batas standar, dikenakan cas denda sebesar:
👉 ${rupiah(denda(lebih, tarif))}

Mohon nominal denda ini ditransfer bersamaan dengan pembayaran sewa kos bulan ini. Terima kasih!`;
};

export const waLink = (wa: string, text: string) =>
  `https://wa.me/${wa.replace(/^0/, "62")}?text=${encodeURIComponent(text)}`;
