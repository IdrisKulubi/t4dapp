import { Resend } from 'resend';
import { render } from '@react-email/render';
import { VerificationCodeEmail } from '@/components/emails/verification-code-email';
import { ApplicationSubmissionEmail } from '@/components/emails/application-submission-email';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendVerificationCodeParams {
  to: string;
  verificationCode: string;
}

export interface SendApplicationSubmissionEmailParams {
  to: string;
  applicantName: string;
  applicationId: string;
  businessName: string;
  submissionDate: string;
}

export async function sendVerificationCode({
  to,
  verificationCode,
}: SendVerificationCodeParams) {
  try {
    const emailHtml = await render(
      VerificationCodeEmail({
        verificationCode,
        userEmail: to,
      })
    );

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'youthADAPT <veryfy@strathspace.com>',
      to: [to],
      subject: 'Your YouthADAPT Challenge Verification Code',
      html: emailHtml,
    });

    if (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
}

export async function sendApplicationSubmissionEmail({
  to,
  applicantName,
  applicationId,
  businessName,
  submissionDate,
}: SendApplicationSubmissionEmailParams) {
  try {
    const emailHtml = await render(
      ApplicationSubmissionEmail({
        applicantName,
        applicationId,
        businessName,
        submissionDate,
        userEmail: to,
      })
    );

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'YouthADAPT <noreply@yourdomain.com>',
      to: [to],
      subject: '🎉 Application Submitted Successfully - YouthADAPT Challenge',
      html: emailHtml,
    });

    if (error) {
      console.error('Error sending application submission email:', error);
      throw new Error('Failed to send application submission email');
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending application submission email:', error);
    throw error;
  }
}

export function generateVerificationCode(): string {
  // Generate a 6-digit verification code
  return Math.floor(100000 + Math.random() * 900000).toString();
} 