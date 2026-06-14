"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SoftwareWithRelations } from "@/repositories/software.repository";
import { formatDate, getDaysRemaining } from "@/utils/date";
import { maskLicenseKey } from "@/utils/string";
import { Button } from "@/components/ui/button";
import { Copy, Check, Eye, EyeOff, Calendar, Building, User, Tag, Key, Hash, Edit2 } from "lucide-react";

interface SoftwareDetailModalProps {
  item: SoftwareWithRelations | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (item: SoftwareWithRelations) => void;
}

export function SoftwareDetailModal({
  item,
  open,
  onOpenChange,
  onEdit
}: SoftwareDetailModalProps) {
  const [keyVisible, setKeyVisible] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  if (!item) return null;

  const days = getDaysRemaining(item.expiration_date);

  const handleCopy = () => {
    if (!item.license_key) return;
    navigator.clipboard.writeText(item.license_key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = () => {
    if (!item.expiration_date) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[11px] font-bold bg-blue-500/12 text-blue-400 uppercase tracking-wider">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          Lifetime
        </span>
      );
    }
    if (days !== null && days < 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[11px] font-bold bg-[#e05252]/12 text-[#e05252] uppercase tracking-wider">
          <span className="h-1.5 w-1.5 rounded-full bg-[#e05252]" />
          Expired ({Math.abs(days)}d ago)
        </span>
      );
    }
    if (days !== null && days <= 30) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[11px] font-bold bg-[#f5853d]/12 text-[#f5853d] uppercase tracking-wider">
          <span className="h-1.5 w-1.5 rounded-full bg-[#f5853d]" />
          Expiring ({days}d left)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[11px] font-bold bg-[#2eb87a]/12 text-[#2eb87a] uppercase tracking-wider">
        <span className="h-1.5 w-1.5 rounded-full bg-[#2eb87a]" />
        Active ({days}d left)
      </span>
    );
  };

  const DetailRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => (
    <div className="flex items-start gap-3 py-2.5 border-b border-border/40 last:border-0">
      <div className="mt-0.5 text-muted-foreground shrink-0">{icon}</div>
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
        <div className="text-sm font-semibold text-foreground mt-0.5 break-words">{value}</div>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between pr-8">
            <DialogTitle className="text-lg font-bold text-foreground">
              {item.name}
            </DialogTitle>
            {getStatusBadge()}
          </div>
          {item.item_code && (
            <DialogDescription className="font-mono text-[11px] text-[#c9a342] font-extrabold tracking-wider uppercase mt-1">
              <Hash className="h-3 w-3 inline mr-1 -mt-0.5" />
              {item.item_code}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="py-2">
          {/* License Key */}
          <DetailRow
            icon={<Key className="h-4 w-4" />}
            label="License Key"
            value={
              item.license_key ? (
                <div className="flex items-center gap-2">
                  <code className="font-mono text-xs bg-secondary/40 px-2 py-0.5 rounded">
                    {keyVisible ? item.license_key : maskLicenseKey(item.license_key)}
                  </code>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setKeyVisible(!keyVisible)}
                      className="h-6 w-6 rounded flex items-center justify-center hover:bg-secondary text-muted-foreground hover:text-foreground"
                      title={keyVisible ? "Hide" : "Show"}
                    >
                      {keyVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="h-6 w-6 rounded flex items-center justify-center hover:bg-secondary text-muted-foreground hover:text-foreground"
                      title="Copy Key"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              ) : (
                <span className="text-muted-foreground/60 italic">No License Key</span>
              )
            }
          />

          {/* Expiration Date */}
          <DetailRow
            icon={<Calendar className="h-4 w-4" />}
            label="Expiration Date"
            value={
              item.expiration_date
                ? formatDate(item.expiration_date)
                : <span className="text-muted-foreground/60 italic">Lifetime / No Expiration</span>
            }
          />

          {/* Assigned To */}
          <DetailRow
            icon={<User className="h-4 w-4" />}
            label="Assigned To"
            value={
              item.staff ? (
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{item.staff.full_name}</span>
                  <span className="text-[10px] text-muted-foreground">{item.staff.department_id?.name}</span>
                </div>
              ) : (
                <span className="text-muted-foreground/60 italic">Unassigned</span>
              )
            }
          />

          {/* Vendor */}
          <DetailRow
            icon={<Building className="h-4 w-4" />}
            label="Vendor / Reseller"
            value={
              item.vendor ? (
                item.vendor.name
              ) : (
                <span className="text-muted-foreground/60 italic">—</span>
              )
            }
          />

          {/* Record Info */}
          <DetailRow
            icon={<Tag className="h-4 w-4" />}
            label="Record Information"
            value={
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground">
                  Created: {item.created_at ? formatDate(item.created_at) : "—"}
                </span>
                <span className="text-xs text-muted-foreground">
                  Updated: {item.updated_at ? formatDate(item.updated_at) : "—"}
                </span>
              </div>
            }
          />
        </div>

        {/* Edit Button */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-border mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-9 px-4 rounded-lg"
          >
            Close
          </Button>
          <Button
            type="button"
            onClick={() => {
              onOpenChange(false);
              onEdit(item);
            }}
            className="h-9 px-4 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center gap-1.5 shadow-sm hover:bg-primary/90"
          >
            <Edit2 className="h-4 w-4" />
            Edit License
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}