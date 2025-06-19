import React from "react";
import Link from "next/link";
import Image from "next/image";

const AboutUs = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#2563eb]">More About Our Service</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">We provide high-quality vending machine solutions tailored to your specific needs and environment.</p>
      </div>

      {/* Types of Machines */}
      <section className="mb-10 bg-white rounded-xl shadow-lg p-6 border-t-4 border-[#38bdf8] hover:shadow-xl transition-shadow">
        <div className="flex items-center mb-4">
          <Image src="/icons/machine.png" alt="Vending Machines" width={40} height={40} className="mr-3" />
          <h3 className="text-xl font-bold text-[#2563eb]">Types of Machines We Place</h3>
        </div>
        
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-[#f3f4f6] rounded-lg p-5 hover:bg-[#e5e7eb] transition-colors">
            <h4 className="font-bold text-[#2563eb] mb-2">Closed Drink Machines</h4>
            <p className="text-gray-700">Perfect for outdoor locations in the open air.</p>
            <p className="text-gray-600 mt-2 text-sm italic">Example: Weather-resistant machines for parks or stadiums.</p>
          </div>
          
          <div className="bg-[#f3f4f6] rounded-lg p-5 hover:bg-[#e5e7eb] transition-colors">
            <h4 className="font-bold text-[#2563eb] mb-2">Glass Display Machines</h4>
            <p className="text-gray-700">Suitable for closed locations inside the workplace.</p>
            <p className="text-gray-600 mt-2 text-sm italic">Example: Transparent-front machines for offices or lobbies.</p>
          </div>
          
          <div className="bg-[#f3f4f6] rounded-lg p-5 hover:bg-[#e5e7eb] transition-colors">
            <h4 className="font-bold text-[#2563eb] mb-2">Combined Machines</h4>
            <p className="text-gray-700">Save space. Perfect for closed and small locations.</p>
            <p className="text-gray-600 mt-2 text-sm italic">Example: Compact units for small break rooms or waiting areas.</p>
          </div>
        </div>
      </section>

      {/* Customer Service */}
      <section className="mb-10 bg-white rounded-xl shadow-lg p-6 border-t-4 border-[#6ee7b7] hover:shadow-xl transition-shadow">
        <div className="flex items-center mb-4">
          <Image src="/icons/service.png" alt="Customer Service" width={40} height={40} className="mr-3" />
          <h3 className="text-xl font-bold text-[#2563eb]">Customer Service – Response Times</h3>
        </div>
        
        <div className="bg-[#f3f4f6] rounded-lg p-5 mt-4">
          <div className="flex flex-col sm:flex-row sm:justify-around">
            <div className="mb-4 sm:mb-0">
              <h4 className="font-semibold text-[#2563eb] mb-2">Weekdays</h4>
              <p className="text-gray-700 text-lg">Sun-Thu: 8:00-19:00</p>
            </div>
            <div>
              <h4 className="font-semibold text-[#2563eb] mb-2">Weekends & Holidays</h4>
              <p className="text-gray-700 text-lg">Friday and holiday eves: 8:00-14:00</p>
            </div>
          </div>
        </div>
      </section>

      {/* Unique Service */}
      <section className="mb-10 bg-white rounded-xl shadow-lg p-6 border-t-4 border-[#facc15] hover:shadow-xl transition-shadow">
        <div className="flex items-center mb-4">
          <Image src="/icons/support_question.png" alt="Unique Service" width={40} height={40} className="mr-3" />
          <h3 className="text-xl font-bold text-[#2563eb]">A Unique Service for Us</h3>
        </div>
        
        <div className="bg-[#f3f4f6] rounded-lg p-5 mt-4">
          <p className="text-gray-700 text-lg font-medium">Customer survey and placing items according to demand.</p>
          <div className="flex items-center mt-4 p-4 bg-white rounded-lg border border-gray-200">
            <div className="mr-4 hidden sm:block">
              <Image src="/icons/send.png" alt="Barcode" width={60} height={60} />
            </div>
            <div>
              <p className="text-gray-700">
                We place a barcode on each machine. Scanning it leads to a special requests page where customers can submit requests for unavailable products. This helps us add them if possible.
              </p>
              <Link href="/request" className="text-[#2563eb] font-medium mt-2 inline-block hover:underline">
                View Request Page →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <div className="text-center mt-12">
        <Link
          href="/"
          className="inline-flex items-center bg-[#2563eb] text-white font-bold px-6 py-3 rounded-full shadow hover:bg-[#1d4ed8] transition"
        >
          <span className="mr-2">←</span> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default AboutUs;
