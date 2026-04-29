import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryClientProvider from "@/layout/QueryClient";
import { ToastProvider } from "@/shared/Toast/ToastProvider";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Goldencare",
  description:
    "Goldencare is a compassionate healthcare platform dedicated to providing personalized care and support for individuals with chronic illnesses. Our mission is to empower patients and their families by offering comprehensive resources, expert guidance, and a supportive community to navigate the challenges of chronic illness with confidence and compassion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head></head>
      <body className="min-h-full flex flex-col">
        <QueryClientProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
