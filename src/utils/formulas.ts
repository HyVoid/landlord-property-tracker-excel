import { Property, Tenant, Maintenance, AlertItem, SystemSettings } from "../types";

/**
 * Parses "YYYY-MM-DD" and calculates the difference in calendar days (dueDate - currentDate).
 */
export function calculateDaysRemaining(dueDateStr: string, currentDateStr: string): number {
  if (!dueDateStr || !currentDateStr) return 0;
  
  const due = new Date(dueDateStr + "T00:00:00");
  const current = new Date(currentDateStr + "T00:00:00");
  
  const diffTime = due.getTime() - current.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Auto-generates the Alerts Engine data matching the Excel schema.
 * Scan points:
 * 1. Properties: Insurance Expiry (Ins_Expiry_Date)
 * 2. Properties: Gas/Fire Safety Inspect Date (Safety_Check_Date)
 * 3. Tenants: Lease End Date (Lease_End)
 * 4. Maintenance: Unresolved repairs that are reported (Report_Date <= Today and status != "Resolved")
 */
export function generateAlerts(
  properties: Property[],
  tenants: Tenant[],
  maintenanceList: Maintenance[],
  settings: SystemSettings
): AlertItem[] {
  const alerts: AlertItem[] = [];
  const currentDate = settings.currentDate;
  const threshold = settings.alertDays;

  // 1. Property Insurance Expiry
  properties.forEach((p) => {
    if (p.insExpiryDate) {
      const days = calculateDaysRemaining(p.insExpiryDate, currentDate);
      let alertLevel: AlertItem["alertLevel"] = "🟢 Normal";
      if (days < 0) {
        alertLevel = "🔴 Overdue";
      } else if (days <= threshold) {
        alertLevel = "🟡 Urgent";
      }

      alerts.push({
        sourceId: p.id,
        sourceType: "Insurance Expiry",
        targetItem: `Property [${p.id}] at "${p.address}" - Insurance Expiration Alert`,
        dueDate: p.insExpiryDate,
        daysRemaining: days,
        alertLevel,
      });
    }
  });

  // 2. Property Safety Checks
  properties.forEach((p) => {
    if (p.safetyCheckDate) {
      const days = calculateDaysRemaining(p.safetyCheckDate, currentDate);
      let alertLevel: AlertItem["alertLevel"] = "🟢 Normal";
      if (days < 0) {
        alertLevel = "🔴 Overdue";
      } else if (days <= threshold) {
        alertLevel = "🟡 Urgent";
      }

      alerts.push({
        sourceId: p.id,
        sourceType: "Safety Check",
        targetItem: `Property [${p.id}] at "${p.address}" - Annual Safety & Fire Audit Due`,
        dueDate: p.safetyCheckDate,
        daysRemaining: days,
        alertLevel,
      });
    }
  });

  // 3. Lease Expiries
  tenants.forEach((t) => {
    if (t.leaseEnd) {
      const days = calculateDaysRemaining(t.leaseEnd, currentDate);
      let alertLevel: AlertItem["alertLevel"] = "🟢 Normal";
      if (days < 0) {
        alertLevel = "🔴 Overdue";
      } else if (days <= threshold) {
        alertLevel = "🟡 Urgent";
      }

      alerts.push({
        sourceId: t.id,
        sourceType: "Lease Expiry",
        targetItem: `Tenant [${t.id}] (${t.name}) - Lease Agreement Renewal Evaluation`,
        dueDate: t.leaseEnd,
        daysRemaining: days,
        alertLevel,
      });
    }
  });

  // 4. Pending Maintenance Tickets
  maintenanceList.forEach((m) => {
    if (m.status !== "Resolved") {
      const days = calculateDaysRemaining(m.reportDate, currentDate);
      // Since it's unresolved, if reportDate falls before or today, it counts as pending/overdue
      // Let's formulate "daysRemaining" as days elapsed since reportDate. If negative, it was filed in the future (unlikely)
      // We can use Report Date itself to display.
      const alertLevel: AlertItem["alertLevel"] = days < 0 ? "🔴 Overdue" : "🟡 Urgent";

      alerts.push({
        sourceId: m.id,
        sourceType: "Pending Maintenance",
        targetItem: `Ticket [${m.id}] Repair Issue: "${m.issueDesc}" (Status: ${m.status})`,
        dueDate: m.reportDate,
        daysRemaining: days, // days overdue from report date
        alertLevel,
      });
    }
  });

  return alerts;
}

/**
 * Calculates Dashboard KPIs from state:
 * 1. Vacant Properties: count of properties with status "Vacant"
 * 2. Overdue/Unresolved Maintenance counts: status != "Resolved" and report_date < Today
 * 3. 30-Day Expiries/Overdue Alerts total: count of "🔴 Overdue" + "🟡 Urgent" alerts
 * 4. Total operating cost / collected deposits for further insights
 */
export function calculateDashboardKPIs(
  properties: Property[],
  maintenanceList: Maintenance[],
  alerts: AlertItem[],
  settings: SystemSettings
) {
  const vacantCount = properties.filter((p) => p.status === "Vacant").length;
  
  const unresolvedMaintenanceCount = maintenanceList.filter(
    (m) => m.status !== "Resolved" && calculateDaysRemaining(m.reportDate, settings.currentDate) <= 0
  ).length;

  const urgentAndOverdueAlertsCount = alerts.filter(
    (a) => a.alertLevel === "🔴 Overdue" || a.alertLevel === "🟡 Urgent"
  ).length;

  const activePropertiesCount = properties.filter((p) => p.status === "Active").length;
  const inMaintenanceCount = properties.filter((p) => p.status === "Maintenance").length;

  const totalMaintenanceCost = maintenanceList.reduce((acc, curr) => acc + (curr.cost || 0), 0);

  return {
    vacantCount,
    unresolvedMaintenanceCount,
    urgentAndOverdueAlertsCount,
    activePropertiesCount,
    inMaintenanceCount,
    totalMaintenanceCost,
  };
}
