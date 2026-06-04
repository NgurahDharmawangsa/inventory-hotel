"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { 
  getStaffAction, 
  getStaffDetailAction,
  deleteStaffAction 
} from "@/app/actions/staff";
import { getDepartmentsAction } from "@/app/actions/departments";
import { StaffTable } from "@/features/staff/staff-table";
import { StaffForm } from "@/features/staff/staff-form";
import { StaffTableSkeleton } from "@/features/staff/staff-skeleton";
import { StaffDetail } from "@/types/database.types";
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
  Users,
  UserCheck,
  UserX
} from "lucide-react";

export default function StaffPage() {
  const [items, setItems] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<StaffDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Notification
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const loadStaff = async () => {
    setLoading(true);
    try {
      const res = await getStaffAction({
        query: searchQuery || undefined
      });
      if (res.success) {
        setItems(res.data || []);
      } else {
        showNotification("error", res.error || "Failed to load employee list.");
      }
    } catch (err: any) {
      showNotification("error", err.message || "Failed to load employee list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadDepartments() {
      const res = await getDepartmentsAction();
      if (res.success) {
        setDepartments(res.data || []);
      }
    }
    loadDepartments();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadStaff();
    }, 300);

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
    showNotification("success", `Employee successfully ${selectedItem ? "updated" : "registered"}.`);
    loadStaff();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      const res = await deleteStaffAction(deleteId);
      if (res.success) {
        setDeleteOpen(false);
        setDeleteId(null);
        showNotification("success", "Employee record deleted successfully.");
        loadStaff();
      } else {
        showNotification("error", res.error || "Failed to delete employee record.");
      }
    } catch (err: any) {
      showNotification("error", err.message || "Failed to delete employee record.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleRowClick = async (item: any) => {
    setDetailOpen(true);
    setDetailItem(null);
    setDetailLoading(true);

    try {
      const res = await getStaffDetailAction(item.id);
      if (res.success && res.data) {
        setDetailItem(res.data);
      } else {
        setDetailItem(null);
        showNotification("error", res.error || "Failed to load staff details.");
      }
    } catch (err: any) {
      showNotification("error", err.message || "Failed to load staff details.");
    } finally {
      setDetailLoading(false);
    }
  };

  // Stats calculation
  const stats = React.useMemo(() => {
    let total = items.length;
    let active = items.filter(item => item.status === "ACTIVE").length;
    let onLeave = items.filter(item => item.status === "ON LEAVE").length;

    return { total, active, onLeave };
  }, [items]);

  return (
    <div className="space-y-6">
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

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Employee Directory</h1>
          <p className="text-sm font-medium text-muted-foreground">
            Manage hotel personnel database and active division records.
          </p>
        </div>
        <Button 
          onClick={handleCreateOpen}
          className="h-10 px-4 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center gap-2 shadow-sm hover:bg-primary/90 shrink-0 w-fit"
        >
          <Plus className="h-4 w-4" />
          Register Employee
        </Button>
      </div>

      {/* Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <Users className="h-6 w-6" />
          </div>
          <div className="space-y-0.5 leading-none">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Directory</span>
            <div className="text-xl font-extrabold text-foreground mt-1">
              {stats.total} <span className="text-xs font-semibold text-muted-foreground font-sans">staff members</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500">
            <UserCheck className="h-6 w-6" />
          </div>
          <div className="space-y-0.5 leading-none">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Staff</span>
            <div className="text-xl font-extrabold text-foreground mt-1">
              {stats.active} <span className="text-xs font-semibold text-muted-foreground font-sans">employees</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 rounded-lg bg-amber-500/10 text-amber-500">
            <UserX className="h-6 w-6" />
          </div>
          <div className="space-y-0.5 leading-none">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">On Leave</span>
            <div className="text-xl font-extrabold text-foreground mt-1">
              {stats.onLeave} <span className="text-xs font-semibold text-muted-foreground font-sans">personnel</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search employees by ID, name, department, or job role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex h-10 w-full rounded-lg border border-input bg-card pl-10 pr-4 text-sm shadow-xs transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      {/* Main Table */}
      {loading ? (
        <StaffTableSkeleton />
      ) : (
        <StaffTable 
          items={items} 
          onEdit={handleEditOpen} 
          onDelete={handleDeleteOpen}
          onRowClick={handleRowClick}
        />
      )}

      <Dialog open={detailOpen} onOpenChange={(open) => {
        setDetailOpen(open);
        if (!open) {
          setDetailItem(null);
        }
      }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              Staff Detail Overview
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-muted-foreground">
              Review assigned assets and email accounts for the selected employee.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {detailLoading ? (
              <div className="flex flex-col items-center justify-center p-14 rounded-xl border border-border bg-card">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                <p className="text-sm font-semibold text-muted-foreground">Loading staff details...</p>
              </div>
            ) : detailItem ? (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Employee</p>
                    <h3 className="text-base font-bold text-foreground mt-2">{detailItem.full_name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{detailItem.employee_id}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Role</p>
                    <h3 className="text-base font-bold text-foreground mt-2">{detailItem.position}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{detailItem.department?.name || "—"}</p>
                    <p className={`mt-3 inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                      detailItem.status === "ACTIVE"
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        : detailItem.status === "ON LEAVE"
                        ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                    }`}>
                      {detailItem.status}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                  <div className="rounded-xl border border-border bg-card p-4">
                    <h4 className="text-sm font-semibold text-foreground">Assigned Hardware</h4>
                    {detailItem.hardware.length > 0 ? (
                      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                        {detailItem.hardware.map((item) => (
                          <li key={item.id} className="rounded-lg border border-border bg-muted/70 px-3 py-2">
                            <div className="font-semibold text-foreground">{item.name}</div>
                            <div>{item.category}</div>
                            <div className="text-[11px] text-muted-foreground">{item.status}</div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 text-sm text-muted-foreground">No hardware assets assigned.</p>
                    )}
                  </div>

                  <div className="rounded-xl border border-border bg-card p-4">
                    <h4 className="text-sm font-semibold text-foreground">Assigned Software</h4>
                    {detailItem.software.length > 0 ? (
                      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                        {detailItem.software.map((item) => (
                          <li key={item.id} className="rounded-lg border border-border bg-muted/70 px-3 py-2">
                            <div className="font-semibold text-foreground">{item.name}</div>
                            <div>{item.license_key ? `License: ${item.license_key}` : item.expiration_date ? `Expires: ${item.expiration_date}` : "Software assignment"}</div>
                            <div className="text-[11px] text-muted-foreground">
                              {item.item_code ? `Code: ${item.item_code}` : item.expiration_date ? `Expires ${item.expiration_date}` : "No additional details"}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 text-sm text-muted-foreground">No software assigned.</p>
                    )}
                  </div>

                  <div className="rounded-xl border border-border bg-card p-4">
                    <h4 className="text-sm font-semibold text-foreground">Assigned Email Accounts</h4>
                    {detailItem.emails.length > 0 ? (
                      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                        {detailItem.emails.map((item) => (
                          <li key={item.id} className="rounded-lg border border-border bg-muted/70 px-3 py-2">
                            <div className="font-semibold text-foreground">{item.email_address}</div>
                            <div>{item.platform}</div>
                            <div className="text-[11px] text-muted-foreground">{item.status}</div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 text-sm text-muted-foreground">No email accounts assigned.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card p-8 text-center">
                <p className="text-sm font-semibold text-muted-foreground">Staff details could not be loaded.</p>
              </div>
            )}
          </div>

          <DialogFooter className="flex items-center justify-end gap-2 pt-4 border-t border-border mt-4">
            <Button onClick={() => setDetailOpen(false)} className="h-9 px-4 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Form Modal */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              {selectedItem ? "Edit Employee Details" : "Register New Personnel"}
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-muted-foreground">
              Add individual identifiers, complete name, division assigned, and operational status.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <StaffForm
              initialData={selectedItem}
              departments={departments}
              onSuccess={handleFormSuccess}
              onCancel={() => setFormOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 mb-2">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center text-lg font-bold text-foreground">
              Purge Personnel Record?
            </DialogTitle>
            <DialogDescription className="text-center text-sm font-medium text-muted-foreground">
              Are you sure you want to permanently delete this employee? This will unassign any active hardware or software accounts.
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
