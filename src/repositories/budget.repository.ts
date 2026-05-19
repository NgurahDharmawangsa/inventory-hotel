import { supabase } from "@/lib/supabase";
import { Budget } from "@/types/database.types";

export class BudgetRepository {
  /**
   * Fetch all budget plans.
   */
  static async findAll(filters?: { query?: string }): Promise<Budget[]> {
    let queryBuilder = supabase
      .from("budgets")
      .select("*")
      .order("year", { ascending: false });

    if (filters?.query) {
      // Search in year (cast as text) or notes
      queryBuilder = queryBuilder.or(
        `notes.ilike.%${filters.query}%`
      );
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error("Error in BudgetRepository.findAll:", error);
      throw new Error(`Failed to fetch budget plans: ${error.message}`);
    }

    // Client-side fallback search filter for Year since Supabase ilike doesn't cast numeric fields automatically in basic syntax
    if (filters?.query && data) {
      const q = filters.query.trim().toLowerCase();
      return data.filter(item => 
        item.year.toString().includes(q) || 
        (item.notes && item.notes.toLowerCase().includes(q))
      ) as Budget[];
    }

    return (data || []) as Budget[];
  }

  /**
   * Find a single budget plan by ID.
   */
  static async findById(id: string): Promise<Budget | null> {
    const { data, error } = await supabase
      .from("budgets")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // Not found
      }
      console.error("Error in BudgetRepository.findById:", error);
      throw new Error(`Failed to fetch budget plan: ${error.message}`);
    }

    return data as Budget;
  }

  /**
   * Find a budget plan by year.
   */
  static async findByYear(year: number): Promise<Budget | null> {
    const { data, error } = await supabase
      .from("budgets")
      .select("*")
      .eq("year", year);

    if (error) {
      console.error("Error in BudgetRepository.findByYear:", error);
      throw new Error(`Failed to query budget by year: ${error.message}`);
    }

    if (data && data.length > 0) {
      return data[0] as Budget;
    }

    return null;
  }

  /**
   * Create a new budget plan, checking for unique year constraints.
   */
  static async create(data: Omit<Budget, "id" | "created_at" | "updated_at">): Promise<Budget> {
    // 1. Check duplicate year
    const existing = await this.findByYear(data.year);
    if (existing) {
      throw new Error(`A budget plan for the year ${data.year} already exists in the database.`);
    }

    const { data: newBudget, error } = await supabase
      .from("budgets")
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error("Error in BudgetRepository.create:", error);
      throw new Error(`Failed to create budget plan: ${error.message}`);
    }

    return newBudget as Budget;
  }

  /**
   * Update an existing budget plan, checking for unique year constraints.
   */
  static async update(id: string, data: Partial<Omit<Budget, "id" | "created_at" | "updated_at">>): Promise<Budget> {
    if (data.year !== undefined) {
      const existing = await this.findByYear(data.year);
      if (existing && existing.id !== id) {
        throw new Error(`A budget plan for the year ${data.year} already exists in the database.`);
      }
    }

    const { data: updatedBudget, error } = await supabase
      .from("budgets")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error in BudgetRepository.update:", error);
      throw new Error(`Failed to update budget plan: ${error.message}`);
    }

    return updatedBudget as Budget;
  }

  /**
   * Delete a budget plan.
   */
  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("budgets")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error in BudgetRepository.delete:", error);
      throw new Error(`Failed to delete budget plan: ${error.message}`);
    }
  }
}
