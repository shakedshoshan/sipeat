import AboutUs from "@/components/AboutUs";
import Link from "next/link";

export default function AboutUsPage() {
    return (
        <div className="flex flex-col items-center text-center py-16 px-4 bg-white">
            <AboutUs />

            {/* Contact Button */}
      <div className="mt-8 text-center">
        <Link href="/#contact" 
              className="inline-block bg-[#2563eb] text-white font-bold px-8 py-3 rounded-full shadow hover:bg-[#1d4ed8] transition">
          Contact Us
        </Link>
      </div>
        </div>
    )
}