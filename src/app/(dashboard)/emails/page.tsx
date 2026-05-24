"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { 
  getEmailsAction, 
  deleteEmailAction 
} from "@/app/actions/emails";
import { EmailTable } from "@/features/emails/email-table";
import { EmailForm } from "@/features/emails/email-form";
import { EmailTableSkeleton } from "@/features/emails/email-skeleton";
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
  Mail,
  ShieldCheck,
  ShieldAlert
} from "lucide-react";

export default function EmailsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Notification
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const loadEmails = async () => {
    setLoading(true);
    try {
      const res = await getEmailsAction({
        query: searchQuery || undefined
      });
      if (res.success) {
        setItems(res.data || []);
      } else {
        showNotification("error", res.error || "Failed to load email account list.");
      }
    } catch (err: any) {
      showNotification("error", err.message || "Failed to load email account list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadEmails();
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
    showNotification("success", `Email account successfully ${selectedItem ? "updated" : "registered"}.`);
    loadEmails();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      const res = await deleteEmailAction(deleteId);
      if (res.success) {
        setDeleteOpen(false);
        setDeleteId(null);
        showNotification("success", "Email account deleted successfully.");
        loadEmails();
      } else {
        showNotification("error", res.error || "Failed to delete email account.");
      }
    } catch (err: any) {
      showNotification("error", err.message || "Failed to delete email account.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Stats calculation
  const stats = React.useMemo(() => {
    let total = items.length;
    let active = items.filter(item => item.status === "ACTIVE").length;
    let nonActive = items.filter(item => item.status !== "ACTIVE").length;

    return { total, active, nonActive };
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
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Email Account Management</h1>
          <p className="text-sm font-medium text-muted-foreground">
            Monitor and assign corporate Google Workspace and Microsoft 365 logins.
          </p>
        </div>
        <Button 
          onClick={handleCreateOpen}
          className="h-10 px-4 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center gap-2 shadow-sm hover:bg-primary/90 shrink-0 w-fit"
        >
          <Plus className="h-4 w-4" />
          Register Email Login
        </Button>
      </div>

      {/* Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <Mail className="h-6 w-6" />
          </div>
          <div className="space-y-0.5 leading-none">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Emails</span>
            <div className="text-xl font-extrabold text-foreground mt-1">
              {stats.total} <span className="text-xs font-semibold text-muted-foreground font-sans">addresses</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="space-y-0.5 leading-none">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Logins</span>
            <div className="text-xl font-extrabold text-foreground mt-1">
              {stats.active} <span className="text-xs font-semibold text-muted-foreground font-sans">logins</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 rounded-lg bg-amber-500/10 text-amber-500">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div className="space-y-0.5 leading-none">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Inactive / Suspended</span>
            <div className="text-xl font-extrabold text-foreground mt-1">
              {stats.nonActive} <span className="text-xs font-semibold text-muted-foreground font-sans">accounts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search email accounts by address, platform provider, or owner employee..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex h-10 w-full rounded-lg border border-input bg-card pl-10 pr-4 text-sm shadow-xs transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      {/* Main Table */}
      {loading ? (
        <EmailTableSkeleton />
      ) : (
        <EmailTable 
          items={items} 
          onEdit={handleEditOpen} 
          onDelete={handleDeleteOpen} 
        />
      )}

      {/* Form Modal */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              {selectedItem ? "Edit Email Account Details" : "Register Email Login Account"}
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-muted-foreground">
              Map login handles to specific system platforms and assign active employees.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <EmailForm
              initialData={selectedItem}
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
              Purge Email Account?
            </DialogTitle>
            <DialogDescription className="text-center text-sm font-medium text-muted-foreground">
              Are you sure you want to permanently delete this email login account? This will immediately unassign it from the personnel record.
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
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
