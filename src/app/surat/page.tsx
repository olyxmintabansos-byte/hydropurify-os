"use client";

import React from "react";
import { useWater } from "@/context/WaterContext";
import { Printer } from "lucide-react";

export default function CertificateA4Page() {
  const { labParameters, certificate } = useWater();

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      <div className="border-4 border-black bg-[#FFE600] p-4 shadow-[6px_6px_0px_#000] print:hidden">
        <h2 className="text-xl font-black uppercase text-black">STUDIO DOKUMEN RESMI A4</h2>
        <button onClick={() => window.print()} className="mt-2 px-6 py-2 bg-black text-[#FFE600] font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-2">
            <Printer className="w-4 h-4" /> CETAK
        </button>
      </div>

      <div className="border-4 border-black bg-white p-12 shadow-[8px_8px_0px_#000] font-sans">
        <h1 className="text-2xl font-black uppercase text-center underline">LAPORAN HASIL UJI LABORATORIUM</h1>
        <div className="mt-6 border-2 border-black p-4 font-mono text-xs">
          <div>Nomor Sertifikat: {certificate.certificateNo}</div>
          <div>Lokasi Sampling: {certificate.samplingLocation}</div>
        </div>
        <table className="w-full mt-6 border-2 border-black">
          <thead>
            <tr className="bg-[#FFE600] border-b-2 border-black text-black text-left">
              <th className="p-2">PARAMETER</th>
              <th className="p-2">HASIL</th>
              <th className="p-2">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {labParameters.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.testValue} {p.unit}</td>
                <td className="p-2 font-black">{p.isCompliant ? "MS" : "TMS"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}