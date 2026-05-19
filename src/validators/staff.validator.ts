import { Staff } from "@/types/database.types";

export class StaffValidator {
  private static validStatuses: Array<Staff["status"]> = ["ACTIVE", "RESIGNED", "ON LEAVE"];

  /**
   * Validate parameters for creating a new Staff member.
   */
  static validateCreate(data: any): Omit<Staff, "id" | "created_at" | "updated_at"> {
    if (!data.employee_id?.trim()) {
      throw new Error("Employee ID is required.");
    }

    if (!data.full_name?.trim()) {
      throw new Error("Full name is required.");
    }

    if (!data.department?.trim()) {
      throw new Error("Department is required.");
    }

    if (!data.position?.trim()) {
      throw new Error("Position is required.");
    }

    const status = data.status || "ACTIVE";
    if (!this.validStatuses.includes(status)) {
      throw new Error("Invalid staff status. Allowed: ACTIVE, RESIGNED, ON LEAVE.");
    }

    return {
      employee_id: data.employee_id.trim().toUpperCase(),
      full_name: data.full_name.trim(),
      department: data.department.trim(),
      position: data.position.trim(),
      status
    };
  }

  /**
   * Validate parameters for updating an existing Staff member.
   */
  static validateUpdate(data: any): Partial<Omit<Staff, "id" | "created_at" | "updated_at">> {
    const sanitizedData: Partial<Omit<Staff, "id" | "created_at" | "updated_at">> = {};

    if (data.employee_id !== undefined) {
      if (!data.employee_id?.trim()) {
        throw new Error("Employee ID cannot be empty.");
      }
      sanitizedData.employee_id = data.employee_id.trim().toUpperCase();
    }

    if (data.full_name !== undefined) {
      if (!data.full_name?.trim()) {
        throw new Error("Full name cannot be empty.");
      }
      sanitizedData.full_name = data.full_name.trim();
    }

    if (data.department !== undefined) {
      if (!data.department?.trim()) {
        throw new Error("Department cannot be empty.");
      }
      sanitizedData.department = data.department.trim();
    }

    if (data.position !== undefined) {
      if (!data.position?.trim()) {
        throw new Error("Position cannot be empty.");
      }
      sanitizedData.position = data.position.trim();
    }

    if (data.status !== undefined) {
      if (!this.validStatuses.includes(data.status)) {
        throw new Error("Invalid staff status. Allowed: ACTIVE, RESIGNED, ON LEAVE.");
      }
      sanitizedData.status = data.status;
    }

    return sanitizedData;
  }
}
