import { EmailRepository } from "@/repositories/email.repository";
import { EmailValidator } from "@/validators/email.validator";
import { EmailAccount } from "@/types/database.types";

export class EmailService {
  /**
   * Fetch all email accounts.
   */
  static async getAllEmails(filters?: { query?: string }): Promise<any[]> {
    return await EmailRepository.findAll(filters);
  }

  /**
   * Fetch a single email account by ID.
   */
  static async getEmailById(id: string): Promise<EmailAccount | null> {
    if (!id) {
      throw new Error("Email ID is required.");
    }
    return await EmailRepository.findById(id);
  }

  /**
   * Register a new corporate email account.
   */
  static async createEmail(data: any): Promise<EmailAccount> {
    const validatedData = EmailValidator.validateCreate(data);
    return await EmailRepository.create(validatedData);
  }

  /**
   * Update an existing email account.
   */
  static async updateEmail(id: string, data: any): Promise<EmailAccount> {
    if (!id) {
      throw new Error("Email ID is required for update.");
    }
    const validatedData = EmailValidator.validateUpdate(data);
    return await EmailRepository.update(id, validatedData);
  }

  /**
   * Delete an email account.
   */
  static async deleteEmail(id: string): Promise<void> {
    if (!id) {
      throw new Error("Email ID is required for deletion.");
    }
    await EmailRepository.delete(id);
  }
}
