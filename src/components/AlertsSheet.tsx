import React, { useState } from "react";
import { AlertItem } from "../types";
import { Search, AlertTriangle, ShieldCheck, CornerDownRight, Filter } from "lucide-react";

interface AlertsSheetProps {
  alerts: AlertItem[];
}

export default function AlertsSheet({ alerts }: AlertsSheetProps) {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("All");

  const filtered = alerts.filter((alert) => {
    const matchesSearch =
      alert.sourceId.toLowerCase().includes(search.toLowerCase()) ||
      alert.targetItem.toLowerCase().includes(search.toLowerCase()) ||
      alert.sourceType.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      levelFilter === "All" ||
      (levelFilter === "🔴 Overdue" && alert.alertLevel === "🔴 Overdue") ||
      (levelFilter === "🟡 Urgent" && alert.alertLevel === "🟡 Urgent") ||
      (levelFilter === "🟢 Normal" && alert.alertLevel === "🟢 Normal");

    return matchesSearch && matchesFilter;
  });

  const overdueCount = alerts.filter((a) => a.alertLevel === "🔴 Overdue").length;
  const urgentCount = alerts.filter((a) => a.alertLevel === "🟡 Urgent").length;
  const normalCount = alerts.filter((a) => a.alertLevel === "🟢 Normal").length;

  return (
    <div className="fade-up-animation flex flex-col gap-6">
      {/* Introduction Banner explaining automation */}
      <div className="bg-[#2251FF]/4 border-l-4 border-[#2251FF] p-4 rounded-r-lg shadow-sm">
        <h3 className="font-heading-serif text-lg font-semibold text-[#051C2C] flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-[#2251FF]" />
          Automated Alerts & Compliance Engine (Sheet: 05_Alerts_Engine)
        </h3>
        <p className="text-xs text-[#888888] mt-1 font-sans">
          This division is <strong>strictly formula-driven</strong>. It continuously scans the registries of active properties, fire safety, lease expirations, and repair requests to calculate remaining schedules relative to the current evaluation day.
        </p>
      </div>

      {/* KPI Stats overview of current alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border-l-4 border-[#D32F2F] p-4 rounded-lg shadow-sm flex justify-between items-center decoration-clone hover:translate-y-[-2px] transition-transform">
          <div>
            <div className="text-[10px] font-label-caps text-[#888888] uppercase tracking-wider font-semibold">
              🔴 Overdue Actions
            </div>
            <div className="font-display-serif text-2xl font-bold text-[#D32F2F] mt-1">
              {overdueCount} Items
            </div>
          </div>
          <div className="bg-[#D32F2F]/10 p-2 rounded-full text-[#D32F2F] text-xs font-bold px-3">
            Action Needed Today
          </div>
        </div>

        <div className="bg-white border-l-4 border-yellow-500 p-4 rounded-lg shadow-sm flex justify-between items-center hover:translate-y-[-2px] transition-transform">
          <div>
            <div className="text-[10px] font-label-caps text-[#888888] uppercase tracking-wider font-semibold">
              🟡 Urgent Status (30 Days)
            </div>
            <div className="font-display-serif text-2xl font-bold text-yellow-600 mt-1">
              {urgentCount} Items
            </div>
          </div>
          <div className="bg-yellow-50 p-2 rounded-full text-yellow-600 text-xs font-bold px-3">
            Approaching
          </div>
        </div>

        <div className="bg-white border-l-4 border-[#00C853] p-4 rounded-lg shadow-sm flex justify-between items-center hover:translate-y-[-2px] transition-transform">
          <div>
            <div className="text-[10px] font-label-caps text-[#888888] uppercase tracking-wider font-semibold">
              🟢 Healthy Actions
            </div>
            <div className="font-display-serif text-2xl font-bold text-[#00C853] mt-1">
              {normalCount} Items
            </div>
          </div>
          <div className="bg-[#00C853]/10 p-2 rounded-full text-[#00C853] text-xs font-bold px-3">
            Fully Compliant
          </div>
        </div>
      </div>

      {/* Quick filters and search */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#888888]" />
          <input
            type="text"
            placeholder="Search alerting code, text source, or address index..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-md bg-white border border-[#E8E8E6] text-[#051C2C] focus:outline-none focus:border-[#2251FF]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#888888]" />
          <span className="text-xs text-[#888888]">Filter Alarm Grade:</span>
          <div className="flex rounded-md bg-white border border-[#E8E8E6] p-1 gap-1 text-xs">
            {["All", "🔴 Overdue", "🟡 Urgent", "🟢 Normal"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-3 py-1 rounded text-[11px] font-medium transition-all ${
                  levelFilter === lvl
                    ? "bg-[#051C2C] text-white"
                    : "text-[#888888] hover:bg-[#F5F5F2] hover:text-[#051C2C]"
                }`}
              >
                {lvl === "All" ? "All Grades" : lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Engine Output Register Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#E8E8E6]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#051C2C]/4 border-b-2 border-[#051C2C]/10 h-11 text-[11px] font-label-caps text-[#051C2C] tracking-wider uppercase">
                <th className="px-4 py-3 font-semibold w-36">Source entity</th>
                <th className="px-4 py-3 font-semibold w-44">Trigger Stream</th>
                <th className="px-4 py-3 font-semibold">Alarm Detail / Property Context</th>
                <th className="px-4 py-3 font-semibold text-center w-36">Due Date</th>
                <th className="px-4 py-3 font-semibold text-right w-36">Days Remaining</th>
                <th className="px-4 py-3 font-semibold text-center w-40">Status Flag</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-xs text-[#888888]">
                    No critical events match the active category filter logic.
                  </td>
                </tr>
              ) : (
                filtered.map((alert, index) => {
                  const isRed = alert.alertLevel === "🔴 Overdue";
                  const isYellow = alert.alertLevel === "🟡 Urgent";

                  // Conditional classes defined according to prompt's styling guidelines:
                  // "如果包含 '🔴'，填充淡红色背景 + 深红文字；如果包含 '🟡'，填充淡黄色背景 + 深黄文字。"
                  let badgeClass = "bg-[#00C853]/10 text-[#00C853]";
                  if (isRed) {
                    badgeClass = "bg-[#D32F2F]/10 text-[#D32F2F] font-bold";
                  } else if (isYellow) {
                    badgeClass = "bg-yellow-50 text-yellow-600 font-bold";
                  }

                  let rowBg = "hover:bg-[#F5F5F2]/30 transition-colors";
                  if (isRed) {
                    rowBg = "bg-[#D32F2F]/4 hover:bg-[#D32F2F]/10 transition-colors";
                  }

                  return (
                    <tr key={index} className={`border-b border-[#E8E8E6] h-11 text-[13px] ${rowBg}`}>
                      <td className="px-4 py-2 text-[#051C2C] font-semibold">
                        <span className="bg-[#051C2C]/5 text-[#051C2C] font-mono text-xs px-2 py-0.5 rounded font-bold">
                          {alert.sourceId}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className="font-label-caps uppercase text-[10px] text-[#888888] flex items-center gap-1">
                          <CornerDownRight className="w-3.5 h-3.5 text-[#2251FF]" />
                          {alert.sourceType}
                        </span>
                      </td>
                      <td className={`px-4 py-2 ${isRed ? "text-[#D32F2F] font-semibold" : "text-[#051C2C]"}`}>
                        {alert.targetItem}
                      </td>
                      <td className="px-4 py-2 text-center font-mono font-medium text-xs text-[#051C2C]">
                        {alert.dueDate}
                      </td>
                      <td className={`px-4 py-2 text-right font-mono font-bold ${isRed ? "text-[#D32F2F]" : isYellow ? "text-yellow-600" : "text-[#888888]"}`}>
                        {alert.daysRemaining > 0 ? `+${alert.daysRemaining}` : alert.daysRemaining} days
                      </td>
                      <td className="px-4 py-2 text-center select-none">
                        <span className={`inline-block px-3 py-1 rounded-full text-[11px] ${badgeClass}`}>
                          {alert.alertLevel}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Advice Block */}
      <div className="bg-[#2251FF]/4 border-l-4 border-[#2251FF] p-4 rounded-lg shadow-sm">
        <h4 className="font-heading-serif text-base font-semibold text-[#051C2C] mb-1">
          Compliance Standard Operating Guidelines:
        </h4>
        <ul className="list-disc pl-5 text-xs text-[#888888] space-y-1 mt-2">
          <li>Check this dashboard daily. Any <span className="text-[#D32F2F] font-semibold">🔴 Overdue</span> issue requires immediate mitigation or update.</li>
          <li>For <span className="text-yellow-600 font-semibold">🟡 Urgent</span> items, renew contracts or check smoke alarm inspect schedules before they cross zero.</li>
          <li>When you perform the action, navigate to Properties, Tenants, or Maintenance to log updates. This clears alerts immediately.</li>
        </ul>
      </div>
    </div>
  );
}
