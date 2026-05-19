"use server";

import { revalidatePath } from "next/cache";
import { SoftwareService } from "@/services/software.service";

export type ActionResponse<T> = 
  | { success: true; data: T } 
  | { success: false; error: string };

/**
 * Action to fetch all software licenses based on search query.
 */
export async function getSoftwareAction(filters?: { query?: string }): Promise<ActionResponse<any>> {
  try {
    const data = await SoftwareService.getAllSoftware(filters);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}

/**
 * Action to create a new software license.
 */
export async function createSoftwareAction(data: any): Promise<ActionResponse<any>> {
  try {
    const newAsset = await SoftwareService.createSoftware(data);
    revalidatePath("/software");
    return { success: true, data: newAsset };
  } catch (error: any) {
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}

/**
 * Action to update an existing software license.
 */
export async function updateSoftwareAction(id: string, data: any): Promise<ActionResponse<any>> {
  try {
    const updatedAsset = await SoftwareService.updateSoftware(id, data);
    revalidatePath("/software");
    return { success: true, data: updatedAsset };
  } catch (error: any) {
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}

/**
 * Action to delete a software license.
 */
export async function deleteSoftwareAction(id: string): Promise<ActionResponse<void>> {
  try {
    await SoftwareService.deleteSoftware(id);
    revalidatePath("/software");
    return { success: true, data: undefined };
  } catch (error: any) {
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}
