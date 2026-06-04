"use client";

import { useState, useEffect } from "react";
import { createDepartmentAction, updateDepartmentAction } from "@/app/actions/departments";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface DepartmentsFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function DepartmentsForm({ initialData, onSuccess, onCancel }: DepartmentsFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
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
        ? await updateDepartmentAction(initialData.id, formData)
        : await createDepartmentAction(formData);

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

      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-semibold text-foreground">
          Department Name <span className="text-rose-500">*</span>
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Front Office, Housekeeping"
          required
          disabled={loading}
          className="h-10"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-semibold text-foreground">
          Description
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of the department..."
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
          {initialData ? "Update" : "Create"} Department
        </Button>
      </div>
    </form>
  );
}