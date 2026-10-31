import React, { useState, useEffect, useRef } from "react";
import { Property, Tenant, Interaction, Maintenance, SystemSettings, AlertItem } from "./types";
import { 
  defaultProperties, 
  defaultTenants, 
  defaultInteractions, 
  defaultMaintenance, 
  defaultSettings 
} from "./initialData";
import { generateAlerts } from "./utils/formulas";

// View components
import DashboardSheet from "./components/DashboardSheet";
import PropertiesSheet from "./components/PropertiesSheet";
import TenantsSheet from "./components/TenantsSheet";
import InteractionsSheet from "./components/InteractionsSheet";
import MaintenanceSheet from "./components/MaintenanceSheet";
import AlertsSheet from "./components/AlertsSheet";
import SettingsSheet from "./components/SettingsSheet";

// Icons
import { 
  Building, 
  Users, 
  Wrench, 
  MessageSquare, 
  AlertTriangle, 
  SlidersHorizontal, 
  LayoutDashboard, 
  RefreshCw, 
  Download, 
  Upload, 
  Check, 
  ShieldAlert 
} from "lucide-react";

export default function App() {
  // Select active view tab index (0: Dashboard, 1: Properties, 2: Tenants, 3: Interactions, 4: Maintenance, 5: Alerts, 6: Settings)
  const [activeTab, setActiveTab] = useState<number>(0);

  // Core operational databases states
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [maintenanceList, setMaintenanceList] = useState<Maintenance[]>([]);
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);

  // Backup loading/success toasts
  const [lastSaved, setLastSaved] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize operational databases from localStorage or defaults
  useEffect(() => {
    try {
      const storedProps = localStorage.getItem("prop_ops_properties");
      const storedTenants = localStorage.getItem("prop_ops_tenants");
      const storedInteractions = localStorage.getItem("prop_ops_interactions");
      const storedMaint = localStorage.getItem("prop_ops_maintenance");
      const storedSettings = localStorage.getItem("prop_ops_settings");

      if (storedProps && storedTenants && storedInteractions && storedMaint && storedSettings) {
        setProperties(JSON.parse(storedProps));
        setTenants(JSON.parse(storedTenants));
        setInteractions(JSON.parse(storedInteractions));
        setMaintenanceList(JSON.parse(storedMaint));
        setSettings(JSON.parse(storedSettings));
        setLastSaved(new Date().toLocaleTimeString());
      } else {
        // Fall back to pre-seeded datasets
        setProperties(defaultProperties);
        setTenants(defaultTenants);
        setInteractions(defaultInteractions);
        setMaintenanceList(defaultMaintenance);
        setSettings(defaultSettings);
        setLastSaved(new Date().toLocaleTimeString());
      }
    } catch (e) {
      console.error("Local storage initialization failed, falling back to defaults", e);
      setProperties(defaultProperties);
      setTenants(defaultTenants);
      setInteractions(defaultInteractions);
      setMaintenanceList(defaultMaintenance);
      setSettings(defaultSettings);
    }
  }, []);

  // Save changes to localStorage on any state modification
  useEffect(() => {
    if (properties.length === 0 && tenants.length === 0) return; // wait for initialization
    
    try {
      localStorage.setItem("prop_ops_properties", JSON.stringify(properties));
      localStorage.setItem("prop_ops_tenants", JSON.stringify(tenants));
      localStorage.setItem("prop_ops_interactions", JSON.stringify(interactions));
      localStorage.setItem("prop_ops_maintenance", JSON.stringify(maintenanceList));
      localStorage.setItem("prop_ops_settings", JSON.stringify(settings));
      
      setLastSaved(new Date().toLocaleTimeString());
    } catch (e) {
      console.error("Auto-save operation to localStorage failed", e);
    }
  }, [properties, tenants, interactions, maintenanceList, settings]);

  // Derive automated Alerts on the fly (excel-visual-style logic)
  const alerts = generateAlerts(properties, tenants, maintenanceList, settings);
  const urgentCount = alerts.filter((a) => a.alertLevel === "🔴 Overdue" || a.alertLevel === "🟡 Urgent").length;

  // Global resets triggers
  const handleResetData = () => {
    if (confirm("Executing this will restore the original demo records. All local operations history will be purged. Proceed?")) {
      setProperties(defaultProperties);
      setTenants(defaultTenants);
      setInteractions(defaultInteractions);
      setMaintenanceList(defaultMaintenance);
      setSettings(defaultSettings);
      triggerToast("Consoles reset to default records successfully.");
    }
  };

  // Export current states as structured JSON backup
  const handleExportBackup = () => {
    const backupObj = {
      backupVersion: "1.0",
      exportTime: new Date().toISOString(),
      properties,
      tenants,
      interactions,
      maintenanceList,
      settings,
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupObj, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `theseus-property-ops-backup-${settings.currentDate}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerToast("JSON Database Backup exported successfully!");
  };

  // Import JSON backup and overwrite local registers with full validation
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        
        // Strict Schema Validation check to verify file safety
        if (
          parsed &&
          Array.isArray(parsed.properties) &&
          Array.isArray(parsed.tenants) &&
          Array.isArray(parsed.interactions) &&
          Array.isArray(parsed.maintenanceList) &&
          parsed.settings
        ) {
          setProperties(parsed.properties);
          setTenants(parsed.tenants);
          setInteractions(parsed.interactions);
          setMaintenanceList(parsed.maintenanceList);
          setSettings(parsed.settings);
          triggerToast("All database tables loaded and sync'd successfully!");
        } else {
          alert("Schema Mismatch: The imported JSON does not contain correct tables for Properties, Tenants, Interactions or Maintenance.");
        }
      } catch (err) {
        alert("Parsing Error: Invalid JSON structure or corrupted file.");
      }
    };
    fileReader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // clear inputs
    }
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // Quick action from matrix
  const handleQuickTogglePropertyStatus = (id: string, newStatus: string) => {
    setProperties(properties.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));
    triggerToast(`Property ${id} status moved to ${newStatus}.`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F2] density-compact">
      
      {/* 56px white navigation bar, sticky */}
      <header className="sticky top-0 z-50 h-[56px] bg-white border-b border-[#E8E8E6] shadow-sm select-none">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-full flex items-center justify-between">
          
          {/* Brand/Logo Title: Theseus Workshop with brief product application context */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="bg-[#051C2C] text-white p-1.5 rounded flex items-center justify-center shadow-xs">
              <Building className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display-serif text-lg font-bold text-[#051C2C] tracking-tight whitespace-nowrap">
                Theseus Workshop
              </span>
              <span className="hidden sm:inline-flex items-center text-xs text-[#888888] font-medium tracking-normal whitespace-nowrap">
                <span className="text-[#888888]/50 mx-1.5">•</span>
                Property Operations Hub
              </span>
            </div>
          </div>

          {/* Navigation Tab Links with active highlight lines */}
          <nav className="hidden lg:flex h-full items-center gap-1">
            {[
              { label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" />, tab: 0 },
              { label: "Properties", icon: <Building className="w-4 h-4" />, tab: 1 },
              { label: "Tenants", icon: <Users className="w-4 h-4" />, tab: 2 },
              { label: "Interactions", icon: <MessageSquare className="w-4 h-4" />, tab: 3 },
              { label: "Maintenance", icon: <Wrench className="w-4 h-4" />, tab: 4 },
              { 
                label: "Alerts Engine", 
                icon: <AlertTriangle className="w-4 h-4" />, 
                tab: 5,
                badge: urgentCount > 0 ? urgentCount : undefined
              },
              { label: "Settings", icon: <SlidersHorizontal className="w-4 h-4" />, tab: 6 },
            ].map((node) => {
              const isActive = activeTab === node.tab;
              return (
                <button
                  key={node.tab}
                  onClick={() => setActiveTab(node.tab)}
                  className={`h-full px-4 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer relative ${
                    isActive
                      ? "border-[#2251FF] text-[#2251FF] bg-[#2251FF]/2"
                      : "border-transparent text-[#051C2C]/65 hover:text-[#051C2C] hover:bg-[#F5F5F2]/50"
                  }`}
                >
                  {node.icon}
                  <span>{node.label}</span>
                  {node.badge && (
                    <span className="bg-[#D32F2F] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1 font-mono transition-transform animate-pulse">
                      {node.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Local storage Last Saved metadata */}
          <div className="text-[11px] text-[#888888] font-mono flex items-center gap-1 bg-[#051C2C]/5 px-2.5 py-1 rounded">
            <span className="w-2 h-2 rounded-full bg-[#00C853] animate-pulse"></span>
            Last saved: <strong className="text-[#051C2C]">{lastSaved || "Syncing"}</strong>
          </div>

        </div>
      </header>

      {/* Responsive mobile sub-tab bar layout */}
      <div className="lg:hidden bg-white border-b border-[#E8E8E6] p-2 flex flex-wrap justify-center gap-1 shadow-inner select-none">
        {[
          { label: "Dashboard", tab: 0 },
          { label: "Properties", tab: 1 },
          { label: "Tenants", tab: 2 },
          { label: "Interactions", tab: 3 },
          { label: "Maintenance", tab: 4 },
          { label: `Alerts (${urgentCount})`, tab: 5 },
          { label: "Settings", tab: 6 },
        ].map((node) => (
          <button
            key={node.tab}
            onClick={() => setActiveTab(node.tab)}
            className={`px-3 py-1.5 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === node.tab
                ? "bg-[#051C2C] text-white shadow-sm"
                : "text-[#051C2C]/75 hover:bg-[#F5F5F2]"
            }`}
          >
            {node.label}
          </button>
        ))}
      </div>

      {/* Core toolbar bar with Export, Import, Reset, status toasts */}
      <section className="bg-white/80 border-b border-[#E8E8E6] py-3 select-none">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex flex-col sm:flex-row gap-3 items-center justify-between">
          
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold font-label-caps uppercase text-[#888888] tracking-wider">
              Simulation environment:
            </span>
            <span className="text-xs bg-[#2251FF]/5 text-[#2251FF] font-bold px-2 py-0.5 rounded">
              Default Day Pointer: {settings.currentDate}
            </span>
            <span className="text-xs bg-[#051C2C]/5 text-[#051C2C] font-mono px-2 py-0.5 rounded">
              Alert T_Threshold: {settings.alertDays} days
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {toastMessage && (
              <div className="bg-[#00C853]/10 border-l-2 border-[#00C853] text-[#00C853] text-[11px] font-semibold px-3 py-1 rounded flex items-center gap-1 animate-bounce">
                <Check className="w-3 h-3" />
                <span>{toastMessage}</span>
              </div>
            )}

            {/* Hidden Backup File Pick input */}
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              onChange={handleImportBackup}
              className="hidden"
            />

            {/* Export Backup button */}
            <button
              onClick={handleExportBackup}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#051C2C] bg-white border border-[#E8E8E6] px-3 py-1.5 rounded hover:bg-[#F5F5F2] active:scale-95 transition-all cursor-pointer shadow-sm"
              title="Secure export as JSON database"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Backup</span>
            </button>

            {/* Import Backup button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#051C2C] bg-white border border-[#E8E8E6] px-3 py-1.5 rounded hover:bg-[#F5F5F2] active:scale-95 transition-all cursor-pointer shadow-sm"
              title="Load standard property backup JSON"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import Backup</span>
            </button>

            {/* Reset Console records */}
            <button
              onClick={handleResetData}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D32F2F] bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded active:scale-95 transition-all cursor-pointer shadow-sm border border-red-100"
              title="Restores standard seeded data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>

          </div>

        </div>
      </section>

      {/* Main Content Area: Maximum width 1400px centered, 40px left-right padding */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 md:px-10 py-8">
        <div className="fade-up-animation">
          
          {/* Active sheet selection switches */}
          {activeTab === 0 && (
            <DashboardSheet
              properties={properties}
              tenants={tenants}
              maintenanceList={maintenanceList}
              alerts={alerts}
              settings={settings}
              onNavigateToTab={(tabIdx) => setActiveTab(tabIdx)}
              onQuickTogglePropertyStatus={handleQuickTogglePropertyStatus}
            />
          )}

          {activeTab === 1 && (
            <PropertiesSheet
              properties={properties}
              tenants={tenants}
              onUpdateProperties={setProperties}
              propertyTypes={settings.propertyTypes}
              propertyStatuses={settings.propertyStatuses}
            />
          )}

          {activeTab === 2 && (
            <TenantsSheet
              tenants={tenants}
              properties={properties}
              onUpdateTenants={setTenants}
            />
          )}

          {activeTab === 3 && (
            <InteractionsSheet
              interactions={interactions}
              tenants={tenants}
              onUpdateInteractions={setInteractions}
              communicationMethods={settings.communicationMethods}
            />
          )}

          {activeTab === 4 && (
            <MaintenanceSheet
              maintenanceList={maintenanceList}
              properties={properties}
              onUpdateMaintenance={setMaintenanceList}
              maintenanceStatuses={settings.maintenanceStatuses}
            />
          )}

          {activeTab === 5 && (
            <AlertsSheet
              alerts={alerts}
            />
          )}

          {activeTab === 6 && (
            <SettingsSheet
              settings={settings}
              onUpdateSettings={setSettings}
            />
          )}

        </div>
      </main>

      {/* Minimalist page footer with browser storage privacy disclosure */}
      <footer className="bg-white border-t border-[#E8E8E6] py-5 text-center select-none mt-auto">
        <div className="max-w-[1400px] mx-auto px-6 space-y-1">
          <p className="text-xs text-[#051C2C] font-sans font-medium">
            Theseus Workshop &bull; Property Operations Hub
          </p>
          <p className="text-[11px] text-[#888888] font-sans">
            All data in this tool is stored in your browser's localStorage. The page itself does not retain any user data.
          </p>
        </div>
      </footer>

    </div>
  );
}
