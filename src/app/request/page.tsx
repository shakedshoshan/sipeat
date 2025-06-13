import RequestForm from "@/components/RequestForm";

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
    </div>
  );
} 