export type ProcessStageId =
  | "INTAKE"
  | "COAGULATION"
  | "SEDIMENTATION"
  | "FILTRATION"
  | "CHLORINATION"
  | "RESERVOIR";

export type PlantAlertSeverity = "NORMAL" | "WARNING" | "CRITICAL";

export interface ProcessStage {
  id: ProcessStageId;
  name: string;
  code: string;
  nominalRetentionMin: number;
  currentLevelPct: number;
  inflowM3h: number;
  outflowM3h: number;
  status: "ACTIVE" | "MAINTENANCE" | "BACKWASH" | "ALARM";
  primaryParameter: string;
  primaryValue: number;
  unit: string;
  thresholdMax: number;
}

export interface WaterQualityTelemetry {
  timestamp: string;
  rawTurbidityNtu: number;       // Standar Permenkes < 5 NTU
  treatedTurbidityNtu: number;
  rawPh: number;                 // Standar 6.5 - 8.5
  treatedPh: number;
  residualChlorineMgL: number;   // Standar 0.2 - 0.5 mg/L
  dissolvedOxygenMgL: number;
  tdsPpm: number;                // Total Dissolved Solids < 300 ppm
  totalColiformCfu: number;      // Harus 0 CFU/100ml
  dosingAlumPpm: number;         // PAC / Alum Koagulan
  dosingChlorinePpm: number;     // Klorin Disinfeksi
  dosingLimePpm: number;         // Kapur Ca(OH)2 pH Adjuster
  flowRateLps: number;           // Liter per detik (Kap. Instalasi: 250 L/s)
  dailyProducedM3: number;
}

export type TariffCategory =
  | "R1_SOSIAL"
  | "R2_RUMAH_TANGGA"
  | "R3_MENENGAH"
  | "N1_NIAGA_KECIL"
  | "I1_INDUSTRI_BESAR";

export interface WaterCustomer {
  id: string;
  accountNo: string;
  name: string;
  address: string;
  category: TariffCategory;
  meterPrevM3: number;
  meterCurrentM3: number;
  usageM3: number;
  ratePerM3: number;
  baseChargeIdr: number;
  waterBillIdr: number;
  retributionIdr: number;
  totalBillIdr: number;
  paymentStatus: "PAID" | "UNPAID" | "OVERDUE";
  meterSerial: string;
}