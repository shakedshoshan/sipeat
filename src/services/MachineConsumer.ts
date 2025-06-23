import { createTopicConsumer } from '@/lib/kafka';
import { KafkaTopic, MachineCreatedEvent } from '@/types/kafka-events';

/**
 * Handles machine created events from Kafka
 * @param message The machine created event message
 */
async function handleMachineCreated(message: any) {
  try {
    const machineEvent = message.data as MachineCreatedEvent;
    
    console.log('Processing new machine registration:', machineEvent);
    
    // Here you would implement business logic for processing new machines
    // For example:
    // 1. Register in inventory system
    // 2. Schedule installation
    // 3. Notify maintenance team
    
    await processNewMachine(machineEvent);
  } catch (error) {
    console.error('Error handling machine created event:', error);
  }
}

/**
 * Processes a new machine registration
 * @param machine The machine data
 */
async function processNewMachine(machine: MachineCreatedEvent) {
  // In a real application, you would implement your business logic here
  
  // Example: Register in inventory system
  console.log(`Registering machine ${machine.name} in inventory system...`);
  // await registerInInventory(machine);
  
  // Example: Schedule installation
  console.log(`Scheduling installation for machine at ${machine.address}, ${machine.city}...`);
  // await scheduleInstallation(machine);
  
  // Example: Notify maintenance team
  console.log(`Notifying maintenance team about new machine in ${machine.city}...`);
  // await notifyMaintenanceTeam(machine);
  
  console.log('Machine processing completed.');
}

/**
 * Initializes the machine consumer
 */
export async function initializeMachineConsumer() {
  try {
    console.log('Initializing machine consumer...');
    
    const consumer = await createTopicConsumer(
      'sipeat-machine-consumer',
      KafkaTopic.MACHINE_CREATED,
      handleMachineCreated
    );
    
    console.log('Machine consumer initialized successfully');
    
    return consumer;
  } catch (error) {
    console.error('Failed to initialize machine consumer:', error);
    throw error;
  }
} 