/**
 * Common regex and basic validation utilities
 */

export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_ID: /^(^\+62\s?|^0)(\d{3,4}-?){2}\d{3,4}$/,
  NIK: /^\d{16}$/,
  NO_KK: /^\d{16}$/,
};

export function isValidEmail(email: string): boolean {
  return REGEX.EMAIL.test(email);
}

export function isValidIndonesianPhone(phone: string): boolean {
  return REGEX.PHONE_ID.test(phone);
}
