"use client";

import AboutUs from "@/components/AboutUs";
import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useEffect, useState } from "react";
import { Messages } from "@/types/translate_type";

export default function AboutUsPage() {
    const [messages, setMessages] = useState<Messages | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadTranslations = async () => {
            try {
                const language = localStorage.getItem('language') || 'he';
                const translations = await import(`@/messages/${language}.json`);
                setMessages(translations.default);
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to load translations:", error);
                const translations = await import('@/messages/he.json');
                setMessages(translations.default);
                setIsLoading(false);
            }
        };

        loadTranslations();
    }, []);

    if (isLoading || !messages) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center text-center py-16 px-4 bg-white">
            <AboutUs />

            {/* Contact Button */}
      <div className="mt-8 text-center">
        <Link href="/#contact" 
              className="inline-block bg-[#2563eb] text-white font-bold px-8 py-3 rounded-full shadow hover:bg-[#1d4ed8] transition">
          {messages.navigation.contactUs}
        </Link>
      </div>
        </div>
    )
}