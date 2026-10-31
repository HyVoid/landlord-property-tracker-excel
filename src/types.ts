/**
 * Type declarations for the Property Operations Console.
 */

export interface SystemSettings {
  alertDays: number;
  propertyTypes: string[];
  propertyStatuses: string[];
  communicationMethods: string[];
  maintenanceStatuses: string[];
  currentDate: string; // The evaluation target date (e.g. "2026-06-22")
}

export interface Property {
  id: string; // "P000" format
  address: string;
  type: string;
  status: string;
  insExpiryDate: string;
  safetyCheckDate: string;
  note: string;
}

export interface Tenant {
  id: string; // "T000" format
  propId: string; // refers to Property.id
  name: string;
  phone: string;
  leaseStart: string;
  leaseEnd: string;
  deposit: number;
  specialReq: string;
}

export interface Interaction {
  id: string; // "ACT0000" format
  date: string;
  tenantId: string; // refers to Tenant.id
  method: string;
  summary: string;
  nextStep: string;
}

export interface Maintenance {
  id: string; // "M000" format
  reportDate: string;
  propId: string; // refers to Property.id
  issueDesc: string;
  contractor: string;
  status: string;
  resolveDate: string;
  cost: number;
}

export interface AlertItem {
  sourceId: string;
  sourceType: "Insurance Expiry" | "Safety Check" | "Lease Expiry" | "Pending Maintenance";
  targetItem: string;
  dueDate: string;
  daysRemaining: number;
  alertLevel: "🔴 Overdue" | "🟡 Urgent" | "🟢 Normal";
}
