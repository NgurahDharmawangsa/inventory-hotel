import { createClient } from "@/lib/supabase/client";
import { Department } from "@/types/database.types";

const supabase = createClient();

export class DepartmentsRepository {
  /**
   * Fetch all departments with optional search filter.
   */
  static async findAll(filters?: { query?: string }): Promise<Department[]> {
    let queryBuilder = supabase
      .from("departments")
      .select("*")
      .order("name", { ascending: true });

    if (filters?.query) {
      queryBuilder = queryBuilder.or(
        `name.ilike.%${filters.query}%,description.ilike.%${filters.query}%`
      );
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error("Error in DepartmentsRepository.findAll:", error);
      throw new Error(`Failed to fetch departments: ${error.message}`);
    }

    return (data || []) as Department[];
  }

  /**
   * Find a single department by ID.
   */
  static async findById(id: string): Promise<Department | null> {
    const { data, error } = await supabase
      .from("departments")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error in DepartmentsRepository.findById:", error);
      throw new Error(`Failed to fetch department: ${error.message}`);
    }

    return data as Department | null;
  }

  /**
   * Create a new department.
   */
  static async create(data: Omit<Department, "id" | "created_at" | "updated_at">): Promise<Department> {
    const { data: newDepartment, error } = await supabase
      .from("departments")
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error("Error in DepartmentsRepository.create:", error);
      throw new Error(`Failed to create department: ${error.message}`);
    }

    return newDepartment as Department;
  }

  /**
   * Update an existing department.
   */
  static async update(
    id: string,
    data: Partial<Omit<Department, "id" | "created_at" | "updated_at">>
  ): Promise<Department> {
    const updateData = {
      ...data,
      updated_at: new Date().toISOString(),
    };

    const { data: updatedDepartment, error } = await supabase
      .from("departments")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error in DepartmentsRepository.update:", error);
      throw new Error(`Failed to update department: ${error.message}`);
    }

    return updatedDepartment as Department;
  }

  /**
   * Delete a department.
   */
  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("departments")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error in DepartmentsRepository.delete:", error);
      throw new Error(`Failed to delete department: ${error.message}`);
    }
  }

  /**
   * Check if department name already exists (for validation).
   */
  static async existsByName(name: string, excludeId?: string): Promise<boolean> {
    let query = supabase
      .from("departments")
      .select("id")
      .ilike("name", name);

    if (excludeId) {
      query = query.neq("id", excludeId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error in DepartmentsRepository.existsByName:", error);
      return false;
    }

    return (data?.length ?? 0) > 0;
  }
}