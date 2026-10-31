import React, { useState } from "react";
import { Maintenance, Property } from "../types";
import { Plus, Search, HelpCircle, FileText, AlertCircle, Trash2, ShieldAlert } from "lucide-react";

interface MaintenanceSheetProps {
  maintenanceList: Maintenance[];
  properties: Property[];
  onUpdateMaintenance: (updater: Maintenance[]) => void;
  maintenanceStatuses: string[];
}

export default function MaintenanceSheet({
  maintenanceList,
  properties,
  onUpdateMaintenance,
  maintenanceStatuses,
}: MaintenanceSheetProps) {
  const [search, setSearch] = useState("");
  const [newMaintId, setNewMaintId] = useState("");
  const [newReportDate, setNewReportDate] = useState("");
  const [newPropId, setNewPropId] = useState("");
  const [newIssueDesc, setNewIssueDesc] = useState("");
  const [newContractor, setNewContractor] = useState("");
  const [newStatus, setNewStatus] = useState(maintenanceStatuses[0] || "Pending");
  const [newResolveDate, setNewResolveDate] = useState("");
  const [newCost, setNewCost] = useState<number>(0);
  const [valError, setValError] = useState("");

  // Determine maximum Cost to dynamically scale our inline aesthetic indicators
  const maxCost = maintenanceList.reduce((max, m) => (m.cost > max ? m.cost : max), 100) || 500;

  const handleFieldChange = (id: string, field: keyof Maintenance, value: any) => {
    const updated = maintenanceList.map((m) => {
      if (m.id === id) {
        if (field === "cost") {
          return { ...m, [field]: parseFloat(value) || 0 };
        }
        
        // Auto-validate status & resolveDate relations
        let updatedItem = { ...m, [field]: value };
        if (field === "status" && value === "Resolved" && !m.resolveDate) {
          // pre-fill today's date if missing and resolved
          updatedItem.resolveDate = new Date().toISOString().split("T")[0];
        } else if (field === "status" && value !== "Resolved") {
          updatedItem.resolveDate = "";
        }
        return updatedItem;
      }
      return m;
    });
    onUpdateMaintenance(updated);
  };

  const handleAddMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    setValError("");

    // Format validation of Maint_ID: starts with 'M' followed by 3 digits
    const idPattern = /^M\d{3}$/;
    if (!idPattern.test(newMaintId)) {
      setValError("Invalid ID format. Must start with 'M' followed by exactly 3 digits (e.g. M004).");
      return;
    }

    // Duplicate check
    if (maintenanceList.some((m) => m.id === newMaintId)) {
      setValError(`Duplicate ID found: Maintenance ticket ${newMaintId} already exists.`);
      return;
    }

    if (!newPropId) {
      setValError("A valid Property profile must be associated.");
      return;
    }

    if (!newIssueDesc.trim()) {
      setValError("Problem/Issue Description cannot be left blank.");
      return;
    }

    // Date validator logic: Resolve Date must be after Report Date
    if (newStatus === "Resolved") {
      if (!newResolveDate) {
        setValError("You must provide a valid Resolve Date once the ticket status is marked as Resolved.");
        return;
      }
      
      if (newReportDate && newResolveDate) {
        const report = new Date(newReportDate);
        const resolved = new Date(newResolveDate);
        if (resolved < report) {
          setValError("Conflict: Resolve Date cannot precede the original Issue Report Date.");
          return;
        }
      }
    }

    const newTicket: Maintenance = {
      id: newMaintId,
      reportDate: newReportDate || new Date().toISOString().split("T")[0],
      propId: newPropId,
      issueDesc: newIssueDesc,
      contractor: newContractor || "General Handyman Crew",
      status: newStatus,
      resolveDate: newStatus === "Resolved" ? newResolveDate : "",
      cost: newCost || 0,
    };

    onUpdateMaintenance([...maintenanceList, newTicket]);

    // Resetting forms
    setNewMaintId("");
    setNewReportDate("");
    setNewPropId("");
    setNewIssueDesc("");
    setNewContractor("");
    setNewStatus(maintenanceStatuses[0] || "Pending");
    setNewResolveDate("");
    setNewCost(0);
  };

  const handleDelete = (id: string) => {
    if (confirm(`Are you absolutely sure you want to delete maintenance record ${id}?`)) {
      onUpdateMaintenance(maintenanceList.filter((m) => m.id !== id));
    }
  };

  const suggestNextId = () => {
    const maxNumber = maintenanceList.reduce((acc, curr) => {
      const match = curr.id.match(/^M(\d{3})$/);
      if (match) {
        const num = parseInt(match[1]);
        return num > acc ? num : acc;
      }
      return acc;
    }, 0);
    const nextNum = maxNumber + 1;
    setNewMaintId(`M${String(nextNum).padStart(3, "0")}`);
  };

  const filteredMaintenance = maintenanceList.filter((m) => {
    const prop = properties.find((p) => p.id === m.propId);
    const propDetails = prop ? prop.address : "";
    return (
      m.id.toLowerCase().includes(search.toLowerCase()) ||
      m.propId.toLowerCase().includes(search.toLowerCase()) ||
      m.issueDesc.toLowerCase().includes(search.toLowerCase()) ||
      m.contractor.toLowerCase().includes(search.toLowerCase()) ||
      m.status.toLowerCase().includes(search.toLowerCase()) ||
      propDetails.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="fade-up-animation flex flex-col gap-6">
      {/* Overview Block */}
      <div className="bg-[#2251FF]/4 border-l-4 border-[#2251FF] p-4 rounded-r-lg shadow-sm">
        <h3 className="font-heading-serif text-lg font-semibold text-[#051C2C] flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#2251FF]" />
          Maintenance Logbook & Repair Cost Tracker (Sheet: 04_Maintenance)
        </h3>
        <p className="text-xs text-[#888888] mt-1 font-sans">
          Record property upkeep projects, plumbers, technicians, and repair invoices.
          System ensures conditional logical tests where marking a row as <strong>Resolved</strong> mandates a corresponding <strong>Resolve Date</strong> ($\ge$ Report Date).
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#888888]" />
          <input
            type="text"
            placeholder="Search ticket ID, status, description, contractor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-md bg-white border border-[#E8E8E6] text-[#051C2C] focus:outline-none focus:border-[#2251FF] shadow-sm"
          />
        </div>
        <div className="text-xs text-[#888888] flex items-center gap-1.5 self-end">
          <span className="font-semibold text-[#051C2C]">{filteredMaintenance.length}</span> tickets showing of {maintenanceList.length} total
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#E8E8E6]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#051C2C]/4 border-b-2 border-[#051C2C]/10 h-11 text-[11px] font-label-caps text-[#051C2C] tracking-wider uppercase">
                <th className="px-4 py-3 font-semibold">Maint ID</th>
                <th className="px-4 py-3 font-semibold">Report Date</th>
                <th className="px-4 py-3 font-semibold">Associated Prop</th>
                <th className="px-4 py-3 font-semibold">Issue/Problem Details</th>
                <th className="px-4 py-3 font-semibold">Contractor Info</th>
                <th className="px-4 py-3 font-semibold">Ticket Status</th>
                <th className="px-4 py-3 font-semibold">Resolve Date</th>
                <th className="px-4 py-3 font-semibold text-right" style={{ width: "170px" }}>Repair Cost ($)</th>
                <th className="px-4 py-3 font-semibold text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMaintenance.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-xs text-[#888888]">
                    No maintenance worksheets matching active search rules found.
                  </td>
                </tr>
              ) : (
                filteredMaintenance.map((m) => {
                  const prop = properties.find((p) => p.id === m.propId);
                  const isResolved = m.status === "Resolved";
                  const costPercentage = Math.min((m.cost / maxCost) * 100, 100);

                  return (
                    <tr
                      key={m.id}
                      className="border-b border-[#E8E8E6] hover:bg-[#F5F5F2]/50 transition-colors h-11 text-[13px] group"
                    >
                      <td className="px-4 py-2 font-mono text-xs font-semibold text-[#051C2C]">
                        <span className="bg-[#051C2C]/5 text-[#051C2C] px-2 py-0.5 rounded text-[11px] font-bold">
                          {m.id}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="date"
                          value={m.reportDate}
                          onChange={(e) => handleFieldChange(m.id, "reportDate", e.target.value)}
                          className="px-1.5 py-0.5 bg-[#FFFDE7] rounded text-xs border border-transparent focus:outline-none focus:border-[#2251FF] text-center"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={m.propId}
                          onChange={(e) => handleFieldChange(m.id, "propId", e.target.value)}
                          className="px-1.5 py-1 bg-[#FFFDE7] rounded text-xs focus:outline-none focus:border-[#2251FF] font-mono text-[#051C2C]"
                        >
                          {properties.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.id} - {p.address.substring(0, 18)}...
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2 min-w-[180px]">
                        <input
                          type="text"
                          value={m.issueDesc}
                          onChange={(e) => handleFieldChange(m.id, "issueDesc", e.target.value)}
                          className="w-full px-2 py-1 bg-[#FFFDE7] rounded text-xs border border-transparent focus:outline-none focus:border-[#2251FF] text-[#051C2C]"
                        />
                      </td>
                      <td className="px-4 py-2 min-w-[150px]">
                        <input
                          type="text"
                          value={m.contractor}
                          onChange={(e) => handleFieldChange(m.id, "contractor", e.target.value)}
                          className="w-full px-2 py-1 bg-[#FFFDE7] rounded text-xs border border-transparent focus:outline-none focus:border-[#2251FF] text-[#051C2C]"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={m.status}
                          onChange={(e) => handleFieldChange(m.id, "status", e.target.value)}
                          className="px-1.5 py-0.5 bg-[#FFFDE7] rounded text-xs border border-transparent focus:outline-none focus:border-[#2251FF] font-semibold text-[#051C2C]"
                        >
                          {maintenanceStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        {isResolved ? (
                          <input
                            type="date"
                            value={m.resolveDate}
                            onChange={(e) => handleFieldChange(m.id, "resolveDate", e.target.value)}
                            className="px-1.5 py-0.5 bg-[#FFFDE7] rounded text-xs border border-transparent focus:outline-none focus:border-[#2251FF] text-center"
                          />
                        ) : (
                          <span className="text-xs text-[#888888] italic px-2 block text-center bg-slate-50 py-0.5 rounded">
                            Unresolved
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-xs text-[#051C2C] font-mono">$</span>
                            <input
                              type="number"
                              value={m.cost}
                              onChange={(e) => handleFieldChange(m.id, "cost", e.target.value)}
                              className="w-16 px-1 py-0.5 bg-[#FFFDE7] rounded text-xs border border-transparent focus:outline-none focus:border-[#2251FF] text-right font-semibold font-mono"
                            />
                          </div>
                          {/* Animated repair cost slider */}
                          <div className="w-24 bg-[#2251FF]/10 h-1.5 rounded-full overflow-hidden" title={`$${m.cost} representation`}>
                            <div
                              className="bg-[#2251FF] h-full duration-300"
                              style={{ width: `${costPercentage}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => handleDelete(m.id)}
                          className="text-slate-400 hover:text-[#D32F2F] p-1 rounded-md hover:bg-[#D32F2F]/5 active:scale-90 transition-transform"
                          title="Purge Ticket"
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

      {/* Row insertion card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#E8E8E6] p-5 floating-card-lift">
        <h4 className="font-heading-serif text-base font-semibold text-[#051C2C] mb-3 flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-[#2251FF]" />
          Record Modern Maintenance Ticket (Add Row)
        </h4>

        {valError && (
          <div className="mb-4 bg-[#D32F2F]/4 text-[#D32F2F] border-l-2 border-[#D32F2F] p-3 rounded text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{valError}</span>
          </div>
        )}

        <form onSubmit={handleAddMaintenance} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-[#051C2C] font-label-caps uppercase text-[10px] tracking-wide">
                Ticket ID
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
              placeholder="e.g. M004"
              value={newMaintId}
              onChange={(e) => setNewMaintId(e.target.value.toUpperCase())}
              className="px-3 py-1.5 border border-[#E8E8E6] rounded bg-[#FFFDE7] text-xs focus:outline-none focus:border-[#2251FF] text-[#051C2C]"
              required
            />
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <label className="font-semibold text-[#051C2C] font-label-caps uppercase text-[10px] tracking-wide">
              Reported Date
            </label>
            <input
              type="date"
              value={newReportDate}
              onChange={(e) => setNewReportDate(e.target.value)}
              className="px-3 py-1.5 border border-[#E8E8E6] rounded bg-[#FFFDE7] text-xs focus:outline-none focus:border-[#2251FF] text-[#051C2C]"
            />
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <label className="font-semibold text-[#051C2C] font-label-caps uppercase text-[10px] tracking-wide">
              Target Property Unit
            </label>
            <select
              value={newPropId}
              onChange={(e) => setNewPropId(e.target.value)}
              className="px-3 py-1.5 border border-[#E8E8E6] rounded bg-[#FFFDE7] text-xs focus:outline-none focus:border-[#2251FF] text-[#051C2C]"
              required
            >
              <option value="">-- Choose Unit --</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id} - {p.address}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <label className="font-semibold text-[#051C2C] font-label-caps uppercase text-[10px] tracking-wide">
              Responsible Contractor / Handyman
            </label>
            <input
              type="text"
              placeholder="e.g. Dave's Plumbers (+1 555-404-9892)"
              value={newContractor}
              onChange={(e) => setNewContractor(e.target.value)}
              className="px-3 py-1.5 border border-[#E8E8E6] rounded bg-[#FFFDE7] text-xs focus:outline-none focus:border-[#2251FF] text-[#051C2C]"
            />
          </div>

          <div className="flex flex-col gap-1 text-xs md:col-span-2">
            <label className="font-semibold text-[#051C2C] font-label-caps uppercase text-[10px] tracking-wide">
              Problem / Issue Description
            </label>
            <input
              type="text"
              placeholder="e.g. Master ensuite shower plumbing pipe is rattling..."
              value={newIssueDesc}
              onChange={(e) => setNewIssueDesc(e.target.value)}
              className="px-3 py-1.5 border border-[#E8E8E6] rounded bg-[#FFFDE7] text-xs focus:outline-none focus:border-[#2251FF] text-[#051C2C]"
              required
            />
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <label className="font-semibold text-[#051C2C] font-label-caps uppercase text-[10px] tracking-wide">
              Initial Status
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="px-3 py-1.5 border border-[#E8E8E6] rounded bg-[#FFFDE7] text-xs focus:outline-none focus:border-[#2251FF] text-[#051C2C]"
            >
              {maintenanceStatuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {newStatus === "Resolved" && (
            <div className="flex flex-col gap-1 text-xs">
              <label className="font-semibold text-[#D32F2F] font-label-caps uppercase text-[10px] tracking-wide flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-[#D32F2F]" />
                Resolve Date (Mandated)
              </label>
              <input
                type="date"
                value={newResolveDate}
                onChange={(e) => setNewResolveDate(e.target.value)}
                className="px-3 py-1.5 border border-[#D32F2F] rounded bg-[#FFFDE7] text-xs focus:outline-none focus:border-[#D32F2F] text-[#051C2C]"
                required
              />
            </div>
          )}

          <div className="flex flex-col gap-1 text-xs">
            <label className="font-semibold text-[#051C2C] font-label-caps uppercase text-[10px] tracking-wide">
              Cost of Repair ($ Price)
            </label>
            <input
              type="number"
              placeholder="e.g. 250"
              value={newCost || ""}
              onChange={(e) => setNewCost(parseFloat(e.target.value) || 0)}
              className="px-3 py-1.5 border border-[#E8E8E6] rounded bg-[#FFFDE7] text-xs focus:outline-none focus:border-[#2251FF] text-[#051C2C]"
            />
          </div>

          <div className="md:col-span-4 flex justify-end mt-2">
            <button
              type="submit"
              className="bg-[#051C2C] hover:bg-[#2251FF] text-white text-xs font-semibold px-6 py-2 rounded-md active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              Log Upkeep Ticket (Append)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
