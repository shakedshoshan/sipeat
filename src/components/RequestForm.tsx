"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { DrinkRequestData } from "@/api/CreateRequest";
import { useSupabaseQuery } from "@/hooks/useSupabase";
import { Machine } from "@/types/types_db";
import { Messages } from "@/types/translate_type";
import { drinksList, Drink } from "@/types/drinks_list";

export default function RequestForm() {
  const [messages, setMessages] = useState<Messages | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState<string>('he');
  const router = useRouter();
  const [formData, setFormData] = useState<DrinkRequestData>({
    customer_name: "",
    drink_name: "",
    machine: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter drinks based on search term and current language
  const filteredDrinks = drinksList.filter(drink => 
    drink.translations[language as keyof typeof drink.translations]
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const currentLanguage = localStorage.getItem('language') || 'he';
        setLanguage(currentLanguage);
        const translations = await import(`@/messages/${currentLanguage}.json`);
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

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
    // Handle touch events for mobile devices
  useEffect(() => {
    if (!dropdownRef.current) return;
    
    const dropdownElement = dropdownRef.current.querySelector('.dropdown-content');
    const inputElement = dropdownRef.current.querySelector('#drink_search') as HTMLElement | null;
    
    // Prevent default touch behaviors that might interfere with dropdown
    function handleTouchMove(e: Event) {
      const touchEvent = e as unknown as TouchEvent;
      if (isDropdownOpen && dropdownElement?.contains(touchEvent.target as Node)) {
        // Allow scrolling within the dropdown
        e.stopPropagation();
      }
    }
    
    // Force open dropdown on input touch
    function handleInputTouch(e: Event) {
      setIsDropdownOpen(true);
      // Delay focus to ensure dropdown opens properly on mobile
      setTimeout(() => {
        const target = e.target as HTMLElement;
        target.focus();
      }, 100);
    }
    
    // Ensure dropdown stays open during scrolling
    function handleTouchStart(e: Event) {
      const touchEvent = e as unknown as TouchEvent;
      if (dropdownElement?.contains(touchEvent.target as Node)) {
        e.stopPropagation();
      }
    }
    
    if (inputElement) {
      inputElement.addEventListener('touchstart', handleInputTouch, { passive: false } as AddEventListenerOptions);
    }
    
    document.addEventListener('touchmove', handleTouchMove, { passive: false } as AddEventListenerOptions);
    document.addEventListener('touchstart', handleTouchStart, { passive: false } as AddEventListenerOptions);
    
    return () => {
      if (inputElement) {
        inputElement.removeEventListener('touchstart', handleInputTouch);
      }
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, [isDropdownOpen]);

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

  const handleDrinkSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleDrinkSelect = (drink: Drink) => {
    // Store the English name in the database but display the localized name
    setFormData((prev) => ({
      ...prev,
      drink_name: drink.translations.en,
    }));
    setSearchTerm(drink.translations[language as keyof typeof drink.translations]);
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Find the selected machine to get its name
      const selectedMachine = machines?.find(m => m.id === formData.machine);
      const machineName = selectedMachine?.name || formData.machine;

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

      // Redirect to status page with customer_name and machine_name as URL params
      router.push(`/status?customer_name=${encodeURIComponent(formData.customer_name)}&machine_name=${encodeURIComponent(machineName)}&type=request`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      setIsSubmitting(false);
    }
  };

  if (isLoading || !messages) {
    return <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md">Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-[#2563eb] mb-6">{messages.requestForm.title}</h2>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      {machinesError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
          {messages.requestForm.errorLoadingMachines}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-1">
            {messages.requestForm.customerName}
          </label>
          <input
            type="text"
            id="customer_name"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#38bdf8]"
            placeholder={messages.requestForm.customerNamePlaceholder}
          />
        </div>
        
        <div className="mb-4 relative" ref={dropdownRef}>
          <label htmlFor="drink_search" className="block text-sm font-medium text-gray-700 mb-1">
            {messages.requestForm.drinkName}
          </label>
          <div className="relative">
            <input
              type="text"
              id="drink_search"
              value={searchTerm}
              onChange={handleDrinkSearch}
              onClick={() => setIsDropdownOpen(true)}
              onTouchStart={() => setIsDropdownOpen(true)}
              onFocus={() => setIsDropdownOpen(true)}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#38bdf8]"
              placeholder={messages.requestForm.drinkNamePlaceholder}
              autoComplete="off"
              role="combobox"
              aria-expanded={isDropdownOpen}
              aria-haspopup="listbox"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-2"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-label="Toggle dropdown"
            >
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <input 
              type="hidden" 
              name="drink_name" 
              value={formData.drink_name} 
            />
            
            {isDropdownOpen && (
              <div className="dropdown-content absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm touch-auto overscroll-contain">
              {filteredDrinks.length > 0 ? (
                filteredDrinks.map((drink) => (
                  <button
                    type="button"
                    key={drink.id}
                    className="w-full text-left cursor-pointer select-none relative py-4 pl-3 pr-3 hover:bg-gray-100 touch-auto md:py-2"
                    onClick={() => handleDrinkSelect(drink)}
                  >
                    {drink.translations[language as keyof typeof drink.translations]}
                  </button>
                ))
              ) : (
                <div className="cursor-default select-none relative py-2 pl-3 pr-9 text-gray-500">
                  No drinks found
                </div>
              )}
              </div>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="machine" className="block text-sm font-medium text-gray-700 mb-1">
            {messages.requestForm.selectMachine}
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
            <option value="">{messages.requestForm.selectMachinePlaceholder}</option>
            {machines?.map((machine) => (
              <option key={machine.id} value={machine.id}>
                {machine.name} - {machine.city}, {machine.country}
              </option>
            ))}
          </select>
          {loadingMachines && (
            <p className="text-sm text-gray-500 mt-1">{messages.requestForm.loadingMachines}</p>
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
          {isSubmitting ? messages.requestForm.submittingButton : messages.requestForm.submitButton}
        </button>
      </form>
    </div>
  );
} 