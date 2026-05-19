import { Hardware } from "@/types/database.types";

export const VALID_STATUSES = ["ACTIVE", "BROKEN", "REPAIR", "DISPOSED"] as const;
export const VALID_CATEGORIES = ["Server", "Laptop", "Desktop", "Network", "Printer", "Other"] as const;

export type ValidStatus = (typeof VALID_STATUSES)[number];
export type ValidCategory = (typeof VALID_CATEGORIES)[number];

export class HardwareValidator {
  /**
   * Validate and sanitize input data for creating a new hardware asset.
   */
  static validateCreate(data: any): Omit<Hardware, "id" | "created_at" | "updated_at"> {
    // 1. Validate and sanitize name
    const name = data.name?.trim();
    if (!name || name.length < 3) {
      throw new Error("Asset Name must be at least 3 characters long.");
    }

    // 2. Validate and sanitize category
    const category = data.category;
    if (!category || !VALID_CATEGORIES.includes(category as any)) {
      throw new Error(`Invalid category. Allowed: ${VALID_CATEGORIES.join(", ")}`);
    }

    // 3. Validate and sanitize status
    const status = data.status?.toUpperCase() || "ACTIVE";
    if (!VALID_STATUSES.includes(status as any)) {
      throw new Error(`Invalid status. Allowed: ${VALID_STATUSES.join(", ")}`);
    }

    // 4. Sanitize and return full object
    return {
      item_code: data.item_code?.trim() || null,
      name,
      category: category as ValidCategory,
      location: data.location?.trim() || null,
      status: status as ValidStatus,
      staff_id: data.staff_id && data.staff_id !== "" ? data.staff_id : null,
      vendor_id: data.vendor_id && data.vendor_id !== "" ? data.vendor_id : null
    } as any;
  }

  /**
   * Validate and sanitize input data for updating an existing hardware asset.
   */
  static validateUpdate(data: any): Partial<Omit<Hardware, "id" | "created_at" | "updated_at">> {
    const sanitizedData: any = {};

    // 1. Validate name if provided
    if (data.name !== undefined) {
      const name = data.name?.trim();
      if (!name || name.length < 3) {
        throw new Error("Asset Name must be at least 3 characters long.");
      }
      sanitizedData.name = name;
    }

    // 2. Validate category if provided
    if (data.category !== undefined) {
      if (!data.category || !VALID_CATEGORIES.includes(data.category as any)) {
        throw new Error(`Invalid category. Allowed: ${VALID_CATEGORIES.join(", ")}`);
      }
      sanitizedData.category = data.category as ValidCategory;
    }

    // 3. Validate status if provided
    if (data.status !== undefined) {
      const status = data.status.toUpperCase();
      if (!VALID_STATUSES.includes(status as any)) {
        throw new Error(`Invalid status. Allowed: ${VALID_STATUSES.join(", ")}`);
      }
      sanitizedData.status = status as ValidStatus;
    }

    // 4. Location & Item Code
    if (data.item_code !== undefined) {
      sanitizedData.item_code = data.item_code?.trim() || null;
    }
    if (data.location !== undefined) {
      sanitizedData.location = data.location?.trim() || null;
    }

    // 5. Staff & Vendor associations
    if (data.staff_id !== undefined) {
      sanitizedData.staff_id = data.staff_id && data.staff_id !== "" ? data.staff_id : null;
    }
    if (data.vendor_id !== undefined) {
      sanitizedData.vendor_id = data.vendor_id && data.vendor_id !== "" ? data.vendor_id : null;
    }

    return sanitizedData;
  }
}
