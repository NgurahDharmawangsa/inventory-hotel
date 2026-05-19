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
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Mail, ArrowUpDown, ArrowUp, ArrowDown, UserMinus, UserCheck } from "lucide-react";

interface EmailTableProps {
  items: any[];
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
}

export function EmailTable({ items, onEdit, onDelete }: EmailTableProps) {
  const [sortColumn, setSortColumn] = React.useState<string>("email_address");
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
        case "email_address":
          aVal = a.email_address || "";
          bVal = b.email_address || "";
          break;
        case "platform":
          aVal = a.platform || "";
          bVal = b.platform || "";
          break;
        case "status":
          aVal = a.status || "";
          bVal = b.status || "";
          break;
        case "staff":
          aVal = a.staff?.full_name || "";
          bVal = b.staff?.full_name || "";
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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 uppercase tracking-wider border border-emerald-500/20">
            <span className="h-1 w-1 rounded-full bg-emerald-500" />
            Active
          </span>
        );
      case "SUSPENDED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 uppercase tracking-wider border border-amber-500/20">
            <span className="h-1 w-1 rounded-full bg-amber-500" />
            Suspended
          </span>
        );
      case "DELETED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-500 uppercase tracking-wider border border-rose-500/20">
            <span className="h-1 w-1 rounded-full bg-rose-500" />
            Deleted
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
          <Mail className="h-8 w-8 opacity-60" />
        </div>
        <h3 className="text-base font-bold text-foreground mb-1">No Email Accounts</h3>
        <p className="text-sm text-muted-foreground font-medium max-w-sm leading-relaxed">
          Create corporate email logins (GWS, Microsoft 365) and assign them directly to staff directory lines.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            {renderHeader("Email Address", "email_address", "pl-4")}
            {renderHeader("Platform Provider", "platform")}
            {renderHeader("Assigned Owner", "staff")}
            {renderHeader("Status", "status")}
            <TableHead className="font-bold text-right pr-4">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedItems.map((item) => (
            <TableRow key={item.id} className="group hover:bg-muted/40 transition-colors">
              {/* Email Address */}
              <TableCell className="pl-4 py-3 font-semibold text-foreground">
                {item.email_address}
              </TableCell>

              {/* Platform */}
              <TableCell className="py-3 text-sm font-medium text-foreground">
                {item.platform}
              </TableCell>

              {/* Assigned Staff */}
              <TableCell className="py-3 text-sm font-medium">
                {item.staff ? (
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <div className="flex flex-col leading-tight">
                      <span className="font-semibold text-foreground">{item.staff.full_name}</span>
                      <span className="font-mono text-[9px] text-[#c9a342] font-extrabold mt-0.5 tracking-wider uppercase">
                        {item.staff.employee_id}
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground/60 italic font-medium text-xs">
                    <UserMinus className="h-3.5 w-3.5 opacity-60" />
                    Unassigned / Idle Account
                  </span>
                )}
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
