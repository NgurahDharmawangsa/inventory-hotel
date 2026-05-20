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
import { Staff } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Users, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface StaffTableProps {
  items: Staff[];
  onEdit: (item: Staff) => void;
  onDelete: (id: string) => void;
  onRowClick?: (item: Staff) => void;
}

export function StaffTable({ items, onEdit, onDelete, onRowClick }: StaffTableProps) {
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
        case "employee_id":
          aVal = a.employee_id || "";
          bVal = b.employee_id || "";
          break;
        case "name":
          aVal = a.full_name || "";
          bVal = b.full_name || "";
          break;
        case "department":
          aVal = a.department || "";
          bVal = b.department || "";
          break;
        case "position":
          aVal = a.position || "";
          bVal = b.position || "";
          break;
        case "status":
          aVal = a.status || "";
          bVal = b.status || "";
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

  const getStatusBadge = (status: Staff["status"]) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 uppercase tracking-wider border border-emerald-500/20">
            <span className="h-1 w-1 rounded-full bg-emerald-500" />
            Active
          </span>
        );
      case "ON LEAVE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 uppercase tracking-wider border border-amber-500/20">
            <span className="h-1 w-1 rounded-full bg-amber-500" />
            On Leave
          </span>
        );
      case "RESIGNED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-500 uppercase tracking-wider border border-rose-500/20">
            <span className="h-1 w-1 rounded-full bg-rose-500" />
            Resigned
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground uppercase tracking-wider">
            {status}
          </span>
        );
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border bg-card">
        <div className="p-4 rounded-full bg-muted text-muted-foreground mb-4">
          <Users className="h-8 w-8 opacity-60" />
        </div>
        <h3 className="text-base font-bold text-foreground mb-1">No Employees Found</h3>
        <p className="text-sm text-muted-foreground font-medium max-w-sm leading-relaxed">
          Register new hotel staff members to start assigning IT assets and company email accounts.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            {renderHeader("Employee Details", "name", "pl-4")}
            {renderHeader("Department", "department")}
            {renderHeader("Position / Role", "position")}
            {renderHeader("Status", "status")}
            <TableHead className="font-bold text-right pr-4">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedItems.map((item) => (
            <TableRow key={item.id} onClick={() => onRowClick?.(item)} className="group hover:bg-muted/40 transition-colors cursor-pointer">
              {/* Employee ID & Name */}
              <TableCell className="pl-4 py-3">
                <div className="flex flex-col leading-tight">
                  <span className="font-semibold text-foreground">{item.full_name}</span>
                  <span className="font-mono text-[10px] text-[#c9a342] font-extrabold mt-1 tracking-wider uppercase">
                    {item.employee_id}
                  </span>
                </div>
              </TableCell>

              {/* Department */}
              <TableCell className="py-3 text-sm font-medium text-foreground">
                {item.department}
              </TableCell>

              {/* Position */}
              <TableCell className="py-3 text-sm font-medium text-muted-foreground">
                {item.position}
              </TableCell>

              {/* Status */}
              <TableCell className="py-3">
                {getStatusBadge(item.status)}
              </TableCell>

              {/* Actions */}
              <TableCell className="py-3 text-right pr-4">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(event) => {
                      event.stopPropagation();
                      onEdit(item);
                    }}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(event) => {
                      event.stopPropagation();
                      onDelete(item.id);
                    }}
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
