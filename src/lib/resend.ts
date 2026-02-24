import { Resend } from 'resend';

// Provide a dummy key if the API key is missing so the app doesn't crash during local development or build.
export const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_to_prevent_crash');
