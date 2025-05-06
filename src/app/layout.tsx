import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "sonner";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-teal-950 via-blue-950 to-green-900 min-h-screen`}
      >
        <header className="w-full flex items-center justify-between px-6 py-4 bg-black/40 backdrop-blur-md z-50 relative">
          <div className="flex items-center gap-4">
            <img src="/images/gca-logo.png" alt="GCA Logo" className="h-10 w-auto" />
            <img src="/images/kcic-logo.png" alt="KCIC Logo" className="h-10 w-auto" />
          </div>
          <span className="text-lg font-semibold text-white tracking-wide">YouthAdapt Challenge</span>
        </header>
        <Toaster />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="pt-4">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
