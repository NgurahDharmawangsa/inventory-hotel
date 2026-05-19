import { supabase } from "@/lib/supabase";
import { Hardware } from "@/types/database.types";

export type HardwareWithRelations = Hardware & {
  staff?: {
    id: string;
    full_name: string;
    department: string;
  } | null;
  vendor?: {
    id: string;
    name: string;
  } | null;
};

export class HardwareRepository {
  /**
   * Fetch all hardware items with optional filters and staff/vendor relations joined.
   */
  static async findAll(filters?: { query?: string; status?: string }): Promise<HardwareWithRelations[]> {
    let queryBuilder = supabase
      .from("hardware")
      .select(`
        *,
        staff:staff_id (id, full_name, department),
        vendor:vendor_id (id, name)
      `)
      .order("created_at", { ascending: false });

    if (filters?.status) {
      queryBuilder = queryBuilder.eq("status", filters.status);
    }

    if (filters?.query) {
      // Search in name, location, or item_code
      queryBuilder = queryBuilder.or(`name.ilike.%${filters.query}%,location.ilike.%${filters.query}%,item_code.ilike.%${filters.query}%`);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error("Error in HardwareRepository.findAll:", error);
      throw new Error(`Failed to fetch hardware assets: ${error.message}`);
    }

    return (data || []) as HardwareWithRelations[];
  }

  /**
   * Find a single hardware item by ID.
   */
  static async findById(id: string): Promise<HardwareWithRelations | null> {
    const { data, error } = await supabase
      .from("hardware")
      .select(`
        *,
        staff:staff_id (id, full_name, department),
        vendor:vendor_id (id, name)
      `)
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // Not found
      }
      console.error("Error in HardwareRepository.findById:", error);
      throw new Error(`Failed to fetch hardware asset: ${error.message}`);
    }

    return data as HardwareWithRelations;
  }

  /**
   * Create a new hardware asset.
   */
  static async create(data: Omit<Hardware, "id" | "created_at" | "updated_at">): Promise<Hardware> {
    const { data: newAsset, error } = await supabase
      .from("hardware")
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error("Error in HardwareRepository.create:", error);
      throw new Error(`Failed to create hardware asset: ${error.message}`);
    }

    return newAsset as Hardware;
  }

  /**
   * Update an existing hardware asset.
   */
  static async update(id: string, data: Partial<Omit<Hardware, "id" | "created_at" | "updated_at">>): Promise<Hardware> {
    const { data: updatedAsset, error } = await supabase
      .from("hardware")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error in HardwareRepository.update:", error);
      throw new Error(`Failed to update hardware asset: ${error.message}`);
    }

    return updatedAsset as Hardware;
  }

  /**
   * Delete a hardware asset.
   */
  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("hardware")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error in HardwareRepository.delete:", error);
      throw new Error(`Failed to delete hardware asset: ${error.message}`);
    }
  }
}
