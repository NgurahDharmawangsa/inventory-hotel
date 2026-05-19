import { VendorRepository } from "@/repositories/vendor.repository";
import { VendorValidator } from "@/validators/vendor.validator";
import { Vendor } from "@/types/database.types";

export class VendorService {
  /**
   * Fetch all vendors.
   */
  static async getAllVendors(filters?: { query?: string }): Promise<Vendor[]> {
    return await VendorRepository.findAll(filters);
  }

  /**
   * Fetch a single vendor by ID.
   */
  static async getVendorById(id: string): Promise<Vendor | null> {
    if (!id) {
      throw new Error("Vendor ID is required.");
    }
    return await VendorRepository.findById(id);
  }

  /**
   * Create a new vendor.
   */
  static async createVendor(data: any): Promise<Vendor> {
    const validatedData = VendorValidator.validateCreate(data);
    return await VendorRepository.create(validatedData);
  }

  /**
   * Update an existing vendor.
   */
  static async updateVendor(id: string, data: any): Promise<Vendor> {
    if (!id) {
      throw new Error("Vendor ID is required for update.");
    }
    const validatedData = VendorValidator.validateUpdate(data);
    return await VendorRepository.update(id, validatedData);
  }

  /**
   * Delete a vendor.
   */
  static async deleteVendor(id: string): Promise<void> {
    if (!id) {
      throw new Error("Vendor ID is required for deletion.");
    }
    await VendorRepository.delete(id);
  }
}
