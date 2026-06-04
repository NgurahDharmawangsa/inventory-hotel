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
import { HardwareWithRelations } from "@/repositories/hardware.repository";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Laptop, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface HardwareTableProps {
  items: HardwareWithRelations[];
  onEdit: (item: HardwareWithRelations) => void;
  onDelete: (id: string) => void;
}

export function HardwareTable({ items, onEdit, onDelete }: HardwareTableProps) {
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
        case "name":
          aVal = a.name || "";
          bVal = b.name || "";
          break;
        case "category":
          aVal = a.category || "";
          bVal = b.category || "";
          break;
        case "location":
          // Sort by department, location, or room
          aVal = a.department?.name || a.location?.name || a.room?.room_number || "";
          bVal = b.department?.name || b.location?.name || b.room?.room_number || "";
          break;
        case "status":
          aVal = a.status || "";
          bVal = b.status || "";
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-[#2eb87a]/12 text-[#2eb87a] uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2eb87a]" />
            Active
          </span>
        );
      case "BROKEN":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-[#e05252]/12 text-[#e05252] uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-[#e05252]" />
            Broken
          </span>
        );
      case "REPAIR":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-[#f5853d]/12 text-[#f5853d] uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-[#f5853d]" />
            Repair
          </span>
        );
      case "DISPOSED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-[#5a6480]/12 text-[#8a95b0] uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-[#8a95b0]" />
            Disposed
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
          <Laptop className="h-8 w-8 opacity-60" />
        </div>
        <h3 className="text-base font-bold text-foreground mb-1">No Hardware Assets Found</h3>
        <p className="text-sm text-muted-foreground font-medium max-w-sm leading-relaxed">
          There are no items registered in the inventory matching your active query or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            {renderHeader("Asset Name", "name", "pl-4")}
            {renderHeader("Category", "category")}
            {renderHeader("Location", "location")}
            {renderHeader("Status", "status")}
            {renderHeader("Assigned To", "staff")}
            {renderHeader("Vendor Partner", "vendor")}
            <TableHead className="font-bold text-right pr-4">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedItems.map((item) => (
            <TableRow key={item.id} className="group hover:bg-muted/40 transition-colors">
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
              <TableCell className="text-muted-foreground font-medium">{item.category}</TableCell>
              <TableCell className="text-muted-foreground font-medium">
                {item.department ? (
                  <div className="flex flex-col leading-none">
                    <span className="text-xs font-semibold text-foreground/70">Dept: {item.department.name}</span>
                  </div>
                ) : item.location ? (
                  <div className="flex flex-col leading-none">
                    <span className="text-xs font-semibold text-foreground/70">{item.location.name}</span>
                    <span className="text-[10px] text-muted-foreground">({item.location.type})</span>
                  </div>
                ) : item.room ? (
                  <div className="flex flex-col leading-none">
                    <span className="text-xs font-semibold text-foreground/70">Room {item.room.room_number}</span>
                    {item.room.floor && <span className="text-[10px] text-muted-foreground">{item.room.floor}</span>}
                  </div>
                ) : (
                  <span className="text-muted-foreground/30">—</span>
                )}
              </TableCell>
              <TableCell>{getStatusBadge(item.status)}</TableCell>
              <TableCell className="font-medium text-foreground/80">
                {item.staff ? (
                  <div className="flex flex-col leading-none">
                    <span className="text-sm font-semibold">{item.staff.full_name}</span>
                    <span className="text-[10px] text-muted-foreground">{item.staff.department?.name}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground/30 font-semibold">Unassigned</span>
                )}
              </TableCell>
              <TableCell className="font-semibold text-foreground/70">
                {item.vendor ? (
                  item.vendor.name
                ) : (
                  <span className="text-muted-foreground/30 font-semibold">—</span>
                )}
              </TableCell>
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
                    <span className="sr-only">Edit Asset</span>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(item.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/5 rounded-lg"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="sr-only">Delete Asset</span>
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
