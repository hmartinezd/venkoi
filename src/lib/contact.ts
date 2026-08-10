export const PUBLIC_CONTACT = {
  email: 'hecoraidis@gmail.com',
  whatsapp: {
    number: '16145863968',
    displayNumber: '+1 (614) 586-3968'
  }
} as const;

export function buildWhatsAppUrl(message: string): string {
  const url = new URL(`https://wa.me/${PUBLIC_CONTACT.whatsapp.number}`);
  url.search = new URLSearchParams({ text: message }).toString();
  return url.toString();
}

export function buildEmailUrl(subject: string): string {
  const params = new URLSearchParams({ subject });
  return `mailto:${PUBLIC_CONTACT.email}?${params.toString()}`;
}
