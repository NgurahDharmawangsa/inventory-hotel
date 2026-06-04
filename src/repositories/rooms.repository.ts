import { createClient } from "@/lib/supabase/client";
import { Room } from "@/types/database.types";

const supabase = createClient();

export class RoomsRepository {
  /**
   * Fetch all rooms with optional search filter.
   */
  static async findAll(filters?: { query?: string; status?: string; room_type?: string }): Promise<Room[]> {
    let queryBuilder = supabase
      .from("rooms")
      .select("*")
      .order("room_number", { ascending: true });

    if (filters?.status) {
      queryBuilder = queryBuilder.eq("status", filters.status);
    }

    if (filters?.room_type) {
      queryBuilder = queryBuilder.eq("room_type", filters.room_type);
    }

    if (filters?.query) {
      queryBuilder = queryBuilder.or(
        `room_number.ilike.%${filters.query}%,floor.ilike.%${filters.query}%,room_type.ilike.%${filters.query}%,description.ilike.%${filters.query}%`
      );
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error("Error in RoomsRepository.findAll:", error);
      throw new Error(`Failed to fetch rooms: ${error.message}`);
    }

    return (data || []) as Room[];
  }

  /**
   * Find a single room by ID.
   */
  static async findById(id: string): Promise<Room | null> {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error in RoomsRepository.findById:", error);
      throw new Error(`Failed to fetch room: ${error.message}`);
    }

    return data as Room | null;
  }

  /**
   * Create a new room.
   */
  static async create(data: Omit<Room, "id" | "created_at" | "updated_at">): Promise<Room> {
    const { data: newRoom, error } = await supabase
      .from("rooms")
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error("Error in RoomsRepository.create:", error);
      throw new Error(`Failed to create room: ${error.message}`);
    }

    return newRoom as Room;
  }

  /**
   * Update an existing room.
   */
  static async update(
    id: string,
    data: Partial<Omit<Room, "id" | "created_at" | "updated_at">>
  ): Promise<Room> {
    const updateData = {
      ...data,
      updated_at: new Date().toISOString(),
    };

    const { data: updatedRoom, error } = await supabase
      .from("rooms")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error in RoomsRepository.update:", error);
      throw new Error(`Failed to update room: ${error.message}`);
    }

    return updatedRoom as Room;
  }

  /**
   * Delete a room.
   */
  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("rooms")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error in RoomsRepository.delete:", error);
      throw new Error(`Failed to delete room: ${error.message}`);
    }
  }

  /**
   * Check if room number already exists (for validation).
   */
  static async existsByRoomNumber(roomNumber: string, excludeId?: string): Promise<boolean> {
    let query = supabase
      .from("rooms")
      .select("id")
      .ilike("room_number", roomNumber);

    if (excludeId) {
      query = query.neq("id", excludeId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error in RoomsRepository.existsByRoomNumber:", error);
      return false;
    }

    return (data?.length ?? 0) > 0;
  }

  /**
   * Fetch distinct room types.
   */
  static async findDistinctRoomTypes(): Promise<string[]> {
    const { data, error } = await supabase
      .from("rooms")
      .select("room_type")
      .not("room_type", "is", null)
      .order("room_type", { ascending: true });

    if (error) {
      console.error("Error in RoomsRepository.findDistinctRoomTypes:", error);
      throw new Error(`Failed to fetch room types: ${error.message}`);
    }

    const types = new Set<string>();
    (data || []).forEach((item: { room_type: string | null }) => {
      if (item.room_type) types.add(item.room_type);
    });

    return Array.from(types).sort();
  }

  /**
   * Fetch distinct floors.
   */
  static async findDistinctFloors(): Promise<string[]> {
    const { data, error } = await supabase
      .from("rooms")
      .select("floor")
      .not("floor", "is", null)
      .order("floor", { ascending: true });

    if (error) {
      console.error("Error in RoomsRepository.findDistinctFloors:", error);
      throw new Error(`Failed to fetch floors: ${error.message}`);
    }

    const floors = new Set<string>();
    (data || []).forEach((item: { floor: string | null }) => {
      if (item.floor) floors.add(item.floor);
    });

    return Array.from(floors).sort();
  }
}