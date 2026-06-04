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
import { SecurityWithRelations } from "@/repositories/security.repository";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Shield, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface SecurityTableProps {
  items: SecurityWithRelations[];
  onEdit: (item: SecurityWithRelations) => void;
  onDelete: (id: string) => void;
}

export function SecurityTable({ items, onEdit, onDelete }: SecurityTableProps) {
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
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
    if (!sortColumn) return items;

    return [...items].sort((a, b) => {
      let aVal: any = "";
      let bVal: any = "";

      switch (sortColumn) {
        case "device_type":
          aVal = a.device_type || "";
          bVal = b.device_type || "";
          break;
        case "location":
          aVal = a.department?.name || a.location?.name || a.room?.room_number || "";
          bVal = b.department?.name || b.location?.name || b.room?.room_number || "";
          break;
        case "status":
          aVal = a.status || "";
          bVal = b.status || "";
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ONLINE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-[#2eb87a]/12 text-[#2eb87a] uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2eb87a]" />
            Online
          </span>
        );
      case "OFFLINE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-[#e05252]/12 text-[#e05252] uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-[#e05252]" />
            Offline
          </span>
        );
      case "MAINTENANCE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-[#f5853d]/12 text-[#f5853d] uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-[#f5853d]" />
            Maintenance
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-muted text-muted-foreground uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
            {status}
          </span>
        );
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border bg-card">
        <div className="p-4 rounded-full bg-muted text-muted-foreground mb-4">
          <Shield className="h-8 w-8 opacity-60" />
        </div>
        <h3 className="text-base font-bold text-foreground mb-1">No Security Devices Found</h3>
        <p className="text-sm text-muted-foreground font-medium max-w-sm leading-relaxed">
          There are no security devices registered in the inventory database matching your current query.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            {renderHeader("Device Type", "device_type", "pl-4")}
            {renderHeader("Location", "location")}
            {renderHeader("Status", "status")}
            {renderHeader("Vendor Partner", "vendor")}
            <TableHead className="font-bold text-right pr-4">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedItems.map((item) => (
            <TableRow key={item.id} className="group hover:bg-muted/40 transition-colors">
              {/* Device Type & Item Code */}
              <TableCell className="pl-4 py-3">
                <div className="flex flex-col leading-tight">
                  <span className="font-semibold text-foreground">{item.device_type}</span>
                  {item.item_code && (
                    <span className="font-mono text-[9.5px] text-[#c9a342] font-extrabold mt-0.5 tracking-wider uppercase">
                      {item.item_code}
                    </span>
                  )}
                </div>
              </TableCell>

              {/* Location */}
              <TableCell className="py-3 text-sm font-semibold text-muted-foreground">
                {item.department && (
                    <span>Dept: {item.department.name}<br /></span>
                  )}
                  {item.location && (
                    <span>Loc: {item.location.name} ({item.location.type})</span>
                  )}
                  {item.room && (
                    <span>Room {item.room.room_number}</span>
                  )}
                  {!item.department && !item.location && !item.room && "—"}
              </TableCell>

              {/* Status */}
              <TableCell className="py-3">
                {getStatusBadge(item.status)}
              </TableCell>

              {/* Vendor */}
              <TableCell className="py-3 text-sm font-semibold text-muted-foreground">
                {item.vendor?.name || "None"}
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
