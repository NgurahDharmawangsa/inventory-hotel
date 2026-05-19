import { Vendor } from "@/types/database.types";

export class VendorValidator {
  /**
   * Validate parameters for creating a new Vendor.
   */
  static validateCreate(data: any): Omit<Vendor, "id" | "created_at" | "updated_at"> {
    if (!data.name?.trim()) {
      throw new Error("Vendor name is required.");
    }

    return {
      name: data.name.trim(),
      contact_person: data.contact_person?.trim() || null,
      phone: data.phone?.trim() || null,
      email: data.email?.trim() || null,
      address: data.address?.trim() || null
    };
  }

  /**
   * Validate parameters for updating an existing Vendor.
   */
  static validateUpdate(data: any): Partial<Omit<Vendor, "id" | "created_at" | "updated_at">> {
    const sanitizedData: Partial<Omit<Vendor, "id" | "created_at" | "updated_at">> = {};

    if (data.name !== undefined) {
      if (!data.name?.trim()) {
        throw new Error("Vendor name cannot be empty.");
      }
      sanitizedData.name = data.name.trim();
    }

    if (data.contact_person !== undefined) {
      sanitizedData.contact_person = data.contact_person?.trim() || null;
    }

    if (data.phone !== undefined) {
      sanitizedData.phone = data.phone?.trim() || null;
    }

    if (data.email !== undefined) {
      sanitizedData.email = data.email?.trim() || null;
    }

    if (data.address !== undefined) {
      sanitizedData.address = data.address?.trim() || null;
    }

    return sanitizedData;
  }
}
