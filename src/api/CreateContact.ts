import { supabase } from '@/lib/supabase';

export type ContactData = {
  name: string;
  email: string;
  phone: number;
  message: string;
};

/**
 * Creates a new contact submission in the database
 * @param contactData The contact data to create
 * @returns The created contact data with ID, or null if there was an error
 */
export async function createContact(contactData: ContactData) {
  try {
    // Validate required fields
    if (!contactData.name || !contactData.email || !contactData.phone || !contactData.message) {
      throw new Error('Missing required fields: name, email, phone, and message are required');
    }

    // Insert the contact into the database
    const { data, error } = await supabase
      .from('contact')
      .insert([
        {
          name: contactData.name,
          email: contactData.email,
          phone: contactData.phone,
          message: contactData.message,
        }
      ])
      .select();

    if (error) {
      console.error('Error creating contact submission:', error);
      throw error;
    }

    return data?.[0] || null;
  } catch (error) {
    console.error('Failed to create contact submission:', error);
    return null;
  }
}

/**
 * API handler for creating a contact submission via API route
 * For use in Next.js API routes
 */
export async function createContactHandler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const contactData: ContactData = await req.json();
    const result = await createContact(contactData);
    
    if (!result) {
      return new Response(JSON.stringify({ error: 'Failed to create contact submission' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request data', details: error }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 