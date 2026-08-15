import { SecurityRepository, SecurityWithRelations, LocationRoomOption } from "@/repositories/security.repository";
import { SecurityValidator } from "@/validators/security.validator";
import { Security } from "@/types/database.types";

export class SecurityService {
  /**
   * Fetch all security devices.
   */
  static async getAllDevices(filters?: { query?: string; location?: string; device_type?: string; status?: string }): Promise<SecurityWithRelations[]> {
    return await SecurityRepository.findAll({
      query: filters?.query?.trim(),
      location: filters?.location || undefined,
      device_type: filters?.device_type || undefined,
      status: filters?.status || undefined,
    });
  }

  /**
   * Fetch a single security device by ID.
   */
  static async getDeviceById(id: string): Promise<SecurityWithRelations | null> {
    if (!id) {
      throw new Error("Device ID is required.");
    }
    return await SecurityRepository.findById(id);
  }

  /**
   * Create a new security device.
   */
  static async createDevice(data: any): Promise<Security> {
    const validatedData = SecurityValidator.validateCreate(data);
    return await SecurityRepository.create(validatedData);
  }

  /**
   * Update an existing security device.
   */
  static async updateDevice(id: string, data: any): Promise<Security> {
    if (!id) {
      throw new Error("Device ID is required for update.");
    }
    const validatedData = SecurityValidator.validateUpdate(data);
    return await SecurityRepository.update(id, validatedData);
  }

  /**
   * Fetch distinct locations and rooms for the filter dropdown.
   */
  static async getDistinctLocations(): Promise<LocationRoomOption[]> {
    return SecurityRepository.findDistinctLocations();
  }

  /**
   * Delete a security device.
   */
  static async deleteDevice(id: string): Promise<void> {
    if (!id) {
      throw new Error("Device ID is required for deletion.");
    }
    await SecurityRepository.delete(id);
  }
}
