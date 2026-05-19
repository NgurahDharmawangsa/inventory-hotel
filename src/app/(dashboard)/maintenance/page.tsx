"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  getMaintenanceAction, 
  getMaintenanceAssetsAction,
  deleteMaintenanceAction 
} from "@/app/actions/maintenance";
import { MaintenanceTable } from "@/features/maintenance/maintenance-table";
import { MaintenanceForm } from "@/features/maintenance/maintenance-form";
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
  AlertTriangle,
  Filter
} from "lucide-react";

export default function MaintenancePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Data states
  const [items, setItems] = useState<any[]>([]);
  const [assets, setAssets] = useState<{
    hardware: any[];
    software: any[];
    networking: any[];
    security: any[];
    hospitality: any[];
  }>({
    hardware: [],
    software: [],
    networking: [],
    security: [],
    hospitality: []
  });
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "IN_PROGRESS" | "COMPLETED">("ALL");

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Notifications
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Fetch registered assets once on mount
  useEffect(() => {
    async function loadAssets() {
      const res = await getMaintenanceAssetsAction();
      if (res.success && res.data) {
        setAssets(res.data);
      }
    }
    loadAssets();
  }, []);

  // Fetch maintenance logs
  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await getMaintenanceAction({
        query: searchQuery || undefined
      });
      if (res.success) {
        setItems(res.data || []);
      } else {
        showNotification("error", res.error || "Failed to load maintenance records.");
      }
    } catch (err: any) {
      showNotification("error", err.message || "Failed to load maintenance records.");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch on query changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadLogs();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Support ?action=new deep linking
  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "new" && assets.hardware.length > 0) {
      setSelectedItem(null);
      setFormOpen(true);
      // Clean up search query params from URL
      router.replace("/maintenance");
    }
  }, [searchParams, assets, router]);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreateOpen = () => {
    setSelectedItem(null);
    setFormOpen(true);
  };

  const handleEditOpen = (item: any) => {
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
    showNotification("success", `Maintenance record successfully ${selectedItem ? "updated" : "created"}.`);
    loadLogs();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      const res = await deleteMaintenanceAction(deleteId);
      if (res.success) {
        setDeleteOpen(false);
        setDeleteId(null);
        showNotification("success", "Maintenance record successfully deleted.");
        loadLogs();
      } else {
        showNotification("error", res.error || "Failed to delete maintenance record.");
      }
    } catch (err: any) {
      showNotification("error", err.message || "Failed to delete maintenance record.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Apply status filter client-side
  const filteredItems = React.useMemo(() => {
    if (statusFilter === "ALL") return items;
    if (statusFilter === "COMPLETED") {
      return items.filter(item => !!item.date_resolved);
    }
    if (statusFilter === "IN_PROGRESS") {
      return items.filter(item => !item.date_resolved);
    }
    return items;
  }, [items, statusFilter]);

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
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Maintenance & Repairs</h1>
          <p className="text-sm font-medium text-muted-foreground">
            Track reported equipment issues, active repair runs, resolution dates, and accumulated hardware repair costs.
          </p>
        </div>
        <Button 
          onClick={handleCreateOpen}
          className="h-10 px-4 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center gap-2 shadow-sm hover:bg-primary/90 shrink-0 w-fit"
        >
          <Plus className="h-4 w-4" />
          Report Maintenance Issue
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by asset name, issue, category, or item code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex h-10 w-full rounded-lg border border-input bg-card pl-10 pr-4 text-sm shadow-xs transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 sm:shrink-0">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="flex h-10 rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-semibold"
          >
            <option value="ALL">All Statuses</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Main Table view */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-24 text-center rounded-xl border border-border bg-card">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
          <p className="text-sm font-semibold text-muted-foreground">Loading maintenance logs...</p>
        </div>
      ) : (
        <MaintenanceTable 
          items={filteredItems} 
          onEdit={handleEditOpen} 
          onDelete={handleDeleteOpen} 
        />
      )}

      {/* Form Dialog Modal (Create/Edit) */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              {selectedItem ? "Edit Maintenance Record" : "Report Maintenance Issue"}
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-muted-foreground">
              Specify the asset, describe the issue, and fill in repairs/cost updates.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <MaintenanceForm
              initialData={selectedItem}
              assets={assets}
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
              Delete Maintenance Record?
            </DialogTitle>
            <DialogDescription className="text-center text-sm font-medium text-muted-foreground">
              Are you sure you want to purge this maintenance record? This will permanently delete the cost and history from logs.
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
              Delete Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
