import { SystemSettings, Property, Tenant, Interaction, Maintenance } from "./types";

export const defaultSettings: SystemSettings = {
  alertDays: 30,
  propertyTypes: ["Condo", "Single Family", "Apartment", "Townhouse"],
  propertyStatuses: ["Active", "Maintenance", "Vacant"],
  communicationMethods: ["WeChat", "Email", "Phone", "In Person"],
  maintenanceStatuses: ["Pending", "In Progress", "Resolved", "On Hold"],
  currentDate: "2026-06-22"
};

export const defaultProperties: Property[] = [
  {
    id: "P001",
    address: "102 Ocean Drive, Miami FL",
    type: "Condo",
    status: "Active",
    insExpiryDate: "2026-07-15", // 23 days from 2026-06-22 -> Urgent
    safetyCheckDate: "2026-08-10", // 49 days -> Normal
    note: "Key box code: 4590. Oceanfront views, prefers afternoon maintenance."
  },
  {
    id: "P002",
    address: "405 Alpine Retreat, Aspen CO",
    type: "Single Family",
    status: "Maintenance",
    insExpiryDate: "2026-05-10", // -43 days -> Overdue
    safetyCheckDate: "2026-07-20", // 28 days -> Urgent
    note: "Snow plow contract active. Main heating unit can be noisy."
  },
  {
    id: "P003",
    address: "77 Pine Boulevard, Seattle WA",
    type: "Apartment",
    status: "Vacant",
    insExpiryDate: "2027-01-30", // Normal
    safetyCheckDate: "2026-06-15", // -7 days -> Overdue
    note: "Downtown location. Access transit key inside lobby mailbox."
  },
  {
    id: "P004",
    address: "12 Palm Grove, Oahu HI",
    type: "Single Family",
    status: "Active",
    insExpiryDate: "2026-12-15", // Normal
    safetyCheckDate: "2026-11-01", // Normal
    note: "Close to beach. Handyman lives two blocks away (+1 555-404-1122)."
  }
];

export const defaultTenants: Tenant[] = [
  {
    id: "T001",
    propId: "P001",
    name: "Sarah Connor",
    phone: "+1 (555) 019-2834",
    leaseStart: "2025-07-01",
    leaseEnd: "2026-06-30", // 8 days -> Urgent
    deposit: 2500,
    specialReq: "Requests non-allergenic bedding. Strict pet-free lease."
  },
  {
    id: "T002",
    propId: "P002",
    name: "John Doe",
    phone: "+1 (555) 014-9876",
    leaseStart: "2025-11-01",
    leaseEnd: "2026-05-15", // -38 days -> Overdue
    deposit: 3000,
    specialReq: "Configured direct fiber connection for remote software design work."
  },
  {
    id: "T003",
    propId: "P004",
    name: "Alice Smith",
    phone: "+1 (555) 012-3456",
    leaseStart: "2026-01-01",
    leaseEnd: "2026-12-31", // Normal
    deposit: 1800,
    specialReq: "Approved cat rental agreement with increased damage guarantee index."
  }
];

export const defaultInteractions: Interaction[] = [
  {
    id: "ACT0001",
    date: "2026-06-15",
    tenantId: "T001",
    method: "Email",
    summary: "Inquired about lease extension parameters and potential rent adjustment.",
    nextStep: "Draft renewal agreement for extension until Jun 2027 by next Monday."
  },
  {
    id: "ACT0002",
    date: "2026-06-20",
    tenantId: "T002",
    method: "WeChat",
    summary: "Complained regarding low hot water temperature inside the primary tub.",
    nextStep: "Verify thermostat or assign plumbing team to visit if issue persists."
  },
  {
    id: "ACT0003",
    date: "2026-06-22",
    tenantId: "T003",
    method: "Phone",
    summary: "Inquired regarding dry cleaning facilities nearby and trash drop timing.",
    nextStep: "Emailed local guidelines PDF and scheduled community event flyer."
  }
];

export const defaultMaintenance: Maintenance[] = [
  {
    id: "M001",
    reportDate: "2026-05-20",
    propId: "P002",
    issueDesc: "Central boiler system pressure pressure valve failure.",
    contractor: "Dave's Heating & Cooling (+1 555-883-9922)",
    status: "Resolved",
    resolveDate: "2026-05-22",
    cost: 480
  },
  {
    id: "M002",
    reportDate: "2026-06-18",
    propId: "P001",
    issueDesc: "Balcony sliding glass lock adjustment and safety lock add.",
    contractor: "Miami Locksmith Co (+1 555-321-7788)",
    status: "In Progress",
    resolveDate: "",
    cost: 120
  },
  {
    id: "M003",
    reportDate: "2026-06-21",
    propId: "P003",
    issueDesc: "Laminate flooring restoration and carpet deep wash post-vacating.",
    contractor: "Seattle Green Steamers (+1 555-121-0099)",
    status: "Pending",
    resolveDate: "",
    cost: 350
  }
];
