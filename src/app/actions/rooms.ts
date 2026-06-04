"use server";

import { RoomsService } from "@/services/rooms.service";
import { revalidatePath } from "next/cache";

export type ActionResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Action to fetch all rooms with optional filters.
 */
export async function getRoomsAction(filters?: { query?: string; status?: string; room_type?: string }): Promise<ActionResponse<any>> {
  try {
    const rooms = await RoomsService.getAllRooms(filters);
    return { success: true, data: rooms };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to retrieve rooms." };
  }
}

/**
 * Action to fetch a single room by ID.
 */
export async function getRoomByIdAction(id: string): Promise<ActionResponse<any>> {
  try {
    const room = await RoomsService.getRoomById(id);
    return { success: true, data: room };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to retrieve room." };
  }
}

/**
 * Action to create a new room.
 */
export async function createRoomAction(data: any): Promise<ActionResponse<any>> {
  try {
    const newRoom = await RoomsService.createRoom(data);
    revalidatePath("/rooms");
    return { success: true, data: newRoom };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create room." };
  }
}

/**
 * Action to update an existing room.
 */
export async function updateRoomAction(id: string, data: any): Promise<ActionResponse<any>> {
  try {
    const updatedRoom = await RoomsService.updateRoom(id, data);
    revalidatePath("/rooms");
    return { success: true, data: updatedRoom };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update room." };
  }
}

/**
 * Action to delete a room.
 */
export async function deleteRoomAction(id: string): Promise<ActionResponse> {
  try {
    await RoomsService.deleteRoom(id);
    revalidatePath("/rooms");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete room." };
  }
}

/**
 * Action to fetch distinct room types.
 */
export async function getRoomTypesAction(): Promise<ActionResponse<string[]>> {
  try {
    const types = await RoomsService.getDistinctRoomTypes();
    return { success: true, data: types };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to retrieve room types." };
  }
}

/**
 * Action to fetch distinct floors.
 */
export async function getRoomFloorsAction(): Promise<ActionResponse<string[]>> {
  try {
    const floors = await RoomsService.getDistinctFloors();
    return { success: true, data: floors };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to retrieve floors." };
  }
}