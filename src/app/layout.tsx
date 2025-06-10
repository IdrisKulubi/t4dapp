import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "sonner";
import { Header } from "@/components/Header";
import { PasscodeProvider, PasscodeGuard } from "@/components/passcode";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InCountryYouthADAPT Challenge 2025",
  description: "Supporting young climate innovators in Africa with $30,000 grants and business development support. Part of the Africa Adaptation Acceleration Program (AAAP) by GCA and AfDB.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <Providers>
          <PasscodeProvider>
            <PasscodeGuard>
              <Header />
              <Toaster />
              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
              >
                <main className="pt-20">{children}</main>
              </ThemeProvider>
            </PasscodeGuard>
          </PasscodeProvider>
        </Providers>
      </body>
    </html>
  );
}
