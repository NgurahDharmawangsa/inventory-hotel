"use server";

import { supabase } from "@/lib/supabase";

export type DashboardStats = {
  hardware: {
    total: number;
    active: number;
    broken: number;
    repair: number;
    disposed: number;
    recentlyAdded: number;
  };
  software: {
    total: number;
    expiringSoon: number; // within 30 days
    expired: number;
  };
  networking: {
    total: number;
    online: number;
    offline: number;
    maintenance: number;
  };
  security: {
    total: number;
    online: number;
    offline: number;
    maintenance: number;
  };
  hospitality: {
    total: number;
    active: number;
    broken: number;
    repair: number;
  };
  maintenance: {
    total: number;
    pending: number; // date_resolved is null
    resolved: number;
    highPriority: number;
  };
  staff: {
    total: number;
    active: number;
    onLeave: number;
    resigned: number;
  };
  budget: {
    yearlyAllocated: number;
    yearlySpent: number;
    percentageUsed: number;
    remaining: number;
  };
};

export type ActionResponse<T> = 
  | { success: true; data: T } 
  | { success: false; error: string };

/**
 * Fetch comprehensive dashboard statistics
 */
export async function getDashboardStatsAction(): Promise<ActionResponse<DashboardStats>> {
  try {
    const currentYear = new Date().getFullYear();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // Fetch all data in parallel
    const [
      hardwareData,
      softwareData,
      networkingData,
      securityData,
      hospitalityData,
      maintenanceData,
      staffData,
      budgetData,
    ] = await Promise.all([
      // Hardware stats
      supabase.from("hardware").select("status, created_at"),
      
      // Software stats
      supabase.from("software").select("expiration_date"),
      
      // Networking stats
      supabase.from("networking").select("status"),
      
      // Security stats
      supabase.from("security").select("status"),
      
      // Hospitality stats
      supabase.from("hospitality").select("status"),
      
      // Maintenance stats
      supabase.from("maintenance").select("date_resolved, repair_cost"),
      
      // Staff stats
      supabase.from("staff").select("status"),
      
      // Budget stats for current year
      supabase
        .from("budgets")
        .select("total_allocated, total_spent")
        .eq("year", currentYear)
        .single(),
    ]);

    // Process Hardware
    const hardware = hardwareData.data || [];
    const hardwareStats = {
      total: hardware.length,
      active: hardware.filter((h) => h.status === "ACTIVE").length,
      broken: hardware.filter((h) => h.status === "BROKEN").length,
      repair: hardware.filter((h) => h.status === "REPAIR").length,
      disposed: hardware.filter((h) => h.status === "DISPOSED").length,
      recentlyAdded: hardware.filter(
        (h) => new Date(h.created_at) >= oneMonthAgo
      ).length,
    };

    // Process Software
    const software = softwareData.data || [];
    const today = new Date();
    const softwareStats = {
      total: software.length,
      expiringSoon: software.filter((s) => {
        if (!s.expiration_date) return false;
        const expDate = new Date(s.expiration_date);
        return expDate > today && expDate <= thirtyDaysFromNow;
      }).length,
      expired: software.filter((s) => {
        if (!s.expiration_date) return false;
        return new Date(s.expiration_date) < today;
      }).length,
    };

    // Process Networking
    const networking = networkingData.data || [];
    const networkingStats = {
      total: networking.length,
      online: networking.filter((n) => n.status === "ONLINE").length,
      offline: networking.filter((n) => n.status === "OFFLINE").length,
      maintenance: networking.filter((n) => n.status === "MAINTENANCE").length,
    };

    // Process Security
    const security = securityData.data || [];
    const securityStats = {
      total: security.length,
      online: security.filter((s) => s.status === "ONLINE").length,
      offline: security.filter((s) => s.status === "OFFLINE").length,
      maintenance: security.filter((s) => s.status === "MAINTENANCE").length,
    };

    // Process Hospitality
    const hospitality = hospitalityData.data || [];
    const hospitalityStats = {
      total: hospitality.length,
      active: hospitality.filter((h) => h.status === "ACTIVE").length,
      broken: hospitality.filter((h) => h.status === "BROKEN").length,
      repair: hospitality.filter((h) => h.status === "REPAIR").length,
    };

    // Process Maintenance
    const maintenance = maintenanceData.data || [];
    const maintenanceStats = {
      total: maintenance.length,
      pending: maintenance.filter((m) => !m.date_resolved).length,
      resolved: maintenance.filter((m) => m.date_resolved).length,
      highPriority: maintenance.filter(
        (m) => !m.date_resolved && (m.repair_cost || 0) > 1000
      ).length,
    };

    // Process Staff
    const staff = staffData.data || [];
    const staffStats = {
      total: staff.length,
      active: staff.filter((s) => s.status === "ACTIVE").length,
      onLeave: staff.filter((s) => s.status === "ON LEAVE").length,
      resigned: staff.filter((s) => s.status === "RESIGNED").length,
    };

    // Process Budget
    const budget = budgetData.data || { total_allocated: 0, total_spent: 0 };
    const budgetStats = {
      yearlyAllocated: budget.total_allocated || 0,
      yearlySpent: budget.total_spent || 0,
      percentageUsed: budget.total_allocated
        ? Math.round((budget.total_spent / budget.total_allocated) * 100)
        : 0,
      remaining: (budget.total_allocated || 0) - (budget.total_spent || 0),
    };

    const stats: DashboardStats = {
      hardware: hardwareStats,
      software: softwareStats,
      networking: networkingStats,
      security: securityStats,
      hospitality: hospitalityStats,
      maintenance: maintenanceStats,
      staff: staffStats,
      budget: budgetStats,
    };

    return { success: true, data: stats };
  } catch (error: any) {
    console.error("Dashboard stats error:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch dashboard statistics.",
    };
  }
}

/**
 * Fetch expiring software licenses for alerts
 */
export async function getExpiringSoftwareAction(days: number = 30): Promise<ActionResponse<any[]>> {
  try {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    const today = new Date().toISOString().split('T')[0];
    const futureDateStr = futureDate.toISOString().split('T')[0];

    const { data, error } = await supabase
      .from("software")
      .select(`
        id,
        name,
        license_key,
        expiration_date,
        staff:staff_id (
          id,
          full_name,
          department
        ),
        vendor:vendor_id (
          id,
          name
        )
      `)
      .gte("expiration_date", today)
      .lte("expiration_date", futureDateStr)
      .order("expiration_date", { ascending: true });

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch expiring software.",
    };
  }
}

/**
 * Fetch recent activity/changes across all tables
 */
export async function getRecentActivityAction(limit: number = 10): Promise<ActionResponse<any[]>> {
  try {
    // Fetch recent items from multiple tables
    const [hardware, software, maintenance] = await Promise.all([
      supabase
        .from("hardware")
        .select("id, name, category, created_at, updated_at")
        .order("updated_at", { ascending: false })
        .limit(limit),
      
      supabase
        .from("software")
        .select("id, name, created_at, updated_at")
        .order("updated_at", { ascending: false })
        .limit(limit),
      
      supabase
        .from("maintenance")
        .select("id, issue, item_type, created_at, updated_at")
        .order("updated_at", { ascending: false })
        .limit(limit),
    ]);

    // Combine and sort all activities
    const activities = [
      ...(hardware.data || []).map((item) => ({
        ...item,
        type: "hardware",
        title: item.name,
        subtitle: item.category,
      })),
      ...(software.data || []).map((item) => ({
        ...item,
        type: "software",
        title: item.name,
        subtitle: "Software License",
      })),
      ...(maintenance.data || []).map((item) => ({
        ...item,
        type: "maintenance",
        title: item.issue,
        subtitle: item.item_type,
      })),
    ]
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, limit);

    return { success: true, data: activities };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch recent activity.",
    };
  }
}