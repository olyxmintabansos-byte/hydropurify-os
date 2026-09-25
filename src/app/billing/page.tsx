"use client";

import React, { useState } from "react";
import { useWater } from "@/context/WaterContext";
import { formatRupiah, formatNumber } from "@/lib/utils";
import confetti from "canvas-confetti";
import {
  Receipt,
  Users,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileSpreadsheet,
  Printer,
} from "lucide-react";
import { TariffCategory, WaterCustomer } from "@/types/water";

export default function BillingPage() {
  const { customers, updateCustomerMeter, addNewCustomer } = useWater();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [selectedCust, setSelectedCust] = useState<WaterCustomer | null>(null);

  // New Customer Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [formName, setFormName] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formCategory, setFormCategory] = useState<TariffCategory>("R2_RUMAH_TANGGA");
  const [formPrevMeter, setFormPrevMeter] = useState(100);
  const [formCurrentMeter, setFormCurrentMeter] = useState(125);

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.accountNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.meterSerial.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = filterCategory === "ALL" || c.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  const totalBillCollected = customers
    .filter((c) => c.paymentStatus === "PAID")
    .reduce((acc, c) => acc + c.totalBillIdr, 0);

  const totalOutstanding = customers
    .filter((c) => c.paymentStatus !== "PAID")
    .reduce((acc, c) => acc + c.totalBillIdr, 0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formAddress) return;

    addNewCustomer({
      accountNo: `PAM-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      name: formName,
      address: formAddress,
      category: formCategory,
      meterPrevM3: formPrevMeter,
      meterCurrentM3: formCurrentMeter,
      ratePerM3: formCategory === "I1_INDUSTRI_BESAR" ? 12500 : 4500,
      baseChargeIdr: 25000,
      retributionIdr: 5000,
      paymentStatus: "UNPAID",
      meterSerial: `MTR-NEW-${Math.floor(1000 + Math.random() * 9000)}`,
    });

    setShowAddModal(false);
    setFormName("");
    setFormAddress("");
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {/* Top Banner */}
      <div className="border-4 border-black bg-[#00F0FF] p-6 shadow-[6px_6px_0px_#000] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-black text-[#00F0FF] px-3 py-1 font-mono text-xs font-black border border-black shadow-[2px_2px_0px_#fff] mb-2">
            <Receipt className="w-4 h-4" />
            LOKET REKENING AIR PDAM TIRTA KENCANA
          </div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black">
            WATER METERING & REKENING BILLING
          </h2>
          <p className="text-xs font-bold text-black/80 font-mono mt-1">
            Penetapan tarif progresif sesuai SK Walikota No. 42/2025. Perhitungan abodemen, pemeliharaan meter, dan cetak faktur.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 bg-[#FFE600] hover:bg-[#ffe100] text-black font-black text-xs uppercase border-3 border-black shadow-[4px_4px_0px_#000] flex items-center gap-2 active:translate-x-1 active:translate-y-1 transition-all"
        >
          <Plus className="w-4 h-4" />
          PASANG SAMBUNGAN BARU
        </button>
      </div>

      {/* Revenue & Water Volume Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border-3 border-black bg-white p-4 shadow-[4px_4px_0px_#000]">
          <span className="font-mono text-xs font-black uppercase text-black/70">
            TOTAL PELANGGAN AKTIF
          </span>
          <div className="text-3xl font-black font-mono mt-1">{customers.length} SR</div>
          <span className="text-[11px] font-bold text-[#00E575] bg-black px-1.5 py-0.5 mt-2 inline-block">
            100% TERHUBUNG METER
          </span>
        </div>

        <div className="border-3 border-black bg-[#00E575] p-4 shadow-[4px_4px_0px_#000]">
          <span className="font-mono text-xs font-black uppercase text-black">
            TAGIHAN TERBAYAR (KAS PDAM)
          </span>
          <div className="text-2xl font-black font-mono mt-1 text-black">
            {formatRupiah(totalBillCollected)}
          </div>
          <span className="text-[11px] font-black text-black">
            Lunas {customers.filter((c) => c.paymentStatus === "PAID").length} Rekening
          </span>
        </div>

        <div className="border-3 border-black bg-[#FF4D4D] text-white p-4 shadow-[4px_4px_0px_#000]">
          <span className="font-mono text-xs font-black uppercase text-white/80">
            PIUTANG AIR TERTUNGGAK
          </span>
          <div className="text-2xl font-black font-mono mt-1 text-white">
            {formatRupiah(totalOutstanding)}
          </div>
          <span className="text-[11px] font-black text-black bg-white px-1.5 py-0.5 mt-2 inline-block">
            Menunggu Pembayaran Loket
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="border-3 border-black bg-white p-4 shadow-[4px_4px_0px_#000] flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[260px] relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-black/50" />
          <input
            type="text"
            placeholder="Cari No. Rekening, Nama Pelanggan, atau Serial Meter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-black font-mono text-xs font-bold focus:outline-none focus:bg-[#FFE600]/20"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {["ALL", "R2_RUMAH_TANGGA", "R1_SOSIAL", "I1_INDUSTRI_BESAR", "N1_NIAGA_KECIL"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 border-2 border-black font-mono text-[11px] font-black uppercase transition-all ${
                filterCategory === cat
                  ? "bg-black text-[#FFE600] shadow-none translate-x-0.5 translate-y-0.5"
                  : "bg-white text-black shadow-[2px_2px_0px_#000] hover:bg-slate-100"
              }`}
            >
              {cat.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Table of Customers */}
      <div className="border-4 border-black bg-white shadow-[6px_6px_0px_#000] overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-4 border-black bg-[#FFE600] font-mono text-xs font-black uppercase text-black">
              <th className="p-3 border-r-2 border-black">NO. REKENING</th>
              <th className="p-3 border-r-2 border-black">PELANGGAN / ALAMAT</th>
              <th className="p-3 border-r-2 border-black">GOLONGAN</th>
              <th className="p-3 border-r-2 border-black text-center">METER LALU</th>
              <th className="p-3 border-r-2 border-black text-center">METER KINI</th>
              <th className="p-3 border-r-2 border-black text-center">PAKAI (M³)</th>
              <th className="p-3 border-r-2 border-black text-right">TOTAL TAGIHAN</th>
              <th className="p-3 border-r-2 border-black text-center">STATUS</th>
              <th className="p-3 text-center">AKSI</th>
            </tr>
          </thead>
          <tbody className="font-mono text-xs divide-y-2 divide-black">
            {filteredCustomers.map((cust) => (
              <tr key={cust.id} className="hover:bg-[#FFFDF5]">
                <td className="p-3 border-r-2 border-black font-black">
                  {cust.accountNo}
                  <div className="text-[10px] text-black/60 font-normal">SN: {cust.meterSerial}</div>
                </td>
                <td className="p-3 border-r-2 border-black">
                  <div className="font-black text-black">{cust.name}</div>
                  <div className="text-[10px] text-black/60">{cust.address}</div>
                </td>
                <td className="p-3 border-r-2 border-black">
                  <span className="bg-black text-white px-2 py-0.5 text-[10px] font-black border border-black">
                    {cust.category}
                  </span>
                </td>
                <td className="p-3 border-r-2 border-black text-center font-bold">
                  {cust.meterPrevM3}
                </td>
                <td className="p-3 border-r-2 border-black text-center">
                  <input
                    type="number"
                    value={cust.meterCurrentM3}
                    onChange={(e) => updateCustomerMeter(cust.id, parseInt(e.target.value) || 0)}
                    className="w-20 text-center border-2 border-black bg-[#FFE600]/30 font-black py-1 focus:bg-[#FFE600]"
                  />
                </td>
                <td className="p-3 border-r-2 border-black text-center font-black text-sm bg-slate-50">
                  {cust.usageM3} M³
                </td>
                <td className="p-3 border-r-2 border-black text-right font-black text-black">
                  {formatRupiah(cust.totalBillIdr)}
                </td>
                <td className="p-3 border-r-2 border-black text-center">
                  <span
                    className={`px-2 py-1 border-2 border-black text-[10px] font-black ${
                      cust.paymentStatus === "PAID"
                        ? "bg-[#00E575] text-black"
                        : cust.paymentStatus === "OVERDUE"
                        ? "bg-[#FF4D4D] text-white"
                        : "bg-[#FFE600] text-black"
                    }`}
                  >
                    {cust.paymentStatus}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => {
                      setSelectedCust(cust);
                      confetti({ particleCount: 30, spread: 50 });
                    }}
                    className="px-3 py-1 bg-black text-[#00F0FF] hover:text-[#FFE600] text-[10px] font-black uppercase border border-black shadow-[2px_2px_0px_#00F0FF] active:translate-x-0.5 active:translate-y-0.5"
                  >
                    FAKTUR
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invoice Modal Preview */}
      {selectedCust && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="border-4 border-black bg-white max-w-lg w-full p-6 shadow-[8px_8px_0px_#000] space-y-4">
            <div className="flex items-center justify-between border-b-3 border-black pb-3">
              <div>
                <h3 className="font-black text-lg uppercase text-black">
                  REKENING RESMI PEMAKAIAN AIR
                </h3>
                <p className="text-[10px] font-mono font-bold text-black/60">
                  PDAM TIRTA KENCANA // KANTOR PUSAT BANTEN
                </p>
              </div>
              <button
                onClick={() => setSelectedCust(null)}
                className="font-black text-lg border-2 border-black px-2 py-0.5 bg-[#FF4D4D] text-white"
              >
                ✕
              </button>
            </div>

            <div className="font-mono text-xs space-y-2 border-2 border-black p-3 bg-[#FFFDF5]">
              <div className="flex justify-between">
                <span className="text-black/60">No. Rekening:</span>
                <span className="font-black">{selectedCust.accountNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60">Nama Pelanggan:</span>
                <span className="font-black">{selectedCust.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60">Golongan Tarif:</span>
                <span className="font-black">{selectedCust.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60">Pemakaian Air:</span>
                <span className="font-black">
                  {selectedCust.meterCurrentM3} - {selectedCust.meterPrevM3} = {selectedCust.usageM3} M³
                </span>
              </div>
              <div className="border-t border-black/30 pt-2 flex justify-between font-black text-sm">
                <span>TOTAL HARUS DIBAYAR:</span>
                <span className="text-[#FF4D4D]">{formatRupiah(selectedCust.totalBillIdr)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 bg-[#FFE600] text-black border-2 border-black font-black text-xs uppercase shadow-[3px_3px_0px_#000] flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" /> CETAK STRUK PDF
              </button>
              <button
                onClick={() => setSelectedCust(null)}
                className="px-4 py-2 bg-black text-white border-2 border-black font-black text-xs uppercase"
              >
                TUTUP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleAddSubmit}
            className="border-4 border-black bg-white max-w-md w-full p-6 shadow-[8px_8px_0px_#000] space-y-4"
          >
            <div className="flex items-center justify-between border-b-3 border-black pb-2">
              <h3 className="font-black text-base uppercase">PASANG SAMBUNGAN METER BARU</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="font-black text-base border-2 border-black px-2 bg-[#FF4D4D] text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="font-black block mb-1">NAMA LENGKAP PELANGGAN:</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-2 border-2 border-black font-bold focus:bg-[#FFE600]/20"
                />
              </div>

              <div>
                <label className="font-black block mb-1">ALAMAT LENGKAP PASANG:</label>
                <input
                  type="text"
                  required
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  className="w-full p-2 border-2 border-black font-bold focus:bg-[#FFE600]/20"
                />
              </div>

              <div>
                <label className="font-black block mb-1">KATEGORI GOLONGAN TARIF:</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as TariffCategory)}
                  className="w-full p-2 border-2 border-black font-bold bg-white"
                >
                  <option value="R2_RUMAH_TANGGA">R2 - RUMAH TANGGA</option>
                  <option value="R1_SOSIAL">R1 - SOSIAL (RS/Masjid)</option>
                  <option value="R3_MENENGAH">R3 - MENENGAH</option>
                  <option value="N1_NIAGA_KECIL">N1 - NIAGA KECIL</option>
                  <option value="I1_INDUSTRI_BESAR">I1 - INDUSTRI BESAR</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-black block mb-1">METER AWAL:</label>
                  <input
                    type="number"
                    value={formPrevMeter}
                    onChange={(e) => setFormPrevMeter(parseInt(e.target.value) || 0)}
                    className="w-full p-2 border-2 border-black font-bold"
                  />
                </div>
                <div>
                  <label className="font-black block mb-1">METER KINI:</label>
                  <input
                    type="number"
                    value={formCurrentMeter}
                    onChange={(e) => setFormCurrentMeter(parseInt(e.target.value) || 0)}
                    className="w-full p-2 border-2 border-black font-bold"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#00E575] hover:bg-[#00c765] text-black font-black text-xs uppercase border-3 border-black shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 transition-all"
            >
              SIMPAN SAMBUNGAN BARU
            </button>
          </form>
        </div>
      )}
    </div>
  );
}