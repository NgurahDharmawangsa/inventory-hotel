"use client";

import { useState, useEffect } from "react";
import { createRoomAction, updateRoomAction } from "@/app/actions/rooms";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface RoomsFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function RoomsForm({ initialData, onSuccess, onCancel }: RoomsFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<{
    room_number: string;
    floor: string;
    room_type: string;
    status: string;
    capacity: string;
    description: string;
  }>({
    room_number: "",
    floor: "",
    room_type: "",
    status: "ACTIVE",
    capacity: "",
    description: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        room_number: initialData.room_number || "",
        floor: initialData.floor || "",
        room_type: initialData.room_type || "",
        status: initialData.status || "ACTIVE",
        capacity: initialData.capacity?.toString() || "",
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = initialData
        ? await updateRoomAction(initialData.id, formData)
        : await createRoomAction(formData);

      if (res.success) {
        onSuccess();
      } else {
        setError(res.error || "An error occurred.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-sm text-rose-500">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="room_number" className="text-sm font-semibold text-foreground">
            Room Number <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="room_number"
            value={formData.room_number}
            onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
            placeholder="e.g., 101, A-201"
            required
            disabled={loading}
            className="h-10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="floor" className="text-sm font-semibold text-foreground">
            Floor
          </Label>
          <Input
            id="floor"
            value={formData.floor}
            onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
            placeholder="e.g., 1st Floor, Ground"
            disabled={loading}
            className="h-10"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="room_type" className="text-sm font-semibold text-foreground">
            Room Type
          </Label>
          <Input
            id="room_type"
            value={formData.room_type}
            onChange={(e) => setFormData({ ...formData, room_type: e.target.value })}
            placeholder="e.g., Meeting Room, Office"
            disabled={loading}
            className="h-10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="capacity" className="text-sm font-semibold text-foreground">
            Capacity
          </Label>
          <Input
            id="capacity"
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            placeholder="Number of people"
            disabled={loading}
            className="h-10"
            min="1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status" className="text-sm font-semibold text-foreground">
          Status
        </Label>
        <Select
          value={formData.status}
          onValueChange={(value) => setFormData({ ...formData, status: value || "ACTIVE" })}
          disabled={loading}
        >
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-semibold text-foreground">
          Description
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of the room..."
          disabled={loading}
          rows={3}
          className="resize-none"
        />
      </div>

      <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="h-9 px-4 rounded-lg"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="h-9 px-4 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 flex items-center gap-2"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {initialData ? "Update" : "Create"} Room
        </Button>
      </div>
    </form>
  );
}