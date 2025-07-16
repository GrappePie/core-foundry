import { Resend } from 'resend';
import type { ReactElement } from 'react';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const from = process.env.EMAIL_FROM ?? 'no-reply@example.com';

export async function sendEmail({ to, subject, react }: { to: string; subject: string; react: ReactElement; }) {
  if (!resend) {
    console.warn('Resend client not initialized, skipping email');
    return;
  }
  try {
    await resend.emails.send({ from, to, subject, react });
  } catch (err) {
    console.error('Failed to send email', err);
  }
}
