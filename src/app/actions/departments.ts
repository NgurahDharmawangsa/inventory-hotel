"use server";

import { DepartmentsService } from "@/services/departments.service";
import { revalidatePath } from "next/cache";

export type ActionResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Action to fetch all departments with optional search filter.
 */
export async function getDepartmentsAction(filters?: { query?: string }): Promise<ActionResponse<any>> {
  try {
    const departments = await DepartmentsService.getAllDepartments(filters);
    return { success: true, data: departments };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to retrieve departments." };
  }
}

/**
 * Action to fetch a single department by ID.
 */
export async function getDepartmentByIdAction(id: string): Promise<ActionResponse<any>> {
  try {
    const department = await DepartmentsService.getDepartmentById(id);
    return { success: true, data: department };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to retrieve department." };
  }
}

/**
 * Action to create a new department.
 */
export async function createDepartmentAction(data: any): Promise<ActionResponse<any>> {
  try {
    const newDepartment = await DepartmentsService.createDepartment(data);
    revalidatePath("/departments");
    return { success: true, data: newDepartment };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create department." };
  }
}

/**
 * Action to update an existing department.
 */
export async function updateDepartmentAction(id: string, data: any): Promise<ActionResponse<any>> {
  try {
    const updatedDepartment = await DepartmentsService.updateDepartment(id, data);
    revalidatePath("/departments");
    return { success: true, data: updatedDepartment };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update department." };
  }
}

/**
 * Action to delete a department.
 */
export async function deleteDepartmentAction(id: string): Promise<ActionResponse> {
  try {
    await DepartmentsService.deleteDepartment(id);
    revalidatePath("/departments");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete department." };
  }
}