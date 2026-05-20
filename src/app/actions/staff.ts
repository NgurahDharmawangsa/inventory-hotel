"use server";

import { revalidatePath } from "next/cache";
import { StaffService } from "@/services/staff.service";

export async function getStaffAction(filters?: { query?: string }) {
  try {
    const data = await StaffService.getAllStaff(filters);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to retrieve employee directory." };
  }
}

export async function getStaffDetailAction(id: string) {
  try {
    const data = await StaffService.getStaffDetailById(id);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to retrieve staff details." };
  }
}

export async function createStaffAction(data: any) {
  try {
    const newStaff = await StaffService.createStaff(data);
    revalidatePath("/staff");
    return { success: true, data: newStaff };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to register employee." };
  }
}

export async function updateStaffAction(id: string, data: any) {
  try {
    const updatedStaff = await StaffService.updateStaff(id, data);
    revalidatePath("/staff");
    return { success: true, data: updatedStaff };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update employee details." };
  }
}

export async function deleteStaffAction(id: string) {
  try {
    await StaffService.deleteStaff(id);
    revalidatePath("/staff");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete employee record." };
  }
}
