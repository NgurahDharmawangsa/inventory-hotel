"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createStaffAction, updateStaffAction } from "@/app/actions/staff";
import { Staff } from "@/types/database.types";
import { Loader2 } from "lucide-react";

interface StaffFormProps {
  initialData?: Staff | null;
  departments: Array<{ id: string; name: string }>;
  onSuccess: () => void;
  onCancel: () => void;
}

export function StaffForm({
  initialData,
  departments,
  onSuccess,
  onCancel
}: StaffFormProps) {
  const isEdit = !!initialData;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [employeeId, setEmployeeId] = useState<string>(initialData?.employee_id || "");
  const [fullName, setFullName] = useState<string>(initialData?.full_name || "");
  const [departmentId, setDepartmentId] = useState<string>(initialData?.department_id || "");
  const [position, setPosition] = useState<string>(initialData?.position || "");
  const [status, setStatus] = useState<Staff["status"]>(initialData?.status || "ACTIVE");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!employeeId.trim()) {
      setError("Employee ID is required.");
      setLoading(false);
      return;
    }

    if (!fullName.trim()) {
      setError("Full name is required.");
      setLoading(false);
      return;
    }

    if (!departmentId.trim()) {
      setError("Department selection is required.");
      setLoading(false);
      return;
    }

    if (!position.trim()) {
      setError("Position is required.");
      setLoading(false);
      return;
    }

    const payload = {
      employee_id: employeeId.trim().toUpperCase(),
      full_name: fullName.trim(),
      department_id: departmentId.trim(),
      position: position.trim(),
      status
    };

    try {
      let res;
      if (isEdit && initialData) {
        res = await updateStaffAction(initialData.id, payload);
      } else {
        res = await createStaffAction(payload);
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
        {/* Row 1: Symmetrical Grid (1/3 Employee ID, 2/3 Full Name) */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1 col-span-1">
            <label htmlFor="employeeId" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Employee ID *
            </label>
            <input
              id="employeeId"
              type="text"
              required
              disabled={loading || isEdit}
              placeholder="E.g. EMP-001"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-75 font-mono font-bold uppercase"
            />
          </div>

          <div className="space-y-1 col-span-2">
            <label htmlFor="fullName" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Full Name *
            </label>
            <input
              id="fullName"
              type="text"
              required
              placeholder="E.g. Rizky Pratama"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
            />
          </div>
        </div>

        {/* Row 2: Symmetrical Grid (1/2 Department, 1/2 Position) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="department" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Department *
            </label>
            <select
              id="department"
              required
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

          <div className="space-y-1">
            <label htmlFor="position" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Position / Role *
            </label>
            <input
              id="position"
              type="text"
              required
              placeholder="E.g. Supervisor, Manager"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              disabled={loading}
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
            />
          </div>
        </div>

        {/* Row 3: Status Selection */}
        <div className="space-y-1">
          <label htmlFor="status" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
            Employment Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as Staff["status"])}
            disabled={loading}
            className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 font-semibold"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="ON LEAVE">ON LEAVE</option>
            <option value="RESIGNED">RESIGNED</option>
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
          {isEdit ? "Update Staff" : "Add Staff"}
        </Button>
      </div>
    </form>
  );
}
