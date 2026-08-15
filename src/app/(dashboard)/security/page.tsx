"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { 
  getSecurityAction, 
  getSecurityLocationsAction, 
  deleteSecurityAction 
} from "@/app/actions/security";
import { LocationRoomOption } from "@/repositories/security.repository";
import { getRelationsAction } from "@/app/actions/hardware";
import { getDepartmentsAction } from "@/app/actions/departments";
import { getLocationsAction } from "@/app/actions/locations";
import { getRoomsAction } from "@/app/actions/rooms";
import { SecurityWithRelations } from "@/repositories/security.repository";
import { LocationRoomFilter } from "@/components/filters/location-room-filter";
import { exportToCSV, exportToJSON, flattenSecurityForExport, generateExportFilename } from "@/lib/export-utils";
import { SecurityTable } from "@/features/security/security-table";
import { SecurityForm } from "@/features/security/security-form";
import { SecurityTableSkeleton } from "@/features/security/security-skeleton";
import { SecurityStatsCards } from "@/features/security/security-stats-cards";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Loader2, 
  X,
  AlertTriangle,
  Download,
  FileJson,
  FileDown,
  Shield,
  Hash,
  MapPin,
  Building2,
  Monitor,
  Wifi,
  Camera,
  Store,
  DoorOpen,
  Radio,
  AlarmClock,
  Factory,
  User,
  Calendar,
  Clock,
  Network
} from "lucide-react";

export default function SecurityPage() {
  // Data states
  const [items, setItems] = useState<SecurityWithRelations[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [deviceTypeFilter, setDeviceTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [locationFilter, setLocationFilter] = useState("ALL");
  const [locationOptions, setLocationOptions] = useState<LocationRoomOption[]>([]);

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<SecurityWithRelations | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SecurityWithRelations | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Notifications
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Fetch relations and master data once on mount
  useEffect(() => {
    async function loadInitialData() {
      const [relationsRes, departmentsRes, locationsRes, roomsRes] = await Promise.all([
        getRelationsAction(),
        getDepartmentsAction(),
        getLocationsAction(),
        getRoomsAction(),
      ]);
      if (relationsRes.success) {
        setVendors(relationsRes.data.vendors);
      }
      if (departmentsRes.success) {
        setDepartments(departmentsRes.data);
      }
      if (locationsRes.success) {
        setLocations(locationsRes.data);
      }
      if (roomsRes.success) {
        setRooms(roomsRes.data);
      }
    }
    loadInitialData();
    refreshLocationOptions();
  }, []);

  const refreshLocationOptions = async () => {
    const res = await getSecurityLocationsAction();
    if (res.success) {
      setLocationOptions(res.data);
    }
  };

  // Fetch security list based on filters
  const loadSecurity = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getSecurityAction({
        query: searchQuery || undefined,
        location: locationFilter !== "ALL" ? locationFilter : undefined,
        device_type: deviceTypeFilter !== "ALL" ? deviceTypeFilter : undefined,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
      });
      if (res.success) {
        setItems(res.data || []);
      } else {
        showNotification("error", res.error || "Failed to load security devices.");
      }
    } catch (err: any) {
      showNotification("error", err.message || "Failed to load security devices.");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, locationFilter, deviceTypeFilter, statusFilter]);

  // Re-fetch on filter changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadSecurity();
    }, 300); // 300ms debounce for search input

    return () => clearTimeout(delayDebounce);
  }, [loadSecurity]);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreateOpen = () => {
    setSelectedItem(null);
    setFormOpen(true);
  };

  const handleEditOpen = (item: SecurityWithRelations) => {
    setSelectedItem(item);
    setFormOpen(true);
  };

  const handleRowClick = (item: SecurityWithRelations) => {
    setDetailItem(item);
    setDetailOpen(true);
  };

  const handleDeleteOpen = (id: string) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleFormSuccess = () => {
    setFormOpen(false);
    setSelectedItem(null);
    showNotification("success", `Security device successfully ${selectedItem ? "updated" : "registered"}.`);
    loadSecurity();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      const res = await deleteSecurityAction(deleteId);
      if (res.success) {
        setDeleteOpen(false);
        setDeleteId(null);
        showNotification("success", "Security device successfully deleted.");
        loadSecurity();
      } else {
        showNotification("error", res.error || "Failed to delete security device.");
      }
    } catch (err: any) {
      showNotification("error", err.message || "Failed to delete security device.");
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
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Security Devices</h1>
          <p className="text-sm font-medium text-muted-foreground">
            Monitor and manage physical security infrastructure, including IP CCTV cameras, fire alarms, and door controllers.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 w-fit">
          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-10 px-4 rounded-lg font-semibold flex items-center gap-2 shadow-xs hover:bg-muted"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => {
                  const flattened = flattenSecurityForExport(items);
                  const filename = generateExportFilename("security_devices");
                  exportToCSV(flattened, filename);
                  showNotification("success", "Data exported to CSV successfully.");
                }}
                className="cursor-pointer"
              >
                <FileDown className="h-4 w-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const flattened = flattenSecurityForExport(items);
                  const filename = generateExportFilename("security_devices");
                  exportToJSON(flattened, filename);
                  showNotification("success", "Data exported to JSON successfully.");
                }}
                className="cursor-pointer"
              >
                <FileJson className="h-4 w-4 mr-2" />
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            onClick={handleCreateOpen}
            className="h-10 px-4 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center gap-2 shadow-sm hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Register New Device
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <SecurityStatsCards items={items} />

      {/* Filters Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by device type, item code, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex h-10 w-full rounded-lg border border-input bg-card pl-10 pr-4 text-sm shadow-xs transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        {/* Device Type Filter */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <select
              value={deviceTypeFilter}
              onChange={(e) => setDeviceTypeFilter(e.target.value)}
              className="h-10 appearance-none rounded-lg border border-input bg-card pl-9 pr-8 text-sm font-medium shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
            >
              <option value="ALL">All Types</option>
              <option value="CCTV Camera">CCTV Camera</option>
              <option value="Access Control">Access Control</option>
              <option value="Alarm System">Alarm System</option>
              <option value="Intercom">Intercom</option>
              <option value="Fire Detector">Fire Detector</option>
              <option value="Door Lock">Door Lock</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 appearance-none rounded-lg border border-input bg-card pl-9 pr-8 text-sm font-medium shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="ONLINE">Online</option>
              <option value="OFFLINE">Offline</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>
        </div>

        {/* Location/Room Filter */}
        <div className="flex items-center gap-2 shrink-0">
          <LocationRoomFilter
            value={locationFilter}
            onChange={setLocationFilter}
            options={locationOptions}
          />
        </div>
      </div>

      {/* Main Table view */}
      {loading ? (
        <SecurityTableSkeleton />
      ) : (
        <SecurityTable 
          items={items} 
          onEdit={handleEditOpen} 
          onDelete={handleDeleteOpen}
          onRowClick={handleRowClick}
        />
      )}

      {/* Form Dialog Modal (Create/Edit) */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              {selectedItem ? "Edit Security Device" : "Register New Device"}
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-muted-foreground">
              Fill in the parameters below to update or register the security asset.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <SecurityForm
              initialData={selectedItem}
              vendorList={vendors}
              departments={departments}
              locations={locations}
              rooms={rooms}
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
              Delete Security Device?
            </DialogTitle>
            <DialogDescription className="text-center text-sm font-medium text-muted-foreground">
              Are you absolutely sure you want to delete this security device? This operation cannot be undone and will permanently purge the record from the database.
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
              Delete Device
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog Modal */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#c9a342]" />
              Security Device Details
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-muted-foreground">
              Detailed information about this security device.
            </DialogDescription>
          </DialogHeader>

          {detailLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : detailItem ? (
            <div className="space-y-6 py-2">
              {/* Header Section */}
              <div className="flex items-start justify-between border-b border-border pb-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-foreground">{detailItem.device_type}</h3>
                  {detailItem.item_code && (
                    <div className="mt-1">
                      <span className="font-mono text-[10px] text-[#c9a342] font-extrabold tracking-wider uppercase">
                        <Hash className="h-3 w-3 inline mr-1" />
                        {detailItem.item_code}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {detailItem.status === "ONLINE" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs font-bold bg-[#2eb87a]/12 text-[#2eb87a] uppercase tracking-wider">
                      <span className="h-2 w-2 rounded-full bg-[#2eb87a]" />
                      Online
                    </span>
                  )}
                  {detailItem.status === "OFFLINE" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs font-bold bg-[#e05252]/12 text-[#e05252] uppercase tracking-wider">
                      <span className="h-2 w-2 rounded-full bg-[#e05252]" />
                      Offline
                    </span>
                  )}
                  {detailItem.status === "MAINTENANCE" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs font-bold bg-[#f5853d]/12 text-[#f5853d] uppercase tracking-wider">
                      <span className="h-2 w-2 rounded-full bg-[#f5853d]" />
                      Maintenance
                    </span>
                  )}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Department */}
                {detailItem.department && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wide">
                      <Building2 className="h-3.5 w-3.5" />
                      Department
                    </div>
                    <div className="text-sm font-semibold text-foreground">{detailItem.department.name}</div>
                  </div>
                )}

                {/* Location */}
                {detailItem.location && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wide">
                      <MapPin className="h-3.5 w-3.5" />
                      Location
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      {detailItem.location.name} ({detailItem.location.type})
                    </div>
                  </div>
                )}

                {/* Room */}
                {detailItem.room && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wide">
                      <DoorOpen className="h-3.5 w-3.5" />
                      Room
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      Room {detailItem.room.room_number}
                      {detailItem.room.floor && ` (Floor ${detailItem.room.floor})`}
                    </div>
                  </div>
                )}

                {/* Vendor */}
                {detailItem.vendor && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wide">
                      <Store className="h-3.5 w-3.5" />
                      Vendor Partner
                    </div>
                    <div className="text-sm font-semibold text-foreground">{detailItem.vendor.name}</div>
                  </div>
                )}
              </div>

              {/* Timestamps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wide">
                    <Calendar className="h-3.5 w-3.5" />
                    Created At
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    {detailItem.created_at ? new Date(detailItem.created_at).toLocaleString() : "—"}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wide">
                    <Clock className="h-3.5 w-3.5" />
                    Updated At
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    {detailItem.updated_at ? new Date(detailItem.updated_at).toLocaleString() : "—"}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No device selected.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
