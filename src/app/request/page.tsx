import RequestForm from "@/components/RequestForm";
import Link from "next/link";

export default function RequestPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-[#2563eb] mb-8">
          Request Your Favorite Drink
        </h1>
        
        <div className="mb-12">
          <RequestForm />
        </div>
      </div>
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-blue-500 hover:text-blue-600 flex items-center justify-center bg-white rounded-md p-2 border-2 border-blue-100 hover:bg-blue-100">Back to Home</Link>
      </div>
    </div>
  );
} 