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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
        <SessionProvider>
          <StoreProvider>
            <ToastHandler />
            <Providers />
            <Navbar />
            <div className="pt-24 sm:pt-28 lg:pt-20">
              <Toaster />
              {children}
            </div>
            <Footer />
          </StoreProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
