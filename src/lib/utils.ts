/**
 * Utility functions for SpatioAgri Fertilizer Manager
 */

/**
 * Format a number or string as Sri Lankan Rupees (LKR)
 */
export function formatLKR(amount: number | string): string {
  if (typeof amount === "string" && amount.startsWith("LKR")) {
    return amount;
  }
  const numericValue =
    typeof amount === "string" ? parseFloat(amount.replace(/[^0-9.-]+/g, "")) : amount;
  if (isNaN(numericValue)) return "LKR 0";
  return `LKR ${numericValue.toLocaleString("en-US")}`;
}

/**
 * Mask National Identity Card (NIC) for privacy protection
 */
export function maskNIC(nic: string): string {
  if (!nic || nic.length < 8) return nic;
  return `${nic.slice(0, 4)}••••${nic.slice(-4)}`;
}

/**
 * Format date string or Date object to standard display format (e.g. "Oct 24, 2026")
 */
export function formatDate(
  date?: Date | string | number | null,
  options?: Intl.DateTimeFormatOptions,
): string {
  if (!date) return "N/A";
  try {
    const d = typeof date === "object" && date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return String(date);
    return d.toLocaleDateString(
      "en-US",
      options || {
        month: "short",
        day: "numeric",
        year: "numeric",
      },
    );
  } catch {
    return String(date);
  }
}

/**
 * Format date with full month name (e.g. "October 24, 2026")
 */
export function formatFullDate(date?: Date | string | number | null): string {
  return formatDate(date, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format service type string into Title Case (e.g. "FERTILIZER_SPRAY" -> "Fertilizer Spray")
 */
export function formatServiceType(service?: string): string {
  if (!service) return "General";
  return service
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Format GPS decimal coordinates to 4 decimal places string
 */
export function formatCoordinates(lat?: number, lng?: number): string {
  if (lat === undefined || lng === undefined || isNaN(lat) || isNaN(lng)) return "N/A";
  return `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`;
}
