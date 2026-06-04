"use server";

import { LocationsService } from "@/services/locations.service";
import { revalidatePath } from "next/cache";

export type ActionResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Action to fetch all locations with optional filters.
 */
export async function getLocationsAction(filters?: { query?: string; type?: string }): Promise<ActionResponse<any>> {
  try {
    const locations = await LocationsService.getAllLocations(filters);
    return { success: true, data: locations };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to retrieve locations." };
  }
}

/**
 * Action to fetch a single location by ID.
 */
export async function getLocationByIdAction(id: string): Promise<ActionResponse<any>> {
  try {
    const location = await LocationsService.getLocationById(id);
    return { success: true, data: location };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to retrieve location." };
  }
}

/**
 * Action to create a new location.
 */
export async function createLocationAction(data: any): Promise<ActionResponse<any>> {
  try {
    const newLocation = await LocationsService.createLocation(data);
    revalidatePath("/locations");
    return { success: true, data: newLocation };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create location." };
  }
}

/**
 * Action to update an existing location.
 */
export async function updateLocationAction(id: string, data: any): Promise<ActionResponse<any>> {
  try {
    const updatedLocation = await LocationsService.updateLocation(id, data);
    revalidatePath("/locations");
    return { success: true, data: updatedLocation };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update location." };
  }
}

/**
 * Action to delete a location.
 */
export async function deleteLocationAction(id: string): Promise<ActionResponse> {
  try {
    await LocationsService.deleteLocation(id);
    revalidatePath("/locations");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete location." };
  }
}

/**
 * Action to fetch distinct location types.
 */
export async function getLocationTypesAction(): Promise<ActionResponse<string[]>> {
  try {
    const types = await LocationsService.getDistinctTypes();
    return { success: true, data: types };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to retrieve location types." };
  }
}