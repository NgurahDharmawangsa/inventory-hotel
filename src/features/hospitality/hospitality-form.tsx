"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createHospitalityAction, updateHospitalityAction } from "@/app/actions/hospitality";
import { HospitalityWithRelations } from "@/repositories/hospitality.repository";
import { Loader2 } from "lucide-react";

interface HospitalityFormProps {
  initialData?: HospitalityWithRelations | null;
  vendorList: Array<{ id: string; name: string }>;
  onSuccess: () => void;
  onCancel: () => void;
}

export function HospitalityForm({
  initialData,
  vendorList,
  onSuccess,
  onCancel
}: HospitalityFormProps) {
  const isEdit = !!initialData;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [itemCode, setItemCode] = useState(initialData?.item_code || "");
  const [deviceType, setDeviceType] = useState(initialData?.device_type || "");
  const [roomNumber, setRoomNumber] = useState(initialData?.room_number || "");
  const [status, setStatus] = useState(initialData?.status || "ACTIVE");
  const [vendorId, setVendorId] = useState(initialData?.vendor_id || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (deviceType.trim().length < 3) {
      setError("Device Type must be at least 3 characters long.");
      setLoading(false);
      return;
    }

    const payload = {
      item_code: itemCode.trim() || undefined,
      device_type: deviceType.trim(),
      room_number: roomNumber.trim() || undefined,
      status,
      vendor_id: vendorId || undefined
    };

    try {
      let res;
      if (isEdit && initialData) {
        res = await updateHospitalityAction(initialData.id, payload);
      } else {
        res = await createHospitalityAction(payload);
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
              placeholder="e.g. HOS-TV-001"
              value={itemCode}
              onChange={(e) => setItemCode(e.target.value)}
              disabled={loading}
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 font-mono text-[13px] tracking-wide"
            />
          </div>

          {/* Device Type */}
          <div className="space-y-1 col-span-2">
            <label htmlFor="deviceType" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Device Type *
            </label>
            <input
              id="deviceType"
              type="text"
              required
              placeholder="e.g. Smart TV Samsung 55'"
              value={deviceType}
              onChange={(e) => setDeviceType(e.target.value)}
              disabled={loading}
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Room Number */}
          <div className="space-y-1">
            <label htmlFor="roomNumber" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Room Number
            </label>
            <input
              id="roomNumber"
              type="text"
              placeholder="e.g. Room 101, Executive Suite"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              disabled={loading}
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
            />
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label htmlFor="status" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Status *
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as "ACTIVE" | "BROKEN" | "REPAIR")}
              disabled={loading}
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
            >
              <option value="ACTIVE">Active</option>
              <option value="BROKEN">Broken</option>
              <option value="REPAIR">Repair</option>
            </select>
          </div>
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
          {isEdit ? "Update Device" : "Register Device"}
        </Button>
      </div>
    </form>
  );
}
