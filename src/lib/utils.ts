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
 * Format date string to display format
 */
export function formatDate(date: Date = new Date()): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
