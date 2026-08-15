"use server";

import { revalidatePath } from "next/cache";
import { SecurityService } from "@/services/security.service";
import { LocationRoomOption } from "@/repositories/security.repository";

export type ActionResponse<T> = 
  | { success: true; data: T } 
  | { success: false; error: string };

export async function getSecurityAction(filters?: { query?: string; location?: string; device_type?: string; status?: string }): Promise<ActionResponse<any>> {
  try {
    const data = await SecurityService.getAllDevices({
      query: filters?.query?.trim(),
      location: filters?.location || undefined,
      device_type: filters?.device_type || undefined,
      status: filters?.status || undefined,
    });
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to retrieve security devices." };
  }
}

export async function getSecurityLocationsAction(): Promise<ActionResponse<LocationRoomOption[]>> {
  try {
    const locations = await SecurityService.getDistinctLocations();
    return { success: true, data: locations };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to fetch security locations." };
  }
}

export async function createSecurityAction(data: any): Promise<ActionResponse<any>> {
  try {
    const newDevice = await SecurityService.createDevice(data);
    revalidatePath("/security");
    return { success: true, data: newDevice };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to register security device." };
  }
}

export async function updateSecurityAction(id: string, data: any): Promise<ActionResponse<any>> {
  try {
    const updatedDevice = await SecurityService.updateDevice(id, data);
    revalidatePath("/security");
    return { success: true, data: updatedDevice };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update security device." };
  }
}

export async function deleteSecurityAction(id: string): Promise<ActionResponse<void>> {
  try {
    await SecurityService.deleteDevice(id);
    revalidatePath("/security");
    return { success: true, data: undefined };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete security device." };
  }
}
