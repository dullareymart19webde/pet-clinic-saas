import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import NextAuthSessionProvider from "@/components/providers/SessionProvider";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PetCare Clinic Pro | Advanced Veterinary Health Tech",
  description: "Premium SaaS dashboard for modern veterinary clinics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <NextAuthSessionProvider>
          {children}
        </NextAuthSessionProvider>
        <Toaster position="top-right" richColors theme="light" />
      </body>
    </html>
  );
}
