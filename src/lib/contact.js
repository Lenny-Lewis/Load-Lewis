// Direct contact details, shared by the WhatsApp button and the buy choices on project pages.
export const EMAIL = "lennylewis6a6y@gmail.com";
// One number for WhatsApp and calls, in international format without the plus.
export const PHONE = "254115740615";

export const WHATSAPP_URL = `https://wa.me/${PHONE}`;
export const whatsappUrl = (message) => `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
export const mailtoUrl = (subject, body) =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
export const telUrl = `tel:+${PHONE}`;
