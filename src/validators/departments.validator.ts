import { Department } from "@/types/database.types";

export class DepartmentsValidator {
  /**
   * Validate parameters for creating a new department.
   */
  static validateCreate(data: any): Omit<Department, "id" | "created_at" | "updated_at"> {
    if (!data.name?.trim()) {
      throw new Error("Department name is required.");
    }

    if (data.name.trim().length > 100) {
      throw new Error("Department name must not exceed 100 characters.");
    }

    return {
      name: data.name.trim(),
      description: data.description?.trim() || undefined,
    };
  }

  /**
   * Validate parameters for updating an existing department.
   */
  static validateUpdate(data: any): Partial<Omit<Department, "id" | "created_at" | "updated_at">> {
    const sanitizedData: Partial<Omit<Department, "id" | "created_at" | "updated_at">> = {};

    if (data.name !== undefined) {
      if (!data.name?.trim()) {
        throw new Error("Department name cannot be empty.");
      }
      if (data.name.trim().length > 100) {
        throw new Error("Department name must not exceed 100 characters.");
      }
      sanitizedData.name = data.name.trim();
    }

    if (data.description !== undefined) {
      sanitizedData.description = data.description?.trim() || undefined;
    }

    if (Object.keys(sanitizedData).length === 0) {
      throw new Error("At least one field must be provided for update.");
    }

    return sanitizedData;
  }
}