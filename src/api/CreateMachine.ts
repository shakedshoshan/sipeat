import { supabase } from '@/lib/supabase';
import { Machine } from '@/types/types_db';
import { sendMessage } from '@/lib/kafka';
import { KafkaTopic, createKafkaEvent, MachineCreatedEvent } from '@/types/kafka-events';

export type MachineData = Omit<Machine, 'id'>;

/**
 * Creates a new vending machine in the database
 * @param machineData The machine data to create
 * @returns The created machine data with ID, or null if there was an error
 */
export async function createMachine(machineData: MachineData) {
  try {
    // Validate required fields
    if (!machineData.name || !machineData.country || !machineData.city) {
      throw new Error('Missing required fields: name, country, and city are required');
    }

    // Insert the machine into the database
    const { data, error } = await supabase
      .from('machine')
      .insert([
        {
          name: machineData.name,
          country: machineData.country,
          city: machineData.city,
          street: machineData.street || null,
        }
      ])
      .select();

    if (error) {
      console.error('Error creating machine:', error);
      throw error;
    }

    const createdMachine = data?.[0] as Machine;
    
    if (createdMachine) {
      // Publish machine created event to Kafka
      const machineEvent: MachineCreatedEvent = {
        id: createdMachine.id,
        name: createdMachine.name,
        address: createdMachine.street || '',
        city: createdMachine.city,
        country: createdMachine.country,
        contactName: '', // Add these fields to your machine table if needed
        contactEmail: '',
        contactPhone: '',
        timestamp: new Date().toISOString(),
      };
      
      const kafkaEvent = createKafkaEvent(KafkaTopic.MACHINE_CREATED, machineEvent);
      await sendMessage(KafkaTopic.MACHINE_CREATED, kafkaEvent);
      
      // Also send a notification event
      const notificationEvent = createKafkaEvent(KafkaTopic.NOTIFICATION, {
        type: 'machine',
        message: `New machine registered: ${createdMachine.name} in ${createdMachine.city}, ${createdMachine.country}`,
        timestamp: new Date().toISOString(),
      });
      await sendMessage(KafkaTopic.NOTIFICATION, notificationEvent);
    }

    return createdMachine || null;
  } catch (error) {
    console.error('Failed to create machine:', error);
    return null;
  }
}

/**
 * API handler for creating a machine via API route
 * For use in Next.js API routes
 */
export async function createMachineHandler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const machineData: MachineData = await req.json();
    const result = await createMachine(machineData);
    
    if (!result) {
      return new Response(JSON.stringify({ error: 'Failed to create machine' }), {
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
