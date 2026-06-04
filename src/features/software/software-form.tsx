"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createSoftwareAction, updateSoftwareAction } from "@/app/actions/software";
import { SoftwareWithRelations } from "@/repositories/software.repository";
import { Loader2 } from "lucide-react";

interface SoftwareFormProps {
  initialData?: SoftwareWithRelations | null;
  staffList: Array<{ id: string; full_name: string; department: { id: string; name: string } | null }>;
  vendorList: Array<{ id: string; name: string }>;
  onSuccess: () => void;
  onCancel: () => void;
}

export function SoftwareForm({
  initialData,
  staffList,
  vendorList,
  onSuccess,
  onCancel
}: SoftwareFormProps) {
  const isEdit = !!initialData;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [itemCode, setItemCode] = useState(initialData?.item_code || "");
  const [name, setName] = useState(initialData?.name || "");
  const [licenseKey, setLicenseKey] = useState(initialData?.license_key || "");
  const [expirationDate, setExpirationDate] = useState(initialData?.expiration_date || "");
  const [staffId, setStaffId] = useState(initialData?.staff_id || "");
  const [vendorId, setVendorId] = useState(initialData?.vendor_id || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (name.trim().length < 3) {
      setError("Software Name must be at least 3 characters long.");
      setLoading(false);
      return;
    }

    const payload = {
      item_code: itemCode.trim() || undefined,
      name: name.trim(),
      license_key: licenseKey.trim() || undefined,
      expiration_date: expirationDate || undefined,
      staff_id: staffId === "" ? null : staffId,
      vendor_id: vendorId === "" ? null : vendorId
    };

    try {
      let res;
      if (isEdit && initialData) {
        res = await updateSoftwareAction(initialData.id, payload);
      } else {
        res = await createSoftwareAction(payload);
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
              placeholder="e.g. SW-MS-001"
              value={itemCode}
              onChange={(e) => setItemCode(e.target.value)}
              disabled={loading}
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 font-mono text-[13px] tracking-wide"
            />
          </div>

          {/* Name */}
          <div className="space-y-1 col-span-2">
            <label htmlFor="name" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Software Name *
            </label>
            <input
              id="name"
              type="text"
              required
              placeholder="e.g. Adobe Creative Cloud, Microsoft Office 365"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        {/* License Key */}
        <div className="space-y-1">
          <label htmlFor="licenseKey" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
            License Key
          </label>
          <input
            id="licenseKey"
            type="text"
            placeholder="e.g. AAAA-BBBB-CCCC-DDDD"
            value={licenseKey}
            onChange={(e) => setLicenseKey(e.target.value)}
            disabled={loading}
            className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 font-mono text-[13px] tracking-wide"
          />
        </div>

        {/* Expiration Date */}
        <div className="space-y-1">
          <label htmlFor="expirationDate" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
            Expiration Date (Optional)
          </label>
          <input
            id="expirationDate"
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            disabled={loading}
            className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
          />
          <p className="text-[10px] text-muted-foreground/80 font-medium">Leave blank for lifetime or permanent licenses.</p>
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
                  {staff.full_name} ({staff.department?.name || "No Dept"})
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
          {isEdit ? "Update License" : "Register License"}
        </Button>
      </div>
    </form>
  );
}
