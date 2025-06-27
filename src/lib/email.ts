import { Resend } from 'resend';
import { render } from '@react-email/render';
import { VerificationCodeEmail } from '@/components/emails/verification-code-email';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendVerificationCodeParams {
  to: string;
  verificationCode: string;
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
      from: ' youthADAPT <veryfy@strathspace.com>',
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

export function generateVerificationCode(): string {
  // Generate a 6-digit verification code
  return Math.floor(100000 + Math.random() * 900000).toString();
} 