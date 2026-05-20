import { supabase } from "@/lib/supabase";
import { EmailAccount, Hardware, Software, Staff, StaffDetail } from "@/types/database.types";

export class StaffRepository {
  /**
   * Fetch all staff members, supporting filters.
   */
  static async findAll(filters?: { query?: string }): Promise<Staff[]> {
    let queryBuilder = supabase
      .from("staff")
      .select("*")
      .order("full_name");

    if (filters?.query) {
      const q = `%${filters.query}%`;
      queryBuilder = queryBuilder.or(
        `employee_id.ilike.${q},full_name.ilike.${q},department.ilike.${q},position.ilike.${q}`
      );
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error("Error in StaffRepository.findAll:", error);
      throw new Error(`Failed to fetch staff members: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Find a staff member by ID.
   */
  static async findById(id: string): Promise<Staff | null> {
    const { data, error } = await supabase
      .from("staff")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Error in StaffRepository.findById:", error);
      throw new Error(`Failed to fetch staff member: ${error.message}`);
    }

    return data as Staff;
  }

  /**
   * Find a staff member with assigned hardware, software, and email accounts.
   */
  static async findDetailById(id: string): Promise<StaffDetail | null> {
    const staff = await this.findById(id);
    if (!staff) {
      return null;
    }

    const [hardwareRes, softwareRes, emailRes] = await Promise.all([
      supabase
        .from("hardware")
        .select("*")
        .eq("staff_id", id)
        .order("name"),
      supabase
        .from("software")
        .select("*")
        .eq("staff_id", id)
        .order("name"),
      supabase
        .from("emails")
        .select("*")
        .eq("staff_id", id)
        .order("email_address")
    ]);

    if (hardwareRes.error) {
      console.error("Error in StaffRepository.findDetailById (hardware):", hardwareRes.error);
      throw new Error(`Failed to fetch assigned hardware: ${hardwareRes.error.message}`);
    }

    if (softwareRes.error) {
      console.error("Error in StaffRepository.findDetailById (software):", softwareRes.error);
      throw new Error(`Failed to fetch assigned software: ${softwareRes.error.message}`);
    }

    if (emailRes.error) {
      console.error("Error in StaffRepository.findDetailById (emails):", emailRes.error);
      throw new Error(`Failed to fetch assigned emails: ${emailRes.error.message}`);
    }

    return {
      ...staff,
      hardware: hardwareRes.data || [],
      software: softwareRes.data || [],
      emails: emailRes.data || [],
    };
  }

  /**
   * Find a staff member by Employee ID.
   */
  static async findByEmployeeId(employeeId: string): Promise<Staff | null> {
    const { data, error } = await supabase
      .from("staff")
      .select("*")
      .eq("employee_id", employeeId.trim().toUpperCase());

    if (error) {
      console.error("Error in StaffRepository.findByEmployeeId:", error);
      throw new Error(`Failed to query staff by Employee ID: ${error.message}`);
    }

    if (data && data.length > 0) {
      return data[0] as Staff;
    }

    return null;
  }

  /**
   * Create a new staff member, ensuring uniqueness.
   */
  static async create(data: Omit<Staff, "id" | "created_at" | "updated_at">): Promise<Staff> {
    const existing = await this.findByEmployeeId(data.employee_id);
    if (existing) {
      throw new Error(`Employee ID ${data.employee_id} is already assigned to ${existing.full_name}.`);
    }

    const { data: newStaff, error } = await supabase
      .from("staff")
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error("Error in StaffRepository.create:", error);
      throw new Error(`Failed to register staff: ${error.message}`);
    }

    return newStaff as Staff;
  }

  /**
   * Update an existing staff member.
   */
  static async update(id: string, data: Partial<Omit<Staff, "id" | "created_at" | "updated_at">>): Promise<Staff> {
    if (data.employee_id !== undefined) {
      const existing = await this.findByEmployeeId(data.employee_id);
      if (existing && existing.id !== id) {
        throw new Error(`Employee ID ${data.employee_id} is already assigned to ${existing.full_name}.`);
      }
    }

    const { data: updatedStaff, error } = await supabase
      .from("staff")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error in StaffRepository.update:", error);
      throw new Error(`Failed to update staff member: ${error.message}`);
    }

    return updatedStaff as Staff;
  }

  /**
   * Delete a staff member.
   */
  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("staff")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error in StaffRepository.delete:", error);
      throw new Error(`Failed to delete staff member: ${error.message}`);
    }
  }
}
