"use server";

import { revalidatePath } from "next/cache";
import { BudgetService } from "@/services/budget.service";

export async function getBudgetsAction(filters?: { query?: string }) {
  try {
    const data = await BudgetService.getAllBudgets(filters);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to retrieve budget plans." };
  }
}

export async function createBudgetAction(data: any) {
  try {
    const newBudget = await BudgetService.createBudget(data);
    revalidatePath("/budget");
    return { success: true, data: newBudget };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create budget plan." };
  }
}

export async function updateBudgetAction(id: string, data: any) {
  try {
    const updatedBudget = await BudgetService.updateBudget(id, data);
    revalidatePath("/budget");
    return { success: true, data: updatedBudget };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update budget plan." };
  }
}

export async function deleteBudgetAction(id: string) {
  try {
    await BudgetService.deleteBudget(id);
    revalidatePath("/budget");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete budget plan." };
  }
}
