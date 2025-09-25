/**
 * RootLayout Component
 *
 * Main layout wrapper for the Next.js app.
 * Sets up global providers, fonts, navigation bar, footer, and toast notifications.
 * Ensures consistent layout and context across all pages.
 *
 * Props:
 * - children {React.ReactNode}: The page content to render inside the layout.
 *
 * Usage:
 * - Wraps all pages with session, Redux store, toast handler, and UI providers.
 * - Renders Navbar at the top and Footer at the bottom.
 * - Applies custom fonts and global styles.
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import StoreProvider from "./StoreProvider";
import ToastHandler from "@/components/global/ToastHandler";
import { Toaster } from "react-hot-toast";
import Providers from "./Providers";
import { SessionProvider } from "next-auth/react";

// Load Geist Sans font and set CSS variable
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Load Geist Mono font and set CSS variable
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata for the app (title, description)
export const metadata: Metadata = {
  title: "ZLS Health",
  description: "Zealous Health",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Provide NextAuth session context */}
        <SessionProvider>
          {/* Provide Redux store context */}
          <StoreProvider>
            {/* Listen for toast notifications from Redux */}
            <ToastHandler />
            {/* Provide additional UI context/providers */}
            <Providers />
            {/* Render global navigation bar */}
            <Navbar />
            {/* Main content area with top padding for navbar */}
            <div className="pt-24 sm:pt-28 lg:pt-20 container mx-auto bg-white text-black">
              {/* React Hot Toast container */}
              <Toaster />
              {/* Render page content */}
              {children}
            </div>
            {/* Render global footer */}
            <Footer />
          </StoreProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
