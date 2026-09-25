"use client";

import React, { useState } from "react";
import { useWater } from "@/context/WaterContext";
import { formatNumber } from "@/lib/utils";
import confetti from "canvas-confetti";
import {
  Droplets,
  Activity,
  Sliders,
  AlertOctagon,
  RefreshCw,
  Waves,
  Zap,
  ShieldCheck,
  Flame,
  ArrowRight,
} from "lucide-react";

export default function ScadaConsolePage() {
  const {
    telemetry,
    stages,
    plantStatus,
    setPlantStatus,
    updateDosing,
    triggerBackwash,
  } = useWater();

  const [alumSlider, setAlumSlider] = useState(telemetry.dosingAlumPpm);
  const [chlorineSlider, setChlorineSlider] = useState(telemetry.dosingChlorinePpm);
  const [limeSlider, setLimeSlider] = useState(telemetry.dosingLimePpm);

  const handleApplyDosing = () => {
    updateDosing(alumSlider, chlorineSlider, limeSlider);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#00F0FF", "#FFE600", "#00E575"],
    });
  };

  const getStageColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-[#00E575]";
      case "BACKWASH":
        return "bg-[#FFE600]";
      case "ALARM":
        return "bg-[#FF4D4D] text-white";
      default:
        return "bg-slate-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {/* Hero Headline Banner */}
      <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_#000] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#00F0FF] border-2 border-black px-3 py-1 font-mono text-xs font-black shadow-[3px_3px_0px_#000] mb-3">
            <Activity className="w-4 h-4" />
            TELEMETRI INSTALASI PENGOLAHAN AIR // 250 L/DETIK
          </div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black">
            WTP SCADA COMMAND DECK
          </h2>
          <p className="text-sm font-bold text-black/75 mt-1 max-w-2xl">
            Sistem automasi pengolahan air bersih Sungai Cisadane dengan monitoring turbiditas multi-tahap, kalkulasi kurva koagulasi Jar Test, dan disinfeksi gas klorin otomatis.
          </p>
        </div>

        {/* Emergency Control Toggle */}
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (plantStatus === "EMERGENCY_SHUTDOWN") {
                  setPlantStatus("RUNNING");
                } else {
                  if (confirm("Peringatan: Jalankan Emergency Shutdown seluruh intake pompa?")) {
                    setPlantStatus("EMERGENCY_SHUTDOWN");
                  }
                }
              }}
              className={`w-full md:w-auto px-6 py-3 border-3 border-black font-black text-sm uppercase flex items-center justify-center gap-2 shadow-[4px_4px_0px_#000] transition-all active:translate-x-1 active:translate-y-1 ${
                plantStatus === "EMERGENCY_SHUTDOWN"
                  ? "bg-[#00E575] text-black hover:bg-[#00c765]"
                  : "bg-[#FF4D4D] text-white hover:bg-red-600"
              }`}
            >
              <AlertOctagon className="w-5 h-5" />
              {plantStatus === "EMERGENCY_SHUTDOWN" ? "RESUME ALL PUMPS" : "EMERGENCY SHUTDOWN"}
            </button>
          </div>
          <span className="text-[11px] font-mono font-bold text-center text-black/60">
            STATUS: {plantStatus} // {telemetry.timestamp}
          </span>
        </div>
      </div>

      {/* 4 Critical Key Performance Gauges (Neo-Brutalist Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gauge 1: Kekeruhan Air Baku vs Olahan */}
        <div className="border-3 border-black bg-[#FFE600] p-4 shadow-[5px_5px_0px_#000]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs font-black uppercase text-black">
              OUT TURBIDITY (NTU)
            </span>
            <span className="bg-black text-[#FFE600] text-[10px] font-black px-1.5 py-0.5 border border-black">
              BAKU &lt; 2.0
            </span>
          </div>
          <div className="text-4xl font-black tracking-tight text-black font-mono">
            {formatNumber(telemetry.treatedTurbidityNtu, 2)}
          </div>
          <div className="mt-3 pt-2 border-t-2 border-black flex justify-between text-xs font-bold font-mono">
            <span>Air Baku: {telemetry.rawTurbidityNtu} NTU</span>
            <span className="text-black font-black">
              Efisiensi: {(((telemetry.rawTurbidityNtu - telemetry.treatedTurbidityNtu) / telemetry.rawTurbidityNtu) * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Gauge 2: Sisa Klor Bebas */}
        <div className="border-3 border-black bg-[#00F0FF] p-4 shadow-[5px_5px_0px_#000]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs font-black uppercase text-black">
              CHLORINE RESIDUAL
            </span>
            <span className="bg-black text-[#00F0FF] text-[10px] font-black px-1.5 py-0.5 border border-black">
              0.2 - 0.5 mg/L
            </span>
          </div>
          <div className="text-4xl font-black tracking-tight text-black font-mono">
            {formatNumber(telemetry.residualChlorineMgL, 2)}{" "}
            <span className="text-xl">mg/L</span>
          </div>
          <div className="mt-3 pt-2 border-t-2 border-black flex justify-between text-xs font-bold font-mono">
            <span>Dosis Injeksi: {telemetry.dosingChlorinePpm} ppm</span>
            <span className="bg-[#00E575] px-1 border border-black">BEBAS BAKTERI</span>
          </div>
        </div>

        {/* Gauge 3: pH Balance */}
        <div className="border-3 border-black bg-[#D4B2FF] p-4 shadow-[5px_5px_0px_#000]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs font-black uppercase text-black">
              WATER PH BALANCE
            </span>
            <span className="bg-black text-[#D4B2FF] text-[10px] font-black px-1.5 py-0.5 border border-black">
              NETRAL 7.0
            </span>
          </div>
          <div className="text-4xl font-black tracking-tight text-black font-mono">
            {formatNumber(telemetry.treatedPh, 2)}
          </div>
          <div className="mt-3 pt-2 border-t-2 border-black flex justify-between text-xs font-bold font-mono">
            <span>Raw pH: {telemetry.rawPh}</span>
            <span>Kapur: {telemetry.dosingLimePpm} ppm</span>
          </div>
        </div>

        {/* Gauge 4: Total Produksi Hari Ini */}
        <div className="border-3 border-black bg-[#00E575] p-4 shadow-[5px_5px_0px_#000]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs font-black uppercase text-black">
              DEBIT INSTALASI
            </span>
            <span className="bg-black text-[#00E575] text-[10px] font-black px-1.5 py-0.5 border border-black">
              250 L/S
            </span>
          </div>
          <div className="text-3xl font-black tracking-tight text-black font-mono">
            {formatNumber(telemetry.flowRateLps, 1)}{" "}
            <span className="text-lg">L/s</span>
          </div>
          <div className="mt-3 pt-2 border-t-2 border-black flex justify-between text-xs font-bold font-mono">
            <span>Akumulasi:</span>
            <span className="font-black">{telemetry.dailyProducedM3.toLocaleString()} M³</span>
          </div>
        </div>
      </div>

      {/* Main Process Stages Pipeline (6 Tahapan Air) */}
      <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_#000] space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 border-b-3 border-black pb-3">
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight">
              DIAGRAM ALUR 6 TAHAP PENGOLAHAN (WATER PURIFICATION TRAIN)
            </h3>
            <p className="text-xs font-bold text-black/70 font-mono">
              Status hidrolis tiap basin dan bak filtrasi dengan indikator retensi waktu dan backwash interaktif.
            </p>
          </div>
          <span className="bg-black text-[#00F0FF] text-xs font-mono font-black px-3 py-1 border border-black shadow-[2px_2px_0px_#000]">
            TRAIN-A // ONLINE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stages.map((stg, idx) => (
            <div
              key={stg.id}
              className="border-3 border-black bg-[#FFFDF5] p-4 shadow-[4px_4px_0px_#000] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="bg-black text-white text-xs font-mono font-black px-2 py-0.5 border border-black">
                    {stg.code}
                  </span>
                  <span
                    className={`text-[11px] font-black px-2 py-0.5 border-2 border-black font-mono ${getStageColor(
                      stg.status
                    )}`}
                  >
                    {stg.status}
                  </span>
                </div>

                <h4 className="font-black text-base text-black uppercase leading-tight">
                  {stg.name}
                </h4>

                <div className="mt-3 space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between border-b border-black/20 pb-1">
                    <span className="text-black/70">Waktu Retensi:</span>
                    <span className="font-bold">{stg.nominalRetentionMin} Menit</span>
                  </div>
                  <div className="flex justify-between border-b border-black/20 pb-1">
                    <span className="text-black/70">Debit In / Out:</span>
                    <span className="font-bold">
                      {stg.inflowM3h} / {stg.outflowM3h} M³/h
                    </span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-black/70">{stg.primaryParameter}:</span>
                    <span className="font-black text-black">
                      {stg.primaryValue} {stg.unit}
                    </span>
                  </div>
                </div>

                {/* Level Water Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] font-mono font-bold mb-1">
                    <span>Level Bak:</span>
                    <span>{stg.currentLevelPct}%</span>
                  </div>
                  <div className="w-full h-4 bg-white border-2 border-black overflow-hidden shadow-[2px_2px_0px_#000]">
                    <div
                      className="h-full bg-[#00F0FF] border-r-2 border-black transition-all duration-500"
                      style={{ width: `${stg.currentLevelPct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Backwash / Action Button for Filter */}
              {stg.id === "FILTRATION" && (
                <button
                  onClick={() => triggerBackwash(stg.id)}
                  disabled={stg.status === "BACKWASH"}
                  className="mt-4 w-full py-2 bg-[#FFE600] hover:bg-[#ffe100] text-black border-2 border-black font-black text-xs uppercase shadow-[3px_3px_0px_#000] active:translate-x-1 active:translate-y-1 transition-all disabled:opacity-50"
                >
                  {stg.status === "BACKWASH" ? "SEDANG MENCUCI..." : "LAKUKAN BACKWASH FILTER"}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dosing Chemical Console & Jar Test Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chemical Dosing Sliders (2 Columns) */}
        <div className="lg:col-span-2 border-4 border-black bg-white p-6 shadow-[6px_6px_0px_#000] space-y-4">
          <div className="flex items-center justify-between border-b-3 border-black pb-3">
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight">
                KONSOL DOSING KIMIAWI & JAR TEST SOLVER
              </h3>
              <p className="text-xs font-bold text-black/70 font-mono">
                Atur dosis koagulan PAC, gas klorin, dan kapur padam untuk menjaga stabilitas air baku.
              </p>
            </div>
            <Sliders className="w-6 h-6 text-black" />
          </div>

          <div className="space-y-4 font-mono">
            {/* Slider 1: Alum / PAC */}
            <div className="border-2 border-black p-3 bg-[#FFE600]/20 shadow-[3px_3px_0px_#000]">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-black uppercase text-black">
                  1. Dosis Koagulan PAC (Poli-Aluminium Klorida)
                </label>
                <span className="font-black bg-black text-[#FFE600] px-2 py-0.5 text-xs">
                  {alumSlider} PPM
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="0.5"
                value={alumSlider}
                onChange={(e) => setAlumSlider(parseFloat(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-black/70 font-bold mt-1">
                <span>10 ppm (Air Jernih)</span>
                <span>Target Jar Test: 28.5 ppm</span>
                <span>60 ppm (Banjir Ekstrem)</span>
              </div>
            </div>

            {/* Slider 2: Chlorine Disinfection */}
            <div className="border-2 border-black p-3 bg-[#00F0FF]/20 shadow-[3px_3px_0px_#000]">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-black uppercase text-black">
                  2. Dosis Injeksi Gas Klorin (Cl₂)
                </label>
                <span className="font-black bg-black text-[#00F0FF] px-2 py-0.5 text-xs">
                  {chlorineSlider} PPM
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.1"
                value={chlorineSlider}
                onChange={(e) => setChlorineSlider(parseFloat(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-black/70 font-bold mt-1">
                <span>0.5 ppm</span>
                <span>Standar Sisa Klor: 0.35 mg/L</span>
                <span>5.0 ppm</span>
              </div>
            </div>

            {/* Slider 3: Hydrated Lime */}
            <div className="border-2 border-black p-3 bg-[#D4B2FF]/20 shadow-[3px_3px_0px_#000]">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-black uppercase text-black">
                  3. Dosis Kapur Padam Ca(OH)₂ (Penstabil pH)
                </label>
                <span className="font-black bg-black text-[#D4B2FF] px-2 py-0.5 text-xs">
                  {limeSlider} PPM
                </span>
              </div>
              <input
                type="range"
                min="2.0"
                max="20.0"
                step="0.5"
                value={limeSlider}
                onChange={(e) => setLimeSlider(parseFloat(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-black/70 font-bold mt-1">
                <span>2.0 ppm</span>
                <span>Target Netral: 7.2 pH</span>
                <span>20.0 ppm</span>
              </div>
            </div>

            <button
              onClick={handleApplyDosing}
              className="w-full py-3 bg-black hover:bg-neutral-800 text-[#FFE600] font-black text-sm uppercase border-2 border-black shadow-[4px_4px_0px_#FFE600] hover:shadow-[6px_6px_0px_#FFE600] transition-all active:translate-x-1 active:translate-y-1"
            >
              APLIKASIKAN DOSING DOSER POMPA SCADA
            </button>
          </div>
        </div>

        {/* Jar Test Reference Table (1 Column) */}
        <div className="border-4 border-black bg-[#FFE600] p-6 shadow-[6px_6px_0px_#000] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b-2 border-black pb-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-black" />
              <h4 className="font-black text-sm uppercase text-black">
                TABEL STANDAR PERMENKES 2/2023
              </h4>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="bg-white border-2 border-black p-2 shadow-[2px_2px_0px_#000]">
                <div className="text-[10px] text-black/70 font-bold">PARAMETER KEKERUHAN:</div>
                <div className="font-black text-sm text-black">Maks. 2.0 NTU</div>
                <div className="text-[10px] text-[#00E575] font-black bg-black px-1 mt-1 inline-block">
                  STATUS: AMAN ({telemetry.treatedTurbidityNtu} NTU)
                </div>
              </div>

              <div className="bg-white border-2 border-black p-2 shadow-[2px_2px_0px_#000]">
                <div className="text-[10px] text-black/70 font-bold">DERAJAT KEASAMAN (pH):</div>
                <div className="font-black text-sm text-black">Rentang 6.5 - 8.5</div>
                <div className="text-[10px] text-[#00E575] font-black bg-black px-1 mt-1 inline-block">
                  STATUS: NORMAL ({telemetry.treatedPh})
                </div>
              </div>

              <div className="bg-white border-2 border-black p-2 shadow-[2px_2px_0px_#000]">
                <div className="text-[10px] text-black/70 font-bold">TOTAL COLIFORM:</div>
                <div className="font-black text-sm text-black">0 CFU / 100 mL</div>
                <div className="text-[10px] text-[#00E575] font-black bg-black px-1 mt-1 inline-block">
                  STATUS: 100% STERIL
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t-2 border-black text-[11px] font-mono font-bold text-black/80">
            *Laboratorium Terakreditasi KAN LP-482-IDN // Pengujian berkala tiap 2 jam sekali.
          </div>
        </div>
      </div>
    </div>
  );
}