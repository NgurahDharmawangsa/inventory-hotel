import { supabase } from "@/lib/supabase";
import { Networking } from "@/types/database.types";

export type NetworkingWithRelations = Networking & {
  vendor?: {
    id: string;
    name: string;
  } | null;
};

export class NetworkingRepository {
  /**
   * Fetch all networking items with optional filters and vendor relation joined.
   */
  static async findAll(filters?: { query?: string }): Promise<NetworkingWithRelations[]> {
    let queryBuilder = supabase
      .from("networking")
      .select(`
        *,
        vendor:vendor_id (id, name)
      `)
      .order("created_at", { ascending: false });

    if (filters?.query) {
      // Search in device_type, ip_address, location, or item_code
      queryBuilder = queryBuilder.or(
        `device_type.ilike.%${filters.query}%,ip_address.ilike.%${filters.query}%,location.ilike.%${filters.query}%,item_code.ilike.%${filters.query}%`
      );
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error("Error in NetworkingRepository.findAll:", error);
      throw new Error(`Failed to fetch networking devices: ${error.message}`);
    }

    return (data || []) as NetworkingWithRelations[];
  }

  /**
   * Find a single networking item by ID with relations.
   */
  static async findById(id: string): Promise<NetworkingWithRelations | null> {
    const { data, error } = await supabase
      .from("networking")
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
      console.error("Error in NetworkingRepository.findById:", error);
      throw new Error(`Failed to fetch networking device: ${error.message}`);
    }

    return data as NetworkingWithRelations;
  }

  /**
   * Create a new networking device.
   */
  static async create(data: Omit<Networking, "id" | "created_at" | "updated_at">): Promise<Networking> {
    const { data: newDevice, error } = await supabase
      .from("networking")
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error("Error in NetworkingRepository.create:", error);
      throw new Error(`Failed to create networking device: ${error.message}`);
    }

    return newDevice as Networking;
  }

  /**
   * Update an existing networking device.
   */
  static async update(id: string, data: Partial<Omit<Networking, "id" | "created_at" | "updated_at">>): Promise<Networking> {
    const { data: updatedDevice, error } = await supabase
      .from("networking")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error in NetworkingRepository.update:", error);
      throw new Error(`Failed to update networking device: ${error.message}`);
    }

    return updatedDevice as Networking;
  }

  /**
   * Delete a networking device.
   */
  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("networking")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error in NetworkingRepository.delete:", error);
      throw new Error(`Failed to delete networking device: ${error.message}`);
    }
  }
}
