"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  ProcessStage,
  WaterQualityTelemetry,
  WaterCustomer,
  TariffCategory,
} from "@/types/water";

interface WaterContextType {
  telemetry: WaterQualityTelemetry;
  stages: ProcessStage[];
  customers: WaterCustomer[];
  plantStatus: "RUNNING" | "OPTIMIZING" | "EMERGENCY_SHUTDOWN";
  setPlantStatus: (status: "RUNNING" | "OPTIMIZING" | "EMERGENCY_SHUTDOWN") => void;
  updateDosing: (alum: number, chlorine: number, lime: number) => void;
  triggerBackwash: (stageId: string) => void;
  updateCustomerMeter: (id: string, newCurrentMeter: number) => void;
  addNewCustomer: (customer: Omit<WaterCustomer, "id" | "usageM3" | "waterBillIdr" | "totalBillIdr">) => void;
  resetToDefaults: () => void;
}

const INITIAL_STAGES: ProcessStage[] = [
  {
    id: "INTAKE",
    name: "Intake Kali Cisadane",
    code: "STG-01",
    nominalRetentionMin: 15,
    currentLevelPct: 84,
    inflowM3h: 900,
    outflowM3h: 900,
    status: "ACTIVE",
    primaryParameter: "Kekeruhan Alami",
    primaryValue: 245.5,
    unit: "NTU",
    thresholdMax: 500,
  },
  {
    id: "COAGULATION",
    name: "Koagulasi Rapid Mix (PAC)",
    code: "STG-02",
    nominalRetentionMin: 5,
    currentLevelPct: 78,
    inflowM3h: 900,
    outflowM3h: 890,
    status: "ACTIVE",
    primaryParameter: "Dosis Koagulan",
    primaryValue: 28.4,
    unit: "ppm",
    thresholdMax: 50,
  },
  {
    id: "SEDIMENTATION",
    name: "Flokulasi & Sedimentasi Clarifier",
    code: "STG-03",
    nominalRetentionMin: 120,
    currentLevelPct: 92,
    inflowM3h: 890,
    outflowM3h: 885,
    status: "ACTIVE",
    primaryParameter: "Ketebalan Lumpur Flok",
    primaryValue: 34.2,
    unit: "cm",
    thresholdMax: 80,
  },
  {
    id: "FILTRATION",
    name: "Rapid Sand Dual-Media Filter",
    code: "STG-04",
    nominalRetentionMin: 20,
    currentLevelPct: 65,
    inflowM3h: 885,
    outflowM3h: 880,
    status: "ACTIVE",
    primaryParameter: "Loss of Head (Delta P)",
    primaryValue: 1.4,
    unit: "bar",
    thresholdMax: 2.2,
  },
  {
    id: "CHLORINATION",
    name: "Disinfeksi Gas Klorin (Cl2)",
    code: "STG-05",
    nominalRetentionMin: 30,
    currentLevelPct: 88,
    inflowM3h: 880,
    outflowM3h: 880,
    status: "ACTIVE",
    primaryParameter: "Sisa Klor Bebas",
    primaryValue: 0.38,
    unit: "mg/L",
    thresholdMax: 0.8,
  },
  {
    id: "RESERVOIR",
    name: "Clear Water Reservoir 5000 M3",
    code: "STG-06",
    nominalRetentionMin: 240,
    currentLevelPct: 79,
    inflowM3h: 880,
    outflowM3h: 850,
    status: "ACTIVE",
    primaryParameter: "Kekeruhan Akhir",
    primaryValue: 0.82,
    unit: "NTU",
    thresholdMax: 2.0,
  },
];

const INITIAL_TELEMETRY: WaterQualityTelemetry = {
  timestamp: "18:45:00 WIB",
  rawTurbidityNtu: 245.5,
  treatedTurbidityNtu: 0.82,
  rawPh: 6.72,
  treatedPh: 7.24,
  residualChlorineMgL: 0.38,
  dissolvedOxygenMgL: 6.8,
  tdsPpm: 142.0,
  totalColiformCfu: 0,
  dosingAlumPpm: 28.5,
  dosingChlorinePpm: 2.4,
  dosingLimePpm: 8.2,
  flowRateLps: 244.5,
  dailyProducedM3: 14850,
};

const INITIAL_CUSTOMERS: WaterCustomer[] = [
  {
    id: "CUST-001",
    accountNo: "PAM-2026-08129",
    name: "Haji Sulaiman Effendi",
    address: "Jl. Cisadane Raya No. 45 RT 02/05",
    category: "R2_RUMAH_TANGGA",
    meterPrevM3: 412,
    meterCurrentM3: 438,
    usageM3: 26,
    ratePerM3: 4500,
    baseChargeIdr: 25000,
    waterBillIdr: 117000,
    retributionIdr: 5000,
    totalBillIdr: 147000,
    paymentStatus: "PAID",
    meterSerial: "MTR-ITR-9921",
  },
  {
    id: "CUST-002",
    accountNo: "PAM-2026-09418",
    name: "RSUD Tirta Husada Tangerang",
    address: "Jl. Veteran No. 12 Blok B",
    category: "R1_SOSIAL",
    meterPrevM3: 3120,
    meterCurrentM3: 3680,
    usageM3: 560,
    ratePerM3: 2500,
    baseChargeIdr: 50000,
    waterBillIdr: 1400000,
    retributionIdr: 10000,
    totalBillIdr: 1460000,
    paymentStatus: "PAID",
    meterSerial: "MTR-ACT-4410",
  },
  {
    id: "CUST-003",
    accountNo: "PAM-2026-10294",
    name: "PT Indofood Tirta Kemasan",
    address: "Kawasan Industri Manis Blok C4",
    category: "I1_INDUSTRI_BESAR",
    meterPrevM3: 14200,
    meterCurrentM3: 16450,
    usageM3: 2250,
    ratePerM3: 12500,
    baseChargeIdr: 250000,
    waterBillIdr: 28125000,
    retributionIdr: 25000,
    totalBillIdr: 28400000,
    paymentStatus: "UNPAID",
    meterSerial: "MTR-SCH-8822",
  },
  {
    id: "CUST-004",
    accountNo: "PAM-2026-11847",
    name: "Warung Kopi & Resto Babakan",
    address: "Jl. Perintis Kemerdekaan No. 8",
    category: "N1_NIAGA_KECIL",
    meterPrevM3: 540,
    meterCurrentM3: 615,
    usageM3: 75,
    ratePerM3: 7800,
    baseChargeIdr: 45000,
    waterBillIdr: 585000,
    retributionIdr: 8000,
    totalBillIdr: 638000,
    paymentStatus: "OVERDUE",
    meterSerial: "MTR-ITR-3321",
  },
  {
    id: "CUST-005",
    accountNo: "PAM-2026-12003",
    name: "Komplek Perum Graha Asri Blok D",
    address: "Jl. Asri Boulevard No. 1",
    category: "R3_MENENGAH",
    meterPrevM3: 820,
    meterCurrentM3: 895,
    usageM3: 75,
    ratePerM3: 6200,
    baseChargeIdr: 35000,
    waterBillIdr: 465000,
    retributionIdr: 6000,
    totalBillIdr: 506000,
    paymentStatus: "PAID",
    meterSerial: "MTR-ITR-7744",
  },
];

const TARIFF_RATES: Record<TariffCategory, { rate: number; base: number }> = {
  R1_SOSIAL: { rate: 2500, base: 50000 },
  R2_RUMAH_TANGGA: { rate: 4500, base: 25000 },
  R3_MENENGAH: { rate: 6200, base: 35000 },
  N1_NIAGA_KECIL: { rate: 7800, base: 45000 },
  I1_INDUSTRI_BESAR: { rate: 12500, base: 250000 },
};

const WaterContext = createContext<WaterContextType | undefined>(undefined);

export function WaterProvider({ children }: { children: React.ReactNode }) {
  const [telemetry, setTelemetry] = useState<WaterQualityTelemetry>(INITIAL_TELEMETRY);
  const [stages, setStages] = useState<ProcessStage[]>(INITIAL_STAGES);
  const [customers, setCustomers] = useState<WaterCustomer[]>(INITIAL_CUSTOMERS);
  const [plantStatus, setPlantStatus] = useState<"RUNNING" | "OPTIMIZING" | "EMERGENCY_SHUTDOWN">("RUNNING");

  // Load from LocalStorage
  useEffect(() => {
    try {
      const savedCust = localStorage.getItem("hydropurify_customers");
      if (savedCust) setCustomers(JSON.parse(savedCust));
      const savedTelem = localStorage.getItem("hydropurify_telemetry");
      if (savedTelem) setTelemetry(JSON.parse(savedTelem));
    } catch (e) {
      console.error("Failed to load localstorage data:", e);
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem("hydropurify_customers", JSON.stringify(customers));
      localStorage.setItem("hydropurify_telemetry", JSON.stringify(telemetry));
    } catch (e) {
      console.error("Failed to save localstorage data:", e);
    }
  }, [customers, telemetry]);

  // Real-time telemetry simulation loop (3 sec tick)
  useEffect(() => {
    if (plantStatus === "EMERGENCY_SHUTDOWN") return;

    const interval = setInterval(() => {
      setTelemetry((prev) => {
        const jitter = (Math.random() - 0.5) * 0.04;
        const treatedTurb = Math.max(0.4, Math.min(1.8, prev.treatedTurbidityNtu + jitter));
        const treatedPh = Math.max(6.8, Math.min(7.6, prev.treatedPh + (Math.random() - 0.5) * 0.02));
        const resCl = Math.max(0.25, Math.min(0.55, prev.residualChlorineMgL + (Math.random() - 0.5) * 0.01));
        const flow = Math.max(235, Math.min(252, prev.flowRateLps + (Math.random() - 0.5) * 1.5));

        return {
          ...prev,
          timestamp: new Date().toLocaleTimeString("id-ID") + " WIB",
          treatedTurbidityNtu: Number(treatedTurb.toFixed(2)),
          treatedPh: Number(treatedPh.toFixed(2)),
          residualChlorineMgL: Number(resCl.toFixed(2)),
          flowRateLps: Number(flow.toFixed(1)),
          dailyProducedM3: prev.dailyProducedM3 + Math.floor(flow * 0.003),
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [plantStatus]);

  const updateDosing = (alum: number, chlorine: number, lime: number) => {
    setTelemetry((prev) => ({
      ...prev,
      dosingAlumPpm: alum,
      dosingChlorinePpm: chlorine,
      dosingLimePpm: lime,
      treatedTurbidityNtu: Number(Math.max(0.4, 2.5 - (alum / 30) * 1.8).toFixed(2)),
      residualChlorineMgL: Number(Math.min(0.65, (chlorine * 0.16)).toFixed(2)),
      treatedPh: Number((6.8 + (lime * 0.05)).toFixed(2)),
    }));
  };

  const triggerBackwash = (stageId: string) => {
    setStages((prev) =>
      prev.map((s) =>
        s.id === stageId
          ? { ...s, status: "BACKWASH", primaryValue: 0.2 }
          : s
      )
    );
    setTimeout(() => {
      setStages((prev) =>
        prev.map((s) =>
          s.id === stageId ? { ...s, status: "ACTIVE" } : s
        )
      );
    }, 4000);
  };

  const updateCustomerMeter = (id: string, newCurrentMeter: number) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const usage = Math.max(0, newCurrentMeter - c.meterPrevM3);
        const rateInfo = TARIFF_RATES[c.category];
        const waterBill = usage * rateInfo.rate;
        const total = waterBill + rateInfo.base + c.retributionIdr;
        return {
          ...c,
          meterCurrentM3: newCurrentMeter,
          usageM3: usage,
          waterBillIdr: waterBill,
          totalBillIdr: total,
        };
      })
    );
  };

  const addNewCustomer = (custData: Omit<WaterCustomer, "id" | "usageM3" | "waterBillIdr" | "totalBillIdr">) => {
    const rateInfo = TARIFF_RATES[custData.category];
    const usage = Math.max(0, custData.meterCurrentM3 - custData.meterPrevM3);
    const waterBill = usage * rateInfo.rate;
    const total = waterBill + rateInfo.base + custData.retributionIdr;
    const newCust: WaterCustomer = {
      ...custData,
      id: `CUST-${Date.now().toString().slice(-4)}`,
      usageM3: usage,
      waterBillIdr: waterBill,
      totalBillIdr: total,
    };
    setCustomers((prev) => [newCust, ...prev]);
  };

  const resetToDefaults = () => {
    setTelemetry(INITIAL_TELEMETRY);
    setStages(INITIAL_STAGES);
    setCustomers(INITIAL_CUSTOMERS);
    setPlantStatus("RUNNING");
    localStorage.removeItem("hydropurify_customers");
    localStorage.removeItem("hydropurify_telemetry");
  };

  return (
    <WaterContext.Provider
      value={{
        telemetry,
        stages,
        customers,
        plantStatus,
        setPlantStatus,
        updateDosing,
        triggerBackwash,
        updateCustomerMeter,
        addNewCustomer,
        resetToDefaults,
      }}
    >
      {children}
    </WaterContext.Provider>
  );
}

export function useWater() {
  const context = useContext(WaterContext);
  if (!context) throw new Error("useWater must be used within a WaterProvider");
  return context;
}