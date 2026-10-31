import React, { useState } from "react";
import { SystemSettings } from "../types";
import { Save, Calendar, ShieldAlert, Plus, Trash2, Sliders, Check, HelpCircle } from "lucide-react";

interface SettingsSheetProps {
  settings: SystemSettings;
  onUpdateSettings: (updater: SystemSettings) => void;
}

export default function SettingsSheet({ settings, onUpdateSettings }: SettingsSheetProps) {
  const [alertDays, setAlertDays] = useState(settings.alertDays);
  const [currentDate, setCurrentDate] = useState(settings.currentDate);
  const [newPropType, setNewPropType] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [newMethod, setNewMethod] = useState("");
  const [newMaintStatus, setNewMaintStatus] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSaveStandard = () => {
    onUpdateSettings({
      ...settings,
      alertDays: Number(alertDays) || 30,
      currentDate: currentDate || "2026-06-22",
    });
    triggerSuccess("Standard parameters synchronized successfully.");
  };

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleAddPropType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPropType.trim()) return;
    if (settings.propertyTypes.includes(newPropType.trim())) return;
    onUpdateSettings({
      ...settings,
      propertyTypes: [...settings.propertyTypes, newPropType.trim()],
    });
    setNewPropType("");
    triggerSuccess("Added custom Property Type.");
  };

  const handleDeletePropType = (type: string) => {
    if (settings.propertyTypes.length <= 1) {
      alert("At least one Property Type parameter must remain active.");
      return;
    }
    onUpdateSettings({
      ...settings,
      propertyTypes: settings.propertyTypes.filter((t) => t !== type),
    });
    triggerSuccess("Removed Property Type.");
  };

  const handleAddStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatus.trim()) return;
    if (settings.propertyStatuses.includes(newStatus.trim())) return;
    onUpdateSettings({
      ...settings,
      propertyStatuses: [...settings.propertyStatuses, newStatus.trim()],
    });
    setNewStatus("");
    triggerSuccess("Added custom Property Status.");
  };

  const handleDeleteStatus = (status: string) => {
    if (settings.propertyStatuses.length <= 1) {
      alert("At least one Property Status parameter must remain active.");
      return;
    }
    onUpdateSettings({
      ...settings,
      propertyStatuses: settings.propertyStatuses.filter((s) => s !== status),
    });
    triggerSuccess("Removed Property Status.");
  };

  const handleAddMethod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMethod.trim()) return;
    if (settings.communicationMethods.includes(newMethod.trim())) return;
    onUpdateSettings({
      ...settings,
      communicationMethods: [...settings.communicationMethods, newMethod.trim()],
    });
    setNewMethod("");
    triggerSuccess("Added custom Communication Method.");
  };

  const handleDeleteMethod = (method: string) => {
    if (settings.communicationMethods.length <= 1) {
      alert("At least one Communication Method parameter must remain active.");
      return;
    }
    onUpdateSettings({
      ...settings,
      communicationMethods: settings.communicationMethods.filter((m) => m !== method),
    });
    triggerSuccess("Removed Communication Method.");
  };

  const handleAddMaintStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaintStatus.trim()) return;
    if (settings.maintenanceStatuses.includes(newMaintStatus.trim())) return;
    onUpdateSettings({
      ...settings,
      maintenanceStatuses: [...settings.maintenanceStatuses, newMaintStatus.trim()],
    });
    setNewMaintStatus("");
    triggerSuccess("Added custom Maintenance Status.");
  };

  const handleDeleteMaintStatus = (mStatus: string) => {
    if (settings.maintenanceStatuses.length <= 1) {
      alert("At least one Maintenance Status parameter must remain active.");
      return;
    }
    onUpdateSettings({
      ...settings,
      maintenanceStatuses: settings.maintenanceStatuses.filter((s) => s !== mStatus),
    });
    triggerSuccess("Removed Maintenance Status.");
  };

  return (
    <div className="fade-up-animation flex flex-col gap-6">
      {/* Settings Info Block */}
      <div className="bg-[#2251FF]/4 border-l-4 border-[#2251FF] p-4 rounded-r-lg shadow-sm">
        <h3 className="font-heading-serif text-lg font-semibold text-[#051C2C] flex items-center gap-2">
          <Sliders className="w-5 h-5 text-[#2251FF]" />
          System Settings & Simulation Parameters (Sheet: 00_Settings)
        </h3>
        <p className="text-xs text-[#888888] mt-1 font-sans">
          Central management panel containing global variables, alert windows, dropdown constants, and current evaluation date. 
          Use the <strong>Evaluated system date</strong> to change "today's time pointer" and study exactly how formulas adjust warning categories instantly.
        </p>
      </div>

      {successMsg && (
        <div className="bg-[#00C853]/10 border-l-2 border-[#00C853] text-[#00C853] p-3 rounded text-xs flex items-center gap-2 font-medium duration-300">
          <Check className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Primary configuration card */}
      <div className="bg-white rounded-xl shadow-md border border-[#E8E8E6] p-6">
        <h4 className="font-heading-serif text-base font-semibold text-[#051C2C] mb-4 flex items-center gap-1.5 border-b border-[#F5F5F2] pb-2">
          Operational Core Constants
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Evaluation Date Picker */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-xs text-[#051C2C] font-label-caps uppercase tracking-wide flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#2251FF]" />
              Evaluated system date (TODAY Baseline)
            </label>
            <input
              type="date"
              value={currentDate}
              onChange={(e) => {
                setCurrentDate(e.target.value);
                onUpdateSettings({ ...settings, currentDate: e.target.value });
                triggerSuccess(`System Date moved to: ${e.target.value}. Recalculating alarms...`);
              }}
              className="px-3 py-2 border border-[#E8E8E6] rounded bg-[#FFFDE7] text-xs font-semibold focus:outline-none focus:border-[#2251FF] text-[#051C2C]"
            />
            <span className="text-[10px] text-[#888888] italic">
              All excel formulas inside the Alerts and Dashboard segments resolve relative to this coordinate. Default value is "2026-06-22".
            </span>
          </div>

          {/* Alarm Days Trigger */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-xs text-[#051C2C] font-label-caps uppercase tracking-wide flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-[#2251FF]" />
              Alert Warning Interval (T_Threshold Days)
            </label>
            <input
              type="number"
              min="1"
              max="365"
              value={alertDays}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 30;
                setAlertDays(val);
                onUpdateSettings({ ...settings, alertDays: val });
                triggerSuccess(`Alarm threshold adjusted to ${val} days.`);
              }}
              className="px-3 py-2 border border-[#E8E8E6] rounded bg-[#FFFDE7] text-xs font-semibold focus:outline-none focus:border-[#2251FF] text-[#051C2C]"
            />
            <span className="text-[10px] text-[#888888] italic">
              Events approaching within this window trigger yellow alert classifications.
            </span>
          </div>

          <div className="flex items-center justify-center p-4 bg-[#F5F5F2] rounded-lg border border-[#E8E8E6] text-center select-none">
            <div>
              <div className="text-[10px] font-label-caps text-[#888888] uppercase tracking-wider font-semibold">
                Status Matrix Index Engine
              </div>
              <div className="text-xs text-[#051C2C] italic mt-1 font-semibold">
                Formula Active & Compiled
              </div>
              <div className="text-[10px] text-[#888888] mt-1 font-mono">
                Valuation: {settings.currentDate} (Alert Days: {settings.alertDays})
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subsection tags columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dropdown 1: Property Types list */}
        <div className="bg-white rounded-xl shadow-md border border-[#E8E8E6] p-5">
          <h4 className="font-heading-serif text-sm font-semibold text-[#051C2C] mb-3 border-b border-[#F5F5F2] pb-1.5 uppercase tracking-wide">
            Property Sub-Types
          </h4>
          <div className="flex flex-wrap gap-1.5 mb-4 select-none">
            {settings.propertyTypes.map((type) => (
              <span
                key={type}
                className="inline-flex items-center gap-1 bg-[#051C2C]/5 text-[#051C2C] text-xs px-2.5 py-1 rounded-full font-medium"
              >
                {type}
                <button
                  onClick={() => handleDeletePropType(type)}
                  className="hover:bg-red-100 hover:text-red-600 rounded-full p-0.5 text-[#888888] transition-colors"
                  title="Remove Type"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          <form onSubmit={handleAddPropType} className="flex gap-2">
            <input
              type="text"
              placeholder="Add custom e.g., Villa, Loft..."
              value={newPropType}
              onChange={(e) => setNewPropType(e.target.value)}
              className="flex-1 px-3 py-1 bg-[#FFFDE7] border border-[#E8E8E6] rounded text-xs focus:outline-none focus:border-[#2251FF]"
            />
            <button
              type="submit"
              className="bg-[#051C2C] hover:bg-[#2251FF] text-white text-xs px-3 py-1 rounded-md transition-colors"
            >
              Add
            </button>
          </form>
        </div>

        {/* Dropdown 2: Property Status list */}
        <div className="bg-white rounded-xl shadow-md border border-[#E8E8E6] p-5">
          <h4 className="font-heading-serif text-sm font-semibold text-[#051C2C] mb-3 border-b border-[#F5F5F2] pb-1.5 uppercase tracking-wide">
            Property Status Enums
          </h4>
          <div className="flex flex-wrap gap-1.5 mb-4 select-none">
            {settings.propertyStatuses.map((stat) => (
              <span
                key={stat}
                className="inline-flex items-center gap-1 bg-[#051C2C]/5 text-[#051C2C] text-xs px-2.5 py-1 rounded-full font-medium"
              >
                {stat}
                <button
                  onClick={() => handleDeleteStatus(stat)}
                  className="hover:bg-red-100 hover:text-red-600 rounded-full p-0.5 text-[#888888] transition-colors"
                  title="Remove Status"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          <form onSubmit={handleAddStatus} className="flex gap-2">
            <input
              type="text"
              placeholder="Add custom status..."
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="flex-1 px-3 py-1 bg-[#FFFDE7] border border-[#E8E8E6] rounded text-xs focus:outline-none focus:border-[#2251FF]"
            />
            <button
              type="submit"
              className="bg-[#051C2C] hover:bg-[#2251FF] text-white text-xs px-3 py-1 rounded-md transition-colors"
            >
              Add
            </button>
          </form>
        </div>

        {/* Dropdown 3: Communication Methods */}
        <div className="bg-white rounded-xl shadow-md border border-[#E8E8E6] p-5">
          <h4 className="font-heading-serif text-sm font-semibold text-[#051C2C] mb-3 border-b border-[#F5F5F2] pb-1.5 uppercase tracking-wide">
            Communication Channels
          </h4>
          <div className="flex flex-wrap gap-1.5 mb-4 select-none">
            {settings.communicationMethods.map((m) => (
              <span
                key={m}
                className="inline-flex items-center gap-1 bg-[#051C2C]/5 text-[#051C2C] text-xs px-2.5 py-1 rounded-full font-medium"
              >
                {m}
                <button
                  onClick={() => handleDeleteMethod(m)}
                  className="hover:bg-red-100 hover:text-red-600 rounded-full p-0.5 text-[#888888] transition-colors"
                  title="Remove Channel"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          <form onSubmit={handleAddMethod} className="flex gap-2">
            <input
              type="text"
              placeholder="Add communication channel..."
              value={newMethod}
              onChange={(e) => setNewMethod(e.target.value)}
              className="flex-1 px-3 py-1 bg-[#FFFDE7] border border-[#E8E8E6] rounded text-xs focus:outline-none focus:border-[#2251FF]"
            />
            <button
              type="submit"
              className="bg-[#051C2C] hover:bg-[#2251FF] text-white text-xs px-3 py-1 rounded-md transition-colors"
            >
              Add
            </button>
          </form>
        </div>

        {/* Dropdown 4: Maintenance Statuses */}
        <div className="bg-white rounded-xl shadow-md border border-[#E8E8E6] p-5">
          <h4 className="font-heading-serif text-sm font-semibold text-[#051C2C] mb-3 border-b border-[#F5F5F2] pb-1.5 uppercase tracking-wide">
            Upkeep Process Status Steps
          </h4>
          <div className="flex flex-wrap gap-1.5 mb-4 select-none">
            {settings.maintenanceStatuses.map((ms) => (
              <span
                key={ms}
                className="inline-flex items-center gap-1 bg-[#051C2C]/5 text-[#051C2C] text-xs px-2.5 py-1 rounded-full font-medium"
              >
                {ms}
                <button
                  onClick={() => handleDeleteMaintStatus(ms)}
                  className="hover:bg-red-100 hover:text-red-600 rounded-full p-0.5 text-[#888888] transition-colors"
                  title="Remove Upkeep Status"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          <form onSubmit={handleAddMaintStatus} className="flex gap-2">
            <input
              type="text"
              placeholder="Add upkeep process status..."
              value={newMaintStatus}
              onChange={(e) => setNewMaintStatus(e.target.value)}
              className="flex-1 px-3 py-1 bg-[#FFFDE7] border border-[#E8E8E6] rounded text-xs focus:outline-none focus:border-[#2251FF]"
            />
            <button
              type="submit"
              className="bg-[#051C2C] hover:bg-[#2251FF] text-white text-xs px-3 py-1 rounded-md transition-colors"
            >
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
