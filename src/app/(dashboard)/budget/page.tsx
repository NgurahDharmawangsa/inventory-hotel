"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { 
  getBudgetsAction, 
  deleteBudgetAction 
} from "@/app/actions/budget";
import { BudgetTable } from "@/features/budget/budget-table";
import { BudgetForm } from "@/features/budget/budget-form";
import { BudgetTableSkeleton } from "@/features/budget/budget-skeleton";
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
  TrendingUp,
  TrendingDown,
  Scale
} from "lucide-react";

export default function BudgetPage() {
  // Data states
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Notifications
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Fetch budget plans
  const loadBudgets = async () => {
    setLoading(true);
    try {
      const res = await getBudgetsAction({
        query: searchQuery || undefined
      });
      if (res.success) {
        setItems(res.data || []);
      } else {
        showNotification("error", res.error || "Failed to load budget plans.");
      }
    } catch (err: any) {
      showNotification("error", err.message || "Failed to load budget plans.");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch on query changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadBudgets();
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
    showNotification("success", `Budget plan successfully ${selectedItem ? "updated" : "created"}.`);
    loadBudgets();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      const res = await deleteBudgetAction(deleteId);
      if (res.success) {
        setDeleteOpen(false);
        setDeleteId(null);
        showNotification("success", "Budget plan successfully deleted.");
        loadBudgets();
      } else {
        showNotification("error", res.error || "Failed to delete budget plan.");
      }
    } catch (err: any) {
      showNotification("error", err.message || "Failed to delete budget plan.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Calculate totals for highlight cards
  const stats = React.useMemo(() => {
    let totalAllocated = 0;
    let totalSpent = 0;

    items.forEach(item => {
      totalAllocated += item.total_allocated || 0;
      totalSpent += item.total_spent || 0;
    });

    const remaining = totalAllocated - totalSpent;

    return {
      allocated: totalAllocated,
      spent: totalSpent,
      remaining
    };
  }, [items]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(amount);
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
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">IT Budget Allocations</h1>
          <p className="text-sm font-medium text-muted-foreground">
            Manage year-by-year allocated budgets, verify expenses, and monitor utilization metrics.
          </p>
        </div>
        <Button 
          onClick={handleCreateOpen}
          className="h-10 px-4 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center gap-2 shadow-sm hover:bg-primary/90 shrink-0 w-fit"
        >
          <Plus className="h-4 w-4" />
          Create Budget Plan
        </Button>
      </div>

      {/* Financial Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Allocated Card */}
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div className="space-y-0.5 leading-none">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Allocated</span>
            <div className="text-lg font-extrabold text-foreground font-mono mt-1">
              {formatCurrency(stats.allocated)}
            </div>
          </div>
        </div>

        {/* Spent Card */}
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-4 shadow-2xs">
          <div className="p-3 rounded-lg bg-[#f5853d]/10 text-[#f5853d]">
            <TrendingDown className="h-6 w-6" />
          </div>
          <div className="space-y-0.5 leading-none">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Spent</span>
            <div className="text-lg font-extrabold text-foreground font-mono mt-1">
              {formatCurrency(stats.spent)}
            </div>
          </div>
        </div>

        {/* Net Remaining Card */}
        <div className={`rounded-xl border p-4 flex items-center gap-4 shadow-2xs ${
          stats.remaining >= 0 
            ? "border-border bg-card text-foreground" 
            : "border-rose-500/20 bg-rose-500/5 text-rose-500"
        }`}>
          <div className={`p-3 rounded-lg ${
            stats.remaining >= 0 
              ? "bg-emerald-500/10 text-emerald-600" 
              : "bg-rose-500/20 text-rose-500"
          }`}>
            <Scale className="h-6 w-6" />
          </div>
          <div className="space-y-0.5 leading-none">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Remaining IT Balance</span>
            <div className={`text-lg font-extrabold font-mono mt-1 ${
              stats.remaining >= 0 ? "text-foreground" : "text-rose-500"
            }`}>
              {formatCurrency(stats.remaining)}
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search budgets by year or comments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex h-10 w-full rounded-lg border border-input bg-card pl-10 pr-4 text-sm shadow-xs transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      {/* Main Table View */}
      {loading ? (
        <BudgetTableSkeleton />
      ) : (
        <BudgetTable 
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
              {selectedItem ? "Edit Budget Plan" : "Create IT Budget Plan"}
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-muted-foreground">
              Configure year allocated funds, actual spent baselines, and optional descriptions.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <BudgetForm
              initialData={selectedItem}
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
              Delete Budget Plan?
            </DialogTitle>
            <DialogDescription className="text-center text-sm font-medium text-muted-foreground">
              Are you sure you want to permanently purge this year's budget details? This will delete all allocation references.
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
              Delete Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
