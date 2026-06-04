"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createSecurityAction, updateSecurityAction } from "@/app/actions/security";
import { SecurityWithRelations } from "@/repositories/security.repository";
import { Loader2 } from "lucide-react";

interface SecurityFormProps {
  initialData?: SecurityWithRelations | null;
  vendorList: Array<{ id: string; name: string }>;
  departments: Array<{ id: string; name: string }>;
  locations: Array<{ id: string; name: string; type: string }>;
  rooms: Array<{ id: string; room_number: string; floor?: string; room_type?: string }>;
  onSuccess: () => void;
  onCancel: () => void;
}

export function SecurityForm({
  initialData,
  vendorList,
  departments,
  locations,
  rooms,
  onSuccess,
  onCancel
}: SecurityFormProps) {
  const isEdit = !!initialData;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [itemCode, setItemCode] = useState(initialData?.item_code || "");
  const [deviceType, setDeviceType] = useState(initialData?.device_type || "CCTV");
  const [departmentId, setDepartmentId] = useState(initialData?.department_id || "");
  const [locationId, setLocationId] = useState(initialData?.location_id || "");
  const [roomId, setRoomId] = useState(initialData?.room_id || "");
  const [status, setStatus] = useState(initialData?.status || "ONLINE");
  const [vendorId, setVendorId] = useState(initialData?.vendor_id || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (deviceType.trim().length < 2) {
      setError("Device Type must be at least 2 characters long.");
      setLoading(false);
      return;
    }

    if (locationId && roomId) {
      setError("Please select either Location OR Room, not both.");
      setLoading(false);
      return;
    }

    const payload = {
      item_code: itemCode.trim() || undefined,
      device_type: deviceType.trim(),
      department_id: departmentId === "" ? null : departmentId,
      location_id: locationId === "" ? null : locationId,
      room_id: roomId === "" ? null : roomId,
      status,
      vendor_id: vendorId === "" ? null : vendorId
    };

    try {
      let res;
      if (isEdit && initialData) {
        res = await updateSecurityAction(initialData.id, payload);
      } else {
        res = await createSecurityAction(payload);
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
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="itemCode" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Item Code
            </label>
            <input
              id="itemCode"
              type="text"
              placeholder="e.g. SEC-CC-001"
              value={itemCode}
              onChange={(e) => setItemCode(e.target.value)}
              disabled={loading}
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 font-mono text-[13px] tracking-wide"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="deviceType" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Device Type *
            </label>
            <select
              id="deviceType"
              value={deviceType}
              onChange={(e) => setDeviceType(e.target.value)}
              disabled={loading}
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
            >
              <option value="CCTV">CCTV</option>
              <option value="Access Control">Access Control</option>
              <option value="Fire Alarm">Fire Alarm</option>
              <option value="Intrusion">Intrusion Detection</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="status" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
            Status *
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'ONLINE' | 'OFFLINE' | 'MAINTENANCE')}
            disabled={loading}
            className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
          >
            <option value="ONLINE">Online</option>
            <option value="OFFLINE">Offline</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="department" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
            Department
          </label>
          <select
            id="department"
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            disabled={loading}
            className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
          >
            <option value="">Select department...</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="location" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Location
            </label>
            <select
              id="location"
              value={locationId}
              onChange={(e) => {
                setLocationId(e.target.value);
                if (e.target.value) setRoomId("");
              }}
              disabled={loading || !!roomId}
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
            >
              <option value="">Select location...</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>{loc.name} ({loc.type})</option>
              ))}
            </select>
            {roomId && <p className="text-xs text-muted-foreground">Disabled (Room selected)</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="room" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Room
            </label>
            <select
              id="room"
              value={roomId}
              onChange={(e) => {
                setRoomId(e.target.value);
                if (e.target.value) setLocationId("");
              }}
              disabled={loading || !!locationId}
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
            >
              <option value="">Select room...</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.room_number}{room.floor ? ` (${room.floor})` : ''}
                </option>
              ))}
            </select>
            {locationId && <p className="text-xs text-muted-foreground">Disabled (Location selected)</p>}
          </div>
        </div>

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