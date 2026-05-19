"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createMaintenanceAction, updateMaintenanceAction } from "@/app/actions/maintenance";
import { MaintenanceWithItemDetails } from "@/app/actions/maintenance";
import { Loader2 } from "lucide-react";

interface MaintenanceFormProps {
  initialData?: MaintenanceWithItemDetails | null;
  assets: {
    hardware: Array<{ id: string; name: string; code: string | null }>;
    software: Array<{ id: string; name: string; code: string | null }>;
    networking: Array<{ id: string; name: string; code: string | null }>;
    security: Array<{ id: string; name: string; code: string | null }>;
    hospitality: Array<{ id: string; name: string; code: string | null }>;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export function MaintenanceForm({
  initialData,
  assets,
  onSuccess,
  onCancel
}: MaintenanceFormProps) {
  const isEdit = !!initialData;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [itemType, setItemType] = useState<string>(initialData?.item_type || "HARDWARE");
  const [itemId, setItemId] = useState<string>(initialData?.item_id || "");
  const [issue, setIssue] = useState<string>(initialData?.issue || "");
  const [repairCost, setRepairCost] = useState<string>(initialData?.repair_cost?.toString() || "0");
  const [dateReported, setDateReported] = useState<string>(
    initialData?.date_reported 
      ? new Date(initialData.date_reported).toISOString().split("T")[0] 
      : new Date().toISOString().split("T")[0]
  );
  const [dateResolved, setDateResolved] = useState<string>(
    initialData?.date_resolved 
      ? new Date(initialData.date_resolved).toISOString().split("T")[0] 
      : ""
  );

  // Get active asset lists based on type
  const getActiveAssetList = () => {
    switch (itemType.toUpperCase()) {
      case "HARDWARE":
        return assets.hardware;
      case "SOFTWARE":
        return assets.software;
      case "NETWORKING":
        return assets.networking;
      case "SECURITY":
        return assets.security;
      case "HOSPITALITY":
        return assets.hospitality;
      default:
        return [];
    }
  };

  const activeAssets = getActiveAssetList();

  // Automatically select the first item when category changes
  useEffect(() => {
    if (!isEdit) {
      if (activeAssets.length > 0) {
        setItemId(activeAssets[0].id);
      } else {
        setItemId("");
      }
    }
  }, [itemType, assets]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!itemId) {
      setError("Please select a registered asset to report maintenance for.");
      setLoading(false);
      return;
    }

    if (issue.trim().length < 5) {
      setError("Issue description must be at least 5 characters long.");
      setLoading(false);
      return;
    }

    const costNum = Number(repairCost);
    if (isNaN(costNum) || costNum < 0) {
      setError("Repair cost must be a positive number or zero.");
      setLoading(false);
      return;
    }

    const payload = {
      item_id: itemId,
      item_type: itemType,
      issue: issue.trim(),
      repair_cost: costNum,
      date_reported: dateReported || undefined,
      date_resolved: dateResolved || null
    };

    try {
      let res;
      if (isEdit && initialData) {
        res = await updateMaintenanceAction(initialData.id, payload);
      } else {
        res = await createMaintenanceAction(payload);
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
        <div className="grid grid-cols-3 gap-4">
          {/* Asset Category */}
          <div className="space-y-1 col-span-1">
            <label htmlFor="itemType" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Category *
            </label>
            <select
              id="itemType"
              value={itemType}
              onChange={(e) => {
                setItemType(e.target.value);
                setItemId(""); // Reset item selection
              }}
              disabled={loading || isEdit}
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-70 font-semibold"
            >
              <option value="HARDWARE">Hardware</option>
              <option value="SOFTWARE">Software</option>
              <option value="NETWORKING">Networking</option>
              <option value="SECURITY">Security</option>
              <option value="HOSPITALITY">Hospitality</option>
            </select>
          </div>

          {/* Asset Selection */}
          <div className="space-y-1 col-span-2">
            <label htmlFor="itemId" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Registered Asset *
            </label>
            {activeAssets.length === 0 ? (
              <div className="flex h-9 w-full items-center justify-center rounded-lg border border-dashed border-destructive/30 bg-destructive/5 px-3 text-xs font-semibold text-destructive">
                No items registered in this category.
              </div>
            ) : (
              <select
                id="itemId"
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
                disabled={loading || isEdit}
                className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-70"
              >
                {!itemId && <option value="">Select an asset...</option>}
                {activeAssets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name} {asset.code ? `(${asset.code})` : ""}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Issue Description */}
        <div className="space-y-1">
          <label htmlFor="issue" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
            Reported Issue *
          </label>
          <textarea
            id="issue"
            required
            rows={3}
            placeholder="Describe the issue (e.g. Layar berkedip-kedip saat menyala, butuh ganti modul power supply)"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            disabled={loading}
            className="flex w-full rounded-lg border border-input bg-card px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 resize-none"
          />
        </div>

        {/* Repair Cost */}
        <div className="space-y-1">
          <label htmlFor="repairCost" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
            Repair Cost (Rp) *
          </label>
          <input
            id="repairCost"
            type="number"
            min="0"
            required
            placeholder="0"
            value={repairCost}
            onChange={(e) => setRepairCost(e.target.value)}
            disabled={loading}
            className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 font-mono"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Date Reported */}
          <div className="space-y-1">
            <label htmlFor="dateReported" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Date Reported *
            </label>
            <input
              id="dateReported"
              type="date"
              required
              value={dateReported}
              onChange={(e) => setDateReported(e.target.value)}
              disabled={loading}
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 font-mono"
            />
          </div>

          {/* Date Resolved */}
          <div className="space-y-1">
            <label htmlFor="dateResolved" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Date Resolved (Mark Complete)
            </label>
            <input
              id="dateResolved"
              type="date"
              value={dateResolved}
              onChange={(e) => setDateResolved(e.target.value)}
              disabled={loading}
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 font-mono"
            />
          </div>
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
          disabled={loading || activeAssets.length === 0}
          className="h-9 px-4 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center gap-1.5 shadow-sm hover:bg-primary/90"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEdit ? "Update Record" : "Create Record"}
        </Button>
      </div>
    </form>
  );
}
