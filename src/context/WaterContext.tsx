"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  ProcessStage,
  WaterQualityTelemetry,
  WaterCustomer,
  TariffCategory,
  LabParameter,
  WaterLabCertificate,
} from "@/types/water";

interface WaterContextType {
  stages: ProcessStage[];
  telemetry: WaterQualityTelemetry;
  customers: WaterCustomer[];
  labParameters: LabParameter[];
  certificate: WaterLabCertificate;
  plantStatus: "RUNNING" | "STOPPED" | "EMERGENCY" | "EMERGENCY_SHUTDOWN";
  setPlantStatus: (status: "RUNNING" | "STOPPED" | "EMERGENCY" | "EMERGENCY_SHUTDOWN") => void;
  updateDosing: (alum: number, chlorine: number, lime: number) => void;
  triggerBackwash: (id?: string) => void;
  updateCustomerMeter: (id: string, newMeterM3: number) => void;
  addNewCustomer: (customer: Omit<WaterCustomer, "id" | "usageM3" | "waterBillIdr" | "totalBillIdr">) => void;
  updateLabParameter: (id: string, value: number) => void;
}

const defaultCertificate: WaterLabCertificate = {
  certificateNo: "LHU-2026-9284",
  sampleCode: "SMP-BKB-001",
  samplingDate: "2026-09-23",
  testedDate: "2026-09-25",
  samplingLocation: "Reservoir Utama IPA Cisadane",
  intakeSource: "Sungai Cisadane (Raw Water)",
  notes: "Berdasarkan hasil analisis laboratorium, seluruh parameter yang diuji memenuhi syarat baku mutu air minum sesuai Permenkes No. 2 Tahun 2023.",
  officerName: "Budi Santoso, S.Si",
  labHeadName: "Siti Aminah, M.Si",
  directorName: "Dr. Ir. H. Ahmad Fauzi, M.T.",
};

const defaultStages: ProcessStage[] = [
  { id: "INTAKE", code: "STG-01", name: "INTAKE RIVER WATER", isActive: true, status: "OPTIMAL", alertSeverity: "NORMAL", performanceScore: 98, inflowM3h: 900, outflowM3h: 900, nominalRetentionMin: 5, primaryParameter: "Turbidity", primaryValue: 120, unit: "NTU" },
  { id: "COAGULATION", code: "STG-02", name: "COAGULATION & FLOC", isActive: true, status: "OPTIMAL", alertSeverity: "NORMAL", performanceScore: 95, inflowM3h: 900, outflowM3h: 895, nominalRetentionMin: 15, primaryParameter: "PAC Dosage", primaryValue: 24, unit: "PPM" },
  { id: "SEDIMENTATION", code: "STG-03", name: "LAMELLA SEDIMENTATION", isActive: true, status: "OPTIMAL", alertSeverity: "NORMAL", performanceScore: 92, inflowM3h: 895, outflowM3h: 890, nominalRetentionMin: 120, primaryParameter: "Sludge Level", primaryValue: 1.2, unit: "M", currentLevelPct: 45 },
  { id: "FILTRATION", code: "STG-04", name: "RAPID SAND FILTER", isActive: true, status: "OPTIMAL", alertSeverity: "NORMAL", performanceScore: 96, inflowM3h: 890, outflowM3h: 885, nominalRetentionMin: 20, primaryParameter: "Headloss", primaryValue: 0.8, unit: "M" },
  { id: "CHLORINATION", code: "STG-05", name: "GAS CHLORINATION", isActive: true, status: "OPTIMAL", alertSeverity: "NORMAL", performanceScore: 99, inflowM3h: 885, outflowM3h: 885, nominalRetentionMin: 30, primaryParameter: "Cl2 Residual", primaryValue: 1.2, unit: "mg/L" },
  { id: "RESERVOIR", code: "STG-06", name: "CLEAR WATER RESERVOIR", isActive: true, status: "OPTIMAL", alertSeverity: "NORMAL", performanceScore: 100, inflowM3h: 885, outflowM3h: 880, nominalRetentionMin: 240, primaryParameter: "Storage Vol", primaryValue: 4500, unit: "M³", currentLevelPct: 90 },
];

const defaultTelemetry: WaterQualityTelemetry = {
  ph: 7.2,
  turbidity: 0.8,
  residualChlorine: 0.5,
  flowRate: 250,
  pressure: 2.5,
  timestamp: "2026-09-25T10:00:00Z",
  rawTurbidityNtu: 125,
  treatedTurbidityNtu: 0.85,
  rawPh: 6.8,
  treatedPh: 7.3,
  residualChlorineMgL: 0.55,
  dissolvedOxygenMgL: 7.8,
  tdsPpm: 145,
  totalColiformCfu: 0,
  flowRateLps: 250,
  dailyProducedM3: 21600,
  dosingAlumPpm: 24,
  dosingChlorinePpm: 2.5,
  dosingLimePpm: 12,
};

const defaultCustomers: WaterCustomer[] = [
  { id: "C01", accountNo: "PDAM-100293", name: "Bambang Sudirman", address: "Jl. Merdeka No. 45 Tangerang", category: "R2_RUMAH_TANGGA", meterPrevM3: 1200, meterCurrentM3: 1224, usageM3: 24, ratePerM3: 4500, baseChargeIdr: 15000, waterBillIdr: 108000, retributionIdr: 5000, totalBillIdr: 128000, paymentStatus: "UNPAID", meterSerial: "WM-88203", lastBillingDate: "2026-09-01" },
  { id: "C02", accountNo: "PDAM-100412", name: "Panti Asuhan Kasih Ibu", address: "Jl. Mawar No. 12 Tangerang", category: "R1_SOSIAL", meterPrevM3: 3400, meterCurrentM3: 3485, usageM3: 85, ratePerM3: 2000, baseChargeIdr: 10000, waterBillIdr: 170000, retributionIdr: 3000, totalBillIdr: 183000, paymentStatus: "PAID", meterSerial: "WM-44102", lastBillingDate: "2026-09-01" },
];

const WaterContext = createContext<WaterContextType | undefined>(undefined);

export function WaterProvider({ children }: { children: React.ReactNode }) {
  const [stages, setStages] = useState<ProcessStage[]>(defaultStages);
  const [telemetry, setTelemetry] = useState<WaterQualityTelemetry>(defaultTelemetry);
  const [customers, setCustomers] = useState<WaterCustomer[]>(defaultCustomers);
  const [plantStatus, setPlantStatus] = useState<"RUNNING" | "STOPPED" | "EMERGENCY" | "EMERGENCY_SHUTDOWN">("RUNNING");

  const [labParameters, setLabParameters] = useState<LabParameter[]>([
    { id: "P01", name: "Kekeruhan", category: "FISIKA", unit: "NTU", standardLimit: 2.0, testValue: 0.85, testMethod: "Spektrofotometri", isCompliant: true },
    { id: "P02", name: "Warna", category: "FISIKA", unit: "TCU", standardLimit: 15, testValue: 5, testMethod: "Spektrofotometri", isCompliant: true },
    { id: "P03", name: "pH", category: "KIMIA_ANORGANIK", unit: "-", standardLimit: 6.5, testValue: 7.2, testMethod: "pH Meter", isCompliant: true },
    { id: "P04", name: "Besi (Fe)", category: "KIMIA_ANORGANIK", unit: "mg/L", standardLimit: 0.2, testValue: 0.05, testMethod: "AAS", isCompliant: true },
    { id: "P05", name: "Mangan (Mn)", category: "KIMIA_ANORGANIK", unit: "mg/L", standardLimit: 0.1, testValue: 0.02, testMethod: "AAS", isCompliant: true },
    { id: "P06", name: "Total Coliform", category: "MIKROBIOLOGI", unit: "CFU/100ml", standardLimit: 0, testValue: 0, testMethod: "Membrane Filter", isCompliant: true },
    { id: "P07", name: "E. Coli", category: "MIKROBIOLOGI", unit: "CFU/100ml", standardLimit: 0, testValue: 0, testMethod: "Membrane Filter", isCompliant: true },
  ]);

  const updateDosing = (alum: number, chlorine: number, lime: number) => {
    setTelemetry((prev) => ({
      ...prev,
      dosingAlumPpm: alum,
      dosingChlorinePpm: chlorine,
      dosingLimePpm: lime,
    }));
  };

  const triggerBackwash = (id?: string) => {
    setStages((prev) =>
      prev.map((s) => (s.id === (id || "FILTRATION") ? { ...s, performanceScore: 100, status: "OPTIMAL" } : s))
    );
  };

  const updateCustomerMeter = (id: string, newMeterM3: number) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const usage = Math.max(0, newMeterM3 - c.meterPrevM3);
          const waterBill = usage * c.ratePerM3;
          const total = waterBill + c.baseChargeIdr + c.retributionIdr;
          return { ...c, meterCurrentM3: newMeterM3, usageM3: usage, waterBillIdr: waterBill, totalBillIdr: total };
        }
        return c;
      })
    );
  };

  const addNewCustomer = (cust: Omit<WaterCustomer, "id" | "usageM3" | "waterBillIdr" | "totalBillIdr" | "paymentStatus">) => {
    const usage = Math.max(0, cust.meterCurrentM3 - cust.meterPrevM3);
    const waterBill = usage * cust.ratePerM3;
    const total = waterBill + cust.baseChargeIdr + cust.retributionIdr;
    const newC: WaterCustomer = {
      ...cust,
      id: `C${Date.now()}`,
      usageM3: usage,
      waterBillIdr: waterBill,
      totalBillIdr: total,
      paymentStatus: "UNPAID",
    };
    setCustomers((prev) => [newC, ...prev]);
  };

  const updateLabParameter = (id: string, value: number) => {
    setLabParameters((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, testValue: value, isCompliant: value <= p.standardLimit } : p
      )
    );
  };

  return (
    <WaterContext.Provider
      value={{
        stages,
        telemetry,
        customers,
        labParameters,
        certificate: defaultCertificate,
        plantStatus,
        setPlantStatus,
        updateDosing,
        triggerBackwash,
        updateCustomerMeter,
        addNewCustomer,
        updateLabParameter,
      }}
    >
      {children}
    </WaterContext.Provider>
  );
}

export function useWater() {
  const context = useContext(WaterContext);
  if (!context) throw new Error("useWater must be used within WaterProvider");
  return context;
}