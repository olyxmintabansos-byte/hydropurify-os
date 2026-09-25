"use client";

import React, { useState } from "react";
import { useWater } from "@/context/WaterContext";
import confetti from "canvas-confetti";
import { FlaskConical, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function LabAssayPage() {
  const { labParameters, updateLabParameter } = useWater();

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <div className="border-4 border-black bg-[#00E575] p-6 shadow-[6px_6px_0px_#000]">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black">WATER QUALITY ASSAY STUDIO</h2>
        <p className="text-xs font-bold text-black/80 font-mono mt-1">Pengujian 9 parameter sesuai Permenkes No. 2 Tahun 2023.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {labParameters.map((param) => (
          <div key={param.id} className="border-3 border-black bg-white p-5 shadow-[4px_4px_0px_#000]">
            <h4 className="font-black text-base uppercase">{param.name}</h4>
            <div className="mt-4 p-3 bg-[#FFFDF5] border-2 border-black font-mono">
              <div className="flex justify-between text-xs font-bold">
                <span>Maks: {param.standardLimit} {param.unit}</span>
              </div>
              <input
                type="number"
                value={param.testValue}
                onChange={(e) => updateLabParameter(param.id, parseFloat(e.target.value) || 0)}
                className="w-full mt-2 border-2 border-black bg-[#FFE600]/30 font-black py-1 text-center"
              />
            </div>
            <div className="mt-4 font-black text-sm uppercase">
                {param.isCompliant ? "LULUS" : "GAGAL"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}