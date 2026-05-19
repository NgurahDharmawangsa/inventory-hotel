"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createHardwareAction, updateHardwareAction } from "@/app/actions/hardware";
import { HardwareWithRelations } from "@/repositories/hardware.repository";
import { Loader2 } from "lucide-react";

interface HardwareFormProps {
  initialData?: HardwareWithRelations | null;
  staffList: Array<{ id: string; full_name: string; department: string }>;
  vendorList: Array<{ id: string; name: string }>;
  onSuccess: () => void;
  onCancel: () => void;
}

export function HardwareForm({
  initialData,
  staffList,
  vendorList,
  onSuccess,
  onCancel
}: HardwareFormProps) {
  const isEdit = !!initialData;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [itemCode, setItemCode] = useState(initialData?.item_code || "");
  const [name, setName] = useState(initialData?.name || "");
  const [category, setCategory] = useState(initialData?.category || "Laptop");
  const [location, setLocation] = useState(initialData?.location || "");
  const [status, setStatus] = useState(initialData?.status || "ACTIVE");
  const [staffId, setStaffId] = useState(initialData?.staff_id || "");
  const [vendorId, setVendorId] = useState(initialData?.vendor_id || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (name.trim().length < 3) {
      setError("Asset Name must be at least 3 characters long.");
      setLoading(false);
      return;
    }

    const payload = {
      item_code: itemCode.trim() || undefined,
      name: name.trim(),
      category,
      location: location.trim() || undefined,
      status,
      staff_id: staffId || undefined,
      vendor_id: vendorId || undefined
    };

    try {
      let res;
      if (isEdit && initialData) {
        res = await updateHardwareAction(initialData.id, payload);
      } else {
        res = await createHardwareAction(payload);
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
          {/* Item Code */}
          <div className="space-y-1 col-span-1">
            <label htmlFor="itemCode" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Item Code
            </label>
            <input
              id="itemCode"
              type="text"
              placeholder="e.g. HW-LT-001"
              value={itemCode}
              onChange={(e) => setItemCode(e.target.value)}
              disabled={loading}
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 font-mono text-[13px] tracking-wide"
            />
          </div>

          {/* Name */}
          <div className="space-y-1 col-span-2">
            <label htmlFor="name" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Asset Name *
            </label>
            <input
              id="name"
              type="text"
              required
              placeholder="e.g. Macbook Pro 16"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Category */}
          <div className="space-y-1">
            <label htmlFor="category" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Category *
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
            >
              <option value="Laptop">Laptop</option>
              <option value="Desktop">Desktop</option>
              <option value="Server">Server</option>
              <option value="Network">Network Device</option>
              <option value="Printer">Printer</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label htmlFor="status" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Status *
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              disabled={loading}
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
            >
              <option value="ACTIVE">Active</option>
              <option value="BROKEN">Broken</option>
              <option value="REPAIR">Repair</option>
              <option value="DISPOSED">Disposed</option>
            </select>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-1">
          <label htmlFor="location" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
            Location
          </label>
          <input
            id="location"
            type="text"
            placeholder="e.g. Front Office, IT Room"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={loading}
            className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Assigned Staff */}
          <div className="space-y-1">
            <label htmlFor="staff" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Assign To Staff
            </label>
            <select
              id="staff"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              disabled={loading}
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
            >
              <option value="">Unassigned</option>
              {staffList.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.full_name} ({staff.department})
                </option>
              ))}
            </select>
          </div>

          {/* Vendor */}
          <div className="space-y-1">
            <label htmlFor="vendor" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Vendor Partner
            </label>
            <select
              id="vendor"
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              disabled={loading}
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
            >
              <option value="">None</option>
              {vendorList.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))}
            </select>
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
          disabled={loading}
          className="h-9 px-4 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center gap-1.5 shadow-sm hover:bg-primary/90"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEdit ? "Update Asset" : "Register Asset"}
        </Button>
      </div>
    </form>
  );
}
