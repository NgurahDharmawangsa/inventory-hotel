import { supabase } from "@/lib/supabase";
import { Networking } from "@/types/database.types";

export type LocationRoomOption = {
  label: string;
  value: string;
  group: 'Location' | 'Room';
};

export type NetworkingWithRelations = Networking & {
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

export class NetworkingRepository {
  /**
   * Fetch all networking items with optional filters and vendor relation joined.
   */
  static async findAll(filters?: { query?: string; location?: string }): Promise<NetworkingWithRelations[]> {
    let queryBuilder = supabase
      .from("networking")
      .select(`
        *,
        vendor:vendor_id (id, name),
        department:department_id (id, name),
        location:location_id (id, name, type),
        room:room_id (id, room_number, floor)
      `)
      .order("created_at", { ascending: false });

    if (filters?.location) {
      if (filters.location.startsWith("room:")) {
        const roomNumber = filters.location.replace("room:", "");
        const { data: matchedRooms } = await supabase
          .from("rooms")
          .select("id")
          .eq("room_number", roomNumber);

        const ids = matchedRooms?.map((r: { id: string }) => r.id) ?? [];
        queryBuilder = queryBuilder.in("room_id", ids.length > 0 ? ids : [null]);
      } else {
        const { data: matchedLocations } = await supabase
          .from("locations")
          .select("id")
          .eq("name", filters.location);

        const ids = matchedLocations?.map((l: { id: string }) => l.id) ?? [];
        queryBuilder = queryBuilder.in("location_id", ids.length > 0 ? ids : [null]);
      }
    }

    if (filters?.query) {
      // Search in device_type, ip_address, or item_code
      queryBuilder = queryBuilder.or(`device_type.ilike.%${filters.query}%,ip_address.ilike.%${filters.query}%,item_code.ilike.%${filters.query}%`);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error("Error in NetworkingRepository.findAll:", error);
      throw new Error(`Failed to fetch networking devices: ${error.message}`);
    }

    return (data || []) as NetworkingWithRelations[];
  }

  /**
   * Fetch distinct locations and rooms for the filter dropdown.
   */
  static async findDistinctLocations(): Promise<LocationRoomOption[]> {
    const { data: locationData, error: locError } = await supabase
      .from("locations")
      .select("name")
      .order("name", { ascending: true });

    if (locError) {
      console.error("Error in NetworkingRepository.findDistinctLocations:", locError);
      throw new Error(`Failed to fetch locations: ${locError.message}`);
    }

    const { data: roomData, error: roomError } = await supabase
      .from("rooms")
      .select("room_number")
      .order("room_number", { ascending: true });

    if (roomError) {
      console.error("Error in NetworkingRepository.findDistinctLocations:", roomError);
      throw new Error(`Failed to fetch rooms: ${roomError.message}`);
    }

    const options: LocationRoomOption[] = [];

    const seenLocations = new Set<string>();
    (locationData || []).forEach((item: { name: string | null }) => {
      if (item.name && !seenLocations.has(item.name)) {
        seenLocations.add(item.name);
        options.push({ label: item.name, value: item.name, group: 'Location' });
      }
    });

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
   * Find a single networking item by ID with relations.
   */
  static async findById(id: string): Promise<NetworkingWithRelations | null> {
    const { data, error } = await supabase
      .from("networking")
      .select(`
        *,
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
