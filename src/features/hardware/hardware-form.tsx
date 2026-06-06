"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createHardwareAction, updateHardwareAction } from "@/app/actions/hardware";
import { HardwareWithRelations } from "@/repositories/hardware.repository";
import { Loader2 } from "lucide-react";

interface HardwareFormProps {
  initialData?: HardwareWithRelations | null;
  staffList: Array<{ id: string; full_name: string; department_id?: string; department?: { id: string; name: string } }>;
  vendorList: Array<{ id: string; name: string }>;
  departmentOptions: string[];
  departments: Array<{ id: string; name: string }>;
  locations: Array<{ id: string; name: string; type: string }>;
  rooms: Array<{ id: string; room_number: string; floor?: string; room_type?: string }>;
  onSuccess: () => void;
  onCancel: () => void;
}

export function HardwareForm({
  initialData,
  staffList,
  vendorList,
  departmentOptions,
  departments,
  locations,
  rooms,
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
  const [departmentId, setDepartmentId] = useState(initialData?.department_id || "");
  const [locationId, setLocationId] = useState(initialData?.location_id || "");
  const [roomId, setRoomId] = useState(initialData?.room_id || "");
  const [status, setStatus] = useState(initialData?.status || "ACTIVE");
  const [staffId, setStaffId] = useState(initialData?.staff_id || "");
  const [vendorId, setVendorId] = useState(initialData?.vendor_id || "");
  const [description, setDescription] = useState(initialData?.description || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (name.trim().length < 3) {
      setError("Asset Name must be at least 3 characters long.");
      setLoading(false);
      return;
    }

    // Validate: cannot have both location_id and room_id
    if (locationId && roomId) {
      setError("Please select either Location OR Room, not both.");
      setLoading(false);
      return;
    }

    const payload = {
      item_code: itemCode.trim() || undefined,
      name: name.trim(),
      category,
      department_id: departmentId === "" ? null : departmentId,
      location_id: locationId === "" ? null : locationId,
      room_id: roomId === "" ? null : roomId,
      status,
      staff_id: staffId === "" ? null : staffId,
      vendor_id: vendorId === "" ? null : vendorId,
      description: description.trim() || null
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

        {/* Department */}
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
          {/* Location */}
          <div className="space-y-1">
            <label htmlFor="location" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Location
            </label>
            <select
              id="location"
              value={locationId}
              onChange={(e) => {
                setLocationId(e.target.value);
                if (e.target.value) setRoomId(""); // Clear room if location selected
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

          {/* Room */}
          <div className="space-y-1">
            <label htmlFor="room" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Room
            </label>
            <select
              id="room"
              value={roomId}
              onChange={(e) => {
                setRoomId(e.target.value);
                if (e.target.value) setLocationId(""); // Clear location if room selected
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

        {/* Description */}
        <div className="space-y-1">
          <label htmlFor="description" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
            Description
          </label>
          <textarea
            id="description"
            placeholder="Optional notes, specifications, or remarks about this asset..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            rows={3}
            className="flex w-full rounded-lg border border-input bg-card px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 resize-none"
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
                  {staff.full_name}{staff.department ? ` (${staff.department.name})` : ''}
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
