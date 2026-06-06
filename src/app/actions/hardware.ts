"use server";

import { revalidatePath } from "next/cache";
import { HardwareService } from "@/services/hardware.service";
import { LocationRoomOption } from "@/repositories/hardware.repository";
import { supabase } from "@/lib/supabase";

export type ActionResponse<T> = 
  | { success: true; data: T } 
  | { success: false; error: string };

/**
 * Action to fetch all hardware assets based on query, status, and location.
 */
export async function getHardwareAction(filters?: { query?: string; status?: string; location?: string; department?: string }): Promise<ActionResponse<any>> {
  try {
    const data = await HardwareService.getAllHardware(filters);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}

/**
 * Action to create a new hardware asset.
 */
export async function createHardwareAction(data: any): Promise<ActionResponse<any>> {
  try {
    const newAsset = await HardwareService.createHardware(data);
    revalidatePath("/hardware");
    return { success: true, data: newAsset };
  } catch (error: any) {
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}

/**
 * Action to update an existing hardware asset.
 */
export async function updateHardwareAction(id: string, data: any): Promise<ActionResponse<any>> {
  try {
    const updatedAsset = await HardwareService.updateHardware(id, data);
    revalidatePath("/hardware");
    return { success: true, data: updatedAsset };
  } catch (error: any) {
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}

/**
 * Action to delete a hardware asset.
 */
export async function deleteHardwareAction(id: string): Promise<ActionResponse<void>> {
  try {
    await HardwareService.deleteHardware(id);
    revalidatePath("/hardware");
    return { success: true, data: undefined };
  } catch (error: any) {
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}

/**
 * Action to fetch distinct hardware locations.
 */
export async function getHardwareLocationsAction(): Promise<ActionResponse<LocationRoomOption[]>> {
  try {
    const locations = await HardwareService.getDistinctLocations();
    return { success: true, data: locations };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch hardware locations." };
  }
}

/**
 * Action to fetch distinct staff departments (for location dropdown suggestions).
 */
export async function getHardwareDepartmentOptionsAction(): Promise<ActionResponse<string[]>> {
  try {
    const departments = await HardwareService.getStaffDepartments();
    return { success: true, data: departments };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch department options." };
  }
}

/**
 * Action to fetch a single hardware asset detail by ID.
 */
export async function getHardwareDetailAction(id: string): Promise<ActionResponse<any>> {
  try {
    const data = await HardwareService.getHardwareById(id);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch hardware detail." };
  }
}

/**
 * Action to fetch auxiliary relation tables (active staff and vendors) for select lists.
 */
export async function getRelationsAction(): Promise<ActionResponse<{ staff: any[]; vendors: any[] }>> {
  try {
    // Fetch all active staff
    const { data: staff, error: staffError } = await supabase
      .from("staff")
      .select("id, full_name, department_id, department:department_id (id, name)")
      .eq("status", "ACTIVE")
      .order("full_name", { ascending: true });

    if (staffError) throw staffError;

    // Fetch all vendors
    const { data: vendors, error: vendorsError } = await supabase
      .from("vendors")
      .select("id, name")
      .order("name", { ascending: true });

    if (vendorsError) throw vendorsError;

    return { 
      success: true, 
      data: { 
        staff: staff || [], 
        vendors: vendors || [] 
      } 
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch active relations." };
  }
}
