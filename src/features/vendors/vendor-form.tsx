"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createVendorAction, updateVendorAction } from "@/app/actions/vendors";
import { Vendor } from "@/types/database.types";
import { Loader2 } from "lucide-react";

interface VendorFormProps {
  initialData?: Vendor | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function VendorForm({
  initialData,
  onSuccess,
  onCancel
}: VendorFormProps) {
  const isEdit = !!initialData;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState<string>(initialData?.name || "");
  const [contactPerson, setContactPerson] = useState<string>(initialData?.contact_person || "");
  const [phone, setPhone] = useState<string>(initialData?.phone || "");
  const [email, setEmail] = useState<string>(initialData?.email || "");
  const [address, setAddress] = useState<string>(initialData?.address || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!name.trim()) {
      setError("Vendor name is required.");
      setLoading(false);
      return;
    }

    const payload = {
      name: name.trim(),
      contact_person: contactPerson.trim() || null,
      phone: phone.trim() || null,
      email: email.trim() || null,
      address: address.trim() || null
    };

    try {
      let res;
      if (isEdit && initialData) {
        res = await updateVendorAction(initialData.id, payload);
      } else {
        res = await createVendorAction(payload);
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
        {/* Row 1: Vendor Name (Full) */}
        <div className="space-y-1">
          <label htmlFor="name" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
            Vendor Name *
          </label>
          <input
            id="name"
            type="text"
            required
            disabled={loading}
            placeholder="E.g. PT. Prima Solusi IT"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
          />
        </div>

        {/* Row 2: Contact Person (Full) */}
        <div className="space-y-1">
          <label htmlFor="contactPerson" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
            Contact Person
          </label>
          <input
            id="contactPerson"
            type="text"
            disabled={loading}
            placeholder="E.g. Budi Santoso"
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
            className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
          />
        </div>

        {/* Row 3: Symmetrical Grid (1/2 Phone, 1/2 Email) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="phone" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Phone Number
            </label>
            <input
              id="phone"
              type="text"
              placeholder="E.g. 0812-3456-7890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="E.g. sales@vendor.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
            />
          </div>
        </div>

        {/* Row 4: Address */}
        <div className="space-y-1">
          <label htmlFor="address" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
            Office Address
          </label>
          <textarea
            id="address"
            rows={3}
            placeholder="E.g. Jl. Jenderal Sudirman No. 45, Jakarta Selatan"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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
          {isEdit ? "Update Vendor" : "Add Vendor"}
        </Button>
      </div>
    </form>
  );
}
