"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Messages } from "@/types/translate_type";
import ContactUs from "@/components/ContactUs";
import AboutUs from "@/components/AboutUs";


export default function Home() {
  // Back-to-top button visibility
  const [showTop, setShowTop] = useState(false);
  // Language state
  const [messages, setMessages] = useState<Messages | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Load translations based on the selected language
    const loadTranslations = async () => {
      try {
        const language = localStorage.getItem('language') || 'he';
        const translations = await import(`@/messages/${language}.json`);
        setMessages(translations.default);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load translations:", error);
        // Fallback to English
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
    <div className="relative flex flex-col min-h-screen font-sans bg-gradient-to-b from-[#38bdf8] via-[#6ee7b7] to-[#f3f4f6]">

      {/* Hero Section */}
      <section id="hero" className="flex flex-col items-center justify-center text-center pt-4 pb-16 px-4 bg-gradient-to-br from-[#38bdf8] via-[#2563eb] to-[#6ee7b7] min-h-[70vh]">
        <Image
          src="/SipEat.png"
          alt="Sipeat Logo"
          width={250}
          height={250}
          className="rounded-2xl"
          priority
        />
        <p className="text-lg sm:text-2xl text-white/90 mb-6 max-w-md font-semibold">{messages.hero.slogan}</p>
        <Link
          href="#contact"
          className="inline-block bg-[#facc15] text-[#2563eb] font-bold px-8 py-3 rounded-full shadow hover:bg-[#ffe066] transition mb-2"
        >
          {messages.hero.contact}
        </Link>
       
      </section>

      {/* Who Are We Section */}
      <section id="who" className="flex flex-col items-center text-center py-16 px-4 bg-white">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#2563eb]">{messages.whoAreWe.title}</h2>
        <div className="max-w-2xl mx-auto">
          <p className="text-base sm:text-lg text-gray-700 mb-6">
            {messages.whoAreWe.description}
          </p>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why" className="flex flex-col items-center text-center py-16 px-4 bg-[#f3f4f6]">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[#2563eb]">{messages.whyChooseUs.title}</h2>
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <div className="bg-white rounded-xl shadow p-6 flex-1 min-w-[220px] border-t-4 border-[#38bdf8]">
              <Image src="/icons/service.png" alt="Support" width={60} height={60} className="mx-auto mb-2" />
              <h3 className="font-bold text-[#2563eb] mb-1">{messages.whyChooseUs.reasons.support.title}</h3>
              <p className="text-gray-600">{messages.whyChooseUs.reasons.support.description}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex-1 min-w-[220px] border-t-4 border-[#6ee7b7]">
              <Image src="/icons/wallet.png" alt="Affordable" width={60} height={60} className="mx-auto mb-2" />
              <h3 className="font-bold text-[#2563eb] mb-1">{messages.whyChooseUs.reasons.price.title}</h3>
              <p className="text-gray-600">{messages.whyChooseUs.reasons.price.description}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex-1 min-w-[220px] border-t-4 border-[#facc15]">
              <Image src="/icons/support_question.png" alt="Customer Focus" width={60} height={60} className="mx-auto mb-2" />
              <h3 className="font-bold text-[#2563eb] mb-1">{messages.whyChooseUs.reasons.customer.title}</h3>
              <p className="text-gray-600">{messages.whyChooseUs.reasons.customer.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who is our service suitable for */}
      <section id="suitable" className="flex flex-col items-center text-center py-12 px-4 bg-white">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#2563eb]">{messages.suitableFor.title}</h2>
        <div className="max-w-2xl mx-auto">
          <p className="text-base sm:text-lg text-gray-700 mb-6">
            {messages.suitableFor.description}
          </p>
          <div className="mt-8">
          <Link
              href="/aboutUs"
              className="inline-block bg-[#2563eb] text-white font-bold px-8 py-3 rounded-full shadow hover:bg-[#1d4ed8] transition mb-8"
            >
              {messages.moreAboutUs.title}
            </Link>
            <h3 className="text-xl font-bold mb-4 text-[#2563eb]">{messages.suitableFor.cta.title}</h3>
            <p className="mb-6">{messages.suitableFor.cta.description}</p> 
          </div>
        </div>
      </section>


      {/* Contact Section */}
      <section id="contact" className="flex flex-col items-center text-center py-16 px-4 bg-gradient-to-br from-[#2563eb] via-[#38bdf8] to-[#6ee7b7] text-white">
        <ContactUs messages={messages} />
      </section>

      {/* Back to Top Button */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 bg-[#2563eb] text-white p-3 rounded-full shadow-lg hover:bg-[#38bdf8] transition"
          aria-label={messages.backToTop}
        >
          ↑
        </button>
      )}
    </div>
  );
}
