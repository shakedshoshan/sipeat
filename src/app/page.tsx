"use client";

import Image from "next/image";
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
          <span className="font-extrabold text-[#2563eb] text-lg tracking-tight">Sipeat</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="flex flex-col items-center justify-center text-center pt-10 pb-16 px-4 bg-gradient-to-br from-[#38bdf8] via-[#2563eb] to-[#6ee7b7] min-h-[70vh]">
        <Image
          src="/Sipeat_logo.png"
          alt="Refreshing Cold Drink"
          width={250}
          height={250}
          className="rounded-2xl"
          priority
        />
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow mb-4">Refresh Your Day!</h1>
        <p className="text-lg sm:text-xl text-white/90 mb-6 max-w-md">Delicious, ice-cold drinks available instantly from our vending machines. Taste the chill, feel the thrill!</p>
        <a
          href="#how"
          className="inline-block bg-[#facc15] text-[#2563eb] font-bold px-8 py-3 rounded-full shadow hover:bg-[#ffe066] transition mb-2"
        >
          How It Works
        </a>
      </section>

      {/* How It Works */}
      <section id="how" className="flex flex-col items-center text-center py-16 px-4 bg-white">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#2563eb]">How It Works</h2>
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          <p className="text-base sm:text-lg text-gray-700">
            <span className="font-semibold text-[#2563eb]">Want your favorite drink in your local vending machine?</span> <br />
            With Sipeat, you can <span className="font-bold">request a specific drink</span> to be stocked in a vending machine near you! Just let us know what you crave, and we'll do our best to make it available at your chosen location.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-4">
            <div className="bg-[#f3f4f6] rounded-xl shadow p-6 flex-1 min-w-[220px] border-t-4 border-[#38bdf8]">
              <Image src="/choose-drink.png" alt="Choose Drink" width={60} height={60} className="mx-auto mb-2" />
              <h3 className="font-bold text-[#2563eb] mb-1">1. Choose Your Drink</h3>
              <p className="text-gray-600 text-sm">Browse our selection and pick your favorite flavor.</p>
            </div>
            <div className="bg-[#f3f4f6] rounded-xl shadow p-6 flex-1 min-w-[220px] border-t-4 border-[#6ee7b7]">
              <Image src="/location.png" alt="Select Location" width={60} height={60} className="mx-auto mb-2" />
              <h3 className="font-bold text-[#2563eb] mb-1">2. Select Machine</h3>
              <p className="text-gray-600 text-sm">Tell us which vending machine you want it in.</p>
            </div>
            <div className="bg-[#f3f4f6] rounded-xl shadow p-6 flex-1 min-w-[220px] border-t-4 border-[#facc15]">
              <Image src="/request.png" alt="Request" width={60} height={60} className="mx-auto mb-2" />
              <h3 className="font-bold text-[#2563eb] mb-1">3. Request</h3>
              <p className="text-gray-600 text-sm">Submit your request and we'll do the rest!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="flex flex-col items-center text-center py-16 px-4 bg-[#f3f4f6]">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-[#2563eb]">What Our Customers Say</h2>
        <div className="flex flex-col sm:flex-row gap-6 max-w-4xl w-full justify-center">
          <blockquote className="bg-white rounded-xl p-6 shadow text-[#2563eb] flex-1 border-l-4 border-[#38bdf8]">
            "Absolutely love these drinks! So refreshing and tasty."
            <span className="block mt-2 text-sm text-[#38bdf8] font-semibold">– Alex P.</span>
          </blockquote>
          <blockquote className="bg-white rounded-xl p-6 shadow text-[#2563eb] flex-1 border-l-4 border-[#6ee7b7]">
            "I requested my favorite flavor and it was in my local machine the next week!"
            <span className="block mt-2 text-sm text-[#6ee7b7] font-semibold">– Jamie L.</span>
          </blockquote>
          <blockquote className="bg-white rounded-xl p-6 shadow text-[#2563eb] flex-1 border-l-4 border-[#facc15]">
            "The vending machines are everywhere, and the drinks are always ice-cold!"
            <span className="block mt-2 text-sm text-[#facc15] font-semibold">– Morgan S.</span>
          </blockquote>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="flex flex-col items-center text-center py-16 px-4 bg-gradient-to-br from-[#2563eb] via-[#38bdf8] to-[#6ee7b7] text-white">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Contact Us</h2>
        <p className="mb-6 max-w-md">Want to know where to find our drinks, request a flavor, or have a question? Reach out below!</p>
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
          <textarea
            placeholder="Your Message or Drink Request"
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
