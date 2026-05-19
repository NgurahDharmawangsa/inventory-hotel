import { Software } from "@/types/database.types";

export class SoftwareValidator {
  /**
   * Validate and sanitize input data for creating a new software asset.
   */
  static validateCreate(data: any): Omit<Software, "id" | "created_at" | "updated_at"> {
    // 1. Validate and sanitize name
    const name = data.name?.trim();
    if (!name || name.length < 3) {
      throw new Error("Software Name must be at least 3 characters long.");
    }

    // 2. Validate and sanitize license key (optional)
    const license_key = data.license_key?.trim() || null;

    // 3. Validate expiration date (optional)
    let expiration_date = null;
    if (data.expiration_date && data.expiration_date !== "") {
      const parsedDate = new Date(data.expiration_date);
      if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid expiration date format.");
      }
      expiration_date = data.expiration_date; // Keep as date string (YYYY-MM-DD)
    }

    // 4. Sanitize and return full object
    return {
      item_code: data.item_code?.trim() || null,
      name,
      license_key,
      expiration_date,
      staff_id: data.staff_id && data.staff_id !== "" ? data.staff_id : null,
      vendor_id: data.vendor_id && data.vendor_id !== "" ? data.vendor_id : null
    } as any;
  }

  /**
   * Validate and sanitize input data for updating an existing software asset.
   */
  static validateUpdate(data: any): Partial<Omit<Software, "id" | "created_at" | "updated_at">> {
    const sanitizedData: any = {};

    // 1. Validate name if provided
    if (data.name !== undefined) {
      const name = data.name?.trim();
      if (!name || name.length < 3) {
        throw new Error("Software Name must be at least 3 characters long.");
      }
      sanitizedData.name = name;
    }

    // 2. License key if provided
    if (data.license_key !== undefined) {
      sanitizedData.license_key = data.license_key?.trim() || null;
    }

    // 3. Expiration date if provided
    if (data.expiration_date !== undefined) {
      if (data.expiration_date && data.expiration_date !== "") {
        const parsedDate = new Date(data.expiration_date);
        if (isNaN(parsedDate.getTime())) {
          throw new Error("Invalid expiration date format.");
        }
        sanitizedData.expiration_date = data.expiration_date;
      } else {
        sanitizedData.expiration_date = null;
      }
    }

    // 4. Item Code
    if (data.item_code !== undefined) {
      sanitizedData.item_code = data.item_code?.trim() || null;
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
