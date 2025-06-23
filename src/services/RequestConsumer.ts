import { createTopicConsumer } from '@/lib/kafka';
import { KafkaTopic, RequestCreatedEvent } from '@/types/kafka-events';

/**
 * Handles request created events from Kafka
 * @param message The request created event message
 */
async function handleRequestCreated(message: any) {
  try {
    const requestEvent = message.data as RequestCreatedEvent;
    
    console.log('Processing new drink request:', requestEvent);
    
    // Here you would implement business logic for processing new requests
    // For example:
    // 1. Update inventory
    // 2. Schedule restocking
    // 3. Generate analytics
    
    await processNewRequest(requestEvent);
  } catch (error) {
    console.error('Error handling request created event:', error);
  }
}

/**
 * Processes a new drink request
 * @param request The request data
 */
async function processNewRequest(request: RequestCreatedEvent) {
  // In a real application, you would implement your business logic here
  
  // Example: Update inventory
  console.log(`Updating inventory for drinks: ${request.drinksList.join(', ')}...`);
  // await updateInventory(request.drinksList);
  
  // Example: Schedule restocking if necessary
  console.log(`Checking if restocking is needed for machine at ${request.address}...`);
  // const needsRestocking = await checkInventoryLevels(request.machineId);
  // if (needsRestocking) {
  //   await scheduleRestocking(request.machineId);
  // }
  
  // Example: Generate analytics
  console.log(`Updating analytics for customer preferences in ${request.city}...`);
  // await updateAnalytics(request);
  
  console.log('Request processing completed.');
}

/**
 * Initializes the request consumer
 */
export async function initializeRequestConsumer() {
  try {
    console.log('Initializing request consumer...');
    
    const consumer = await createTopicConsumer(
      'sipeat-request-consumer',
      KafkaTopic.REQUEST_CREATED,
      handleRequestCreated
    );
    
    console.log('Request consumer initialized successfully');
    
    return consumer;
  } catch (error) {
    console.error('Failed to initialize request consumer:', error);
    throw error;
  }
}