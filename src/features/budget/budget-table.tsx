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
import { Budget } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Wallet, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface BudgetTableProps {
  items: Budget[];
  onEdit: (item: Budget) => void;
  onDelete: (id: string) => void;
}

export function BudgetTable({ items, onEdit, onDelete }: BudgetTableProps) {
  const [sortColumn, setSortColumn] = React.useState<string>("year");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("desc");

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
        case "year":
          aVal = a.year;
          bVal = b.year;
          break;
        case "total_allocated":
          aVal = a.total_allocated;
          bVal = b.total_allocated;
          break;
        case "total_spent":
          aVal = a.total_spent;
          bVal = b.total_spent;
          break;
        case "utilization":
          const utilA = a.total_allocated > 0 ? (a.total_spent / a.total_allocated) : 0;
          const utilB = b.total_allocated > 0 ? (b.total_spent / b.total_allocated) : 0;
          aVal = utilA;
          bVal = utilB;
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getUtilizationData = (spent: number, allocated: number) => {
    if (allocated <= 0) return { percent: 0, colorClass: "bg-emerald-500", textClass: "text-emerald-500", label: "0% Spent" };
    
    const percent = Math.round((spent / allocated) * 100);
    if (percent < 75) {
      return { 
        percent, 
        colorClass: "bg-emerald-500", 
        textClass: "text-emerald-600 bg-emerald-500/10",
        label: `${percent}% Utilized` 
      };
    } else if (percent <= 90) {
      return { 
        percent, 
        colorClass: "bg-amber-500", 
        textClass: "text-amber-600 bg-amber-500/10",
        label: `${percent}% Warning` 
      };
    } else {
      return { 
        percent, 
        colorClass: "bg-rose-500", 
        textClass: "text-rose-600 bg-rose-500/10",
        label: `${percent}% Overdraft!` 
      };
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border bg-card">
        <div className="p-4 rounded-full bg-muted text-muted-foreground mb-4">
          <Wallet className="h-8 w-8 opacity-60" />
        </div>
        <h3 className="text-base font-bold text-foreground mb-1">No Budget Plans Found</h3>
        <p className="text-sm text-muted-foreground font-medium max-w-sm leading-relaxed">
          Register year-by-year allocations and spent records to visualize budget utilization metrics.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            {renderHeader("Budget Year", "year", "pl-4")}
            {renderHeader("Allocated Budget", "total_allocated")}
            {renderHeader("Spent Budget", "total_spent")}
            {renderHeader("Budget Utilization", "utilization")}
            <TableHead className="font-bold">Notes</TableHead>
            <TableHead className="font-bold text-right pr-4">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedItems.map((item) => {
            const util = getUtilizationData(item.total_spent, item.total_allocated);
            return (
              <TableRow key={item.id} className="group hover:bg-muted/40 transition-colors">
                {/* Year */}
                <TableCell className="pl-4 py-3 font-extrabold text-foreground font-mono text-base">
                  {item.year}
                </TableCell>

                {/* Allocated */}
                <TableCell className="py-3 font-semibold text-foreground font-mono text-sm">
                  {formatCurrency(item.total_allocated)}
                </TableCell>

                {/* Spent */}
                <TableCell className="py-3 font-semibold text-foreground font-mono text-sm">
                  {formatCurrency(item.total_spent)}
                </TableCell>

                {/* Budget Utilization Meter */}
                <TableCell className="py-3 max-w-[200px]">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider leading-none">
                      <span className={`px-2 py-0.5 rounded-md font-mono ${util.textClass}`}>
                        {util.label}
                      </span>
                    </div>
                    {/* Progress Bar Container */}
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${util.colorClass}`}
                        style={{ width: `${Math.min(util.percent, 100)}%` }}
                      />
                    </div>
                  </div>
                </TableCell>

                {/* Notes */}
                <TableCell className="py-3 text-sm font-medium text-muted-foreground max-w-xs truncate" title={item.notes || ""}>
                  {item.notes || "—"}
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
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
