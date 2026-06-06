import { supabase } from "@/lib/supabase";
import { Hardware } from "@/types/database.types";

export type LocationRoomOption = {
  label: string;
  value: string;
  group: 'Location' | 'Room';
};

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
      if (filters.location.startsWith("room:")) {
        // Filter by room number (strip "room:" prefix)
        const roomNumber = filters.location.replace("room:", "");
        const { data: matchedRooms } = await supabase
          .from("rooms")
          .select("id")
          .eq("room_number", roomNumber);

        const ids = matchedRooms?.map((r: { id: string }) => r.id) ?? [];
        queryBuilder = queryBuilder.in("room_id", ids.length > 0 ? ids : [null]);
      } else {
        // Filter by location name
        const { data: matchedLocations } = await supabase
          .from("locations")
          .select("id")
          .eq("name", filters.location);

        const ids = matchedLocations?.map((l: { id: string }) => l.id) ?? [];
        queryBuilder = queryBuilder.in("location_id", ids.length > 0 ? ids : [null]);
      }
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
   * Fetch distinct locations and rooms for the filter dropdown.
   * Returns locations first (sorted A-Z), then rooms (sorted numerically).
   * Location values are plain names (e.g. "Lobby"), room values are
   * prefixed with "room:" (e.g. "room:101") for disambiguation in filter logic.
   */
  static async findDistinctLocations(): Promise<LocationRoomOption[]> {
    // Fetch locations
    const { data: locationData, error: locError } = await supabase
      .from("locations")
      .select("name")
      .order("name", { ascending: true });

    if (locError) {
      console.error("Error in HardwareRepository.findDistinctLocations:", locError);
      throw new Error(`Failed to fetch locations: ${locError.message}`);
    }

    // Fetch rooms
    const { data: roomData, error: roomError } = await supabase
      .from("rooms")
      .select("room_number")
      .order("room_number", { ascending: true });

    if (roomError) {
      console.error("Error in HardwareRepository.findDistinctLocations:", roomError);
      throw new Error(`Failed to fetch rooms: ${roomError.message}`);
    }

    const options: LocationRoomOption[] = [];

    // Add locations (deduplicated)
    const seenLocations = new Set<string>();
    (locationData || []).forEach((item: { name: string | null }) => {
      if (item.name && !seenLocations.has(item.name)) {
        seenLocations.add(item.name);
        options.push({ label: item.name, value: item.name, group: 'Location' });
      }
    });

    // Add rooms (deduplicated)
    const seenRooms = new Set<string>();
    (roomData || []).forEach((item: { room_number: string | null }) => {
      if (item.room_number && !seenRooms.has(item.room_number)) {
        seenRooms.add(item.room_number);
        options.push({ label: item.room_number, value: `room:${item.room_number}`, group: 'Room' });
      }
    });

    return options;
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
         vendor:vendor_id (id, name),
         department:department_id (id, name),
         location:location_id (id, name, type),
         room:room_id (id, room_number, floor)
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
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
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