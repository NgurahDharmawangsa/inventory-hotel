import { EmailAccount } from "@/types/database.types";

export class EmailValidator {
  private static validStatuses: Array<EmailAccount["status"]> = ["ACTIVE", "SUSPENDED", "DELETED"];

  /**
   * Validate email format helper.
   */
  private static isValidEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  /**
   * Validate parameters for registering an Email Account.
   */
  static validateCreate(data: any): Omit<EmailAccount, "id" | "created_at" | "updated_at"> {
    if (!data.email_address?.trim()) {
      throw new Error("Email address is required.");
    }
    const emailAddress = data.email_address.trim().toLowerCase();
    if (!this.isValidEmail(emailAddress)) {
      throw new Error("Email address format is invalid.");
    }

    if (!data.platform?.trim()) {
      throw new Error("Email platform provider is required.");
    }

    const status = data.status || "ACTIVE";
    if (!this.validStatuses.includes(status)) {
      throw new Error("Invalid email account status. Allowed: ACTIVE, SUSPENDED, DELETED.");
    }

    return {
      email_address: emailAddress,
      platform: data.platform.trim(),
      staff_id: data.staff_id || null,
      status
    };
  }

  /**
   * Validate parameters for updating an Email Account.
   */
  static validateUpdate(data: any): Partial<Omit<EmailAccount, "id" | "created_at" | "updated_at">> {
    const sanitizedData: Partial<Omit<EmailAccount, "id" | "created_at" | "updated_at">> = {};

    if (data.email_address !== undefined) {
      if (!data.email_address?.trim()) {
        throw new Error("Email address cannot be empty.");
      }
      const emailAddress = data.email_address.trim().toLowerCase();
      if (!this.isValidEmail(emailAddress)) {
        throw new Error("Email address format is invalid.");
      }
      sanitizedData.email_address = emailAddress;
    }

    if (data.platform !== undefined) {
      if (!data.platform?.trim()) {
        throw new Error("Email platform provider cannot be empty.");
      }
      sanitizedData.platform = data.platform.trim();
    }

    if (data.staff_id !== undefined) {
      sanitizedData.staff_id = data.staff_id || null;
    }

    if (data.status !== undefined) {
      if (!this.validStatuses.includes(data.status)) {
        throw new Error("Invalid email account status. Allowed: ACTIVE, SUSPENDED, DELETED.");
      }
      sanitizedData.status = data.status;
    }

    return sanitizedData;
  }
}
