"use client";

import * as React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { SoftwareWithRelations } from "@/repositories/software.repository";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Key, Eye, EyeOff, Copy, Check, Calendar, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { formatDate, getDaysRemaining } from "@/utils/date";
import { maskLicenseKey } from "@/utils/string";

interface SoftwareTableProps {
  items: SoftwareWithRelations[];
  onEdit: (item: SoftwareWithRelations) => void;
  onDelete: (id: string) => void;
}

export function SoftwareTable({ items, onEdit, onDelete }: SoftwareTableProps) {
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");
  const [visibleKeys, setVisibleKeys] = React.useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedItems = React.useMemo(() => {
    if (!sortColumn) return items;

    return [...items].sort((a, b) => {
      let aVal: any = "";
      let bVal: any = "";

      switch (sortColumn) {
        case "name":
          aVal = a.name || "";
          bVal = b.name || "";
          break;
        case "license_key":
          aVal = a.license_key || "";
          bVal = b.license_key || "";
          break;
        case "expiration_date":
          aVal = a.expiration_date || "";
          bVal = b.expiration_date || "";
          break;
        case "staff":
          aVal = a.staff?.full_name || "";
          bVal = b.staff?.full_name || "";
          break;
        case "vendor":
          aVal = a.vendor?.name || "";
          bVal = b.vendor?.name || "";
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [items, sortColumn, sortDirection]);

  const renderHeader = (label: string, columnKey: string, alignmentClass: string = "") => {
    const isSorted = sortColumn === columnKey;
    return (
      <TableHead 
        onClick={() => handleSort(columnKey)}
        className={`font-bold cursor-pointer hover:bg-muted/50 select-none group/header transition-colors ${alignmentClass}`}
      >
        <div className="flex items-center gap-1.5 py-2">
          <span>{label}</span>
          {isSorted ? (
            sortDirection === "asc" ? (
              <ArrowUp className="h-3.5 w-3.5 text-[#c9a342] shrink-0 animate-in fade-in zoom-in-75 duration-200" />
            ) : (
              <ArrowDown className="h-3.5 w-3.5 text-[#c9a342] shrink-0 animate-in fade-in zoom-in-75 duration-200" />
            )
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5 opacity-0 group-hover/header:opacity-40 transition-opacity shrink-0" />
          )}
        </div>
      </TableHead>
    );
  };

  const getExpirationBadge = (dateString: string | null | undefined) => {
    if (!dateString) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-blue-500/12 text-blue-400 uppercase tracking-wider">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          Lifetime
        </span>
      );
    }

    const days = getDaysRemaining(dateString);
    if (days !== null && days < 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-[#e05252]/12 text-[#e05252] uppercase tracking-wider">
          <span className="h-1.5 w-1.5 rounded-full bg-[#e05252]" />
          Expired ({Math.abs(days)}d ago)
        </span>
      );
    }

    if (days !== null && days <= 30) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-[#f5853d]/12 text-[#f5853d] uppercase tracking-wider">
          <span className="h-1.5 w-1.5 rounded-full bg-[#f5853d]" />
          Expiring ({days}d left)
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-[#2eb87a]/12 text-[#2eb87a] uppercase tracking-wider">
        <span className="h-1.5 w-1.5 rounded-full bg-[#2eb87a]" />
        Active ({days}d left)
      </span>
    );
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border bg-card">
        <div className="p-4 rounded-full bg-muted text-muted-foreground mb-4">
          <Key className="h-8 w-8 opacity-60" />
        </div>
        <h3 className="text-base font-bold text-foreground mb-1">No Software Licenses Found</h3>
        <p className="text-sm text-muted-foreground font-medium max-w-sm leading-relaxed">
          There are no licenses registered in the database matching your active query or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            {renderHeader("Software Name", "name", "pl-4")}
            {renderHeader("License Key", "license_key")}
            {renderHeader("Expiration Date", "expiration_date")}
            {renderHeader("Assigned To", "staff")}
            {renderHeader("Vendor/Reseller", "vendor")}
            <TableHead className="font-bold text-right pr-4">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedItems.map((item) => {
            const isKeyVisible = !!visibleKeys[item.id];
            const isCopied = copiedId === item.id;
            
            return (
              <TableRow key={item.id} className="group hover:bg-muted/40 transition-colors">
                {/* Software Name */}
                <TableCell className="pl-4 py-3">
                  <div className="flex flex-col leading-tight">
                    <span className="font-semibold text-foreground">{item.name}</span>
                    {item.item_code && (
                      <span className="font-mono text-[9.5px] text-[#c9a342] font-extrabold mt-0.5 tracking-wider uppercase">
                        {item.item_code}
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* License Key */}
                <TableCell className="py-3">
                  {item.license_key ? (
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-xs bg-secondary/40 px-2 py-0.5 rounded text-foreground font-medium max-w-[200px] truncate block">
                        {isKeyVisible ? item.license_key : maskLicenseKey(item.license_key)}
                      </code>
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleKeyVisibility(item.id)}
                          className="h-7 w-7 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground shrink-0"
                          title={isKeyVisible ? "Hide Key" : "Show Key"}
                        >
                          {isKeyVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopy(item.id, item.license_key || "")}
                          className="h-7 w-7 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground shrink-0"
                          title="Copy Key"
                        >
                          {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground/30 font-semibold italic">No License Key</span>
                  )}
                </TableCell>

                {/* Expiration Date */}
                <TableCell className="py-3">
                  <div className="flex flex-col leading-tight gap-1">
                    <span className="font-medium text-foreground/80 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground/60 animate-none" />
                      {formatDate(item.expiration_date)}
                    </span>
                    {getExpirationBadge(item.expiration_date)}
                  </div>
                </TableCell>

                {/* Assigned To */}
                <TableCell className="font-medium text-foreground/80 py-3">
                  {item.staff ? (
                    <div className="flex flex-col leading-none">
                      <span className="text-sm font-semibold">{item.staff.full_name}</span>
                      <span className="text-[10px] text-muted-foreground">{item.staff.department_id?.name}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground/30 font-semibold">Unassigned</span>
                  )}
                </TableCell>

                {/* Vendor Partner */}
                <TableCell className="font-semibold text-foreground/70 py-3">
                  {item.vendor ? (
                    item.vendor.name
                  ) : (
                    <span className="text-muted-foreground/30 font-semibold">—</span>
                  )}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right pr-4 py-3">
                  <div className="flex items-center justify-end gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(item)}
                      className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span className="sr-only">Edit License</span>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(item.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/5 rounded-lg"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="sr-only">Delete License</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
