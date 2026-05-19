import { HardwareRepository, HardwareWithRelations } from "@/repositories/hardware.repository";
import { Hardware } from "@/types/database.types";
import { HardwareValidator } from "@/validators/hardware.validator";

export class HardwareService {
  /**
   * Fetch all hardware assets, passing optional filters.
   */
  static async getAllHardware(filters?: { query?: string; status?: string }): Promise<HardwareWithRelations[]> {
    return HardwareRepository.findAll({
      query: filters?.query?.trim(),
      status: filters?.status ? filters.status.toUpperCase() : undefined
    });
  }

  /**
   * Find a single asset by ID.
   */
  static async getHardwareById(id: string): Promise<HardwareWithRelations | null> {
    if (!id) throw new Error("Hardware Asset ID is required.");
    return HardwareRepository.findById(id);
  }

  /**
   * Validate and create a new hardware asset using central validator.
   */
  static async createHardware(data: Omit<Hardware, "id" | "created_at" | "updated_at">): Promise<Hardware> {
    const validatedData = HardwareValidator.validateCreate(data);
    return HardwareRepository.create(validatedData);
  }

  /**
   * Validate and update an existing hardware asset using central validator.
   */
  static async updateHardware(id: string, data: Partial<Omit<Hardware, "id" | "created_at" | "updated_at">>): Promise<Hardware> {
    if (!id) throw new Error("Hardware Asset ID is required for update.");
    const validatedPayload = HardwareValidator.validateUpdate(data);
    return HardwareRepository.update(id, validatedPayload);
  }

  /**
   * Delete a hardware asset.
   */
  static async deleteHardware(id: string): Promise<void> {
    if (!id) throw new Error("Hardware Asset ID is required for deletion.");
    return HardwareRepository.delete(id);
  }
}
