"use server";

import { revalidatePath } from "next/cache";
import { NetworkingService } from "@/services/networking.service";
import { LocationRoomOption } from "@/repositories/networking.repository";

export type ActionResponse<T> = 
  | { success: true; data: T } 
  | { success: false; error: string };

export async function getNetworkingAction(filters?: { query?: string; location?: string }): Promise<ActionResponse<any>> {
  try {
    const data = await NetworkingService.getAllDevices(filters);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to retrieve networking devices." };
  }
}

export async function getNetworkingLocationsAction(): Promise<ActionResponse<LocationRoomOption[]>> {
  try {
    const locations = await NetworkingService.getDistinctLocations();
    return { success: true, data: locations };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to fetch networking locations." };
  }
}

export async function createNetworkingAction(data: any): Promise<ActionResponse<any>> {
  try {
    const newDevice = await NetworkingService.createDevice(data);
    revalidatePath("/networking");
    return { success: true, data: newDevice };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to register networking device." };
  }
}

export async function updateNetworkingAction(id: string, data: any): Promise<ActionResponse<any>> {
  try {
    const updatedDevice = await NetworkingService.updateDevice(id, data);
    revalidatePath("/networking");
    return { success: true, data: updatedDevice };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update networking device." };
  }
}

export async function deleteNetworkingAction(id: string): Promise<ActionResponse<void>> {
  try {
    await NetworkingService.deleteDevice(id);
    revalidatePath("/networking");
    return { success: true, data: undefined };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete networking device." };
  }
}
