import { Location } from "@/types/database.types";

export class LocationsValidator {
  /**
   * Validate parameters for creating a new location.
   */
  static validateCreate(data: any): Omit<Location, "id" | "created_at" | "updated_at"> {
    if (!data.name?.trim()) {
      throw new Error("Location name is required.");
    }

    if (data.name.trim().length > 100) {
      throw new Error("Location name must not exceed 100 characters.");
    }

    if (!data.type?.trim()) {
      throw new Error("Location type is required.");
    }

    return {
      name: data.name.trim(),
      type: data.type.trim(),
      floor: data.floor?.trim() || undefined,
      building: data.building?.trim() || undefined,
      description: data.description?.trim() || undefined,
    };
  }

  /**
   * Validate parameters for updating an existing location.
   */
  static validateUpdate(data: any): Partial<Omit<Location, "id" | "created_at" | "updated_at">> {
    const sanitizedData: Partial<Omit<Location, "id" | "created_at" | "updated_at">> = {};

    if (data.name !== undefined) {
      if (!data.name?.trim()) {
        throw new Error("Location name cannot be empty.");
      }
      if (data.name.trim().length > 100) {
        throw new Error("Location name must not exceed 100 characters.");
      }
      sanitizedData.name = data.name.trim();
    }

    if (data.type !== undefined) {
      if (!data.type?.trim()) {
        throw new Error("Location type cannot be empty.");
      }
      sanitizedData.type = data.type.trim();
    }

    if (data.floor !== undefined) {
      sanitizedData.floor = data.floor?.trim() || undefined;
    }

    if (data.building !== undefined) {
      sanitizedData.building = data.building?.trim() || undefined;
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