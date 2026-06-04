import { supabase } from "@/lib/supabase";
import { Software } from "@/types/database.types";

export type SoftwareWithRelations = Software & {
  staff?: {
    id: string;
    full_name: string;
    department_id: {
      id: string;
      name: string;
    } | null;
  } | null;
  vendor?: {
    id: string;
    name: string;
  } | null;
};

export class SoftwareRepository {
  /**
   * Fetch all software items with optional filters and staff/vendor relations joined.
   */
  static async findAll(filters?: { query?: string }): Promise<SoftwareWithRelations[]> {
    let queryBuilder = supabase
      .from("software")
      .select(`
        *,
        staff:staff_id (id, full_name, department_id (id, name)),
        vendor:vendor_id (id, name)
      `)
      .order("created_at", { ascending: false });

    if (filters?.query) {
      // Search in name, license_key, or item_code
      queryBuilder = queryBuilder.or(`name.ilike.%${filters.query}%,license_key.ilike.%${filters.query}%,item_code.ilike.%${filters.query}%`);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error("Error in SoftwareRepository.findAll:", error);
      throw new Error(`Failed to fetch software licenses: ${error.message}`);
    }

    return (data || []) as SoftwareWithRelations[];
  }

  /**
   * Find a single software item by ID.
   */
  static async findById(id: string): Promise<SoftwareWithRelations | null> {
    const { data, error } = await supabase
      .from("software")
      .select(`
        *,
        staff:staff_id (id, full_name, department_id (id, name)),
        vendor:vendor_id (id, name)
      `)
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // Not found
      }
      console.error("Error in SoftwareRepository.findById:", error);
      throw new Error(`Failed to fetch software license: ${error.message}`);
    }

    return data as SoftwareWithRelations;
  }

  /**
   * Create a new software asset.
   */
  static async create(data: Omit<Software, "id" | "created_at" | "updated_at">): Promise<Software> {
    const { data: newAsset, error } = await supabase
      .from("software")
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error("Error in SoftwareRepository.create:", error);
      throw new Error(`Failed to create software license: ${error.message}`);
    }

    return newAsset as Software;
  }

  /**
   * Update an existing software asset.
   */
  static async update(id: string, data: Partial<Omit<Software, "id" | "created_at" | "updated_at">>): Promise<Software> {
    const { data: updatedAsset, error } = await supabase
      .from("software")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error in SoftwareRepository.update:", error);
      throw new Error(`Failed to update software license: ${error.message}`);
    }

    return updatedAsset as Software;
  }

  /**
   * Delete a software asset.
   */
  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("software")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error in SoftwareRepository.delete:", error);
      throw new Error(`Failed to delete software license: ${error.message}`);
    }
  }
}
