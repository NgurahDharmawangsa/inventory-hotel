import { supabase } from "@/lib/supabase";
import { Hospitality } from "@/types/database.types";

export type HospitalityWithRelations = Hospitality & {
  vendor?: {
    id: string;
    name: string;
  } | null;
};

export class HospitalityRepository {
  /**
   * Fetch all hospitality items with optional filters and vendor relation joined.
   */
  static async findAll(filters?: { query?: string }): Promise<HospitalityWithRelations[]> {
    let queryBuilder = supabase
      .from("hospitality")
      .select(`
        *,
        vendor:vendor_id (id, name)
      `)
      .order("created_at", { ascending: false });

    if (filters?.query) {
      // Search in device_type, room_number, or item_code
      queryBuilder = queryBuilder.or(
        `device_type.ilike.%${filters.query}%,room_number.ilike.%${filters.query}%,item_code.ilike.%${filters.query}%`
      );
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error("Error in HospitalityRepository.findAll:", error);
      throw new Error(`Failed to fetch hospitality devices: ${error.message}`);
    }

    return (data || []) as HospitalityWithRelations[];
  }

  /**
   * Find a single hospitality item by ID with relations.
   */
  static async findById(id: string): Promise<HospitalityWithRelations | null> {
    const { data, error } = await supabase
      .from("hospitality")
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
      console.error("Error in HospitalityRepository.findById:", error);
      throw new Error(`Failed to fetch hospitality device: ${error.message}`);
    }

    return data as HospitalityWithRelations;
  }

  /**
   * Create a new hospitality device.
   */
  static async create(data: Omit<Hospitality, "id" | "created_at" | "updated_at">): Promise<Hospitality> {
    const { data: newDevice, error } = await supabase
      .from("hospitality")
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error("Error in HospitalityRepository.create:", error);
      throw new Error(`Failed to create hospitality device: ${error.message}`);
    }

    return newDevice as Hospitality;
  }

  /**
   * Update an existing hospitality device.
   */
  static async update(id: string, data: Partial<Omit<Hospitality, "id" | "created_at" | "updated_at">>): Promise<Hospitality> {
    const { data: updatedDevice, error } = await supabase
      .from("hospitality")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error in HospitalityRepository.update:", error);
      throw new Error(`Failed to update hospitality device: ${error.message}`);
    }

    return updatedDevice as Hospitality;
  }

  /**
   * Delete a hospitality device.
   */
  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("hospitality")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error in HospitalityRepository.delete:", error);
      throw new Error(`Failed to delete hospitality device: ${error.message}`);
    }
  }
}
