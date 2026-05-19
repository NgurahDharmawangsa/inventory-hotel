"use server";

import { revalidatePath } from "next/cache";
import { HospitalityService } from "@/services/hospitality.service";

export async function getHospitalityAction(filters?: { query?: string }) {
  try {
    const data = await HospitalityService.getAllDevices(filters);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to retrieve hospitality devices." };
  }
}

export async function createHospitalityAction(data: any) {
  try {
    const newDevice = await HospitalityService.createDevice(data);
    revalidatePath("/hospitality");
    return { success: true, data: newDevice };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to register hospitality device." };
  }
}

export async function updateHospitalityAction(id: string, data: any) {
  try {
    const updatedDevice = await HospitalityService.updateDevice(id, data);
    revalidatePath("/hospitality");
    return { success: true, data: updatedDevice };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update hospitality device." };
  }
}

export async function deleteHospitalityAction(id: string) {
  try {
    await HospitalityService.deleteDevice(id);
    revalidatePath("/hospitality");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete hospitality device." };
  }
}
