"use server";

import { revalidatePath } from "next/cache";
import { VendorService } from "@/services/vendor.service";

export async function getVendorsAction(filters?: { query?: string }) {
  try {
    const data = await VendorService.getAllVendors(filters);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to retrieve vendors list." };
  }
}

export async function createVendorAction(data: any) {
  try {
    const newVendor = await VendorService.createVendor(data);
    revalidatePath("/vendors");
    return { success: true, data: newVendor };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create vendor record." };
  }
}

export async function updateVendorAction(id: string, data: any) {
  try {
    const updatedVendor = await VendorService.updateVendor(id, data);
    revalidatePath("/vendors");
    return { success: true, data: updatedVendor };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update vendor record." };
  }
}

export async function deleteVendorAction(id: string) {
  try {
    await VendorService.deleteVendor(id);
    revalidatePath("/vendors");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete vendor record." };
  }
}
