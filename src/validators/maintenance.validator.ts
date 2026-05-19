import { Maintenance } from "@/types/database.types";

export class MaintenanceValidator {
  /**
   * Validate parameters for creating a new maintenance log.
   */
  static validateCreate(data: any): Omit<Maintenance, "id" | "created_at" | "updated_at"> {
    if (!data.item_id || typeof data.item_id !== "string") {
      throw new Error("Item ID is required.");
    }

    const validItemTypes = ["HARDWARE", "SOFTWARE", "NETWORKING", "SECURITY", "HOSPITALITY"];
    const itemType = data.item_type ? data.item_type.toUpperCase() : "";
    if (!validItemTypes.includes(itemType)) {
      throw new Error(`Item Type is required and must be one of: ${validItemTypes.join(", ")}`);
    }

    if (!data.issue || typeof data.issue !== "string" || data.issue.trim().length < 5) {
      throw new Error("Issue description is required and must be at least 5 characters long.");
    }

    let repairCost = 0;
    if (data.repair_cost !== undefined && data.repair_cost !== null) {
      repairCost = Number(data.repair_cost);
      if (isNaN(repairCost) || repairCost < 0) {
        throw new Error("Repair cost must be a positive number.");
      }
    }

    const dateReported = data.date_reported || new Date().toISOString().split("T")[0];

    return {
      item_id: data.item_id,
      item_type: itemType,
      issue: data.issue.trim(),
      repair_cost: repairCost,
      date_reported: dateReported,
      date_resolved: data.date_resolved || null
    };
  }

  /**
   * Validate parameters for updating an existing maintenance log.
   */
  static validateUpdate(data: any): Partial<Omit<Maintenance, "id" | "created_at" | "updated_at">> {
    const sanitizedData: Partial<Omit<Maintenance, "id" | "created_at" | "updated_at">> = {};

    if (data.item_id !== undefined) {
      if (!data.item_id || typeof data.item_id !== "string") {
        throw new Error("Item ID must be a valid string.");
      }
      sanitizedData.item_id = data.item_id;
    }

    if (data.item_type !== undefined) {
      const validItemTypes = ["HARDWARE", "SOFTWARE", "NETWORKING", "SECURITY", "HOSPITALITY"];
      const itemType = data.item_type ? data.item_type.toUpperCase() : "";
      if (!validItemTypes.includes(itemType)) {
        throw new Error(`Item Type must be one of: ${validItemTypes.join(", ")}`);
      }
      sanitizedData.item_type = itemType;
    }

    if (data.issue !== undefined) {
      if (typeof data.issue !== "string" || data.issue.trim().length < 5) {
        throw new Error("Issue description must be at least 5 characters long.");
      }
      sanitizedData.issue = data.issue.trim();
    }

    if (data.repair_cost !== undefined && data.repair_cost !== null) {
      const repairCost = Number(data.repair_cost);
      if (isNaN(repairCost) || repairCost < 0) {
        throw new Error("Repair cost must be a positive number.");
      }
      sanitizedData.repair_cost = repairCost;
    }

    if (data.date_reported !== undefined) {
      sanitizedData.date_reported = data.date_reported || null;
    }

    if (data.date_resolved !== undefined) {
      sanitizedData.date_resolved = data.date_resolved || null;
    }

    return sanitizedData;
  }
}
