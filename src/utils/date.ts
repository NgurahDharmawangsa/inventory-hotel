/**
 * Format a date string (YYYY-MM-DD) into a human-readable format.
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "N/A";
  }
}

/**
 * Calculate the remaining days until the expiration date.
 * Returns negative if expired, and null if no date is provided.
 */
export function getDaysRemaining(dateString: string | null | undefined): number | null {
  if (!dateString) return null;
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expDate = new Date(dateString);
    expDate.setHours(0, 0, 0, 0);
    
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch {
    return null;
  }
}

/**
 * Check if the expiration date is expired.
 */
export function isExpired(dateString: string | null | undefined): boolean {
  const days = getDaysRemaining(dateString);
  return days !== null && days < 0;
}

/**
 * Check if the expiration date is near (within the threshold of days).
 */
export function isNearExpiration(dateString: string | null | undefined, thresholdDays: number = 30): boolean {
  const days = getDaysRemaining(dateString);
  return days !== null && days >= 0 && days <= thresholdDays;
}
