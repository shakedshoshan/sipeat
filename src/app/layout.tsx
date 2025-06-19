import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sipeat",
  description: "Sipeat is a platform that allows you to request a drink from a vending machine near you.",
  icons: {
    icon: "/SipEat.png",
  },
  openGraph: {
    title: "Sipeat",
    description: "Sipeat is a platform that allows you to request a drink from a vending machine near you.",
    images: "/SipEat.png",
  },
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
        {/* Sticky Navigation */}
        <div className="relative flex flex-col mb-10 font-sans bg-gradient-to-b from-[#38bdf8] via-[#6ee7b7] to-[#f3f4f6]">
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur shadow-sm border-b border-[#38bdf8] ">
        <div className="max-w-4xl mx-auto flex justify-between items-center px-4 py-2 ">
          <Link href="/">
          <span className="font-extrabold text-[#2563eb] text-2xl tracking-tight ">Sipeat</span>
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
