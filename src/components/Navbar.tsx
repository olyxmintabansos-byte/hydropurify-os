"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWater } from "@/context/WaterContext";
import {
  Droplets,
  Gauge,
  Receipt,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { plantStatus, telemetry, resetToDefaults } = useWater();

  const navLinks = [
    { href: "/", label: "SCADA TREATMENT CONSOLE", icon: Gauge },
    { href: "/billing", label: "PDAM TARIFF & METERING", icon: Receipt },
  ];

  return (
    <header className="border-b-4 border-black bg-[#FFE600] px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Substation Tag */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-black text-[#00F0FF] border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center font-black">
            <Droplets className="w-7 h-7 text-[#00F0FF]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-black uppercase">
                HydroPurify OS
              </h1>
              <span className="bg-black text-[#FFE600] text-xs font-black px-2 py-0.5 border border-black shadow-[2px_2px_0px_#fff]">
                IPA-250 LPS
              </span>
            </div>
            <p className="text-xs font-bold text-black/80 font-mono">
              PDAM TIRTA KENCANA // WTP CISADANE BANTEN
            </p>
          </div>
        </div>

        {/* Live Telemetry Pill */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="bg-white border-2 border-black px-3 py-1.5 shadow-[3px_3px_0px_#000] flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#00E575] border border-black animate-pulse" />
            <span className="text-xs font-black text-black">
              OUT TURBIDITY: {telemetry.treatedTurbidityNtu} NTU
            </span>
            <span className="text-[10px] bg-[#00F0FF] px-1.5 py-0.5 border border-black font-bold">
              PERMENKES OK
            </span>
          </div>

          <div className="bg-white border-2 border-black px-3 py-1.5 shadow-[3px_3px_0px_#000] flex items-center gap-2 font-mono text-xs font-black">
            <span>pH: {telemetry.treatedPh}</span>
            <span>|</span>
            <span>Cl₂: {telemetry.residualChlorineMgL} mg/L</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 font-black text-xs uppercase border-2 border-black transition-all ${
                  isActive
                    ? "bg-black text-[#FFE600] shadow-none translate-x-[2px] translate-y-[2px]"
                    : "bg-white text-black shadow-[3px_3px_0px_#000] hover:bg-[#00F0FF] hover:-translate-x-0.5 hover:-translate-y-0.5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <button
            onClick={() => {
              if (confirm("Reset simulasi ke kondisi pabrik awal?")) {
                resetToDefaults();
              }
            }}
            title="Reset Parameter Default"
            className="p-2 bg-white text-black border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-[#FF4D4D] hover:text-white transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}