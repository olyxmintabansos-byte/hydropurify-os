"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Droplets, Gauge, Receipt, FlaskConical, Printer } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "SCADA", href: "/", icon: Gauge },
    { name: "BILLING", href: "/billing/", icon: Receipt },
    { name: "LAB", href: "/lab/", icon: FlaskConical },
    { name: "SURAT", href: "/surat/", icon: Printer },
  ];

  return (
    <nav className="border-b-4 border-black bg-[#FFE600] p-4 flex items-center justify-between shadow-[0_4px_0_#000]">
      <div className="flex items-center gap-2">
        <Droplets className="w-8 h-8 text-black" />
        <h1 className="text-xl font-black uppercase tracking-tight text-black">HydroPurify OS</h1>
      </div>
      <div className="flex gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`px-4 py-2 font-black text-xs uppercase border-3 border-black shadow-[3px_3px_0px_#000] flex items-center gap-2 transition-all ${
                isActive ? "bg-black text-[#FFE600] translate-x-0.5 translate-y-0.5 shadow-none" : "bg-white text-black hover:bg-slate-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}