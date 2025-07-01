import { Resend } from 'resend';
import { render } from '@react-email/render';
import React from 'react';
import {
  ApplicationSubmissionEmail,
  ApplicationSubmissionEmailProps,
} from '@/components/emails/application-submission-email';
import {
  VerificationCodeEmail,
} from '@/components/emails/verification-code-email';
import {
  PasswordResetEmail,
} from '@/components/emails/password-reset-email';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail =
  process.env.FROM_EMAIL || 'YouthADAPT <verify@incountryouthadapt.kenyacic.org>';

if (!process.env.RESEND_API_KEY) {
  console.warn('⚠️ RESEND_API_KEY is not set. Emails will not be sent.');
}

export interface SendEmailParams {
  to: string;
  subject: string;
  react: React.ReactElement;
}

export const sendEmail = async (params: SendEmailParams) => {
  const { to, subject, react } = params;
  try {
    console.log(`📨 Sending email to ${to}...`);
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html: await render(react),
    });
    if (error) {
      console.error(`❌ Error sending email to ${to}:`, error);
      throw new Error('Failed to send email');
    }
    console.log(`✅ Email sent successfully to ${to}. Message ID: ${data?.id}`);
    return { success: true, data };
  } catch (error) {
    console.error(`❌ Unexpected error sending email to ${to}:`, error);
    throw error;
  }
};

/**
 * Sends a verification code email.
 */
export async function sendVerificationCode(props: {
  to: string;
  verificationCode: string;
}) {
  return sendEmail({
    to: props.to,
    subject: 'Your T4D Africa Verification Code',
    react: VerificationCodeEmail({
      userEmail: props.to,
      verificationCode: props.verificationCode,
    }),
  });
}

/**
 * Sends an application submission confirmation email.
 */
export async function sendApplicationSubmissionEmail(
  props: ApplicationSubmissionEmailProps
) {
  return sendEmail({
    to: props.userEmail,
    subject: '🎉 Application Submitted Successfully - T4D Africa Challenge',
    react: ApplicationSubmissionEmail(props),
  });
}

/**
 * Props for the password reset email.
 */
interface PasswordResetEmailProps {
  to: string;
  code: string;
  userName?: string;
}

/**
 * Sends a password reset email with a verification code.
 */
export async function sendPasswordResetEmail(props: PasswordResetEmailProps) {
  return sendEmail({
    to: props.to,
    subject: 'Reset Your T4D Africa Password',
    react: PasswordResetEmail(props),
  });
}

export function generateVerificationCode(): string {
  // Generate a 6-digit verification code
  return Math.floor(100000 + Math.random() * 900000).toString();
} 