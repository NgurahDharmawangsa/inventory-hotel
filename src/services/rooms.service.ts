import { RoomsRepository } from "@/repositories/rooms.repository";
import { RoomsValidator } from "@/validators/rooms.validator";
import { Room } from "@/types/database.types";

export class RoomsService {
  /**
   * Fetch all rooms.
   */
  static async getAllRooms(filters?: { query?: string; status?: string; room_type?: string }): Promise<Room[]> {
    return RoomsRepository.findAll(filters);
  }

  /**
   * Fetch a single room by ID.
   */
  static async getRoomById(id: string): Promise<Room | null> {
    return RoomsRepository.findById(id);
  }

  /**
   * Create a new room.
   */
  static async createRoom(data: any): Promise<Room> {
    const validatedData = RoomsValidator.validateCreate(data);

    // Check if room number already exists
    const exists = await RoomsRepository.existsByRoomNumber(validatedData.room_number);
    if (exists) {
      throw new Error("A room with this number already exists.");
    }

    return RoomsRepository.create(validatedData);
  }

  /**
   * Update an existing room.
   */
  static async updateRoom(id: string, data: any): Promise<Room> {
    const validatedData = RoomsValidator.validateUpdate(data);

    // If room number is being updated, check if it already exists
    if (validatedData.room_number) {
      const exists = await RoomsRepository.existsByRoomNumber(validatedData.room_number, id);
      if (exists) {
        throw new Error("A room with this number already exists.");
      }
    }

    return RoomsRepository.update(id, validatedData);
  }

  /**
   * Delete a room.
   */
  static async deleteRoom(id: string): Promise<void> {
    return RoomsRepository.delete(id);
  }

  /**
   * Fetch distinct room types.
   */
  static async getDistinctRoomTypes(): Promise<string[]> {
    return RoomsRepository.findDistinctRoomTypes();
  }

  /**
   * Fetch distinct floors.
   */
  static async getDistinctFloors(): Promise<string[]> {
    return RoomsRepository.findDistinctFloors();
  }
}