import { supabase } from '@/lib/supabase';
import { DrinkRequest } from '@/types/types_db';

export type DrinkRequestData = Omit<DrinkRequest, 'id'>;

/**
 * Creates a new drink request in the database
 * @param requestData The request data to create
 * @returns The created request data with ID, or null if there was an error
 */
export async function createDrinkRequest(requestData: DrinkRequestData) {
  try {
    // Validate required fields
    if (!requestData.customer_name || !requestData.drink_name || !requestData.machine) {
      throw new Error('Missing required fields: customer_name, drink_name, and machine are required');
    }

    // Insert the request into the database
    const { data, error } = await supabase
      .from('request')
      .insert([
        {
          customer_name: requestData.customer_name,
          drink_name: requestData.drink_name,
          machine: requestData.machine,
          message: requestData.message || null,
        }
      ])
      .select();

    if (error) {
      console.error('Error creating drink request:', error);
      throw error;
    }

    return data?.[0] as DrinkRequest || null;
  } catch (error) {
    console.error('Failed to create drink request:', error);
    return null;
  }
}

/**
 * API handler for creating a drink request via API route
 * For use in Next.js API routes
 */
export async function createRequestHandler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const requestData: DrinkRequestData = await req.json();
    const result = await createDrinkRequest(requestData);
    
    if (!result) {
      return new Response(JSON.stringify({ error: 'Failed to create drink request' }), {
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