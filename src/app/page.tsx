"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  // Back-to-top button visibility
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative flex flex-col min-h-screen font-sans bg-gradient-to-b from-[#38bdf8] via-[#6ee7b7] to-[#f3f4f6]">
      {/* Sticky Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur shadow-sm border-b border-[#38bdf8]">
        <div className="max-w-4xl mx-auto flex justify-between items-center px-4 py-2">
          <span className="font-extrabold text-[#2563eb] text-2xl tracking-tight">Sipeat</span>
          <div className="flex gap-4">
            <Link href="#contact" className="px-3 py-1 rounded-full bg-[#facc15] text-[#2563eb] font-medium hover:bg-[#ffe066] transition">
              Contact Us
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="flex flex-col items-center justify-center text-center pt-10 pb-16 px-4 bg-gradient-to-br from-[#38bdf8] via-[#2563eb] to-[#6ee7b7] min-h-[70vh]">
        <Image
          src="/SipEat.png"
          alt="Sipeat Logo"
          width={250}
          height={250}
          className="rounded-2xl"
          priority
        />
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow mb-4">Sipeat</h1>
        <p className="text-lg sm:text-2xl text-white/90 mb-6 max-w-md font-semibold">Show employees that you care, every day</p>
        <Link
          href="#who"
          className="inline-block bg-[#facc15] text-[#2563eb] font-bold px-8 py-3 rounded-full shadow hover:bg-[#ffe066] transition mb-2"
        >
          Learn More
        </Link>
      </section>

      {/* Who Are We Section */}
      <section id="who" className="flex flex-col items-center text-center py-16 px-4 bg-white">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#2563eb]">Who Are We?</h2>
        <div className="max-w-2xl mx-auto">
          <p className="text-base sm:text-lg text-gray-700 mb-6">
            Sipeat is a company for installing and managing drink and snack machines, offering a full service – from installation to maintenance – for businesses and institutions in the central and Sharon regions.
            <br /><br />
            We believe in personal service, clean and maintained machines, and a perfect fit for the needs of each customer.
          </p>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why" className="flex flex-col items-center text-center py-16 px-4 bg-[#f3f4f6]">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[#2563eb]">Why Choose Us?</h2>
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <div className="bg-white rounded-xl shadow p-6 flex-1 min-w-[220px] border-t-4 border-[#38bdf8]">
              <Image src="/icons/support.png" alt="Support" width={60} height={60} className="mx-auto mb-2" />
              <h3 className="font-bold text-[#2563eb] mb-1">Always there when needed</h3>
              <p className="text-gray-600">Technical support and a quick response to any malfunction – without delays and without excuses.</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex-1 min-w-[220px] border-t-4 border-[#6ee7b7]">
              <Image src="/icons/price.png" alt="Affordable" width={60} height={60} className="mx-auto mb-2" />
              <h3 className="font-bold text-[#2563eb] mb-1">Pleasure without breaking the bank</h3>
              <p className="text-gray-600">Our product prices are among the cheapest on the market, without compromising on quality!</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex-1 min-w-[220px] border-t-4 border-[#facc15]">
              <Image src="/icons/customer.png" alt="Customer Focus" width={60} height={60} className="mx-auto mb-2" />
              <h3 className="font-bold text-[#2563eb] mb-1">The customer is always at the center</h3>
              <p className="text-gray-600">We listen, respond, and update according to your needs and desires.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who is our service suitable for */}
      <section id="suitable" className="flex flex-col items-center text-center py-16 px-4 bg-white">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#2563eb]">Who is our service suitable for?</h2>
        <div className="max-w-2xl mx-auto">
          <p className="text-base sm:text-lg text-gray-700 mb-6">
            Sipeat's service is designed for places with constant movement of employees - such as offices and factories.
            <br /><br />
            Wherever employees are looking for a moment of refreshment during the day - we bring the perfect solution: advanced machines, accessible and full of treats.
            <br /><br />
            No fuss, no maintenance - just a smooth experience that fits into the routine of your place.
          </p>
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 text-[#2563eb]">What are you waiting for?</h3>
            <p className="mb-6">Leave your details and we will get back to you as soon as possible</p>
            <Link
              href="#contact"
              className="inline-block bg-[#2563eb] text-white font-bold px-8 py-3 rounded-full shadow hover:bg-[#1d4ed8] transition"
            >
              Contact Us Now
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="flex flex-col items-center text-center py-16 px-4 bg-gradient-to-br from-[#2563eb] via-[#38bdf8] to-[#6ee7b7] text-white">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Contact Us</h2>
        <p className="mb-6 max-w-md">Interested in our services? Fill out the form below and we'll get back to you as soon as possible!</p>
        <form className="flex flex-col gap-4 w-full max-w-sm mx-auto bg-white/10 p-6 rounded-xl shadow">
          <input
            type="text"
            placeholder="Your Name"
            className="px-4 py-2 rounded bg-white text-[#2563eb] placeholder-[#38bdf8] focus:outline-none"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            className="px-4 py-2 rounded bg-white text-[#2563eb] placeholder-[#38bdf8] focus:outline-none"
            required
          />
          <input
            type="tel"
            placeholder="Your Phone Number"
            className="px-4 py-2 rounded bg-white text-[#2563eb] placeholder-[#38bdf8] focus:outline-none"
            required
          />
          <textarea
            placeholder="Your Message"
            className="px-4 py-2 rounded bg-white text-[#2563eb] placeholder-[#38bdf8] focus:outline-none"
            rows={3}
            required
          />
          <button
            type="submit"
            className="bg-[#facc15] text-[#2563eb] font-bold px-6 py-2 rounded-full shadow hover:bg-[#ffe066] transition"
          >
            Send Message
          </button>
        </form>
      </section>

      {/* Back to Top Button */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 bg-[#2563eb] text-white p-3 rounded-full shadow-lg hover:bg-[#38bdf8] transition"
          aria-label="Back to top"
        >
          ↑
        </button>
      )}
    </div>
  );
}
