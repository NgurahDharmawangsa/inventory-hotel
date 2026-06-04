import { supabase } from "@/lib/supabase";
import { EmailAccount } from "@/types/database.types";

export class EmailRepository {
  /**
   * Fetch all email accounts, resolving staff associations.
   */
  static async findAll(filters?: { query?: string }): Promise<any[]> {
    let queryBuilder = supabase
      .from("emails")
      .select(`
        *,
        staff:staff_id (
          id,
          employee_id,
          full_name,
          department_id (
            id,
            name
          )
        )
      `)
      .order("email_address");

    const { data, error } = await queryBuilder;

    if (error) {
      console.error("Error in EmailRepository.findAll:", error);
      throw new Error(`Failed to fetch email accounts: ${error.message}`);
    }

    if (filters?.query && data) {
      const q = filters.query.trim().toLowerCase();
      return data.filter(item => 
        item.email_address.toLowerCase().includes(q) ||
        item.platform.toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q) ||
        (item.staff && (
          item.staff.full_name.toLowerCase().includes(q) ||
          item.staff.employee_id.toLowerCase().includes(q)
        ))
      );
    }

    return data || [];
  }

  /**
   * Find an email account by ID.
   */
  static async findById(id: string): Promise<EmailAccount | null> {
    const { data, error } = await supabase
      .from("emails")
      .select(`
          *,
            staff:staff_id (
              id,
              full_name,
              employee_id,
              department_id (
                id,
                name
              )
            )
        `)
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Error in EmailRepository.findById:", error);
      throw new Error(`Failed to fetch email account: ${error.message}`);
    }

    return data as EmailAccount;
  }

  /**
   * Find an email account by address.
   */
  static async findByAddress(emailAddress: string): Promise<EmailAccount | null> {
    const { data, error } = await supabase
      .from("emails")
      .select("*")
      .eq("email_address", emailAddress.trim().toLowerCase());

    if (error) {
      console.error("Error in EmailRepository.findByAddress:", error);
      throw new Error(`Failed to query email by address: ${error.message}`);
    }

    if (data && data.length > 0) {
      return data[0] as EmailAccount;
    }

    return null;
  }

  /**
   * Create a new email account, enforcing unique constraints.
   */
  static async create(data: Omit<EmailAccount, "id" | "created_at" | "updated_at">): Promise<EmailAccount> {
    const existing = await this.findByAddress(data.email_address);
    if (existing) {
      throw new Error(`Email address ${data.email_address} already exists in the system.`);
    }

    const { data: newEmail, error } = await supabase
      .from("emails")
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error("Error in EmailRepository.create:", error);
      throw new Error(`Failed to register email account: ${error.message}`);
    }

    return newEmail as EmailAccount;
  }

  /**
   * Update an existing email account.
   */
  static async update(id: string, data: Partial<Omit<EmailAccount, "id" | "created_at" | "updated_at">>): Promise<EmailAccount> {
    if (data.email_address !== undefined) {
      const existing = await this.findByAddress(data.email_address);
      if (existing && existing.id !== id) {
        throw new Error(`Email address ${data.email_address} already exists in the system.`);
      }
    }

    const { data: updatedEmail, error } = await supabase
      .from("emails")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error in EmailRepository.update:", error);
      throw new Error(`Failed to update email account: ${error.message}`);
    }

    return updatedEmail as EmailAccount;
  }

  /**
   * Delete an email account.
   */
  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("emails")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error in EmailRepository.delete:", error);
      throw new Error(`Failed to delete email account: ${error.message}`);
    }
  }
}
