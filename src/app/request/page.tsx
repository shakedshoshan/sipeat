"use client";

import RequestForm from "@/components/RequestForm";
import { useEffect, useState, Suspense } from "react";
import { Messages } from "@/types/translate_type";

function RequestContent() {
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
        <h1 className="text-3xl font-bold text-center text-[#2563eb] mb-8">
          {messages.requestPage.title}
        </h1>
        
        <div className="mb-12">
          <RequestForm />
        </div>
      </div>
      {/* <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-blue-500 hover:text-blue-600 flex items-center justify-center bg-white rounded-md p-2 border-2 border-blue-100 hover:bg-blue-100">
          {messages.requestPage.backToHome}
        </Link>
      </div> */}
    </div>
  );
}

export default function RequestPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <RequestContent />
    </Suspense>
  );
} 