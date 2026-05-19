import { SoftwareRepository, SoftwareWithRelations } from "@/repositories/software.repository";
import { Software } from "@/types/database.types";
import { SoftwareValidator } from "@/validators/software.validator";

export class SoftwareService {
  /**
   * Fetch all software assets, passing optional filters.
   */
  static async getAllSoftware(filters?: { query?: string }): Promise<SoftwareWithRelations[]> {
    return SoftwareRepository.findAll({
      query: filters?.query?.trim()
    });
  }

  /**
   * Find a single software by ID.
   */
  static async getSoftwareById(id: string): Promise<SoftwareWithRelations | null> {
    if (!id) throw new Error("Software License ID is required.");
    return SoftwareRepository.findById(id);
  }

  /**
   * Validate and create a new software asset using central validator.
   */
  static async createSoftware(data: Omit<Software, "id" | "created_at" | "updated_at">): Promise<Software> {
    const validatedData = SoftwareValidator.validateCreate(data);
    return SoftwareRepository.create(validatedData);
  }

  /**
   * Validate and update an existing software asset using central validator.
   */
  static async updateSoftware(id: string, data: Partial<Omit<Software, "id" | "created_at" | "updated_at">>): Promise<Software> {
    if (!id) throw new Error("Software License ID is required for update.");
    const validatedPayload = SoftwareValidator.validateUpdate(data);
    return SoftwareRepository.update(id, validatedPayload);
  }

  /**
   * Delete a software asset.
   */
  static async deleteSoftware(id: string): Promise<void> {
    if (!id) throw new Error("Software License ID is required for deletion.");
    return SoftwareRepository.delete(id);
  }
}
