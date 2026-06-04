import { createClient } from "@/lib/supabase/client";
import { Location } from "@/types/database.types";

const supabase = createClient();

export class LocationsRepository {
  /**
   * Fetch all locations with optional search filter.
   */
  static async findAll(filters?: { query?: string; type?: string }): Promise<Location[]> {
    let queryBuilder = supabase
      .from("locations")
      .select("*")
      .order("name", { ascending: true });

    if (filters?.type) {
      queryBuilder = queryBuilder.eq("type", filters.type);
    }

    if (filters?.query) {
      queryBuilder = queryBuilder.or(
        `name.ilike.%${filters.query}%,type.ilike.%${filters.query}%,floor.ilike.%${filters.query}%,description.ilike.%${filters.query}%`
      );
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error("Error in LocationsRepository.findAll:", error);
      throw new Error(`Failed to fetch locations: ${error.message}`);
    }

    return (data || []) as Location[];
  }

  /**
   * Find a single location by ID.
   */
  static async findById(id: string): Promise<Location | null> {
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error in LocationsRepository.findById:", error);
      throw new Error(`Failed to fetch location: ${error.message}`);
    }

    return data as Location | null;
  }

  /**
   * Create a new location.
   */
  static async create(data: Omit<Location, "id" | "created_at" | "updated_at">): Promise<Location> {
    const { data: newLocation, error } = await supabase
      .from("locations")
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error("Error in LocationsRepository.create:", error);
      throw new Error(`Failed to create location: ${error.message}`);
    }

    return newLocation as Location;
  }

  /**
   * Update an existing location.
   */
  static async update(
    id: string,
    data: Partial<Omit<Location, "id" | "created_at" | "updated_at">>
  ): Promise<Location> {
    const updateData = {
      ...data,
      updated_at: new Date().toISOString(),
    };

    const { data: updatedLocation, error } = await supabase
      .from("locations")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error in LocationsRepository.update:", error);
      throw new Error(`Failed to update location: ${error.message}`);
    }

    return updatedLocation as Location;
  }

  /**
   * Delete a location.
   */
  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("locations")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error in LocationsRepository.delete:", error);
      throw new Error(`Failed to delete location: ${error.message}`);
    }
  }

  /**
   * Check if location name already exists (for validation).
   */
  static async existsByName(name: string, excludeId?: string): Promise<boolean> {
    let query = supabase
      .from("locations")
      .select("id")
      .ilike("name", name);

    if (excludeId) {
      query = query.neq("id", excludeId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error in LocationsRepository.existsByName:", error);
      return false;
    }

    return (data?.length ?? 0) > 0;
  }

  /**
   * Fetch distinct location types.
   */
  static async findDistinctTypes(): Promise<string[]> {
    const { data, error } = await supabase
      .from("locations")
      .select("type")
      .not("type", "is", null)
      .order("type", { ascending: true });

    if (error) {
      console.error("Error in LocationsRepository.findDistinctTypes:", error);
      throw new Error(`Failed to fetch location types: ${error.message}`);
    }

    const types = new Set<string>();
    (data || []).forEach((item: { type: string | null }) => {
      if (item.type) types.add(item.type);
    });

    return Array.from(types).sort();
  }
}