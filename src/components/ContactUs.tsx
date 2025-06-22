import { Messages } from "@/types/translate_type";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createContact } from "@/api/CreateContact";

export default function ContactUs({ messages }: { messages: Messages }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>("he"); // Default to Hebrew

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") || "he";
    setLanguage(storedLanguage);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const contactData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: Number(formData.get("phone")),
      company_name: formData.get("company_name") as string,
      mechine_location: formData.get("mechine_location") as string,
      message: formData.get("message") as string,
    };

    try {
      const result = await createContact(contactData);
      if (result) {
        router.push("/status?type=contact");
      } else {
        setError(messages.contact.form.error || "Failed to submit the form. Please try again.");
      }
    } catch (err) {
      setError(messages.contact.form.error || "An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-4">{messages.contact.title}</h2>
      <p className="mb-6 max-w-md">{messages.contact.description}</p>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm mx-auto bg-white/10 p-6 rounded-xl shadow">
        <input
          type="text"
          name="name"
          placeholder={messages.contact.form.name}
          className="px-4 py-2 rounded bg-white text-[#2563eb] placeholder-[#38bdf8] focus:outline-none"
          required
        />
        <input
          type="email"
          name="email"
          placeholder={messages.contact.form.email}
          className="px-4 py-2 rounded bg-white text-[#2563eb] placeholder-[#38bdf8] focus:outline-none"
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder={messages.contact.form.phone}
          className="px-4 py-2 rounded bg-white text-[#2563eb] placeholder-[#38bdf8] focus:outline-none"
          dir={language === "he" || language === "ar" ? "rtl" : "ltr"}
          required
        />
        <input
          type="text"
          name="company_name"
          placeholder={messages.contact.form.company_name}
          className="px-4 py-2 rounded bg-white text-[#2563eb] placeholder-[#38bdf8] focus:outline-none"
        />
        <input
          type="text"
          name="mechine_location"
          placeholder={messages.contact.form.mechine_location}
          className="px-4 py-2 rounded bg-white text-[#2563eb] placeholder-[#38bdf8] focus:outline-none"
        />
        <textarea
          name="message"
          placeholder={messages.contact.form.message}
          className="px-4 py-2 rounded bg-white text-[#2563eb] placeholder-[#38bdf8] focus:outline-none"
          rows={3}
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#facc15] text-[#2563eb] font-bold px-6 py-2 rounded-full shadow hover:bg-[#ffe066] transition disabled:opacity-50"
        >
          {isSubmitting ? messages.contact.form.submitting || "Submitting..." : messages.contact.form.submit}
        </button>
      </form>
    </div>
  );
}