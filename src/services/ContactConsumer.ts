import { createTopicConsumer } from '@/lib/kafka';
import { KafkaTopic, ContactCreatedEvent } from '@/types/kafka-events';

/**
 * Handles contact created events from Kafka
 * @param message The contact created event message
 */
async function handleContactCreated(message: any) {
  try {
    const contactEvent = message.data as ContactCreatedEvent;
    
    console.log('Processing new contact submission:', contactEvent);
    
    // Here you would implement business logic for processing new contacts
    // For example:
    // 1. Add to CRM system
    // 2. Start a follow-up workflow
    // 3. Assign to a sales representative
    
    await processNewContact(contactEvent);
  } catch (error) {
    console.error('Error handling contact created event:', error);
  }
}

/**
 * Processes a new contact submission
 * @param contact The contact data
 */
async function processNewContact(contact: ContactCreatedEvent) {
  // In a real application, you would implement your business logic here
  
  // Example: Add to CRM system
  console.log(`Adding ${contact.name} to CRM system...`);
  // await addToCRM(contact);
  
  // Example: Start a follow-up workflow
  console.log(`Starting follow-up workflow for ${contact.email}...`);
  // await startFollowUpWorkflow(contact);
  
  // Example: Assign to a sales representative
  console.log(`Assigning ${contact.name} to a sales representative...`);
  // await assignToSalesRep(contact);
  
  console.log('Contact processing completed.');
}

/**
 * Initializes the contact consumer
 */
export async function initializeContactConsumer() {
  try {
    console.log('Initializing contact consumer...');
    
    const consumer = await createTopicConsumer(
      'sipeat-contact-consumer',
      KafkaTopic.CONTACT_CREATED,
      handleContactCreated
    );
    
    console.log('Contact consumer initialized successfully');
    
    return consumer;
  } catch (error) {
    console.error('Failed to initialize contact consumer:', error);
    throw error;
  }
} 