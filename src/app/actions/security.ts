"use server";

import { revalidatePath } from "next/cache";
import { SecurityService } from "@/services/security.service";

export async function getSecurityAction(filters?: { query?: string }) {
  try {
    const data = await SecurityService.getAllDevices(filters);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to retrieve security devices." };
  }
}

export async function createSecurityAction(data: any) {
  try {
    const newDevice = await SecurityService.createDevice(data);
    revalidatePath("/security");
    return { success: true, data: newDevice };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to register security device." };
  }
}

export async function updateSecurityAction(id: string, data: any) {
  try {
    const updatedDevice = await SecurityService.updateDevice(id, data);
    revalidatePath("/security");
    return { success: true, data: updatedDevice };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update security device." };
  }
}

export async function deleteSecurityAction(id: string) {
  try {
    await SecurityService.deleteDevice(id);
    revalidatePath("/security");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete security device." };
  }
}
