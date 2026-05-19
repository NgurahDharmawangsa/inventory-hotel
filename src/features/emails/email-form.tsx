"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createEmailAction, updateEmailAction } from "@/app/actions/emails";
import { getStaffAction } from "@/app/actions/staff";
import { Staff, EmailAccount } from "@/types/database.types";
import { Loader2 } from "lucide-react";

interface EmailFormProps {
  initialData?: any | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EmailForm({
  initialData,
  onSuccess,
  onCancel
}: EmailFormProps) {
  const isEdit = !!initialData;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dynamic relational states
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [staffLoading, setStaffLoading] = useState(false);

  // Form states
  const [emailAddress, setEmailAddress] = useState<string>(initialData?.email_address || "");
  const [platform, setPlatform] = useState<string>(initialData?.platform || "");
  const [staffId, setStaffId] = useState<string>(initialData?.staff_id || "");
  const [status, setStatus] = useState<EmailAccount["status"]>(initialData?.status || "ACTIVE");

  useEffect(() => {
    async function loadStaffOptions() {
      setStaffLoading(true);
      try {
        const res = await getStaffAction();
        if (res.success && res.data) {
          // Only show active staff members or currently assigned staff member
          setStaffList(res.data.filter((s: Staff) => s.status === "ACTIVE" || s.id === initialData?.staff_id));
        }
      } catch (err) {
        console.error("Failed to load staff select options:", err);
      } finally {
        setStaffLoading(false);
      }
    }
    loadStaffOptions();
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!emailAddress.trim()) {
      setError("Email address is required.");
      setLoading(false);
      return;
    }

    if (!platform.trim()) {
      setError("Platform provider is required.");
      setLoading(false);
      return;
    }

    const payload = {
      email_address: emailAddress.trim().toLowerCase(),
      platform: platform.trim(),
      staff_id: staffId || null,
      status
    };

    try {
      let res;
      if (isEdit && initialData) {
        res = await updateEmailAction(initialData.id, payload);
      } else {
        res = await createEmailAction(payload);
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
        {/* Row 1: Symmetrical Grid (2/3 Email, 1/3 Platform) */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1 col-span-2">
            <label htmlFor="emailAddress" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Email Address *
            </label>
            <input
              id="emailAddress"
              type="email"
              required
              disabled={loading || isEdit}
              placeholder="E.g. rizky@hotel.com"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-75"
            />
          </div>

          <div className="space-y-1 col-span-1">
            <label htmlFor="platform" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Platform *
            </label>
            <input
              id="platform"
              type="text"
              required
              placeholder="Google Workspace, O365"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              disabled={loading}
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
            />
          </div>
        </div>

        {/* Row 2: Assigned Staff Dropdown */}
        <div className="space-y-1">
          <label htmlFor="staffId" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
            Assigned Staff Member
          </label>
          <select
            id="staffId"
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            disabled={loading || staffLoading}
            className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 font-semibold"
          >
            <option value="">-- Unassigned / Idle Account --</option>
            {staffList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.full_name} ({s.employee_id} - {s.department})
              </option>
            ))}
          </select>
        </div>

        {/* Row 3: Status Dropdown */}
        <div className="space-y-1">
          <label htmlFor="status" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
            Email Login Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as EmailAccount["status"])}
            disabled={loading}
            className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 font-semibold"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="SUSPENDED">SUSPENDED</option>
            <option value="DELETED">DELETED</option>
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
          {isEdit ? "Update Account" : "Register Account"}
        </Button>
      </div>
    </form>
  );
}
