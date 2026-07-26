"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { 
   getNetworkingAction, 
   getNetworkingLocationsAction, 
   getNetworkingDetailAction, 
   deleteNetworkingAction 
} from "@/app/actions/networking";
import { LocationRoomOption, NetworkingWithRelations } from "@/repositories/networking.repository";
import { getRelationsAction } from "@/app/actions/hardware";
import { getDepartmentsAction } from "@/app/actions/departments";
import { getLocationsAction } from "@/app/actions/locations";
import { getRoomsAction } from "@/app/actions/rooms";
import { LocationRoomFilter } from "@/components/filters/location-room-filter";
import { exportToCSV, exportToJSON, flattenNetworkingForExport, generateExportFilename } from "@/lib/export-utils";
import { NetworkingTable } from "@/features/networking/networking-table";
import { NetworkingForm } from "@/features/networking/networking-form";
import { NetworkingTableSkeleton } from "@/features/networking/networking-skeleton";
import { NetworkingStatsCards } from "@/features/networking/networking-stats-cards";
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
  Filter,
  Download,
  FileJson,
  FileDown,
  Network,
  MapPin,
  Building2,
  DoorOpen,
  User,
  Briefcase,
  Tag,
  Hash,
  FileText
} from "lucide-react";

export default function NetworkingPage() {
  // Data states
  const [items, setItems] = useState<NetworkingWithRelations[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [deviceTypeFilter, setDeviceTypeFilter] = useState("ALL");
  const [locationFilter, setLocationFilter] = useState("ALL");
  const [locationOptions, setLocationOptions] = useState<LocationRoomOption[]>([]);

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<NetworkingWithRelations | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Detail modal states
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<NetworkingWithRelations | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Notifications
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [exportOpen, setExportOpen] = useState(false);

  // Export handlers
  const handleExportCSV = () => {
    const flattened = flattenNetworkingForExport(items);
    const headers = ["Device Type","Item Code","IP Address","Status","Department","Location","Location Type","Room","Room Floor","Vendor","Created At","Updated At"];
    const filename = generateExportFilename("networking_devices");
    exportToCSV(flattened, filename, headers);
    setExportOpen(false);
    showNotification("success", `CSV file "${filename}.csv" exported successfully.`);
  };

  const handleExportJSON = () => {
    const flattened = flattenNetworkingForExport(items);
    const filename = generateExportFilename("networking_devices");
    exportToJSON(flattened, filename);
    setExportOpen(false);
    showNotification("success", `JSON file "${filename}.json" exported successfully.`);
  };

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
    const res = await getNetworkingLocationsAction();
    if (res.success) {
      setLocationOptions(res.data);
    }
  };

  // Fetch networking list based on filters
  const loadNetworking = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await getNetworkingAction({
        query: searchQuery || undefined,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        device_type: deviceTypeFilter !== "ALL" ? deviceTypeFilter : undefined,
        location: locationFilter !== "ALL" ? locationFilter : undefined,
      });
      if (res.success) {
        setItems(res.data || []);
      } else {
        showNotification("error", res.error || "Failed to load networking devices.");
      }
    } catch (err: any) {
      showNotification("error", err.message || "Failed to load networking devices.");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, deviceTypeFilter, locationFilter]);

  // Re-fetch on filter changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadNetworking();
    }, 300); // 300ms debounce for search input

    return () => clearTimeout(delayDebounce);
  }, [loadNetworking]);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreateOpen = () => {
    setSelectedItem(null);
    setFormOpen(true);
  };

  const handleEditOpen = (item: NetworkingWithRelations) => {
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
    showNotification("success", `Networking device successfully ${selectedItem ? "updated" : "registered"}.`);
    loadNetworking();
  };

  const handleRowClick = async (item: NetworkingWithRelations) => {
    setDetailLoading(true);
    setDetailOpen(true);
    try {
      const res = await getNetworkingDetailAction(item.id);
      if (res.success) {
        setDetailItem(res.data);
      } else {
        showNotification("error", res.error || "Failed to load device detail.");
      }
    } catch (err: any) {
      showNotification("error", err.message || "Failed to load device detail.");
    } finally {
      setDetailLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ONLINE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-[#2eb87a]/12 text-[#2eb87a] uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2eb87a]" />
            Online
          </span>
        );
      case "OFFLINE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-[#e05252]/12 text-[#e05252] uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-[#e05252]" />
            Offline
          </span>
        );
      case "MAINTENANCE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-[#f5853d]/12 text-[#f5853d] uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-[#f5853d]" />
            Maintenance
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-muted text-muted-foreground uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
            {status}
          </span>
        );
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      const res = await deleteNetworkingAction(deleteId);
      if (res.success) {
        setDeleteOpen(false);
        setDeleteId(null);
        showNotification("success", "Networking device successfully deleted.");
        loadNetworking();
      } else {
        showNotification("error", res.error || "Failed to delete networking device.");
      }
    } catch (err: any) {
      showNotification("error", err.message || "Failed to delete networking device.");
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
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Networking Devices</h1>
          <p className="text-sm font-medium text-muted-foreground">
            Monitor and manage physical hotel network hardware, static IP addresses, and routing infrastructure.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 px-4 rounded-lg font-semibold flex items-center gap-2 shrink-0">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={handleExportCSV} className="cursor-pointer font-medium">
                <FileDown className="h-4 w-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportJSON} className="cursor-pointer font-medium">
                <FileJson className="h-4 w-4 mr-2" />
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            onClick={handleCreateOpen}
            className="h-10 px-4 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center gap-2 shadow-sm hover:bg-primary/90 shrink-0 w-fit"
          >
            <Plus className="h-4 w-4" />
            Register New Device
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <NetworkingStatsCards items={items} />

      {/* Filters Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by device type, item code, IP, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex h-10 w-full rounded-lg border border-input bg-card pl-10 pr-4 text-sm shadow-xs transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        {/* Device Type Filter */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <select
              value={deviceTypeFilter}
              onChange={(e) => setDeviceTypeFilter(e.target.value)}
              className="h-10 appearance-none rounded-lg border border-input bg-card pl-9 pr-8 text-sm font-medium shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
            >
              <option value="ALL">All Types</option>
              <option value="Router">Router</option>
              <option value="Switch">Switch</option>
              <option value="Firewall">Firewall</option>
              <option value="Access Point">Access Point</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
        <NetworkingTableSkeleton />
      ) : (
        <NetworkingTable 
          items={items} 
          onEdit={handleEditOpen} 
          onDelete={handleDeleteOpen} 
          onRowClick={handleRowClick}
        />
      )}

      {/* Detail Dialog Modal */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
              <Network className="h-5 w-5 text-[#c9a342]" />
              Networking Device Details
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-muted-foreground">
              Detailed information about this networking device.
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
                  {detailItem.ip_address && (
                    <span className="font-mono text-[11px] text-muted-foreground font-medium tracking-wide">
                      {detailItem.ip_address}
                    </span>
                  )}
                  {detailItem.item_code && (
                    <div className="mt-1">
                      <span className="font-mono text-[10px] text-[#c9a342] font-extrabold tracking-wider uppercase">
                        <Hash className="h-3 w-3 inline mr-1" />
                        {detailItem.item_code}
                      </span>
                    </div>
                  )}
                </div>
                {getStatusBadge(detailItem.status)}
              </div>

              {/* Detail Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Device Type */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <Tag className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Device Type</p>
                    <p className="text-sm font-semibold text-foreground">{detailItem.device_type}</p>
                  </div>
                </div>

                {/* Location / Room / Department */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Location</p>
                    <div className="space-y-2">
                      {detailItem.department && (
                        <div>
                          <p className="text-sm font-semibold text-foreground">{detailItem.department.name}</p>
                          <p className="text-[10px] text-muted-foreground font-medium">Department</p>
                        </div>
                      )}
                      {detailItem.location && (
                        <div>
                          <p className="text-sm font-semibold text-foreground">{detailItem.location.name}</p>
                          <p className="text-[10px] text-muted-foreground font-medium">({detailItem.location.type})</p>
                        </div>
                      )}
                      {detailItem.room && (
                        <div>
                          <p className="text-sm font-semibold text-foreground">Room {detailItem.room.room_number}</p>
                          {detailItem.room.floor && (
                            <p className="text-[10px] text-muted-foreground font-medium">{detailItem.room.floor}</p>
                          )}
                        </div>
                      )}
                      {!detailItem.department && !detailItem.location && !detailItem.room && (
                        <p className="text-sm text-muted-foreground/50">—</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Vendor */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Vendor Partner</p>
                    {detailItem.vendor ? (
                      <p className="text-sm font-semibold text-foreground">{detailItem.vendor.name}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground/50 font-semibold">—</p>
                    )}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-muted-foreground font-medium">Device details not found.</p>
            </div>
          )}

          <DialogFooter className="border-t border-border pt-4">
            <Button
              variant="outline"
              onClick={() => setDetailOpen(false)}
              className="h-9 px-4 rounded-lg"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Form Dialog Modal (Create/Edit) */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              {selectedItem ? "Edit Networking Device" : "Register New Device"}
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-muted-foreground">
              Fill in the parameters below to update or register the physical network device.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <NetworkingForm
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
              Delete Networking Device?
            </DialogTitle>
            <DialogDescription className="text-center text-sm font-medium text-muted-foreground">
              Are you absolutely sure you want to delete this networking device? This operation cannot be undone and will permanently purge the record from the database.
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
    </div>
  );
}
