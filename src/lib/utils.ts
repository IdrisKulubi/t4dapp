import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely converts a value to a Date object
 * @param value - The value to convert (string, Date, or other)
 * @returns Date object or null if conversion fails
 */
export function safeToDate(value: unknown): Date | null {
  if (!value) return null;
  
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }
  
  if (typeof value === 'string') {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }
  
  return null;
}

/**
 * Generates a random 6-digit verification code.
 * @returns A string representing the 6-digit code.
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
