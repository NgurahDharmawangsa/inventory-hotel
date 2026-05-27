"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { 
   getHardwareAction, 
   getHardwareLocationsAction, 
   getHardwareDepartmentOptionsAction, 
   getRelationsAction, 
   deleteHardwareAction 
} from "@/app/actions/hardware";
import { HardwareWithRelations } from "@/repositories/hardware.repository";
import { HardwareTable } from "@/features/hardware/hardware-table";
import { HardwareForm } from "@/features/hardware/hardware-form";
import { HardwareTableSkeleton } from "@/features/hardware/hardware-skeleton";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Plus, 
  Search, 
  Filter, 
  Laptop, 
  Loader2, 
  X,
  AlertTriangle,
  Download,
  FileDown,
  FileJson
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportToCSV, exportToJSON, flattenForExport, generateExportFilename } from "@/lib/export-utils";

export default function HardwarePage() {
  // Data states
  const [items, setItems] = useState<HardwareWithRelations[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [locationFilter, setLocationFilter] = useState("ALL");
  const [locationOptions, setLocationOptions] = useState<string[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<string[]>([]);

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<HardwareWithRelations | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Notifications
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Fetch relations, departments, and locations once on mount
  useEffect(() => {
    async function loadInitialData() {
      const [relationsRes, deptRes] = await Promise.all([
        getRelationsAction(),
        getHardwareDepartmentOptionsAction(),
      ]);
      if (relationsRes.success) {
        setStaff(relationsRes.data.staff);
        setVendors(relationsRes.data.vendors);
      }
      if (deptRes.success) {
        setDepartmentOptions(deptRes.data);
      }
    }
    loadInitialData();
    // Also fetch initial locations
    refreshLocationOptions();
  }, []);

  // Refresh location dropdown options from database
  const refreshLocationOptions = async () => {
    const res = await getHardwareLocationsAction();
    if (res.success) {
      setLocationOptions(res.data);
    }
  };

  // Fetch hardware list based on filters
  const loadHardware = async () => {
    setLoading(true);
    try {
      const res = await getHardwareAction({
        query: searchQuery || undefined,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        location: locationFilter !== "ALL" ? locationFilter : undefined,
      });
      if (res.success) {
        setItems(res.data);
      } else {
        showNotification("error", res.error || "Failed to load hardware inventory.");
      }
    } catch (err: any) {
      showNotification("error", err.message || "Failed to load hardware inventory.");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch on filter changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadHardware();
    }, 300); // 300ms debounce for search input

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, statusFilter, locationFilter]);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreateOpen = () => {
    setSelectedItem(null);
    setFormOpen(true);
  };

  const handleEditOpen = (item: HardwareWithRelations) => {
    setSelectedItem(item);
    setFormOpen(true);
  };

  const handleDeleteOpen = (id: string) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleFormSuccess = () => {
    setFormOpen(false);
    setSelectedItem(null);
    showNotification("success", `Hardware asset successfully ${selectedItem ? "updated" : "registered"}.`);
    loadHardware();
    refreshLocationOptions();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      const res = await deleteHardwareAction(deleteId);
      if (res.success) {
        setDeleteOpen(false);
        setDeleteId(null);
        showNotification("success", "Hardware asset successfully deleted.");
        loadHardware();
        refreshLocationOptions();
      } else {
        showNotification("error", res.error || "Failed to delete hardware asset.");
      }
    } catch (err: any) {
      showNotification("error", err.message || "Failed to delete hardware asset.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification Banner */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl border p-4 shadow-lg animate-in fade-in-0 slide-in-from-top-5 max-w-md ${
          notification.type === "success" 
            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
            : "bg-rose-500/10 text-rose-500 border-rose-500/20"
        }`}>
          <div className="flex-1 text-sm font-semibold">{notification.message}</div>
          <button onClick={() => setNotification(null)} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Hardware Assets</h1>
          <p className="text-sm font-medium text-muted-foreground">
            Monitor, register, and assign hotel physical IT infrastructure and guest devices.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline"
                className="h-10 px-4 rounded-lg font-semibold flex items-center gap-2 shadow-sm shrink-0"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem 
                onClick={() => {
                  const filename = generateExportFilename("hardware-assets");
                  const flattenedData = flattenForExport(items);
                  exportToCSV(flattenedData, filename);
                  showNotification("success", "Hardware data exported to CSV successfully!");
                }}
                className="cursor-pointer"
              >
                <FileDown className="h-4 w-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => {
                  const filename = generateExportFilename("hardware-assets");
                  exportToJSON(items, filename);
                  showNotification("success", "Hardware data exported to JSON successfully!");
                }}
                className="cursor-pointer"
              >
                <FileJson className="h-4 w-4 mr-2" />
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Register Button */}
          <Button 
            onClick={handleCreateOpen}
            className="h-10 px-4 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center gap-2 shadow-sm hover:bg-primary/90 shrink-0 w-fit"
          >
            <Plus className="h-4 w-4" />
            Register New Asset
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by asset name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex h-10 w-full rounded-lg border border-input bg-card pl-10 pr-4 text-sm shadow-xs transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex h-10 w-44 rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="BROKEN">Broken</option>
            <option value="REPAIR">Repair</option>
            <option value="DISPOSED">Disposed</option>
          </select>
        </div>

        {/* Location Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="flex h-10 w-48 rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="ALL">All Locations</option>
            {locationOptions.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table view */}
      {loading ? (
        <HardwareTableSkeleton />
      ) : (
        <HardwareTable 
          items={items} 
          onEdit={handleEditOpen} 
          onDelete={handleDeleteOpen} 
        />
      )}

      {/* Form Dialog Modal (Create/Edit) */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              {selectedItem ? "Edit Hardware Asset" : "Register New Hardware"}
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-muted-foreground">
              Fill in the parameters below to update or register the physical hardware asset.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <HardwareForm
              initialData={selectedItem}
              staffList={staff}
              vendorList={vendors}
              departmentOptions={departmentOptions}
              onSuccess={handleFormSuccess}
              onCancel={() => setFormOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog Modal */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 mb-2">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center text-lg font-bold text-foreground">
              Delete Hardware Asset?
            </DialogTitle>
            <DialogDescription className="text-center text-sm font-medium text-muted-foreground">
              Are you absolutely sure you want to delete this hardware asset? This operation cannot be undone and will permanently purge the record from the database.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center justify-center gap-2 pt-4 border-t border-border mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={deleteLoading}
              className="h-9 px-4 rounded-lg flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={deleteLoading}
              className="h-9 px-4 rounded-lg bg-rose-500 text-white font-semibold flex items-center justify-center gap-1.5 shadow-sm hover:bg-rose-600 flex-1"
            >
              {deleteLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete Asset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
