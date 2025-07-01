import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface SupportTicketResponseEmailProps {
  userName?: string;
  ticketNumber?: string;
  responseMessage?: string;
  ticketSubject?: string;
  loginUrl?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const SupportTicketResponseEmail = ({
  userName,
  ticketNumber,
  responseMessage,
  ticketSubject,
  loginUrl = `${baseUrl}/login`,
}: SupportTicketResponseEmailProps) => {
  const previewText = `New response on your support ticket ${ticketNumber}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-gradient-to-br from-slate-50 to-slate-100 my-auto mx-auto font-sans">
          <Container className="border border-solid border-slate-200 rounded-xl shadow-lg my-[40px] mx-auto p-0 w-[465px] bg-white overflow-hidden">
            {/* Header Section with Gradient */}
            <Section className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
              <div className="w-12 h-12 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
              </div>
              <Heading className="text-white text-[28px] font-bold m-0">
                Support Response
              </Heading>
              <Text className="text-blue-100 text-[14px] m-0 mt-2">
                YouthAdapt Challenge Platform
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="p-8">
              <Text className="text-slate-800 text-[16px] leading-[24px] font-medium">
                Hello {userName},
              </Text>
              <Text className="text-slate-600 text-[14px] leading-[24px] mt-4">
                Great news! A new response has been posted to your support ticket. Our team is here to help you succeed.
              </Text>

              {/* Ticket Info Card */}
              <Section className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 p-6 rounded-lg my-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-3">
                    <Text className="text-white text-[12px] font-bold m-0">#</Text>
                  </div>
                  <Text className="text-slate-800 font-bold text-[16px] m-0">
                    {ticketNumber}
                  </Text>
                </div>
                <Text className="text-slate-700 font-semibold text-[14px] mb-2">
                  Subject: {ticketSubject}
                </Text>
                <Hr className="border-slate-300 my-4" />
                <div className="bg-white p-4 rounded-md border border-slate-200">
                  <Text className="text-slate-800 text-[14px] font-semibold mb-2">
                    💬 New Response:
                  </Text>
                  <Text className="text-slate-700 text-[14px] leading-[22px] whitespace-pre-wrap">
                    {responseMessage}
                  </Text>
                </div>
              </Section>

              <Text className="text-slate-600 text-[14px] leading-[24px] mb-6">
                Ready to continue the conversation? Click below to view the full ticket details and add your response.
              </Text>

              {/* CTA Button */}
              <Section className="text-center my-8">
                <Button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg px-8 py-4 text-[16px] font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  href={loginUrl}
                >
                  🎯 View & Reply to Ticket
                </Button>
              </Section>

              {/* Alternative Link */}
              <Section className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <Text className="text-slate-600 text-[12px] leading-[18px] text-center">
                  Can&apos;t click the button? Copy and paste this link into your browser:
                </Text>
                <Text className="text-center mt-2">
                  <Link href={loginUrl} className="text-blue-600 text-[12px] underline break-all">
                    {loginUrl}
                  </Link>
                </Text>
              </Section>
            </Section>

            {/* Footer */}
            <Section className="bg-slate-100 p-6 border-t border-slate-200">
              <Text className="text-slate-500 text-[11px] leading-[16px] text-center">
                This email was sent to <span className="text-slate-700 font-medium">{userName}</span> from the 
                <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Incountry-YouthAdapt Challenge</span> platform.
              </Text>
              <Text className="text-slate-400 text-[10px] leading-[14px] text-center mt-2">
                If you weren&apos;t expecting this email, you can safely ignore it. For account security concerns, please reply to this email.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default SupportTicketResponseEmail;