import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
