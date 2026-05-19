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
import { MaintenanceWithItemDetails } from "@/app/actions/maintenance";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Wrench, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface MaintenanceTableProps {
  items: MaintenanceWithItemDetails[];
  onEdit: (item: MaintenanceWithItemDetails) => void;
  onDelete: (id: string) => void;
}

export function MaintenanceTable({ items, onEdit, onDelete }: MaintenanceTableProps) {
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
        case "item_name":
          aVal = a.itemName || "";
          bVal = b.itemName || "";
          break;
        case "item_type":
          aVal = a.item_type || "";
          bVal = b.item_type || "";
          break;
        case "repair_cost":
          aVal = a.repair_cost || 0;
          bVal = b.repair_cost || 0;
          break;
        case "date_reported":
          aVal = a.date_reported || "";
          bVal = b.date_reported || "";
          break;
        case "status":
          aVal = a.date_resolved ? "COMPLETED" : "IN_PROGRESS";
          bVal = b.date_resolved ? "COMPLETED" : "IN_PROGRESS";
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

  const getCategoryBadge = (type: string) => {
    switch (type.toUpperCase()) {
      case "HARDWARE":
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#3b82f6]/10 text-[#3b82f6] uppercase tracking-wider">Hardware</span>;
      case "SOFTWARE":
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#8b5cf6]/10 text-[#8b5cf6] uppercase tracking-wider">Software</span>;
      case "NETWORKING":
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#10b981]/10 text-[#10b981] uppercase tracking-wider">Networking</span>;
      case "SECURITY":
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#f59e0b]/10 text-[#f59e0b] uppercase tracking-wider">Security</span>;
      case "HOSPITALITY":
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#ec4899]/10 text-[#ec4899] uppercase tracking-wider">Hospitality</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-muted text-muted-foreground uppercase tracking-wider">{type}</span>;
    }
  };

  const getStatusBadge = (resolvedDate: string | null | undefined) => {
    if (resolvedDate) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-[#2eb87a]/12 text-[#2eb87a] uppercase tracking-wider">
          <span className="h-1.5 w-1.5 rounded-full bg-[#2eb87a]" />
          Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-[#f5853d]/12 text-[#f5853d] uppercase tracking-wider">
        <span className="h-1.5 w-1.5 rounded-full bg-[#f5853d]" />
        In Progress
      </span>
    );
  };

  const formatCost = (cost: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(cost);
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border bg-card">
        <div className="p-4 rounded-full bg-muted text-muted-foreground mb-4">
          <Wrench className="h-8 w-8 opacity-60" />
        </div>
        <h3 className="text-base font-bold text-foreground mb-1">No Maintenance Records Found</h3>
        <p className="text-sm text-muted-foreground font-medium max-w-sm leading-relaxed">
          There are no maintenance or repair issues registered in the database matching your current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            {renderHeader("Asset / Item Details", "item_name", "pl-4")}
            {renderHeader("Reported Issue", "issue")}
            {renderHeader("Repair Cost", "repair_cost")}
            {renderHeader("Date Reported", "date_reported")}
            {renderHeader("Date Resolved", "date_resolved")}
            {renderHeader("Status", "status")}
            <TableHead className="font-bold text-right pr-4">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedItems.map((item) => (
            <TableRow key={item.id} className="group hover:bg-muted/40 transition-colors">
              {/* Asset Name & Category */}
              <TableCell className="pl-4 py-3">
                <div className="flex flex-col leading-tight">
                  <span className="font-semibold text-foreground">{item.itemName}</span>
                  <div className="flex items-center gap-2 mt-1">
                    {getCategoryBadge(item.item_type)}
                    {item.itemCode && (
                      <span className="font-mono text-[9px] text-[#c9a342] font-extrabold tracking-wider uppercase">
                        {item.itemCode}
                      </span>
                    )}
                  </div>
                </div>
              </TableCell>

              {/* Reported Issue */}
              <TableCell className="py-3 text-sm font-medium text-foreground max-w-xs truncate" title={item.issue}>
                {item.issue}
              </TableCell>

              {/* Repair Cost */}
              <TableCell className="py-3 text-sm font-semibold text-foreground font-mono">
                {formatCost(item.repair_cost || 0)}
              </TableCell>

              {/* Date Reported */}
              <TableCell className="py-3 text-sm font-medium text-muted-foreground font-mono">
                {formatDate(item.date_reported)}
              </TableCell>

              {/* Date Resolved */}
              <TableCell className="py-3 text-sm font-medium text-muted-foreground font-mono">
                {formatDate(item.date_resolved)}
              </TableCell>

              {/* Status */}
              <TableCell className="py-3">
                {getStatusBadge(item.date_resolved)}
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
