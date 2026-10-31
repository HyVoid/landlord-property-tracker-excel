import React from "react";
import { Property, Tenant, Maintenance, AlertItem, SystemSettings } from "../types";
import { calculateDashboardKPIs } from "../utils/formulas";
import { 
  Building, 
  Users, 
  Wrench, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, 
  Calendar, 
  HelpCircle, 
  TrendingUp, 
  DollarSign 
} from "lucide-react";

interface DashboardSheetProps {
  properties: Property[];
  tenants: Tenant[];
  maintenanceList: Maintenance[];
  alerts: AlertItem[];
  settings: SystemSettings;
  onNavigateToTab: (index: number) => void;
  onQuickTogglePropertyStatus: (id: string, newStatus: string) => void;
}

export default function DashboardSheet({
  properties,
  tenants,
  maintenanceList,
  alerts,
  settings,
  onNavigateToTab,
  onQuickTogglePropertyStatus,
}: DashboardSheetProps) {
  
  // Calculate analytics
  const kpis = calculateDashboardKPIs(properties, maintenanceList, alerts, settings);

  // Filter urgent & overdue alarms
  const targetAlerts = alerts.filter(
    (a) => a.alertLevel === "🔴 Overdue" || a.alertLevel === "🟡 Urgent"
  );

  // Group properties check status for matrix
  const getPropertyInsuranceState = (p: Property): "Healthy" | "Urgent" | "Overdue" => {
    if (!p.insExpiryDate) return "Healthy";
    const alert = alerts.find((a) => a.sourceId === p.id && a.sourceType === "Insurance Expiry");
    if (alert?.alertLevel === "🔴 Overdue") return "Overdue";
    if (alert?.alertLevel === "🟡 Urgent") return "Urgent";
    return "Healthy";
  };

  const getPropertySafetyState = (p: Property): "Healthy" | "Urgent" | "Overdue" => {
    if (!p.safetyCheckDate) return "Healthy";
    const alert = alerts.find((a) => a.sourceId === p.id && a.sourceType === "Safety Check");
    if (alert?.alertLevel === "🔴 Overdue") return "Overdue";
    if (alert?.alertLevel === "🟡 Urgent") return "Urgent";
    return "Healthy";
  };

  const getPropertyLeaseState = (propId: string): "Active" | "Urgent" | "Overdue" | "None" => {
    const tenant = tenants.find((t) => t.propId === propId);
    if (!tenant) return "None";
    const alert = alerts.find((a) => a.sourceId === tenant.id && a.sourceType === "Lease Expiry");
    if (alert?.alertLevel === "🔴 Overdue") return "Overdue";
    if (alert?.alertLevel === "🟡 Urgent") return "Urgent";
    return "Active";
  };

  return (
    <div className="fade-up-animation flex flex-col gap-6">
      
      {/* KPI Cards Row (3-5 cards grid, EB Garamond numbers) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* KPI 1: Vacant Properties - COUNTIF status == "Vacant" */}
        <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-yellow-500 hover:translate-y-[-2px] transition-all duration-300">
          <div className="flex justify-between items-start select-none">
            <span className="text-[11px] font-label-caps text-[#888888] uppercase tracking-wider font-semibold">
              Vacant Units
            </span>
            <Building className="w-4 h-4 text-yellow-500" />
          </div>
          <div className="font-display-serif text-3xl font-bold text-[#051C2C] mt-2 tracking-tight">
            {kpis.vacantCount} <span className="text-xs font-normal text-[#888888] font-sans">Units</span>
          </div>
          <p className="text-[10px] text-[#888888] mt-2 font-sans">
            Ready for rent assignment ({properties.length - kpis.vacantCount} occupied)
          </p>
        </div>

        {/* KPI 2: Overdue Unresolved Maintenance - COUNTIFS status != Resolved & Date < today */}
        <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-[#D32F2F] hover:translate-y-[-2px] transition-all duration-300">
          <div className="flex justify-between items-start select-none">
            <span className="text-[11px] font-label-caps text-[#888888] uppercase tracking-wider font-semibold">
              Overdue Repair Jobs
            </span>
            <Wrench className="w-4 h-4 text-[#D32F2F]" />
          </div>
          <div className="font-display-serif text-3xl font-bold text-[#D32F2F] mt-2 tracking-tight">
            {kpis.unresolvedMaintenanceCount} <span className="text-xs font-normal text-[#888888] font-sans">Pending</span>
          </div>
          <p className="text-[10px] text-[#888888] mt-2 font-sans">
            Pending tickets reported before today's target time
          </p>
        </div>

        {/* KPI 3: Total 30-Day Expiries/Overdue Alerts - COUNTIF pre-warnings */}
        <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-[#2251FF] hover:translate-y-[-2px] transition-all duration-300">
          <div className="flex justify-between items-start select-none">
            <span className="text-[11px] font-label-caps text-[#888888] uppercase tracking-wider font-semibold">
              Compliance Actions
            </span>
            <AlertTriangle className="w-4 h-4 text-[#2251FF]" />
          </div>
          <div className="font-display-serif text-3xl font-bold text-[#2251FF] mt-2 tracking-tight">
            {kpis.urgentAndOverdueAlertsCount} <span className="text-xs font-normal text-[#888888] font-sans">Active</span>
          </div>
          <p className="text-[10px] text-[#888888] mt-2 font-sans">
            Sum of all insurance, safety check & lease alerts
          </p>
        </div>

        {/* KPI 4: Financial Metrics / Total costs */}
        <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-slate-700 hover:translate-y-[-2px] transition-all duration-300">
          <div className="flex justify-between items-start select-none">
            <span className="text-[11px] font-label-caps text-[#888888] uppercase tracking-wider font-semibold">
              Upkeep Expenditure
            </span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-display-serif text-3xl font-semibold text-[#051C2C] mt-2 tracking-tight">
            ${kpis.totalMaintenanceCost.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[10px] text-[#888888] mt-2 font-sans">
            Total historical cost summarized across all repairs
          </p>
        </div>

      </div>

      {/* Main split zone: Interactive Exposure Matrix + Alerts list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Exposure Matrix of Properties and status checks */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow-md border border-[#E8E8E6] p-5">
            <div className="flex justify-between items-center border-b border-[#F5F5F2] pb-3 mb-4 select-none">
              <h3 className="font-heading-serif text-base font-semibold text-[#051C2C] flex items-center gap-2">
                <Building className="w-5 h-5 text-[#2251FF]" />
                Interactive Operations Exposure Matrix
              </h3>
              <span className="text-[10px] text-[#888888] italic">Click cells to manipulate status</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E8E8E6] text-[11px] font-label-caps text-[#888888] uppercase tracking-wider h-8">
                    <th className="py-2">Ref</th>
                    <th className="py-2">Property Address</th>
                    <th className="py-2 text-center">Unit Status</th>
                    <th className="py-2 text-center">Insurance Grade</th>
                    <th className="py-2 text-center">Safety Audit</th>
                    <th className="py-2 text-center">Lease Agreement</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((p) => {
                    const insState = getPropertyInsuranceState(p);
                    const safetyState = getPropertySafetyState(p);
                    const leaseState = getPropertyLeaseState(p.id);

                    return (
                      <tr key={p.id} className="border-b border-[#E8E8E6]/60 text-xs h-12">
                        <td className="font-mono text-xs font-bold text-[#051C2C]">
                          <span className="bg-[#051C2C]/5 px-2 py-0.5 rounded text-[10px]">
                            {p.id}
                          </span>
                        </td>
                        <td className="font-semibold text-[#051C2C] max-w-[140px] truncate" title={p.address}>
                          {p.address}
                        </td>
                        
                        {/* Interactive Unit Status selector with scale hover */}
                        <td className="text-center">
                          <div className="active-hover-scale inline-block">
                            <select
                              value={p.status}
                              onChange={(e) => onQuickTogglePropertyStatus(p.id, e.target.value)}
                              className={`cursor-pointer px-2.5 py-1 rounded-full text-[10px] font-semibold text-center select-none border-none focus:ring-1 focus:ring-[#2251FF] ${
                                p.status === "Active" 
                                  ? "bg-emerald-50 text-emerald-700"
                                  : p.status === "Vacant"
                                  ? "bg-yellow-50 text-yellow-700 animate-pulse"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              <option value="Active">🟢 Active</option>
                              <option value="Vacant">🟡 Vacant</option>
                              <option value="Maintenance">🛠️ Maint</option>
                            </select>
                          </div>
                        </td>

                        {/* Interactive Insurance cell */}
                        <td className="text-center">
                          <button
                            onClick={() => onNavigateToTab(1)} // Redirect to Properties
                            className={`active-hover-scale text-[10px] py-1 px-3 rounded-full cursor-pointer font-semibold ${
                              insState === "Overdue"
                                ? "bg-[#D32F2F]/10 text-[#D32F2F]"
                                : insState === "Urgent"
                                ? "bg-yellow-50 text-yellow-600"
                                : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {insState === "Overdue" ? "🔴 Overdue" : insState === "Urgent" ? "🟡 Urgent" : "🟢 Healthy"}
                          </button>
                        </td>

                        {/* Interactive Safety cell */}
                        <td className="text-center">
                          <button
                            onClick={() => onNavigateToTab(1)}
                            className={`active-hover-scale text-[10px] py-1 px-3 rounded-full cursor-pointer font-semibold ${
                              safetyState === "Overdue"
                                ? "bg-[#D32F2F]/10 text-[#D32F2F]"
                                : safetyState === "Urgent"
                                ? "bg-yellow-50 text-yellow-600"
                                : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {safetyState === "Overdue" ? "🔴 Overdue" : safetyState === "Urgent" ? "🟡 Urgent" : "🟢 Healthy"}
                          </button>
                        </td>

                        {/* Interactive Lease cell */}
                        <td className="text-center">
                          <button
                            onClick={() => onNavigateToTab(2)} // Redirect to Tenants
                            className={`active-hover-scale text-[10px] py-1 px-3 rounded-full cursor-pointer font-semibold ${
                              leaseState === "Overdue"
                                ? "bg-[#D32F2F]/10 text-[#D32F2F]"
                                : leaseState === "Urgent"
                                ? "bg-yellow-50 text-yellow-600"
                                : leaseState === "Active"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-50 text-[#888888] border border-dashed border-[#E8E8E6]"
                            }`}
                          >
                            {leaseState === "None" ? "No Tenant" : leaseState === "Overdue" ? "🔴 Expired" : leaseState === "Urgent" ? "🟡 Urgent" : "🟢 Active"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Filtered Warnings Board representing "关键代办视窗" */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow-md border border-[#E8E8E6] p-5 flex flex-col h-full justify-between">
            <div>
              <div className="flex justify-between items-center border-b border-[#F5F5F2] pb-3 mb-4 select-none">
                <h3 className="font-heading-serif text-base font-semibold text-[#051C2C] flex items-center gap-1.5">
                  <AlertTriangle className="w-4.5 h-4.5 text-[#D32F2F]" />
                  Actionable Agenda
                </h3>
                <span className="text-[10px] bg-[#D32F2F]/10 text-[#D32F2F] px-1.5 py-0.5 rounded font-bold font-mono">
                  {targetAlerts.length} Critical
                </span>
              </div>

              <div className="flex flex-col gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                {targetAlerts.length === 0 ? (
                  <div className="text-center py-10">
                    <CheckCircle className="w-8 h-8 text-[#00C853] mx-auto opacity-70 mb-2" />
                    <p className="text-xs text-[#051C2C] font-semibold">🎉 All Operating Status Healthy!</p>
                    <p className="text-[10px] text-[#888888] mt-1">No alerts or overdues in target windows.</p>
                  </div>
                ) : (
                  targetAlerts.map((alert, index) => {
                    const isRed = alert.alertLevel === "🔴 Overdue";
                    return (
                      <div
                        key={index}
                        className={`p-2.5 rounded-lg border text-xs flex flex-col justify-between gap-1.5 group select-none ${
                          isRed
                            ? "bg-[#D32F2F]/4 border-[#D32F2F]/20 hover:border-[#D32F2F]/50"
                            : "bg-yellow-50/50 border-yellow-200 hover:border-yellow-400"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-mono text-[9px] font-bold text-[#888888]">
                            Source: {alert.sourceId}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${isRed ? "bg-[#D32F2F]/10 text-[#D32F2F]" : "bg-yellow-50 text-yellow-700"}`}>
                            {isRed ? "Overdue" : "Urgent"}
                          </span>
                        </div>
                        <p className={`text-[11px] leading-snug font-medium ${isRed ? "text-[#D32F2F]" : "text-[#051C2C]"}`}>
                          {alert.targetItem}
                        </p>
                        <div className="flex justify-between items-center text-[10px] text-[#888888] mt-0.5">
                          <span>Due: <strong className="text-[#051C2C] font-mono">{alert.dueDate}</strong></span>
                          <span className="font-bold text-[#051C2C] font-mono">
                            {alert.daysRemaining < 0 
                              ? `${Math.abs(alert.daysRemaining)} days ago` 
                              : `${alert.daysRemaining} days left`}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {targetAlerts.length > 0 && (
              <button
                onClick={() => onNavigateToTab(5)} // Redirect to Alerts Engine
                className="w-full mt-4 text-[11px] font-semibold text-center text-[#2251FF] hover:underline flex items-center justify-center gap-1 bg-[#2251FF]/5 py-1.5 rounded-md hover:bg-[#2251FF]/10 cursor-pointer"
              >
                Go to Automated Alerts Engine
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Operational Analytical Insights Block with matching style rules */}
      {/* "insight/说明块使用左侧 3px accent border + 主色 4% 透明度底面。" */}
      <div className="bg-[#2251FF]/4 border-l-4 border-[#2251FF] p-5 rounded-r-xl shadow-sm">
        <h4 className="font-heading-serif text-base font-semibold text-[#051C2C] flex items-center gap-1.5 mb-2">
          <TrendingUp className="w-5 h-5 text-[#2251FF]" />
          Operations Hub Intelligence Insights
        </h4>
        <div className="text-xs text-[#051C2C] leading-relaxed space-y-2">
          <p>
            Current system parameters identify <strong>{properties.length} operating properties</strong>, 
            representing an overall occupancy rate of <strong className="text-[#2251FF] font-mono">
              {((properties.filter(p => p.status === "Active").length / properties.length) * 100).toFixed(0)}%
            </strong>. 
            There are currently <strong>{kpis.vacantCount} vacant units</strong> requiring rental pipeline assignments.
          </p>
          <p>
            Upkeep expenses stand at a summarized weight index of <span className="font-mono font-bold">${kpis.totalMaintenanceCost.toLocaleString("en-US")}</span>. 
            Property <strong>P002 (Aspen retreat)</strong> accounts for the maximum repairs index allocation. 
            If insurance expiry details remain critical, please update corresponding expiry calendars inside the Property spreadsheet sections.
          </p>
        </div>
      </div>

    </div>
  );
}
