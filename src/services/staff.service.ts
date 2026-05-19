import { StaffRepository } from "@/repositories/staff.repository";
import { StaffValidator } from "@/validators/staff.validator";
import { Staff } from "@/types/database.types";

export class StaffService {
  /**
   * Fetch all staff members.
   */
  static async getAllStaff(filters?: { query?: string }): Promise<Staff[]> {
    return await StaffRepository.findAll(filters);
  }

  /**
   * Fetch a single staff member by ID.
   */
  static async getStaffById(id: string): Promise<Staff | null> {
    if (!id) {
      throw new Error("Staff ID is required.");
    }
    return await StaffRepository.findById(id);
  }

  /**
   * Register a new staff member.
   */
  static async createStaff(data: any): Promise<Staff> {
    const validatedData = StaffValidator.validateCreate(data);
    return await StaffRepository.create(validatedData);
  }

  /**
   * Update an existing staff member.
   */
  static async updateStaff(id: string, data: any): Promise<Staff> {
    if (!id) {
      throw new Error("Staff ID is required for update.");
    }
    const validatedData = StaffValidator.validateUpdate(data);
    return await StaffRepository.update(id, validatedData);
  }

  /**
   * Delete a staff member.
   */
  static async deleteStaff(id: string): Promise<void> {
    if (!id) {
      throw new Error("Staff ID is required for deletion.");
    }
    await StaffRepository.delete(id);
  }
}
