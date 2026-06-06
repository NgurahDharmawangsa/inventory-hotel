"use client";

import * as React from "react";
import { useState, useEffect } from "react";
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
import { SecurityTable } from "@/features/security/security-table";
import { SecurityForm } from "@/features/security/security-form";
import { SecurityTableSkeleton } from "@/features/security/security-skeleton";
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
  Loader2, 
  X,
  AlertTriangle
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
  const [locationFilter, setLocationFilter] = useState("ALL");
  const [locationOptions, setLocationOptions] = useState<LocationRoomOption[]>([]);

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
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
  const loadSecurity = async () => {
    setLoading(true);
    try {
      const res = await getSecurityAction({
        query: searchQuery || undefined,
        location: locationFilter !== "ALL" ? locationFilter : undefined,
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
  };

  // Re-fetch on filter changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadSecurity();
    }, 300); // 300ms debounce for search input

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, locationFilter]);

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
        <Button 
          onClick={handleCreateOpen}
          className="h-10 px-4 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center gap-2 shadow-sm hover:bg-primary/90 shrink-0 w-fit"
        >
          <Plus className="h-4 w-4" />
          Register New Device
        </Button>
      </div>

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
    </div>
  );
}
