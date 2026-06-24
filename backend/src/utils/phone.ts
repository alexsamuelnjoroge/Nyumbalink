export function normalizeKenyanPhone(raw: string): string | null {
  let phone = raw.trim().replace(/[\s\-]/g, '');

  if (phone.startsWith('+254')) {
    phone = phone.slice(1); // remove +
  } else if (phone.startsWith('254')) {
    // already correct format
  } else if (phone.startsWith('0')) {
    phone = '254' + phone.slice(1);
  } else {
    return null;
  }

  // Must be 12 digits: 254 + 9 digit number
  if (!/^254[17]\d{8}$/.test(phone)) return null;

  return '+' + phone;
}

export function isValidKenyanPhone(phone: string): boolean {
  return normalizeKenyanPhone(phone) !== null;
}
