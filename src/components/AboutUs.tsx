"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Messages } from "@/types/translate_type";
import Link from "next/link";

const AboutUs = () => {
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
    <div className="relative flex flex-col min-h-screen font-sans bg-gradient-to-b from-[#38bdf8] via-[#6ee7b7] to-[#f3f4f6]">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center pt-8 pb-16 px-4 bg-gradient-to-br from-[#38bdf8] via-[#2563eb] to-[#6ee7b7] min-h-[40vh]">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
          {messages.aboutUs.title}
        </h1>
        <p className="text-lg text-white/90 max-w-2xl mx-auto">
          {messages.aboutUs.subtitle}
        </p>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 ">
            {/* Types of Machines */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-[#38bdf8] transform transition-all hover:scale-[1.02]">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-lg bg-[#38bdf8]/10 mr-4">
                  <Image src="/icons/machine.png" alt="Machines" width={32} height={32} />
                </div>
                <h3 className="text-xl font-bold text-[#2563eb]">{messages.aboutUs.machines.title}</h3>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gradient-to-r from-[#f3f4f6] to-white">
                  <h4 className="font-semibold text-[#2563eb]">{messages.aboutUs.machines.closedMachines.title}</h4>
                  <p className="text-gray-600 mt-1">{messages.aboutUs.machines.closedMachines.description}</p>
                </div>
                
                <div className="p-4 rounded-lg bg-gradient-to-r from-[#f3f4f6] to-white">
                  <h4 className="font-semibold text-[#2563eb]">{messages.aboutUs.machines.glassMachines.title}</h4>
                  <p className="text-gray-600 mt-1">{messages.aboutUs.machines.glassMachines.description}</p>
                </div>
                
                <div className="p-4 rounded-lg bg-gradient-to-r from-[#f3f4f6] to-white">
                  <h4 className="font-semibold text-[#2563eb]">{messages.aboutUs.machines.combinedUnits.title}</h4>
                  <p className="text-gray-600 mt-1">{messages.aboutUs.machines.combinedUnits.description}</p>
                </div>
              </div>
            </div>

            {/* Operation Times Section */}
            <div className="bg-white rounded-xl shadow-sm p-8  border-l-4 border-[#6ee7b7]">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-lg bg-[#6ee7b7]/10 mr-4">
                  <Image src="/icons/service.png" alt="Operation Hours" width={32} height={32} />
                </div>
                <h3 className="text-xl font-bold text-[#2563eb]">{messages.aboutUs.operationHours.title}</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#6ee7b7] mr-3"></div>
                  <div>
                    <p className="font-medium text-gray-800">{messages.aboutUs.operationHours.weekdays.title}</p>
                    <p className="text-gray-600">{messages.aboutUs.operationHours.weekdays.hours}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#facc15] mr-3"></div>
                  <div>
                    <p className="font-medium text-gray-800">{messages.aboutUs.operationHours.holidays.title}</p>
                    <p className="text-gray-600">{messages.aboutUs.operationHours.holidays.hours}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Unique Feature Section */}
      <section className="py-16 px-4 bg-[#f3f4f6]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-[#facc15] transform transition-all hover:scale-[1.01]">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/3 mb-6 md:mb-0 md:pr-8">
                <div className="p-4 rounded-xl bg-[#facc15]/10 flex justify-center">
                  <Image src="/icons/send.png" alt="Unique Feature" width={120} height={120} />
                </div>
              </div>
              
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold text-[#2563eb] mb-4">{messages.aboutUs.uniqueService.title}</h3>
                <p className="text-gray-700 mb-6">
                  {messages.aboutUs.uniqueService.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="flex flex-col gap-4 items-center text-center py-6 px-4 justify-center bg-gradient-to-br from-[#2563eb] via-[#38bdf8] to-[#6ee7b7] text-white">
      
        <div className="max-w-4xl mx-auto flex-1 text-center">
        <Link 
                    href="/#contact" 
                    className="inline-block bg-[#facc15] text-[#2563eb] font-bold px-8 py-3 rounded-full shadow hover:bg-[#ffe066] transition"
                >
                    {messages.navigation.contactUs}
                </Link>
        </div>
        <div className="max-w-4xl mx-auto flex-1">
        <Link 
                    href="/" 
                    className="inline-block bg-[#facc15] text-[#2563eb] font-bold px-8 py-3 rounded-full shadow hover:bg-[#ffe066] transition"
                >
                    {messages.requestPage.backToHome}
                </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
