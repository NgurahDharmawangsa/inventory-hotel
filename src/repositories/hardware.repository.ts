import { supabase } from "@/lib/supabase";
import { Hardware } from "@/types/database.types";

export type HardwareWithRelations = Hardware & {
  staff?: {
    id: string;
    full_name: string;
    employee_id: string;
    department_id: {
      id: string;
      name: string;
    } | null;
  } | null;
  vendor?: {
    id: string;
    name: string;
  } | null;
  department?: {
    id: string;
    name: string;
  } | null;
  location?: {
    id: string;
    name: string;
    type: string;
  } | null;
  room?: {
    id: string;
    room_number: string;
    floor: string | null;
  } | null;
};

export class HardwareRepository {
  /**
   * Fetch all hardware items with optional filters and staff/vendor relations joined.
   */
  static async findAll(filters?: { query?: string; status?: string; location?: string; department?: string }): Promise<HardwareWithRelations[]> {
    let queryBuilder = supabase
      .from("hardware")
      .select(`
        *,
         staff:staff_id (
           id,
           full_name,
           employee_id,
           department_id (
             id,
             name
           )
         ),
         vendor:vendor_id (id, name),
         department:department_id (id, name),
         location:location_id (id, name, type),
         room:room_id (id, room_number, floor)
      `)
      .order("created_at", { ascending: false});

    if (filters?.status) {
      queryBuilder = queryBuilder.eq("status", filters.status);
    }

    if (filters?.location) {
      // Look up location IDs matching the given name, then filter by location_id
      const { data: matchedLocations } = await supabase
        .from("locations")
        .select("id")
        .eq("name", filters.location);

      const ids = matchedLocations?.map((l: { id: string }) => l.id) ?? [];
      queryBuilder = queryBuilder.in("location_id", ids.length > 0 ? ids : [null]);
    }

    if (filters?.department) {
      // Look up department IDs matching the given name, then filter by department_id
      const { data: matchedDepartments } = await supabase
        .from("departments")
        .select("id")
        .eq("name", filters.department);

      const ids = matchedDepartments?.map((d: { id: string }) => d.id) ?? [];
      queryBuilder = queryBuilder.in("department_id", ids.length > 0 ? ids : [null]);
    }
    if (filters?.query) {
      // Search in name or item_code
      queryBuilder = queryBuilder.or(`name.ilike.%${filters.query}%,item_code.ilike.%${filters.query}%`);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error("Error in HardwareRepository.findAll:", error);
      throw new Error(`Failed to fetch hardware assets: ${error.message}`);
    }

    return (data || []) as HardwareWithRelations[];
  }

  /**
   * Fetch distinct locations from locations table.
   */
  /**
   * Fetch distinct locations from locations table.
   */
  static async findDistinctLocations(): Promise<string[]> {
    const { data, error } = await supabase
      .from("locations")
      .select("name")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error in HardwareRepository.findDistinctLocations:", error);
      throw new Error(`Failed to fetch hardware locations: ${error.message}`);
    }

    // Extract names (already unique)
    const locations = new Set<string>();
    (data || []).forEach((item: { name: string | null }) => {
      if (item.name) locations.add(item.name);
    });

    return Array.from(locations).sort();
  }

  /**
   * Fetch distinct department names from the departments table.
   */
  static async findStaffDepartments(): Promise<string[]> {
    const { data, error } = await supabase
      .from("departments")
      .select("name")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error in HardwareRepository.findStaffDepartments:", error);
      throw new Error(`Failed to fetch staff departments: ${error.message}`);
    }

    const departments = new Set<string>();
    (data || []).forEach((item: { name: string | null }) => {
      if (item.name) departments.add(item.name);
    });

    return Array.from(departments).sort();
  }

  /**
   * Find a single hardware item by ID.
   */
  static async findById(id: string): Promise<HardwareWithRelations | null> {
    const { data, error } = await supabase
      .from("hardware")
      .select(`
        *,
         staff:staff_id (
           id,
           full_name,
           employee_id,
           department_id (
             id,
             name
           )
         ),
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