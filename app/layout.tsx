/**
 * @file layout.tsx
 * @description Root layout component for the GC-RCP Lite application
 * 
 * This layout provides the Canada.ca UI styling and language handling
 * for the entire application. It follows the Web Experience Toolkit (WET)
 * standards for Government of Canada web applications.
 */

import type { Metadata } from "next";
import { Noto_Sans, Lato } from "next/font/google";
import "./globals.css";

// Import the language provider and layout components
import LanguageProvider from "@/components/wet/LanguageProvider";
import MainLayout from "@/components/wet/MainLayout";

// Load Canada.ca standard fonts
const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
});

// Set application metadata
export const metadata: Metadata = {
  title: "GC-RCP Lite | Risk & Compliance Self-Assessment Portal",
  description: "Self-assessment portal for Government of Canada departments to evaluate risk and compliance",
  applicationName: "GC-RCP Lite",
  authors: [{ name: "Treasury Board Secretariat" }],
  generator: "Next.js",
  keywords: ["Canada", "Government", "Risk", "Compliance", "Assessment", "Self-Assessment"],
  // Add metadata for Government of Canada sites
  other: {
    "dcterms.creator": "Treasury Board of Canada Secretariat",
    "dcterms.language": "eng",
    "dcterms.issued": "2025-05-15",
    "dcterms.modified": "2025-05-15"
  },
};

/**
 * Root layout component
 * Provides language context and main layout structure
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${notoSans.variable} ${lato.variable} antialiased bg-white text-gc-dark-text`}
      >
        {/* Language provider for bilingual support */}
        <LanguageProvider>
          {/* Main layout with Canada.ca header and footer */}
          <MainLayout>
            {children}
          </MainLayout>
        </LanguageProvider>
      </body>
    </html>
  );
}
