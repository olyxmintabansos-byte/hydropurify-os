import type { Metadata } from "next";
import "./globals.css";
import { WaterProvider } from "@/context/WaterContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "HydroPurify OS // Industrial Neo-Brutalism Water SCADA & Billing",
  description:
    "Municipal Water Treatment Plant SCADA, Turbidity Telemetry, Chlorine Dosing Curve & PDAM Tariff Metering System.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col bg-[#FFFDF5] text-black antialiased selection:bg-[#FFE600] selection:text-black">
        <WaterProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t-4 border-black bg-black text-white py-6 px-4">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#FFE600] border border-white inline-block"></span>
                <span className="font-black text-[#FFE600]">HYDROPURIFY OS (TITAN #22)</span>
                <span>• STANDAR BAKU MUTU PERMENKES NO. 2/2023</span>
              </div>
              <div className="text-slate-400">
                INDUSTRIAL NEO-BRUTALISM ARCHITECTURE // SOVEREIGN FLEET OLYXMINTABANSOS
              </div>
            </div>
          </footer>
        </WaterProvider>
      </body>
    </html>
  );
}