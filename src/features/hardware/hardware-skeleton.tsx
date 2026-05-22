"use client";

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function HardwareTableSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/30 border-b border-border">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-24 px-4 py-3">Asset Name</TableHead>
            <TableHead className="px-4 py-3">Category</TableHead>
            <TableHead className="px-4 py-3">Location</TableHead>
            <TableHead className="px-4 py-3">Status</TableHead>
            <TableHead className="px-4 py-3">Assigned To</TableHead>
            <TableHead className="px-4 py-3">Vendor Partner</TableHead>
            <TableHead className="px-4 py-3 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 8 }).map((_, i) => (
            <TableRow key={i} className="hover:bg-transparent border-b border-border/50">
              <TableCell className="px-4 py-3">
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell className="px-4 py-3">
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell className="px-4 py-3">
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell className="px-4 py-3">
                <Skeleton className="h-5 w-16 rounded-full" />
              </TableCell>
              <TableCell className="px-4 py-3">
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell className="px-4 py-3">
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell className="px-4 py-3 text-right">
                <div className="flex items-center gap-2 justify-end">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
