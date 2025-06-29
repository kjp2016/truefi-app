import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/providers/theme-provider";
import MotionProvider from "@/components/providers/motion-provider";
import "./globals.css";
import 'katex/dist/katex.min.css';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "TrueFi.ai",
  description: "TrueFi AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      > */}
      <body
        className={
          `${geistSans.variable} ${geistMono.variable} scroll-smooth font-sans antialiased`
          // "relative flex min-h-screen w-full flex-col justify-center scroll-smooth bg-background font-sans antialiased"
        }
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <MotionProvider>{children}
          {/* <main className="flex-1 container">{children}</main> */}
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
