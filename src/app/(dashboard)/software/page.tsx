"use client";

import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { 
  getSoftwareAction, 
  deleteSoftwareAction 
} from "@/app/actions/software";
import { getRelationsAction } from "@/app/actions/hardware";
import { SoftwareWithRelations } from "@/repositories/software.repository";
import { SoftwareTable } from "@/features/software/software-table";
import { SoftwareDetailModal } from "@/features/software/software-detail-modal";
import { SoftwareForm } from "@/features/software/software-form";
import { SoftwareStatsCards } from "@/features/software/software-stats-cards";
import { SoftwareTableSkeleton } from "@/features/software/software-skeleton";
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
   Download,
   FileDown,
   FileJson,
   Filter
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportToCSV, exportToJSON, flattenSoftwareForExport, generateExportFilename } from "@/lib/export-utils";
import { getDaysRemaining } from "@/utils/date";

export default function SoftwarePage() {
  // Data states
  const [items, setItems] = useState<SoftwareWithRelations[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [expirationFilter, setExpirationFilter] = useState("ALL");
  const [vendorFilter, setVendorFilter] = useState("ALL");

  // Helper: compute expiration status
  const getExpirationStatus = (dateStr: string | null | undefined): string => {
    if (!dateStr) return "LIFETIME";
    const days = getDaysRemaining(dateStr);
    if (days === null) return "LIFETIME";
    if (days < 0) return "EXPIRED";
    if (days <= 30) return "EXPIRING_SOON";
    return "ACTIVE";
  };

  // Filter items client-side by expiration status and vendor
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Expiration filter
      if (expirationFilter !== "ALL" && getExpirationStatus(item.expiration_date) !== expirationFilter) {
        return false;
      }
      // Vendor filter
      if (vendorFilter !== "ALL" && item.vendor_id !== vendorFilter) {
        return false;
      }
      return true;
    });
  }, [items, expirationFilter, vendorFilter]);

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SoftwareWithRelations | null>(null);
  const [detailItem, setDetailItem] = useState<SoftwareWithRelations | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Notifications
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Fetch relations once on mount
  useEffect(() => {
    async function loadRelations() {
      const res = await getRelationsAction();
      if (res.success) {
        setStaff(res.data.staff);
        setVendors(res.data.vendors);
      }
    }
    loadRelations();
  }, []);

  // Fetch software list based on filters
  const loadSoftware = async () => {
    setLoading(true);
    try {
      const res = await getSoftwareAction({
        query: searchQuery || undefined
      });
      if (res.success) {
        setItems(res.data);
      } else {
        showNotification("error", res.error || "Failed to load software licenses.");
      }
    } catch (err: any) {
      showNotification("error", err.message || "Failed to load software licenses.");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch on filter changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadSoftware();
    }, 300); // 300ms debounce for search input

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreateOpen = () => {
    setSelectedItem(null);
    setFormOpen(true);
  };

  const handleViewDetail = (item: SoftwareWithRelations) => {
    setDetailItem(item);
    setDetailOpen(true);
  };

  const handleEditOpen = (item: SoftwareWithRelations) => {
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
    showNotification("success", `Software license successfully ${selectedItem ? "updated" : "registered"}.`);
    loadSoftware();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      const res = await deleteSoftwareAction(deleteId);
      if (res.success) {
        setDeleteOpen(false);
        setDeleteId(null);
        showNotification("success", "Software license successfully deleted.");
        loadSoftware();
      } else {
        showNotification("error", res.error || "Failed to delete software license.");
      }
    } catch (err: any) {
      showNotification("error", err.message || "Failed to delete software license.");
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
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Software Licenses</h1>
          <p className="text-sm font-medium text-muted-foreground">
            Monitor, register, and assign hotel software licenses, keys, and subscription expirations.
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
                  const filename = generateExportFilename("software-licenses");
                  const flattenedData = flattenSoftwareForExport(items);
                  exportToCSV(flattenedData, filename);
                  showNotification("success", "Software data exported to CSV successfully!");
                }}
                className="cursor-pointer"
              >
                <FileDown className="h-4 w-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => {
                  const filename = generateExportFilename("software-licenses");
                  const flattenedData = flattenSoftwareForExport(items);
                  exportToJSON(flattenedData, filename);
                  showNotification("success", "Software data exported to JSON successfully!");
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
            className="h-10 px-4 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center gap-2 shadow-sm hover:bg-primary/90 shrink-0 w-fit"
          >
            <Plus className="h-4 w-4" />
            Register New License
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <SoftwareStatsCards items={items} />

      {/* Filters Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by license name or key..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex h-10 w-full rounded-lg border border-input bg-card pl-10 pr-4 text-sm shadow-xs transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        {/* Expiration Status Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
          <select
            value={expirationFilter}
            onChange={(e) => setExpirationFilter(e.target.value)}
            className="flex h-10 w-44 rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="ALL">All Expiration</option>
            <option value="ACTIVE">Active</option>
            <option value="EXPIRING_SOON">Expiring Soon (≤30d)</option>
            <option value="EXPIRED">Expired</option>
            <option value="LIFETIME">Lifetime</option>
          </select>
        </div>

        {/* Vendor Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={vendorFilter}
            onChange={(e) => setVendorFilter(e.target.value)}
            className="flex h-10 w-44 rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="ALL">All Vendors</option>
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>
      </div>

        {/* Main Table view */}
      {loading ? (
        <SoftwareTableSkeleton />
      ) : (
        <SoftwareTable 
          items={filteredItems} 
          onEdit={handleEditOpen} 
          onDelete={handleDeleteOpen}
          onViewDetail={handleViewDetail}
        />
      )}

      {/* Detail Modal */}
      <SoftwareDetailModal
        item={detailItem}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onEdit={handleEditOpen}
      />

      {/* Form Dialog Modal (Create/Edit) */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              {selectedItem ? "Edit Software License" : "Register New License"}
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-muted-foreground">
              Fill in the parameters below to update or register the software license.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <SoftwareForm
              initialData={selectedItem || undefined}
              staffList={staff}
              vendorList={vendors}
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
              Delete Software License?
            </DialogTitle>
            <DialogDescription className="text-center text-sm font-medium text-muted-foreground">
              Are you absolutely sure you want to delete this software license? This operation cannot be undone and will permanently purge the record from the database.
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
              Delete License
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
