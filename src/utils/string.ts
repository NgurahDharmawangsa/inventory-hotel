/**
 * Mask a license key to hide sensitive parts, e.g. "•••••••••••EF90".
 */
export function maskLicenseKey(key: string | null | undefined): string {
  if (!key) return "No License Key";
  const trimmed = key.trim();
  if (trimmed.length <= 6) return trimmed;
  // Keep the last 4 characters visible, mask the rest with bullet characters
  const visibleLen = Math.min(4, Math.floor(trimmed.length / 3));
  const maskedPart = "•".repeat(trimmed.length - visibleLen);
  const visiblePart = trimmed.slice(-visibleLen);
  return `${maskedPart}${visiblePart}`;
}
