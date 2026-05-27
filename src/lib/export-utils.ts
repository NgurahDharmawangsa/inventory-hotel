/**
 * Export utilities for data export functionality
 */

export type ExportFormat = "csv" | "json";

/**
 * Convert array of objects to CSV string
 */
export function convertToCSV(data: any[], headers?: string[]): string {
  if (data.length === 0) return "";

  // Get headers from first object if not provided
  const csvHeaders = headers || Object.keys(data[0]);
  
  // Create header row
  const headerRow = csvHeaders.join(",");
  
  // Create data rows
  const dataRows = data.map((row) => {
    return csvHeaders
      .map((header) => {
        const value = row[header];
        // Handle null/undefined
        if (value === null || value === undefined) return "";
        // Escape quotes and wrap in quotes if contains comma or quote
        const stringValue = String(value);
        if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      })
      .join(",");
  });
  
  return [headerRow, ...dataRows].join("\n");
}

/**
 * Download data as file
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export data to CSV file
 */
export function exportToCSV(data: any[], filename: string, headers?: string[]) {
  const csv = convertToCSV(data, headers);
  downloadFile(csv, `${filename}.csv`, "text/csv;charset=utf-8;");
}

/**
 * Export data to JSON file
 */
export function exportToJSON(data: any[], filename: string) {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, `${filename}.json`, "application/json;charset=utf-8;");
}

/**
 * Format date for export
 */
export function formatDateForExport(date: string | Date | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0]; // YYYY-MM-DD format
}

/**
 * Format datetime for export
 */
export function formatDateTimeForExport(date: string | Date | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().replace("T", " ").split(".")[0]; // YYYY-MM-DD HH:mm:ss format
}

/**
 * Prepare data for export by flattening nested objects
 */
export function flattenForExport(data: any[]): any[] {
  return data.map((item) => {
    const flattened: any = {};
    
    Object.keys(item).forEach((key) => {
      const value = item[key];
      
      // Handle nested objects
      if (value && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
        Object.keys(value).forEach((nestedKey) => {
          flattened[`${key}_${nestedKey}`] = value[nestedKey];
        });
      } else if (Array.isArray(value)) {
        // Convert arrays to comma-separated strings
        flattened[key] = value.join(", ");
      } else {
        flattened[key] = value;
      }
    });
    
    return flattened;
  });
}

/**
 * Generate filename with timestamp
 */
export function generateExportFilename(prefix: string): string {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, "-").split("T")[0];
  return `${prefix}_${timestamp}`;
}