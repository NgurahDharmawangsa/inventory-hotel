import { MaintenanceRepository } from "@/repositories/maintenance.repository";
import { MaintenanceValidator } from "@/validators/maintenance.validator";
import { Maintenance } from "@/types/database.types";

export class MaintenanceService {
  /**
   * Fetch all maintenance logs.
   */
  static async getAllLogs(): Promise<Maintenance[]> {
    return await MaintenanceRepository.findAll();
  }

  /**
   * Fetch a single maintenance log by ID.
   */
  static async getLogById(id: string): Promise<Maintenance | null> {
    if (!id) {
      throw new Error("Log ID is required.");
    }
    return await MaintenanceRepository.findById(id);
  }

  /**
   * Create a new maintenance log.
   */
  static async createLog(data: any): Promise<Maintenance> {
    const validatedData = MaintenanceValidator.validateCreate(data);
    return await MaintenanceRepository.create(validatedData);
  }

  /**
   * Update an existing maintenance log.
   */
  static async updateLog(id: string, data: any): Promise<Maintenance> {
    if (!id) {
      throw new Error("Log ID is required for update.");
    }
    const validatedData = MaintenanceValidator.validateUpdate(data);
    return await MaintenanceRepository.update(id, validatedData);
  }

  /**
   * Delete a maintenance log.
   */
  static async deleteLog(id: string): Promise<void> {
    if (!id) {
      throw new Error("Log ID is required for deletion.");
    }
    await MaintenanceRepository.delete(id);
  }
}
