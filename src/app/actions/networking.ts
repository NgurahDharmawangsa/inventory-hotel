"use server";

import { revalidatePath } from "next/cache";
import { NetworkingService } from "@/services/networking.service";

export async function getNetworkingAction(filters?: { query?: string }) {
  try {
    const data = await NetworkingService.getAllDevices(filters);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to retrieve networking devices." };
  }
}

export async function createNetworkingAction(data: any) {
  try {
    const newDevice = await NetworkingService.createDevice(data);
    revalidatePath("/networking");
    return { success: true, data: newDevice };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to register networking device." };
  }
}

export async function updateNetworkingAction(id: string, data: any) {
  try {
    const updatedDevice = await NetworkingService.updateDevice(id, data);
    revalidatePath("/networking");
    return { success: true, data: updatedDevice };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update networking device." };
  }
}

export async function deleteNetworkingAction(id: string) {
  try {
    await NetworkingService.deleteDevice(id);
    revalidatePath("/networking");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete networking device." };
  }
}
