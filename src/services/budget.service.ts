import { BudgetRepository } from "@/repositories/budget.repository";
import { BudgetValidator } from "@/validators/budget.validator";
import { Budget } from "@/types/database.types";

export class BudgetService {
  /**
   * Fetch all budget plans.
   */
  static async getAllBudgets(filters?: { query?: string }): Promise<Budget[]> {
    return await BudgetRepository.findAll(filters);
  }

  /**
   * Fetch a single budget plan by ID.
   */
  static async getBudgetById(id: string): Promise<Budget | null> {
    if (!id) {
      throw new Error("Budget ID is required.");
    }
    return await BudgetRepository.findById(id);
  }

  /**
   * Create a new budget plan.
   */
  static async createBudget(data: any): Promise<Budget> {
    const validatedData = BudgetValidator.validateCreate(data);
    return await BudgetRepository.create(validatedData);
  }

  /**
   * Update an existing budget plan.
   */
  static async updateBudget(id: string, data: any): Promise<Budget> {
    if (!id) {
      throw new Error("Budget ID is required for update.");
    }
    const validatedData = BudgetValidator.validateUpdate(data);
    return await BudgetRepository.update(id, validatedData);
  }

  /**
   * Delete a budget plan.
   */
  static async deleteBudget(id: string): Promise<void> {
    if (!id) {
      throw new Error("Budget ID is required for deletion.");
    }
    await BudgetRepository.delete(id);
  }
}
