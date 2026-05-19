"use server";

import { revalidatePath } from "next/cache";
import { EmailService } from "@/services/email.service";

export async function getEmailsAction(filters?: { query?: string }) {
  try {
    const data = await EmailService.getAllEmails(filters);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to retrieve email accounts." };
  }
}

export async function createEmailAction(data: any) {
  try {
    const newEmail = await EmailService.createEmail(data);
    revalidatePath("/emails");
    return { success: true, data: newEmail };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to register email account." };
  }
}

export async function updateEmailAction(id: string, data: any) {
  try {
    const updatedEmail = await EmailService.updateEmail(id, data);
    revalidatePath("/emails");
    return { success: true, data: updatedEmail };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update email account details." };
  }
}

export async function deleteEmailAction(id: string) {
  try {
    await EmailService.deleteEmail(id);
    revalidatePath("/emails");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete email account." };
  }
}
