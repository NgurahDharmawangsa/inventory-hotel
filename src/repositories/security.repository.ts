import { supabase } from "@/lib/supabase";
import { Security } from "@/types/database.types";

export type SecurityWithRelations = Security & {
  vendor?: {
    id: string;
    name: string;
  } | null;
};

export class SecurityRepository {
  /**
   * Fetch all security items with optional filters and vendor relation joined.
   */
  static async findAll(filters?: { query?: string }): Promise<SecurityWithRelations[]> {
    let queryBuilder = supabase
      .from("security")
      .select(`
        *,
        vendor:vendor_id (id, name)
      `)
      .order("created_at", { ascending: false });

    if (filters?.query) {
      // Search in device_type, location, or item_code
      queryBuilder = queryBuilder.or(
        `device_type.ilike.%${filters.query}%,location.ilike.%${filters.query}%,item_code.ilike.%${filters.query}%`
      );
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error("Error in SecurityRepository.findAll:", error);
      throw new Error(`Failed to fetch security devices: ${error.message}`);
    }

    return (data || []) as SecurityWithRelations[];
  }

  /**
   * Find a single security item by ID with relations.
   */
  static async findById(id: string): Promise<SecurityWithRelations | null> {
    const { data, error } = await supabase
      .from("security")
      .select(`
        *,
        vendor:vendor_id (id, name)
      `)
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // Not found
      }
      console.error("Error in SecurityRepository.findById:", error);
      throw new Error(`Failed to fetch security device: ${error.message}`);
    }

    return data as SecurityWithRelations;
  }

  /**
   * Create a new security device.
   */
  static async create(data: Omit<Security, "id" | "created_at" | "updated_at">): Promise<Security> {
    const { data: newDevice, error } = await supabase
      .from("security")
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error("Error in SecurityRepository.create:", error);
      throw new Error(`Failed to create security device: ${error.message}`);
    }

    return newDevice as Security;
  }

  /**
   * Update an existing security device.
   */
  static async update(id: string, data: Partial<Omit<Security, "id" | "created_at" | "updated_at">>): Promise<Security> {
    const { data: updatedDevice, error } = await supabase
      .from("security")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error in SecurityRepository.update:", error);
      throw new Error(`Failed to update security device: ${error.message}`);
    }

    return updatedDevice as Security;
  }

  /**
   * Delete a security device.
   */
  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("security")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error in SecurityRepository.delete:", error);
      throw new Error(`Failed to delete security device: ${error.message}`);
    }
  }
}
