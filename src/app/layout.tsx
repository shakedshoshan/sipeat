'use client';

import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useEffect } from "react";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    // Get the saved language from localStorage on component mount
    const savedLanguage = localStorage.getItem('language') || 'he';
    
    // Apply RTL direction for Hebrew and Arabic languages
    document.documentElement.dir = ['he', 'ar'].includes(savedLanguage) ? 'rtl' : 'ltr';
  }, []);

  return (
    <html>
      <head>
        <title>Sipeat</title>
        <meta name="description" content="Sipeat is a platform that allows you to request a drink from a vending machine near you." />
        <link rel="icon" href="/sipeat_short.svg" />
        <meta property="og:title" content="Sipeat" />
        <meta property="og:description" content="Sipeat is a platform that allows you to request a drink from a vending machine near you." />
        <meta property="og:image" content="https://ibb.co/FqCS2MLp" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Sticky Navigation */}
        <div className="relative flex flex-col mb-10 font-sans bg-gradient-to-b from-[#38bdf8] via-[#6ee7b7] to-[#f3f4f6]">
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur shadow-sm border-b border-[#38bdf8] ">
        <div className="max-w-4xl mx-auto flex justify-between items-center px-4 py-2 ">
          <Link href="/">
            <Image src="/sipeat_short.png" alt="Sipeat" width={100} height={100} />
          </Link>
          <LanguageSwitcher />
        </div>
      </nav>
      </div>
        {children}
      </body>
    </html>
  );
}
