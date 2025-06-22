"use client";

import AboutUs from "@/components/AboutUs";
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
        <div className="flex flex-col items-center text-center py-16 px-4 bg-white relative">
            {/* <div className="absolute top-4 right-4">
                <LanguageSwitcher />
            </div> */}
            <div className="absolute top-4 right-4">
              <AboutUs />
            </div>
        </div>
    );
}