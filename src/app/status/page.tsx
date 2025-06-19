"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Messages } from "@/types/translate_type";

export default function StatusPage() {
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
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-md">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-3">{messages.statusPage.title}</h1>
            <p className="text-lg text-gray-600 mb-8">
              {messages.statusPage.message}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" className="inline-block px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors">
                {messages.statusPage.returnHome}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
