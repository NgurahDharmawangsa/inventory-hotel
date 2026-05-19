import { NetworkingRepository, NetworkingWithRelations } from "@/repositories/networking.repository";
import { NetworkingValidator } from "@/validators/networking.validator";
import { Networking } from "@/types/database.types";

export class NetworkingService {
  /**
   * Fetch all networking devices.
   */
  static async getAllDevices(filters?: { query?: string }): Promise<NetworkingWithRelations[]> {
    return await NetworkingRepository.findAll(filters);
  }

  /**
   * Fetch a single networking device by ID.
   */
  static async getDeviceById(id: string): Promise<NetworkingWithRelations | null> {
    if (!id) {
      throw new Error("Device ID is required.");
    }
    return await NetworkingRepository.findById(id);
  }

  /**
   * Create a new networking device.
   */
  static async createDevice(data: any): Promise<Networking> {
    const validatedData = NetworkingValidator.validateCreate(data);
    return await NetworkingRepository.create(validatedData);
  }

  /**
   * Update an existing networking device.
   */
  static async updateDevice(id: string, data: any): Promise<Networking> {
    if (!id) {
      throw new Error("Device ID is required for update.");
    }
    const validatedData = NetworkingValidator.validateUpdate(data);
    return await NetworkingRepository.update(id, validatedData);
  }

  /**
   * Delete a networking device.
   */
  static async deleteDevice(id: string): Promise<void> {
    if (!id) {
      throw new Error("Device ID is required for deletion.");
    }
    await NetworkingRepository.delete(id);
  }
}
