import React, { useState } from "react";
import { Tenant, Property } from "../types";
import { Plus, Search, HelpCircle, FileText, AlertCircle, Trash2 } from "lucide-react";

interface TenantsSheetProps {
  tenants: Tenant[];
  properties: Property[];
  onUpdateTenants: (updater: Tenant[]) => void;
}

export default function TenantsSheet({
  tenants,
  properties,
  onUpdateTenants,
}: TenantsSheetProps) {
  const [search, setSearch] = useState("");
  const [newTenantId, setNewTenantId] = useState("");
  const [newPropId, setNewPropId] = useState("");
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newLeaseStart, setNewLeaseStart] = useState("");
  const [newLeaseEnd, setNewLeaseEnd] = useState("");
  const [newDeposit, setNewDeposit] = useState<number>(0);
  const [newSpecialReq, setNewSpecialReq] = useState("");
  const [valError, setValError] = useState("");

  // Determine max value in Deposit to scale inline data bar tracks
  const maxDeposit = tenants.reduce((max, t) => (t.deposit > max ? t.deposit : max), 1000) || 3000;

  const handleFieldChange = (id: string, field: keyof Tenant, value: any) => {
    const updated = tenants.map((t) => {
      if (t.id === id) {
        if (field === "deposit") {
          return { ...t, [field]: parseFloat(value) || 0 };
        }
        return { ...t, [field]: value };
      }
      return t;
    });
    onUpdateTenants(updated);
  };

  const handleAddTenant = (e: React.FormEvent) => {
    e.preventDefault();
    setValError("");

    // Format validation of Tenant_ID: starts with 'T' followed by 3 digits
    const idPattern = /^T\d{3}$/;
    if (!idPattern.test(newTenantId)) {
      setValError("Invalid ID format. Must start with 'T' followed by exactly 3 digits (e.g. T004).");
      return;
    }

    // Check duplicate ID
    if (tenants.some((t) => t.id === newTenantId)) {
      setValError(`Duplicate ID error: Tenant with ID ${newTenantId} already exists.`);
      return;
    }

    if (!newPropId) {
      setValError("A valid Property link (Prop ID) must be selected.");
      return;
    }

    if (!newName.trim()) {
      setValError("Tenant Name cannot be empty.");
      return;
    }

    // Check lease date logic: Lease End must be after Lease Start
    if (newLeaseStart && newLeaseEnd) {
      const start = new Date(newLeaseStart);
      const end = new Date(newLeaseEnd);
      if (end <= start) {
        setValError("Lease End Date must be after Lease Start Date, as calculated by contract rules.");
        return;
      }
    }

    const newTenant: Tenant = {
      id: newTenantId,
      propId: newPropId,
      name: newName,
      phone: newPhone,
      leaseStart: newLeaseStart || new Date().toISOString().split("T")[0],
      leaseEnd: newLeaseEnd || new Date().toISOString().split("T")[0],
      deposit: newDeposit || 0,
      specialReq: newSpecialReq,
    };

    onUpdateTenants([...tenants, newTenant]);

    // Resetting form values
    setNewTenantId("");
    setNewPropId("");
    setNewName("");
    setNewPhone("");
    setNewLeaseStart("");
    setNewLeaseEnd("");
    setNewDeposit(0);
    setNewSpecialReq("");
  };

  const handleDelete = (id: string) => {
    if (confirm(`Are you sure you want to release and delete tenant record ${id}?`)) {
      onUpdateTenants(tenants.filter((t) => t.id !== id));
    }
  };

  const suggestNextId = () => {
    const maxNumber = tenants.reduce((acc, curr) => {
      const match = curr.id.match(/^T(\d{3})$/);
      if (match) {
        const num = parseInt(match[1]);
        return num > acc ? num : acc;
      }
      return acc;
    }, 0);
    const nextNum = maxNumber + 1;
    setNewTenantId(`T${String(nextNum).padStart(3, "0")}`);
  };

  const filteredTenants = tenants.filter(
    (t) =>
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.propId.toLowerCase().includes(search.toLowerCase()) ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.phone.toLowerCase().includes(search.toLowerCase()) ||
      t.specialReq.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fade-up-animation flex flex-col gap-6">
      {/* Informational Header */}
      <div className="bg-[#2251FF]/4 border-l-4 border-[#2251FF] p-4 rounded-r-lg shadow-sm">
        <h3 className="font-heading-serif text-lg font-semibold text-[#051C2C] flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#2251FF]" />
          Tenant Registry Directory & Active Leases (Sheet: 02_Tenants)
        </h3>
        <p className="text-xs text-[#888888] mt-1 font-sans">
          Manage current tenants and associate lease structures directly containing deposit values. Column "Deposit" displays inline graphic sliders scaled automatically relative to the maximum deposit in lease system.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#888888]" />
          <input
            type="text"
            placeholder="Search tenant name, ID, property, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-md bg-white border border-[#E8E8E6] text-[#051C2C] focus:outline-none focus:border-[#2251FF] shadow-sm"
          />
        </div>
        <div className="text-xs text-[#888888] flex items-center gap-1.5 self-end">
          <span className="font-semibold text-[#051C2C]">{filteredTenants.length}</span> tenants showing of {tenants.length} total
        </div>
      </div>

      {/* Main Table View */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#E8E8E6]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#051C2C]/4 border-b-2 border-[#051C2C]/10 h-11 text-[11px] font-label-caps text-[#051C2C] tracking-wider uppercase">
                <th className="px-4 py-3 font-semibold">Tenant ID</th>
                <th className="px-4 py-3 font-semibold">Associated Prop</th>
                <th className="px-4 py-3 font-semibold">Full Tenant Name</th>
                <th className="px-4 py-3 font-semibold">Contact Phone</th>
                <th className="px-4 py-3 font-semibold">Lease Start</th>
                <th className="px-4 py-3 font-semibold">Lease End</th>
                <th className="px-4 py-3 font-semibold text-right" style={{ width: "180px" }}>Sec. Deposit</th>
                <th className="px-4 py-3 font-semibold">Special Requests</th>
                <th className="px-4 py-3 font-semibold text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTenants.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-xs text-[#888888]">
                    No tenants found matching the query constraints filter.
                  </td>
                </tr>
              ) : (
                filteredTenants.map((t) => {
                  const prop = properties.find((p) => p.id === t.propId);
                  const depositPercentage = Math.min((t.deposit / maxDeposit) * 100, 100);

                  return (
                    <tr
                      key={t.id}
                      className="border-b border-[#E8E8E6] hover:bg-[#F5F5F2]/50 transition-colors h-11 text-[13px] group"
                    >
                      <td className="px-4 py-2 font-mono text-xs font-semibold text-[#051C2C]">
                        <span className="bg-[#051C2C]/5 text-[#051C2C] px-2 py-0.5 rounded text-[11px] font-bold">
                          {t.id}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={t.propId}
                          onChange={(e) => handleFieldChange(t.id, "propId", e.target.value)}
                          className="px-1.5 py-1 bg-[#FFFDE7] rounded text-xs focus:outline-none focus:border-[#2251FF] font-mono text-[#051C2C]"
                        >
                          {properties.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.id} - {p.address.substring(0, 18)}...
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={t.name}
                          onChange={(e) => handleFieldChange(t.id, "name", e.target.value)}
                          className="w-full px-2 py-1 bg-[#FFFDE7] rounded text-xs border border-transparent focus:outline-none focus:border-[#2251FF] text-[#051C2C] font-semibold"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={t.phone}
                          onChange={(e) => handleFieldChange(t.id, "phone", e.target.value)}
                          className="w-full px-2 py-1 bg-[#FFFDE7] rounded text-xs border border-transparent focus:outline-none focus:border-[#2251FF] text-[#051C2C]"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="date"
                          value={t.leaseStart}
                          onChange={(e) => handleFieldChange(t.id, "leaseStart", e.target.value)}
                          className="px-1.5 py-0.5 bg-[#FFFDE7] rounded text-xs border border-transparent focus:outline-none focus:border-[#2251FF] text-center w-full max-w-[125px]"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="date"
                          value={t.leaseEnd}
                          onChange={(e) => handleFieldChange(t.id, "leaseEnd", e.target.value)}
                          className="px-1.5 py-0.5 bg-[#FFFDE7] rounded text-xs border border-transparent focus:outline-none focus:border-[#2251FF] text-[#051C2C] font-semibold text-center w-full max-w-[125px]"
                        />
                      </td>
                      <td className="px-4 py-2 text-right">
                        <div className="flex flex-col items-end gap-1 select-none">
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-xs text-[#051C2C] font-mono">$</span>
                            <input
                              type="number"
                              value={t.deposit}
                              onChange={(e) => handleFieldChange(t.id, "deposit", e.target.value)}
                              className="w-20 px-1 py-0.5 bg-[#FFFDE7] rounded text-xs border border-transparent focus:outline-none focus:border-[#2251FF] text-right font-semibold font-mono"
                            />
                          </div>
                          {/* Inline data bar progress tracker using custom accent fill */}
                          <div className="w-24 bg-[#2251FF]/10 h-1.5 rounded-full overflow-hidden" title={`$${t.deposit} relative representation`}>
                            <div
                              className="bg-[#2251FF] h-full duration-300"
                              style={{ width: `${depositPercentage}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={t.specialReq}
                          onChange={(e) => handleFieldChange(t.id, "specialReq", e.target.value)}
                          className="w-full px-2 py-1 bg-[#FFFDE7] rounded text-xs border border-transparent focus:outline-none focus:border-[#2251FF] text-[#051C2C]"
                          placeholder="No specific requirements..."
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="text-slate-400 hover:text-[#D32F2F] p-1 rounded-md hover:bg-[#D32F2F]/5 active:scale-90 transition-transform"
                          title="Release Tenant"
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

      {/* Append New Record Form Block */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#E8E8E6] p-5 floating-card-lift">
        <h4 className="font-heading-serif text-base font-semibold text-[#051C2C] mb-3 flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-[#2251FF]" />
          Enroll Active Tenant Record (Add Row)
        </h4>

        {valError && (
          <div className="mb-4 bg-[#D32F2F]/4 text-[#D32F2F] border-l-2 border-[#D32F2F] p-3 rounded text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{valError}</span>
          </div>
        )}

        <form onSubmit={handleAddTenant} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-[#051C2C] font-label-caps uppercase text-[10px] tracking-wide">
                Tenant ID
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
              placeholder="e.g. T004"
              value={newTenantId}
              onChange={(e) => setNewTenantId(e.target.value.toUpperCase())}
              className="px-3 py-1.5 border border-[#E8E8E6] rounded bg-[#FFFDE7] text-xs focus:outline-none focus:border-[#2251FF] text-[#051C2C] uppercase"
              required
            />
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <label className="font-semibold text-[#051C2C] font-label-caps uppercase text-[10px] tracking-wide">
              Property Assignment
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
              Full Guest/Tenant Name
            </label>
            <input
              type="text"
              placeholder="e.g. Robert Downey"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="px-3 py-1.5 border border-[#E8E8E6] rounded bg-[#FFFDE7] text-xs focus:outline-none focus:border-[#2251FF] text-[#051C2C]"
              required
            />
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <label className="font-semibold text-[#051C2C] font-label-caps uppercase text-[10px] tracking-wide">
              Contact Phone / IM Account
            </label>
            <input
              type="text"
              placeholder="e.g. +1 (555) 789-0122"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              className="px-3 py-1.5 border border-[#E8E8E6] rounded bg-[#FFFDE7] text-xs focus:outline-none focus:border-[#2251FF] text-[#051C2C]"
              required
            />
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <label className="font-semibold text-[#051C2C] font-label-caps uppercase text-[10px] tracking-wide">
              Lease Start Date
            </label>
            <input
              type="date"
              value={newLeaseStart}
              onChange={(e) => setNewLeaseStart(e.target.value)}
              className="px-3 py-1.5 border border-[#E8E8E6] rounded bg-[#FFFDE7] text-xs focus:outline-none focus:border-[#2251FF] text-[#051C2C]"
            />
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <label className="font-semibold text-[#051C2C] font-label-caps uppercase text-[10px] tracking-wide">
              Lease End Date
            </label>
            <input
              type="date"
              value={newLeaseEnd}
              onChange={(e) => setNewLeaseEnd(e.target.value)}
              className="px-3 py-1.5 border border-[#E8E8E6] rounded bg-[#FFFDE7] text-xs focus:outline-none focus:border-[#2251FF] text-[#051C2C]"
            />
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <label className="font-semibold text-[#051C2C] font-label-caps uppercase text-[10px] tracking-wide">
              Security Deposit ($ Amount)
            </label>
            <input
              type="number"
              placeholder="e.g. 1500"
              value={newDeposit || ""}
              onChange={(e) => setNewDeposit(parseFloat(e.target.value) || 0)}
              className="px-3 py-1.5 border border-[#E8E8E6] rounded bg-[#FFFDE7] text-xs focus:outline-none focus:border-[#2251FF] text-[#051C2C]"
            />
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <label className="font-semibold text-[#051C2C] font-label-caps uppercase text-[10px] tracking-wide">
              Special Requests/Constraints
            </label>
            <input
              type="text"
              placeholder="e.g. Needs parking bay #12 access."
              value={newSpecialReq}
              onChange={(e) => setNewSpecialReq(e.target.value)}
              className="px-3 py-1.5 border border-[#E8E8E6] rounded bg-[#FFFDE7] text-xs focus:outline-none focus:border-[#2251FF] text-[#051C2C]"
            />
          </div>

          <div className="md:col-span-4 flex justify-end mt-2">
            <button
              type="submit"
              className="bg-[#051C2C] hover:bg-[#2251FF] text-white text-xs font-semibold px-6 py-2 rounded-md active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              Enroll Tenant (Append)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
