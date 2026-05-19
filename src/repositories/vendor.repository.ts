import { supabase } from "@/lib/supabase";
import { Vendor } from "@/types/database.types";

export class VendorRepository {
  /**
   * Fetch all vendors, supporting search filters.
   */
  static async findAll(filters?: { query?: string }): Promise<Vendor[]> {
    let queryBuilder = supabase
      .from("vendors")
      .select("*")
      .order("name");

    if (filters?.query) {
      const q = `%${filters.query}%`;
      queryBuilder = queryBuilder.or(
        `name.ilike.${q},contact_person.ilike.${q},phone.ilike.${q},email.ilike.${q},address.ilike.${q}`
      );
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error("Error in VendorRepository.findAll:", error);
      throw new Error(`Failed to fetch vendors: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Find a single vendor by ID.
   */
  static async findById(id: string): Promise<Vendor | null> {
    const { data, error } = await supabase
      .from("vendors")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Error in VendorRepository.findById:", error);
      throw new Error(`Failed to fetch vendor: ${error.message}`);
    }

    return data as Vendor;
  }

  /**
   * Create a new vendor.
   */
  static async create(data: Omit<Vendor, "id" | "created_at" | "updated_at">): Promise<Vendor> {
    const { data: newVendor, error } = await supabase
      .from("vendors")
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error("Error in VendorRepository.create:", error);
      throw new Error(`Failed to create vendor record: ${error.message}`);
    }

    return newVendor as Vendor;
  }

  /**
   * Update an existing vendor.
   */
  static async update(id: string, data: Partial<Omit<Vendor, "id" | "created_at" | "updated_at">>): Promise<Vendor> {
    const { data: updatedVendor, error } = await supabase
      .from("vendors")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error in VendorRepository.update:", error);
      throw new Error(`Failed to update vendor record: ${error.message}`);
    }

    return updatedVendor as Vendor;
  }

  /**
   * Delete a vendor.
   */
  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("vendors")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error in VendorRepository.delete:", error);
      throw new Error(`Failed to delete vendor record: ${error.message}`);
    }
  }
}
