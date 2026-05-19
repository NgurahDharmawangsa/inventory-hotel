"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import { MaintenanceService } from "@/services/maintenance.service";

export type MaintenanceWithItemDetails = any & {
  itemName: string;
  itemCode: string | null;
};

export async function getMaintenanceAction(filters?: { query?: string }) {
  try {
    // 1. Fetch raw logs
    const rawLogs = await MaintenanceService.getAllLogs();

    // 2. Fetch all registered assets across the 5 categories
    const [hwRes, swRes, nwRes, secRes, hospRes] = await Promise.all([
      supabase.from("hardware").select("id, name, item_code"),
      supabase.from("software").select("id, name, item_code"),
      supabase.from("networking").select("id, device_type, item_code"),
      supabase.from("security").select("id, device_type, item_code"),
      supabase.from("hospitality").select("id, device_type, item_code")
    ]);

    // 3. Compile asset map
    const assetMap: Record<string, { itemName: string; itemCode: string | null }> = {};

    if (hwRes.data) {
      hwRes.data.forEach(item => {
        assetMap[item.id] = { itemName: item.name, itemCode: item.item_code || null };
      });
    }
    if (swRes.data) {
      swRes.data.forEach(item => {
        assetMap[item.id] = { itemName: item.name, itemCode: item.item_code || null };
      });
    }
    if (nwRes.data) {
      nwRes.data.forEach(item => {
        assetMap[item.id] = { itemName: item.device_type, itemCode: item.item_code || null };
      });
    }
    if (secRes.data) {
      secRes.data.forEach(item => {
        assetMap[item.id] = { itemName: item.device_type, itemCode: item.item_code || null };
      });
    }
    if (hospRes.data) {
      hospRes.data.forEach(item => {
        assetMap[item.id] = { itemName: item.device_type, itemCode: item.item_code || null };
      });
    }

    // 4. Map details to logs
    let mappedLogs: MaintenanceWithItemDetails[] = rawLogs.map(log => ({
      ...log,
      itemName: assetMap[log.item_id]?.itemName || "Unknown Asset",
      itemCode: assetMap[log.item_id]?.itemCode || null
    }));

    // 5. Apply query filter if present
    if (filters?.query) {
      const q = filters.query.toLowerCase().trim();
      mappedLogs = mappedLogs.filter(log => 
        log.issue.toLowerCase().includes(q) ||
        log.item_type.toLowerCase().includes(q) ||
        log.itemName.toLowerCase().includes(q) ||
        (log.itemCode && log.itemCode.toLowerCase().includes(q))
      );
    }

    return { success: true, data: mappedLogs };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to retrieve maintenance logs." };
  }
}

export async function getMaintenanceAssetsAction() {
  try {
    const [hwRes, swRes, nwRes, secRes, hospRes] = await Promise.all([
      supabase.from("hardware").select("id, name, item_code").order("name"),
      supabase.from("software").select("id, name, item_code").order("name"),
      supabase.from("networking").select("id, device_type, item_code").order("device_type"),
      supabase.from("security").select("id, device_type, item_code").order("device_type"),
      supabase.from("hospitality").select("id, device_type, item_code").order("device_type")
    ]);

    const hardware = (hwRes.data || []).map(x => ({ id: x.id, name: x.name, code: x.item_code || null }));
    const software = (swRes.data || []).map(x => ({ id: x.id, name: x.name, code: x.item_code || null }));
    const networking = (nwRes.data || []).map(x => ({ id: x.id, name: x.device_type, code: x.item_code || null }));
    const security = (secRes.data || []).map(x => ({ id: x.id, name: x.device_type, code: x.item_code || null }));
    const hospitality = (hospRes.data || []).map(x => ({ id: x.id, name: x.device_type, code: x.item_code || null }));

    return {
      success: true,
      data: {
        hardware,
        software,
        networking,
        security,
        hospitality
      }
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to retrieve registered assets." };
  }
}

export async function createMaintenanceAction(data: any) {
  try {
    const newLog = await MaintenanceService.createLog(data);
    revalidatePath("/maintenance");
    return { success: true, data: newLog };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create maintenance log." };
  }
}

export async function updateMaintenanceAction(id: string, data: any) {
  try {
    const updatedLog = await MaintenanceService.updateLog(id, data);
    revalidatePath("/maintenance");
    return { success: true, data: updatedLog };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update maintenance log." };
  }
}

export async function deleteMaintenanceAction(id: string) {
  try {
    await MaintenanceService.deleteLog(id);
    revalidatePath("/maintenance");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete maintenance log." };
  }
}
