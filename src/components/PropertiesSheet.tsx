import React, { useState } from "react";
import { Property, Tenant } from "../types";
import { Plus, Search, HelpCircle, Eye, AlertCircle, FileText, Trash2 } from "lucide-react";

interface PropertiesSheetProps {
  properties: Property[];
  tenants: Tenant[];
  onUpdateProperties: (updater: Property[]) => void;
  propertyTypes: string[];
  propertyStatuses: string[];
}

export default function PropertiesSheet({
  properties,
  tenants,
  onUpdateProperties,
  propertyTypes,
  propertyStatuses,
}: PropertiesSheetProps) {
  const [search, setSearch] = useState("");
  const [newPropId, setNewPropId] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newType, setNewType] = useState(propertyTypes[0] || "Condo");
  const [newStatus, setNewStatus] = useState(propertyStatuses[0] || "Active");
  const [newInsExpiry, setNewInsExpiry] = useState("");
  const [newSafetyCheck, setNewSafetyCheck] = useState("");
  const [newNote, setNewNote] = useState("");
  const [valError, setValError] = useState("");

  const handleFieldChange = (id: string, field: keyof Property, value: string) => {
    const updated = properties.map((p) => {
      if (p.id === id) {
        return { ...p, [field]: value };
      }
      return p;
    });
    onUpdateProperties(updated);
  };

  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    setValError("");

    // Validate ID: must be 'P' followed by 3 digits (e.g. P005)
    const idPattern = /^P\d{3}$/;
    if (!idPattern.test(newPropId)) {
      setValError("Invalid ID format. Must start with 'P' followed by exactly 3 digits (e.g., P005).");
      return;
    }

    // Check duplicate ID
    if (properties.some((p) => p.id === newPropId)) {
      setValError(`Duplicate ID found: Property with ID ${newPropId} already exists.`);
      return;
    }

    if (!newAddress.trim()) {
      setValError("Address field cannot be empty.");
      return;
    }

    const newProperty: Property = {
      id: newPropId,
      address: newAddress,
      type: newType,
      status: newStatus,
      insExpiryDate: newInsExpiry || new Date().toISOString().split("T")[0],
      safetyCheckDate: newSafetyCheck || new Date().toISOString().split("T")[0],
      note: newNote,
    };

    onUpdateProperties([...properties, newProperty]);
    
    // Reset state
    // Generate next potential ID e.g., P005
    setNewPropId("");
    setNewAddress("");
    setNewNote("");
    setNewInsExpiry("");
    setNewSafetyCheck("");
  };

  const handleDelete = (id: string) => {
    const hasActiveTenant = tenants.some((t) => t.propId === id);
    if (hasActiveTenant) {
      alert(`Cannot delete Property ${id}. It is currently linked as an active foreign key in the Tenants register. Clear the tenant relationship first.`);
      return;
    }
    
    if (confirm(`Are you sure you want to delete property record ${id}?`)) {
      onUpdateProperties(properties.filter((p) => p.id !== id));
    }
  };

  // Pre-fill next logical ID
  const suggestNextId = () => {
    const maxNumber = properties.reduce((acc, curr) => {
      const match = curr.id.match(/^P(\d{3})$/);
      if (match) {
        const num = parseInt(match[1]);
        return num > acc ? num : acc;
      }
      return acc;
    }, 0);
    const nextNum = maxNumber + 1;
    setNewPropId(`P${String(nextNum).padStart(3, "0")}`);
  };

  const filteredProperties = properties.filter(
    (p) =>
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.address.toLowerCase().includes(search.toLowerCase()) ||
      p.type.toLowerCase().includes(search.toLowerCase()) ||
      p.status.toLowerCase().includes(search.toLowerCase()) ||
      p.note.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fade-up-animation flex flex-col gap-6">
      {/* Introduction Banner with excel-visual-style Guidelines */}
      <div className="bg-[#2251FF]/4 border-l-4 border-[#2251FF] p-4 rounded-r-lg shadow-sm">
        <h3 className="font-heading-serif text-lg font-semibold text-[#051C2C] flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#2251FF]" />
          Properties Directory Master (Sheet: 01_Properties)
        </h3>
        <p className="text-xs text-[#888888] mt-1 font-sans">
          This registry aggregates historical physical properties indices, fire audits, insurance expirations, and status. 
          Cells back-filled with the pale-yellow color (<span className="bg-[#FFFDE7] px-1 text-xs border border-yellow-200">#FFFDE7</span>) are fully editable. Changes propagate to alerts registers instantly.
        </p>
      </div>

      {/* Control Tools Container */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#888888]" />
          <input
            type="text"
            placeholder="Search address, type, id, notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-md bg-white border border-[#E8E8E6] text-[#051C2C] focus:outline-none focus:border-[#2251FF] shadow-sm"
          />
        </div>
        <div className="text-xs text-[#888888] flex items-center gap-1.5 self-end">
          <span className="font-semibold text-[#051C2C]">{filteredProperties.length}</span> properties showing of {properties.length} total
        </div>
      </div>

      {/* Main Table Card Container */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#E8E8E6]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#051C2C]/4 border-b-2 border-[#051C2C]/10 h-11 text-[11px] font-label-caps text-[#051C2C] tracking-wider uppercase">
                <th className="px-4 py-3 font-semibold">Prop ID</th>
                <th className="px-4 py-3 font-semibold">Street Address</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Operating Status</th>
                <th className="px-4 py-3 font-semibold">Insurance Expiry</th>
                <th className="px-4 py-3 font-semibold">Safety Audit Expiry</th>
                <th className="px-4 py-3 font-semibold">Operational Notes</th>
                <th className="px-4 py-3 font-semibold text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-xs text-[#888888]">
                    No properties match the current query criteria filter.
                  </td>
                </tr>
              ) : (
                filteredProperties.map((p) => {
                  const hasTenant = tenants.some((t) => t.propId === p.id);
                  return (
                    <tr
                      key={p.id}
                      className="border-b border-[#E8E8E6] hover:bg-[#F5F5F2]/50 transition-colors h-10 text-[13px] group"
                    >
                      <td className="px-4 py-2 font-mono text-xs font-semibold text-[#051C2C]">
                        <span className="bg-[#051C2C]/5 text-[#051C2C] px-2 py-0.5 rounded text-[11px] font-bold">
                          {p.id}
                        </span>
                      </td>
                      <td className="px-4 py-2 min-w-[200px]">
                        <input
                          type="text"
                          value={p.address}
                          onChange={(e) => handleFieldChange(p.id, "address", e.target.value)}
                          className="w-full px-2 py-1 bg-[#FFFDE7] rounded text-xs border border-transparent focus:outline-none focus:border-[#2251FF] text-[#051C2C] focus:bg-white"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={p.type}
                          onChange={(e) => handleFieldChange(p.id, "type", e.target.value)}
                          className="px-1 py-1 bg-[#FFFDE7] rounded text-xs select-none border border-transparent focus:outline-none focus:border-[#2251FF] text-[#051C2C]"
                        >
                          {propertyTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={p.status}
                          onChange={(e) => handleFieldChange(p.id, "status", e.target.value)}
                          className="px-1 py-0.5 bg-[#FFFDE7] rounded text-xs border border-transparent focus:outline-none focus:border-[#2251FF] font-semibold text-[#051C2C]"
                        >
                          {propertyStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="date"
                          value={p.insExpiryDate}
                          onChange={(e) => handleFieldChange(p.id, "insExpiryDate", e.target.value)}
                          className="px-1.5 py-0.5 bg-[#FFFDE7] rounded text-xs border border-transparent focus:outline-none focus:border-[#2251FF] text-center w-full max-w-[130px]"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="date"
                          value={p.safetyCheckDate}
                          onChange={(e) => handleFieldChange(p.id, "safetyCheckDate", e.target.value)}
                          className="px-1.5 py-0.5 bg-[#FFFDE7] rounded text-xs border border-transparent focus:outline-none focus:border-[#2251FF] text-center w-full max-w-[130px]"
                        />
                      </td>
                      <td className="px-4 py-2 min-w-[180px]">
                        <input
                          type="text"
                          value={p.note}
                          onChange={(e) => handleFieldChange(p.id, "note", e.target.value)}
                          className="w-full px-2 py-1 bg-[#FFFDE7] rounded text-xs border border-transparent focus:outline-none focus:border-[#2251FF] text-[#051C2C]"
                          placeholder="No operational note added..."
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <div className="flex justify-center gap-1.5">
                          {hasTenant ? (
                            <span 
                              title="Active rent relation is configured for this property unit."
                              className="text-[10px] bg-slate-100 text-[#888888] px-1.5 py-0.5 rounded cursor-help font-sans uppercase font-medium"
                            >
                              In Use
                            </span>
                          ) : (
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="text-slate-400 hover:text-[#D32F2F] p-1 rounded-md hover:bg-[#D32F2F]/5 active:scale-90 transition-transform"
                              title="Delete this property record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row appending card with scale hover */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#E8E8E6] p-5 floating-card-lift">
        <h4 className="font-heading-serif text-base font-semibold text-[#051C2C] mb-3 flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-[#2251FF]" />
          Append Modern Property Record (Add Row)
        </h4>

        {valError && (
          <div className="mb-4 bg-[#D32F2F]/4 text-[#D32F2F] border-l-2 border-[#D32F2F] p-3 rounded text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{valError}</span>
          </div>
        )}

        <form onSubmit={handleAddProperty} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-[#051C2C] font-label-caps uppercase text-[10px] tracking-wide">
                Property ID
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
              placeholder="e.g. P005"
              value={newPropId}
              onChange={(e) => setNewPropId(e.target.value.toUpperCase())}
              className="px-3 py-1.5 border border-[#E8E8E6] rounded bg-[#FFFDE7] text-xs focus:outline-none focus:border-[#2251FF] text-[#051C2C] uppercase"
              required
            />
          </div>

          <div className="flex flex-col gap-1 text-xs md:col-span-2">
            <label className="font-semibold text-[#051C2C] font-label-caps uppercase text-[10px] tracking-wide">
              Street Address
            </label>
            <input
              type="text"
              placeholder="e.g. 54 Magnolia Ave, Orlando FL"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              className="px-3 py-1.5 border border-[#E8E8E6] rounded bg-[#FFFDE7] text-xs focus:outline-none focus:border-[#2251FF] text-[#051C2C]"
              required
            />
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <label className="font-semibold text-[#051C2C] font-label-caps uppercase text-[10px] tracking-wide">
              Property Type
            </label>
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="px-3 py-1.5 border border-[#E8E8E6] rounded bg-[#FFFDE7] text-xs focus:outline-none focus:border-[#2251FF] text-[#051C2C]"
            >
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <label className="font-semibold text-[#051C2C] font-label-caps uppercase text-[10px] tracking-wide">
              Evaluation Status
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="px-3 py-1.5 border border-[#E8E8E6] rounded bg-[#FFFDE7] text-xs focus:outline-none focus:border-[#2251FF] text-[#051C2C]"
            >
              {propertyStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <label className="font-semibold text-[#051C2C] font-label-caps uppercase text-[10px] tracking-wide">
              Insurance Expiry Date
            </label>
            <input
              type="date"
              value={newInsExpiry}
              onChange={(e) => setNewInsExpiry(e.target.value)}
              className="px-3 py-1.5 border border-[#E8E8E6] rounded bg-[#FFFDE7] text-xs focus:outline-none focus:border-[#2251FF] text-[#051C2C]"
            />
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <label className="font-semibold text-[#051C2C] font-label-caps uppercase text-[10px] tracking-wide">
              Safety Audit Expiry Date
            </label>
            <input
              type="date"
              value={newSafetyCheck}
              onChange={(e) => setNewSafetyCheck(e.target.value)}
              className="px-3 py-1.5 border border-[#E8E8E6] rounded bg-[#FFFDE7] text-xs focus:outline-none focus:border-[#2251FF] text-[#051C2C]"
            />
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <label className="font-semibold text-[#051C2C] font-label-caps uppercase text-[10px] tracking-wide">
              Operational Notes (Access wi-fi details, etc.)
            </label>
            <input
              type="text"
              placeholder="e.g. Master key holds keybox. Alarm is off."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="px-3 py-1.5 border border-[#E8E8E6] rounded bg-[#FFFDE7] text-xs focus:outline-none focus:border-[#2251FF] text-[#051C2C]"
            />
          </div>

          <div className="md:col-span-4 flex justify-end mt-2">
            <button
              type="submit"
              className="bg-[#051C2C] hover:bg-[#2251FF] text-white text-xs font-semibold px-6 py-2 rounded-md active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              Save Property Link (Append)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
