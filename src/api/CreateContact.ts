import { supabase } from '@/lib/supabase';
import { sendMessage } from '@/lib/kafka';
import { KafkaTopic, createKafkaEvent, ContactCreatedEvent } from '@/types/kafka-events';

export type ContactData = {
  name: string;
  email: string;
  phone: number;
  company_name?: string | null;
  mechine_location?: string | null;
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
          company_name: contactData.company_name || null,
          mechine_location: contactData.mechine_location || null,
          message: contactData.message,
        }
      ])
      .select();

    if (error) {
      console.error('Error creating contact submission:', error);
      throw error;
    }

    const createdContact = data?.[0];
    
    if (createdContact) {
      // KAFKA INTEGRATION:
      // After successfully creating a contact in the database,
      // we publish events to Kafka to trigger asynchronous processing
      
      // 1. Create a contact event with the relevant data
      // This follows the Event Sourcing pattern - capturing state changes as events
      const contactEvent: ContactCreatedEvent = {
        id: createdContact.id,
        name: createdContact.name,
        email: createdContact.email,
        phone: createdContact.phone.toString(),
        message: createdContact.message,
        timestamp: new Date().toISOString(),
      };
      
      // 2. Use the event factory to create a properly formatted Kafka event
      const kafkaEvent = createKafkaEvent(KafkaTopic.CONTACT_CREATED, contactEvent);
      
      // 3. Publish the event to the contact-created topic
      // This implements the Publisher part of the Publisher-Subscriber pattern
      await sendMessage(KafkaTopic.CONTACT_CREATED, kafkaEvent);
      
      // 4. Also send a notification event to a separate topic
      // This demonstrates how one action can trigger multiple events
      const notificationEvent = createKafkaEvent(KafkaTopic.NOTIFICATION, {
        type: 'contact',
        message: `New contact submission from ${createdContact.name}`,
        recipientEmail: 'shakedshoshan8@gmail.com', // Replace with actual admin email
        timestamp: new Date().toISOString(),
      });
      await sendMessage(KafkaTopic.NOTIFICATION, notificationEvent);
    }

    return createdContact || null;
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