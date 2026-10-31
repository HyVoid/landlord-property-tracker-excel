import React, { useState } from "react";
import { Interaction, Tenant } from "../types";
import { Plus, Search, HelpCircle, FileText, AlertCircle, Trash2, Calendar } from "lucide-react";

interface InteractionsSheetProps {
  interactions: Interaction[];
  tenants: Tenant[];
  onUpdateInteractions: (updater: Interaction[]) => void;
  communicationMethods: string[];
}

export default function InteractionsSheet({
  interactions,
  tenants,
  onUpdateInteractions,
  communicationMethods,
}: InteractionsSheetProps) {
  const [search, setSearch] = useState("");
  const [newActionId, setNewActionId] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTenantId, setNewTenantId] = useState("");
  const [newMethod, setNewMethod] = useState(communicationMethods[0] || "WeChat");
  const [newSummary, setNewSummary] = useState("");
  const [newNextStep, setNewNextStep] = useState("");
  const [valError, setValError] = useState("");

  const handleFieldChange = (id: string, field: keyof Interaction, value: string) => {
    const updated = interactions.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onUpdateInteractions(updated);
  };

  const handleAddInteraction = (e: React.FormEvent) => {
    e.preventDefault();
    setValError("");

    // Validate Action ID format e.g. ACT0001
    const idPattern = /^ACT\d{4}$/;
    if (!idPattern.test(newActionId)) {
      setValError("Invalid ID format. Must start with 'ACT' followed by exactly 4 digits (e.g. ACT0004).");
      return;
    }

    // Check duplicate ID
    if (interactions.some((item) => item.id === newActionId)) {
      setValError(`Duplicate ID found: Communication record with ID ${newActionId} already exists.`);
      return;
    }

    if (!newTenantId) {
      setValError("You must select a linkable Tenant recipient profile.");
      return;
    }

    if (!newSummary.trim()) {
      setValError("Context Summary cannot be empty.");
      return;
    }

    const newInteract: Interaction = {
      id: newActionId,
      date: newDate || new Date().toISOString().split("T")[0],
      tenantId: newTenantId,
      method: newMethod,
      summary: newSummary,
      nextStep: newNextStep || "None",
    };

    onUpdateInteractions([...interactions, newInteract]);

    // Reset components
    setNewActionId("");
    setNewDate("");
    setNewTenantId("");
    setNewSummary("");
    setNewNextStep("");
  };

  const handleDelete = (id: string) => {
    if (confirm(`Are you sure you want to delete interaction log ${id}?`)) {
      onUpdateInteractions(interactions.filter((item) => item.id !== id));
    }
  };

  const suggestNextId = () => {
    const maxNumber = interactions.reduce((acc, curr) => {
      const match = curr.id.match(/^ACT(\d{4})$/);
      if (match) {
        const num = parseInt(match[1]);
        return num > acc ? num : acc;
      }
      return acc;
    }, 0);
    const nextNum = maxNumber + 1;
    setNewActionId(`ACT${String(nextNum).padStart(4, "0")}`);
  };

  const filteredInteractions = interactions.filter((item) => {
    const tenant = tenants.find((t) => t.id === item.tenantId);
    const tenantName = tenant ? tenant.name : "";
    return (
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.tenantId.toLowerCase().includes(search.toLowerCase()) ||
      tenantName.toLowerCase().includes(search.toLowerCase()) ||
      item.method.toLowerCase().includes(search.toLowerCase()) ||
      item.summary.toLowerCase().includes(search.toLowerCase()) ||
      item.nextStep.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="fade-up-animation flex flex-col gap-6">
      {/* Explanation panel */}
      <div className="bg-[#2251FF]/4 border-l-4 border-[#2251FF] p-4 rounded-r-lg shadow-sm">
        <h3 className="font-heading-serif text-lg font-semibold text-[#051C2C] flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#2251FF]" />
          Communications Logbook & Tenant Requests (Sheet: 03_Interactions)
        </h3>
        <p className="text-xs text-[#888888] mt-1 font-sans">
          This system functions to record historical dialogue logs, inquiries, and complaints.
          Selecting a <strong>Tenant ID</strong> will trigger a React representation of <code>XLOOKUP</code> logic to automatically fetch and exhibit the tenant's full profile name.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#888888]" />
          <input
            type="text"
            placeholder="Search action ID, tenant name, text context..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-md bg-white border border-[#E8E8E6] text-[#051C2C] focus:outline-none focus:border-[#2251FF] shadow-sm"
          />
        </div>
        <div className="text-xs text-[#888888] flex items-center gap-1.5 self-end">
          <span className="font-semibold text-[#051C2C]">{filteredInteractions.length}</span> logs showing of {interactions.length} total
        </div>
      </div>

      {/* Primary Table Grid */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#E8E8E6]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#051C2C]/4 border-b-2 border-[#051C2C]/10 h-11 text-[11px] font-label-caps text-[#051C2C] tracking-wider uppercase">
                <th className="px-4 py-3 font-semibold">Action ID</th>
                <th className="px-4 py-3 font-semibold">Contact Date</th>
                <th className="px-4 py-3 font-semibold">Tenant ID</th>
                <th className="px-4 py-3 font-semibold">Resolved Name (XLOOKUP)</th>
                <th className="px-4 py-3 font-semibold">Method</th>
                <th className="px-4 py-3 font-semibold">Conversation Summary</th>
                <th className="px-4 py-3 font-semibold">Next Steps / Action Item</th>
                <th className="px-4 py-3 font-semibold text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInteractions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-xs text-[#888888]">
                    No communications recorded matching current query parameters.
                  </td>
                </tr>
              ) : (
                filteredInteractions.map((item) => {
                  // Resolve XLOOKUP format
                  const tenant = tenants.find((t) => t.id === item.tenantId);
                  const tenantNameShow = tenant ? tenant.name : "Unknown/Unknown";

                  return (
                    <tr
                      key={item.id}
                      className="border-b border-[#E8E8E6] hover:bg-[#F5F5F2]/50 transition-colors h-11 text-[13px] group"
                    >
                      <td className="px-4 py-2 font-mono text-xs font-semibold text-[#051C2C]">
                        <span className="bg-[#051C2C]/5 text-[#051C2C] px-2 py-0.5 rounded text-[11px] font-bold">
                          {item.id}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="date"
                          value={item.date}
                          onChange={(e) => handleFieldChange(item.id, "date", e.target.value)}
                          className="px-1.5 py-0.5 bg-[#FFFDE7] rounded text-xs border border-transparent focus:outline-none focus:border-[#2251FF] text-center"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={item.tenantId}
                          onChange={(e) => handleFieldChange(item.id, "tenantId", e.target.value)}
                          className="px-1.5 py-1 bg-[#FFFDE7] rounded text-xs focus:outline-none focus:border-[#2251FF] font-mono text-[#051C2C]"
                        >
                          {tenants.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.id}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2 text-[#051C2C] font-semibold">
                        {tenantNameShow}
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={item.method}
                          onChange={(e) => handleFieldChange(item.id, "method", e.target.value)}
                          className="px-1 py-1 bg-[#FFFDE7] rounded text-xs border border-transparent focus:outline-none focus:border-[#2251FF] text-[#051C2C]"
                        >
                          {communicationMethods.map((method) => (
                            <option key={method} value={method}>
                              {method}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2 min-w-[200px]">
                        <input
                          type="text"
                          value={item.summary}
                          onChange={(e) => handleFieldChange(item.id, "summary", e.target.value)}
                          className="w-full px-2 py-1 bg-[#FFFDE7] rounded text-xs border border-transparent focus:outline-none focus:border-[#2251FF] text-[#051C2C]"
                        />
                      </td>
                      <td className="px-4 py-2 min-w-[200px]">
                        <input
                          type="text"
                          value={item.nextStep}
                          onChange={(e) => handleFieldChange(item.id, "nextStep", e.target.value)}
                          className="w-full px-2 py-1 bg-[#FFFDE7] rounded text-xs border border-transparent focus:outline-none focus:border-[#2251FF] text-[#051C2C]"
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-slate-400 hover:text-[#D32F2F] p-1 rounded-md hover:bg-[#D32F2F]/5 active:scale-90 transition-transform"
                          title="Delete link"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Addition Card Row */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#E8E8E6] p-5 floating-card-lift">
        <h4 className="font-heading-serif text-base font-semibold text-[#051C2C] mb-3 flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-[#2251FF]" />
          Log Communication Event (Add Row)
        </h4>

        {valError && (
          <div className="mb-4 bg-[#D32F2F]/4 text-[#D32F2F] border-l-2 border-[#D32F2F] p-3 rounded text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{valError}</span>
          </div>
        )}

        <form onSubmit={handleAddInteraction} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-[#051C2C] font-label-caps uppercase text-[10px] tracking-wide">
                Action ID
              </label>
              <button
                type="button"
                onClick={suggestNextId}
                className="text-[9px] text-[#2251FF] hover:underline"
              >
                Auto-Suggest ID
              </button>
            </div>
            <input
              type="text"
              placeholder="e.g. ACT0004"
              value={newActionId}
              onChange={(e) => setNewActionId(e.target.value.toUpperCase())}
              className="px-3 py-1.5 border border-[#E8E8E6] rounded bg-[#FFFDE7] text-xs focus:outline-none focus:border-[#2251FF] text-[#051C2C]"
              required
            />
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <label className="font-semibold text-[#051C2C] font-label-caps uppercase text-[10px] tracking-wide">
              Communication Date
            </label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="px-3 py-1.5 border border-[#E8E8E6] rounded bg-[#FFFDE7] text-xs focus:outline-none focus:border-[#2251FF] text-[#051C2C]"
            />
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <label className="font-semibold text-[#051C2C] font-label-caps uppercase text-[10px] tracking-wide">
              Selected Tenant Target
            </label>
            <select
              value={newTenantId}
              onChange={(e) => setNewTenantId(e.target.value)}
              className="px-3 py-1.5 border border-[#E8E8E6] rounded bg-[#FFFDE7] text-xs focus:outline-none focus:border-[#2251FF] text-[#051C2C]"
              required
            >
              <option value="">-- Choose Tenant --</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.id} - {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <label className="font-semibold text-[#051C2C] font-label-caps uppercase text-[10px] tracking-wide">
              Communication Method
            </label>
            <select
              value={newMethod}
              onChange={(e) => setNewMethod(e.target.value)}
              className="px-3 py-1.5 border border-[#E8E8E6] rounded bg-[#FFFDE7] text-xs focus:outline-none focus:border-[#2251FF] text-[#051C2C]"
            >
              {communicationMethods.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1 text-xs md:col-span-2">
            <label className="font-semibold text-[#051C2C] font-label-caps uppercase text-[10px] tracking-wide">
              Conversation Summary Context
            </label>
            <input
              type="text"
              placeholder="e.g. Complained about the air conditioner filter needing clean..."
              value={newSummary}
              onChange={(e) => setNewSummary(e.target.value)}
              className="px-3 py-1.5 border border-[#E8E8E6] rounded bg-[#FFFDE7] text-xs focus:outline-none focus:border-[#2251FF] text-[#051C2C]"
              required
            />
          </div>

          <div className="flex flex-col gap-1 text-xs md:col-span-2">
            <label className="font-semibold text-[#051C2C] font-label-caps uppercase text-[10px] tracking-wide">
              Next Action Item / Deadline Plan
            </label>
            <input
              type="text"
              placeholder="e.g. Coordinate clean on next Tuesday check-out gap time..."
              value={newNextStep}
              onChange={(e) => setNewNextStep(e.target.value)}
              className="px-3 py-1.5 border border-[#E8E8E6] rounded bg-[#FFFDE7] text-xs focus:outline-none focus:border-[#2251FF] text-[#051C2C]"
            />
          </div>

          <div className="md:col-span-4 flex justify-end mt-2">
            <button
              type="submit"
              className="bg-[#051C2C] hover:bg-[#2251FF] text-white text-xs font-semibold px-6 py-2 rounded-md active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              Record Communication Log (Append)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
