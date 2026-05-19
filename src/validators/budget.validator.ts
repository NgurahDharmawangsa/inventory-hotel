import { Budget } from "@/types/database.types";

export class BudgetValidator {
  /**
   * Validate parameters for creating a new Budget plan.
   */
  static validateCreate(data: any): Omit<Budget, "id" | "created_at" | "updated_at"> {
    if (data.year === undefined || data.year === null) {
      throw new Error("Budget year is required.");
    }
    const year = Number(data.year);
    if (isNaN(year) || !Number.isInteger(year) || year < 2000 || year > 2100) {
      throw new Error("Budget year must be an integer between 2000 and 2100.");
    }

    if (data.total_allocated === undefined || data.total_allocated === null) {
      throw new Error("Total allocated budget is required.");
    }
    const totalAllocated = Number(data.total_allocated);
    if (isNaN(totalAllocated) || totalAllocated < 0) {
      throw new Error("Total allocated budget must be a positive number or zero.");
    }

    let totalSpent = 0;
    if (data.total_spent !== undefined && data.total_spent !== null) {
      totalSpent = Number(data.total_spent);
      if (isNaN(totalSpent) || totalSpent < 0) {
        throw new Error("Total spent budget must be a positive number or zero.");
      }
    }

    return {
      year,
      total_allocated: totalAllocated,
      total_spent: totalSpent,
      notes: data.notes?.trim() || null
    };
  }

  /**
   * Validate parameters for updating an existing Budget plan.
   */
  static validateUpdate(data: any): Partial<Omit<Budget, "id" | "created_at" | "updated_at">> {
    const sanitizedData: Partial<Omit<Budget, "id" | "created_at" | "updated_at">> = {};

    if (data.year !== undefined) {
      const year = Number(data.year);
      if (isNaN(year) || !Number.isInteger(year) || year < 2000 || year > 2100) {
        throw new Error("Budget year must be an integer between 2000 and 2100.");
      }
      sanitizedData.year = year;
    }

    if (data.total_allocated !== undefined) {
      const totalAllocated = Number(data.total_allocated);
      if (isNaN(totalAllocated) || totalAllocated < 0) {
        throw new Error("Total allocated budget must be a positive number or zero.");
      }
      sanitizedData.total_allocated = totalAllocated;
    }

    if (data.total_spent !== undefined) {
      const totalSpent = Number(data.total_spent);
      if (isNaN(totalSpent) || totalSpent < 0) {
        throw new Error("Total spent budget must be a positive number or zero.");
      }
      sanitizedData.total_spent = totalSpent;
    }

    if (data.notes !== undefined) {
      sanitizedData.notes = data.notes?.trim() || null;
    }

    return sanitizedData;
  }
}
