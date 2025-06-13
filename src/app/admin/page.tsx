import MachineForm from "@/components/MachineForm";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-[#2563eb] mb-8">
          Admin Dashboard
        </h1>
        
        <div className="mb-12">
          <MachineForm />
        </div>
      </div>
    </div>
  );
} 