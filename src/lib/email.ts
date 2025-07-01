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
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html: await render(react),
    });
    if (error) {
      throw new Error('Failed to send email');
    }
    return { success: true, data };
  } catch (error) {
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
    subject: 'Your In-Country YouthADAPT Verification Code',
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
    subject: '🎉 Application Submitted Successfully - In-Country YouthADAPT',
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
    subject: 'Reset Your In-Country YouthADAPT Password',
    react: PasswordResetEmail(props),
  });
}

export function generateVerificationCode(): string {
  // Generate a 6-digit verification code
  return Math.floor(100000 + Math.random() * 900000).toString();
} 