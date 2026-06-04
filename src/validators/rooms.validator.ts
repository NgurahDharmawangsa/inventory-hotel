import { Room } from "@/types/database.types";

export class RoomsValidator {
  /**
   * Validate parameters for creating a new room.
   */
  static validateCreate(data: any): Omit<Room, "id" | "created_at" | "updated_at"> {
    if (!data.room_number?.trim()) {
      throw new Error("Room number is required.");
    }

    if (data.room_number.trim().length > 50) {
      throw new Error("Room number must not exceed 50 characters.");
    }

    const validStatuses = ["ACTIVE", "MAINTENANCE", "INACTIVE"];
    const status = data.status?.toUpperCase() || "ACTIVE";
    if (!validStatuses.includes(status)) {
      throw new Error(`Status must be one of: ${validStatuses.join(", ")}`);
    }

    return {
      room_number: data.room_number.trim(),
      floor: data.floor?.trim() || undefined,
      room_type: data.room_type?.trim() || undefined,
      status: status as "ACTIVE" | "MAINTENANCE" | "INACTIVE",
      capacity: data.capacity ? parseInt(data.capacity, 10) : undefined,
      description: data.description?.trim() || undefined,
    };
  }

  /**
   * Validate parameters for updating an existing room.
   */
  static validateUpdate(data: any): Partial<Omit<Room, "id" | "created_at" | "updated_at">> {
    const sanitizedData: Partial<Omit<Room, "id" | "created_at" | "updated_at">> = {};

    if (data.room_number !== undefined) {
      if (!data.room_number?.trim()) {
        throw new Error("Room number cannot be empty.");
      }
      if (data.room_number.trim().length > 50) {
        throw new Error("Room number must not exceed 50 characters.");
      }
      sanitizedData.room_number = data.room_number.trim();
    }

    if (data.floor !== undefined) {
      sanitizedData.floor = data.floor?.trim() || undefined;
    }

    if (data.room_type !== undefined) {
      sanitizedData.room_type = data.room_type?.trim() || undefined;
    }

    if (data.status !== undefined) {
      const validStatuses = ["ACTIVE", "MAINTENANCE", "INACTIVE"];
      const status = data.status?.toUpperCase();
      if (!validStatuses.includes(status)) {
        throw new Error(`Status must be one of: ${validStatuses.join(", ")}`);
      }
      sanitizedData.status = status as "ACTIVE" | "MAINTENANCE" | "INACTIVE";
    }

    if (data.capacity !== undefined) {
      sanitizedData.capacity = data.capacity ? parseInt(data.capacity, 10) : undefined;
    }

    if (data.description !== undefined) {
      sanitizedData.description = data.description?.trim() || undefined;
    }

    if (Object.keys(sanitizedData).length === 0) {
      throw new Error("At least one field must be provided for update.");
    }

    return sanitizedData;
  }
}