/** Normalize Bangladesh-style phone numbers for consistent DB lookup. */
export function normalizePhone(input: string): string {
  let phone = input.trim().replace(/[\s-]/g, '');

  if (phone.startsWith('+880')) {
    phone = `0${phone.slice(4)}`;
  } else if (phone.startsWith('880') && phone.length >= 12) {
    phone = `0${phone.slice(3)}`;
  } else if (/^1\d{9}$/.test(phone)) {
    phone = `0${phone}`;
  }

  return phone;
}
