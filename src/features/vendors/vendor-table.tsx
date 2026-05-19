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
import { Vendor } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Building2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface VendorTableProps {
  items: Vendor[];
  onEdit: (item: Vendor) => void;
  onDelete: (id: string) => void;
}

export function VendorTable({ items, onEdit, onDelete }: VendorTableProps) {
  const [sortColumn, setSortColumn] = React.useState<string>("name");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      let aVal: any = "";
      let bVal: any = "";

      switch (sortColumn) {
        case "name":
          aVal = a.name || "";
          bVal = b.name || "";
          break;
        case "contact_person":
          aVal = a.contact_person || "";
          bVal = b.contact_person || "";
          break;
        case "phone":
          aVal = a.phone || "";
          bVal = b.phone || "";
          break;
        case "email":
          aVal = a.email || "";
          bVal = b.email || "";
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

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border bg-card">
        <div className="p-4 rounded-full bg-muted text-muted-foreground mb-4">
          <Building2 className="h-8 w-8 opacity-60" />
        </div>
        <h3 className="text-base font-bold text-foreground mb-1">No Vendors Registered</h3>
        <p className="text-sm text-muted-foreground font-medium max-w-sm leading-relaxed">
          Record vendor contact details and hardware warranty providers to coordinate supplies.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            {renderHeader("Vendor Name", "name", "pl-4")}
            {renderHeader("Contact Person", "contact_person")}
            {renderHeader("Phone", "phone")}
            {renderHeader("Email", "email")}
            <TableHead className="font-bold">Address</TableHead>
            <TableHead className="font-bold text-right pr-4">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedItems.map((item) => (
            <TableRow key={item.id} className="group hover:bg-muted/40 transition-colors">
              {/* Vendor Name */}
              <TableCell className="pl-4 py-3 font-semibold text-foreground">
                {item.name}
              </TableCell>

              {/* Contact Person */}
              <TableCell className="py-3 text-sm font-medium text-foreground">
                {item.contact_person || "—"}
              </TableCell>

              {/* Phone */}
              <TableCell className="py-3 text-sm font-medium text-muted-foreground font-mono">
                {item.phone || "—"}
              </TableCell>

              {/* Email */}
              <TableCell className="py-3 text-sm font-medium text-muted-foreground">
                {item.email || "—"}
              </TableCell>

              {/* Address */}
              <TableCell className="py-3 text-sm font-medium text-muted-foreground max-w-xs truncate" title={item.address || ""}>
                {item.address || "—"}
              </TableCell>

              {/* Actions */}
              <TableCell className="py-3 text-right pr-4">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(item)}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(item.id)}
                    className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-md"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
