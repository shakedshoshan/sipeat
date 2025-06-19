"use client";

import { useState } from "react";
import { DrinkRequestData } from "@/api/CreateRequest";
import { useSupabaseQuery } from "@/hooks/useSupabase";
import { Machine } from "@/types/types_db";

export default function RequestForm() {
  const [formData, setFormData] = useState<DrinkRequestData>({
    customer_name: "",
    drink_name: "",
    machine: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Fetch machines from Supabase
  const { data: machines, loading: loadingMachines, error: machinesError } = 
    useSupabaseQuery<Machine>('machine', '*', { 
      order: { column: 'name', ascending: true } 
    });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit drink request");
      }

      // Reset form on success
      setFormData({
        customer_name: "",
        drink_name: "",
        machine: "",
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Request a Drink</h2>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      {machinesError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
          Error loading machines. Please try again later.
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4">
          Drink request submitted successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name*
          </label>
          <input
            type="text"
            id="customer_name"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#38bdf8]"
            placeholder="Enter your name"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="drink_name" className="block text-sm font-medium text-gray-700 mb-1">
            Drink Name*
          </label>
          <input
            type="text"
            id="drink_name"
            name="drink_name"
            value={formData.drink_name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#38bdf8]"
            placeholder="Enter drink name"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="machine" className="block text-sm font-medium text-gray-700 mb-1">
            Select Machine*
          </label>
          <select
            id="machine"
            name="machine"
            value={formData.machine}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#38bdf8]"
            disabled={loadingMachines || !machines}
          >
            <option value="">Select a vending machine</option>
            {machines?.map((machine) => (
              <option key={machine.id} value={machine.id}>
                {machine.name} - {machine.city}, {machine.country}
              </option>
            ))}
          </select>
          {loadingMachines && (
            <p className="text-sm text-gray-500 mt-1">Loading machines...</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting || loadingMachines}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isSubmitting || loadingMachines
              ? "bg-[#93c5fd] cursor-not-allowed" 
              : "bg-[#2563eb] hover:bg-[#1d4ed8]"
          } transition-colors`}
        >
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
} 