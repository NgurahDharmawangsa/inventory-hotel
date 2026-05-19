import { Hospitality } from "@/types/database.types";

export class HospitalityValidator {
  /**
   * Validate parameters for creating a new hospitality device.
   */
  static validateCreate(data: any): Omit<Hospitality, "id" | "created_at" | "updated_at"> {
    if (!data.device_type || typeof data.device_type !== "string") {
      throw new Error("Device Type is required.");
    }
    
    const trimmedDeviceType = data.device_type.trim();
    if (trimmedDeviceType.length < 3) {
      throw new Error("Device Type must be at least 3 characters long.");
    }

    const validStatuses = ["ACTIVE", "BROKEN", "REPAIR"];
    const status = data.status ? data.status.toUpperCase() : "ACTIVE";
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${data.status}. Must be one of: ${validStatuses.join(", ")}`);
    }

    return {
      device_type: trimmedDeviceType,
      item_code: data.item_code?.trim() || null,
      room_number: data.room_number?.trim() || null,
      status: status as "ACTIVE" | "BROKEN" | "REPAIR",
      vendor_id: data.vendor_id || null,
    };
  }

  /**
   * Validate parameters for updating an existing hospitality device.
   */
  static validateUpdate(data: any): Partial<Omit<Hospitality, "id" | "created_at" | "updated_at">> {
    const sanitizedData: Partial<Omit<Hospitality, "id" | "created_at" | "updated_at">> = {};

    if (data.device_type !== undefined) {
      if (typeof data.device_type !== "string") {
        throw new Error("Device Type must be a string.");
      }
      const trimmed = data.device_type.trim();
      if (trimmed.length < 3) {
        throw new Error("Device Type must be at least 3 characters long.");
      }
      sanitizedData.device_type = trimmed;
    }

    if (data.item_code !== undefined) {
      sanitizedData.item_code = data.item_code?.trim() || null;
    }

    if (data.room_number !== undefined) {
      sanitizedData.room_number = data.room_number?.trim() || null;
    }

    if (data.status !== undefined) {
      const validStatuses = ["ACTIVE", "BROKEN", "REPAIR"];
      const status = data.status ? data.status.toUpperCase() : "ACTIVE";
      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status: ${data.status}. Must be one of: ${validStatuses.join(", ")}`);
      }
      sanitizedData.status = status as "ACTIVE" | "BROKEN" | "REPAIR";
    }

    if (data.vendor_id !== undefined) {
      sanitizedData.vendor_id = data.vendor_id || null;
    }

    return sanitizedData;
  }
}
