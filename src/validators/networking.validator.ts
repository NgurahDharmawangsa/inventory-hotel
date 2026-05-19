import { Networking } from "@/types/database.types";

export class NetworkingValidator {
  /**
   * Validate parameters for creating a new networking device.
   */
  static validateCreate(data: any): Omit<Networking, "id" | "created_at" | "updated_at"> {
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

    return {
      device_type: trimmedDeviceType,
      item_code: data.item_code?.trim() || null,
      ip_address: data.ip_address?.trim() || null,
      location: data.location?.trim() || null,
      status: status as "ONLINE" | "OFFLINE" | "MAINTENANCE",
      vendor_id: data.vendor_id || null,
    };
  }

  /**
   * Validate parameters for updating an existing networking device.
   */
  static validateUpdate(data: any): Partial<Omit<Networking, "id" | "created_at" | "updated_at">> {
    const sanitizedData: Partial<Omit<Networking, "id" | "created_at" | "updated_at">> = {};

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

    if (data.ip_address !== undefined) {
      sanitizedData.ip_address = data.ip_address?.trim() || null;
    }

    if (data.location !== undefined) {
      sanitizedData.location = data.location?.trim() || null;
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
