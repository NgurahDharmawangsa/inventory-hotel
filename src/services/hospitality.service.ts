import { HospitalityRepository, HospitalityWithRelations } from "@/repositories/hospitality.repository";
import { HospitalityValidator } from "@/validators/hospitality.validator";
import { Hospitality } from "@/types/database.types";

export class HospitalityService {
  /**
   * Fetch all hospitality devices.
   */
  static async getAllDevices(filters?: { query?: string }): Promise<HospitalityWithRelations[]> {
    return await HospitalityRepository.findAll(filters);
  }

  /**
   * Fetch a single hospitality device by ID.
   */
  static async getDeviceById(id: string): Promise<HospitalityWithRelations | null> {
    if (!id) {
      throw new Error("Device ID is required.");
    }
    return await HospitalityRepository.findById(id);
  }

  /**
   * Create a new hospitality device.
   */
  static async createDevice(data: any): Promise<Hospitality> {
    const validatedData = HospitalityValidator.validateCreate(data);
    return await HospitalityRepository.create(validatedData);
  }

  /**
   * Update an existing hospitality device.
   */
  static async updateDevice(id: string, data: any): Promise<Hospitality> {
    if (!id) {
      throw new Error("Device ID is required for update.");
    }
    const validatedData = HospitalityValidator.validateUpdate(data);
    return await HospitalityRepository.update(id, validatedData);
  }

  /**
   * Delete a hospitality device.
   */
  static async deleteDevice(id: string): Promise<void> {
    if (!id) {
      throw new Error("Device ID is required for deletion.");
    }
    await HospitalityRepository.delete(id);
  }
}
