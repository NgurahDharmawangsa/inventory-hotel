import { supabase } from "@/lib/supabase";
import { Maintenance } from "@/types/database.types";

export class MaintenanceRepository {
  /**
   * Fetch all maintenance items.
   */
  static async findAll(): Promise<Maintenance[]> {
    const { data, error } = await supabase
      .from("maintenance")
      .select("*")
      .order("date_reported", { ascending: false });

    if (error) {
      console.error("Error in MaintenanceRepository.findAll:", error);
      throw new Error(`Failed to fetch maintenance logs: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Find a single maintenance item by ID.
   */
  static async findById(id: string): Promise<Maintenance | null> {
    const { data, error } = await supabase
      .from("maintenance")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // Not found
      }
      console.error("Error in MaintenanceRepository.findById:", error);
      throw new Error(`Failed to fetch maintenance log: ${error.message}`);
    }

    return data as Maintenance;
  }

  /**
   * Create a new maintenance log.
   */
  static async create(data: Omit<Maintenance, "id" | "created_at" | "updated_at">): Promise<Maintenance> {
    const { data: newLog, error } = await supabase
      .from("maintenance")
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error("Error in MaintenanceRepository.create:", error);
      throw new Error(`Failed to create maintenance log: ${error.message}`);
    }

    return newLog as Maintenance;
  }

  /**
   * Update an existing maintenance log.
   */
  static async update(id: string, data: Partial<Omit<Maintenance, "id" | "created_at" | "updated_at">>): Promise<Maintenance> {
    const { data: updatedLog, error } = await supabase
      .from("maintenance")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error in MaintenanceRepository.update:", error);
      throw new Error(`Failed to update maintenance log: ${error.message}`);
    }

    return updatedLog as Maintenance;
  }

  /**
   * Delete a maintenance log.
   */
  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("maintenance")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error in MaintenanceRepository.delete:", error);
      throw new Error(`Failed to delete maintenance log: ${error.message}`);
    }
  }
}
