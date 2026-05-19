"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createBudgetAction, updateBudgetAction } from "@/app/actions/budget";
import { Budget } from "@/types/database.types";
import { Loader2 } from "lucide-react";

interface BudgetFormProps {
  initialData?: Budget | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function BudgetForm({
  initialData,
  onSuccess,
  onCancel
}: BudgetFormProps) {
  const isEdit = !!initialData;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [year, setYear] = useState<string>(initialData?.year?.toString() || new Date().getFullYear().toString());
  const [totalAllocated, setTotalAllocated] = useState<string>(initialData?.total_allocated?.toString() || "0");
  const [totalSpent, setTotalSpent] = useState<string>(initialData?.total_spent?.toString() || "0");
  const [notes, setNotes] = useState<string>(initialData?.notes || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const yearNum = Number(year);
    if (isNaN(yearNum) || !Number.isInteger(yearNum) || yearNum < 2000 || yearNum > 2100) {
      setError("Budget year must be an integer between 2000 and 2100.");
      setLoading(false);
      return;
    }

    const allocatedNum = Number(totalAllocated);
    if (isNaN(allocatedNum) || allocatedNum < 0) {
      setError("Total allocated budget must be a positive number or zero.");
      setLoading(false);
      return;
    }

    const spentNum = Number(totalSpent);
    if (isNaN(spentNum) || spentNum < 0) {
      setError("Total spent budget must be a positive number or zero.");
      setLoading(false);
      return;
    }

    const payload = {
      year: yearNum,
      total_allocated: allocatedNum,
      total_spent: spentNum,
      notes: notes.trim() || null
    };

    try {
      let res;
      if (isEdit && initialData) {
        res = await updateBudgetAction(initialData.id, payload);
      } else {
        res = await createBudgetAction(payload);
      }

      if (res.success) {
        onSuccess();
      } else {
        setError(res.error || "An error occurred during submission.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs font-semibold text-destructive animate-in fade-in slide-in-from-top-1">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {/* Row 1: Symmetrical Grid (1/3 Year, 2/3 Allocated) */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1 col-span-1">
            <label htmlFor="year" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Budget Year *
            </label>
            <input
              id="year"
              type="number"
              min="2000"
              max="2100"
              required
              disabled={loading || isEdit}
              placeholder="e.g. 2026"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-75 font-mono font-bold"
            />
          </div>

          <div className="space-y-1 col-span-2">
            <label htmlFor="totalAllocated" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Total Allocated (Rp) *
            </label>
            <input
              id="totalAllocated"
              type="number"
              min="0"
              required
              placeholder="0"
              value={totalAllocated}
              onChange={(e) => setTotalAllocated(e.target.value)}
              disabled={loading}
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 font-mono"
            />
          </div>
        </div>

        {/* Row 2: Total Spent (full column) */}
        <div className="space-y-1">
          <label htmlFor="totalSpent" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
            Total Spent (Rp) *
          </label>
          <input
            id="totalSpent"
            type="number"
            min="0"
            required
            placeholder="0"
            value={totalSpent}
            onChange={(e) => setTotalSpent(e.target.value)}
            disabled={loading}
            className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 font-mono"
          />
        </div>

        {/* Row 3: Notes */}
        <div className="space-y-1">
          <label htmlFor="notes" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
            Notes / Comments
          </label>
          <textarea
            id="notes"
            rows={3}
            placeholder="E.g. Alokasi pembelian lisensi ERP, CCTV tambahan, dan upgrade router core hotel."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={loading}
            className="flex w-full rounded-lg border border-input bg-card px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 resize-none"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-2 pt-4 border-t border-border mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="h-9 px-4 rounded-lg"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="h-9 px-4 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center gap-1.5 shadow-sm hover:bg-primary/90"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEdit ? "Update Plan" : "Create Plan"}
        </Button>
      </div>
    </form>
  );
}
