import { Room } from "@/types/database.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/utils/date";

interface RoomsTableProps {
  items: Room[];
  onEdit: (item: Room) => void;
  onDelete: (id: string) => void;
}

export function RoomsTable({ items, onEdit, onDelete }: RoomsTableProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <div className="mx-auto max-w-md space-y-3">
          <h3 className="text-lg font-bold text-foreground">No rooms found</h3>
          <p className="text-sm text-muted-foreground">
            Get started by creating your first room.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border">
            <TableHead className="font-bold text-foreground">Room Number</TableHead>
            <TableHead className="font-bold text-foreground">Floor</TableHead>
            <TableHead className="font-bold text-foreground">Type</TableHead>
            <TableHead className="font-bold text-foreground">Capacity</TableHead>
            <TableHead className="font-bold text-foreground">Status</TableHead>
            <TableHead className="font-bold text-foreground">Created</TableHead>
            <TableHead className="w-[100px] font-bold text-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="border-border">
              <TableCell className="font-semibold text-foreground">
                {item.room_number}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {item.floor || "-"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {item.room_type || "-"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {item.capacity ? `${item.capacity} people` : "-"}
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                  item.status === "ACTIVE"
                    ? "bg-emerald-500/10 text-emerald-500"
                    : item.status === "MAINTENANCE"
                    ? "bg-amber-500/10 text-amber-500"
                    : "bg-slate-500/10 text-slate-500"
                }`}>
                  {item.status}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDate(item.created_at)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(item)}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(item.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
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