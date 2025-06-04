import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "sonner";
import { Header } from "@/components/Header";
import { PasscodeProvider, PasscodeGuard } from "@/components/passcode";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YouthAdapt Challenge",
  description: "Supporting young entrepreneurs and MSMEs in Africa building climate resilience",
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
      </body>
    </html>
  );
}
