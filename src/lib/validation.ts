/**
 * Validates Indian mobile numbers.
 * Supports formats: +919876543210, 9876543210, 09876543210, +91-9876543210
 * Rule: 10 digits starting with 6, 7, 8, or 9.
 */
export const INDIAN_MOBILE_REGEX = /^(?:(?:\+|0{0,2})91[\s-]?)?0?[6789]\d{9}$/;

export const isValidIndianMobile = (phone: string): boolean => {
    // Remove all whitespace and hyphens for a cleaner check if needed,
    // but the regex above handles common formats including spaces and hyphens.
    return INDIAN_MOBILE_REGEX.test(phone.trim());
};

export const formatIndianMobile = (phone: string): string => {
    // Optional: add a utility to normalize numbers to +91XXXXXXXXXX format
    const cleaned = phone.replace(/[^\d+]/g, '');
    if (cleaned.length === 10) return `+91${cleaned}`;
    if (cleaned.length === 11 && cleaned.startsWith('0')) return `+91${cleaned.slice(1)}`;
    if (cleaned.startsWith('91') && cleaned.length === 12) return `+${cleaned}`;
    if (cleaned.startsWith('+91')) return cleaned;
    return cleaned;
};
