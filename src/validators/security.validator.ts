import { Security } from "@/types/database.types";

export class SecurityValidator {
  /**
   * Validate parameters for creating a new security device.
   */
  static validateCreate(data: any): Omit<Security, "id" | "created_at" | "updated_at"> {
    if (!data.device_type || typeof data.device_type !== "string") {
      throw new Error("Device Type is required.");
    }
    
    const trimmedDeviceType = data.device_type.trim();
    if (trimmedDeviceType.length < 3) {
      throw new Error("Device Type must be at least 3 characters long.");
    }

    const validStatuses = ["ONLINE", "OFFLINE", "MAINTENANCE"];
    const status = data.status ? data.status.toUpperCase() : "ONLINE";
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${data.status}. Must be one of: ${validStatuses.join(", ")}`);
    }

    if (data.location_id && data.room_id) {
      throw new Error("Cannot assign both location and room. Please select only one.");
    }

    return {
      device_type: trimmedDeviceType,
      item_code: data.item_code?.trim() || null,
      department_id: data.department_id && data.department_id !== "" ? data.department_id : null,
      location_id: data.location_id && data.location_id !== "" ? data.location_id : null,
      room_id: data.room_id && data.room_id !== "" ? data.room_id : null,
      status: status as "ONLINE" | "OFFLINE" | "MAINTENANCE",
      vendor_id: data.vendor_id || null,
    };
  }

  /**
   * Validate parameters for updating an existing security device.
   */
  static validateUpdate(data: any): Partial<Omit<Security, "id" | "created_at" | "updated_at">> {
    const sanitizedData: Partial<Omit<Security, "id" | "created_at" | "updated_at">> = {};

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

    if (data.location_id && data.room_id) {
      throw new Error("Cannot assign both location and room. Please select only one.");
    }

    if (data.department_id !== undefined) {
      sanitizedData.department_id = data.department_id && data.department_id !== "" ? data.department_id : null;
    }

    if (data.location_id !== undefined) {
      sanitizedData.location_id = data.location_id && data.location_id !== "" ? data.location_id : null;
    }

    if (data.room_id !== undefined) {
      sanitizedData.room_id = data.room_id && data.room_id !== "" ? data.room_id : null;
    }

    if (data.status !== undefined) {
      const validStatuses = ["ONLINE", "OFFLINE", "MAINTENANCE"];
      const status = data.status ? data.status.toUpperCase() : "ONLINE";
      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status: ${data.status}. Must be one of: ${validStatuses.join(", ")}`);
      }
      sanitizedData.status = status as "ONLINE" | "OFFLINE" | "MAINTENANCE";
    }

    if (data.vendor_id !== undefined) {
      sanitizedData.vendor_id = data.vendor_id || null;
    }

    return sanitizedData;
  }
}
