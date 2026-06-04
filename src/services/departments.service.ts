import { DepartmentsRepository } from "@/repositories/departments.repository";
import { DepartmentsValidator } from "@/validators/departments.validator";
import { Department } from "@/types/database.types";

export class DepartmentsService {
  /**
   * Fetch all departments.
   */
  static async getAllDepartments(filters?: { query?: string }): Promise<Department[]> {
    return DepartmentsRepository.findAll(filters);
  }

  /**
   * Fetch a single department by ID.
   */
  static async getDepartmentById(id: string): Promise<Department | null> {
    return DepartmentsRepository.findById(id);
  }

  /**
   * Create a new department.
   */
  static async createDepartment(data: any): Promise<Department> {
    const validatedData = DepartmentsValidator.validateCreate(data);

    // Check if name already exists
    const exists = await DepartmentsRepository.existsByName(validatedData.name);
    if (exists) {
      throw new Error("A department with this name already exists.");
    }

    return DepartmentsRepository.create(validatedData);
  }

  /**
   * Update an existing department.
   */
  static async updateDepartment(id: string, data: any): Promise<Department> {
    const validatedData = DepartmentsValidator.validateUpdate(data);

    // If name is being updated, check if it already exists
    if (validatedData.name) {
      const exists = await DepartmentsRepository.existsByName(validatedData.name, id);
      if (exists) {
        throw new Error("A department with this name already exists.");
      }
    }

    return DepartmentsRepository.update(id, validatedData);
  }

  /**
   * Delete a department.
   */
  static async deleteDepartment(id: string): Promise<void> {
    return DepartmentsRepository.delete(id);
  }
}