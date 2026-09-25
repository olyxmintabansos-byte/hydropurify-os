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
  code: string;
  name: string;
  isActive: boolean;
  status: "OPTIMAL" | "ATTENTION" | "CRITICAL" | "OFFLINE" | "BACKWASH";
  alertSeverity: PlantAlertSeverity;
  performanceScore: number;
  inflowM3h: number;
  outflowM3h: number;
  nominalRetentionMin: number;
  primaryParameter: string;
  primaryValue: number;
  unit: string;
  currentLevelPct?: number;
}

export interface WaterQualityTelemetry {
  ph: number;
  turbidity: number;
  residualChlorine: number;
  flowRate: number;
  pressure: number;
  timestamp: string;
  rawTurbidityNtu: number;
  treatedTurbidityNtu: number;
  rawPh: number;
  treatedPh: number;
  residualChlorineMgL: number;
  dissolvedOxygenMgL: number;
  tdsPpm: number;
  totalColiformCfu: number;
  dosingAlumPpm: number;
  dosingChlorinePpm: number;
  dosingLimePpm: number;
  flowRateLps: number;
  dailyProducedM3: number;
}

export type TariffCategory =
  | "R1_SOSIAL"
  | "R2_RUMAH_TANGGA"
  | "R3_MENENGAH"
  | "N1_NIAGA"
  | "I1_INDUSTRI"
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
  lastBillingDate?: string;
}

export type LabCategory = "FISIKA" | "KIMIA_ANORGANIK" | "MIKROBIOLOGI";

export interface LabParameter {
  id: string;
  name: string;
  category: LabCategory;
  unit: string;
  standardLimit: number;
  testValue: number;
  testMethod: string;
  isCompliant: boolean;
}

export interface WaterLabCertificate {
  certificateNo: string;
  sampleCode: string;
  samplingDate: string;
  testedDate: string;
  samplingLocation: string;
  intakeSource: string;
  notes: string;
  officerName: string;
  labHeadName: string;
  directorName: string;
}