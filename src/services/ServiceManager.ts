import { initializeKafka, disconnectProducer } from '@/lib/kafka';
import { initializeNotificationConsumer } from './NotificationConsumer';
import { initializeContactConsumer } from './ContactConsumer';
import { initializeMachineConsumer } from './MachineConsumer';
import { initializeRequestConsumer } from './RequestConsumer';

/**
 * Service Manager
 * 
 * This module manages the lifecycle of all Kafka services in the application.
 * It follows:
 * 1. Facade Pattern by providing a simplified interface to the complex subsystem of Kafka services
 * 2. Mediator Pattern by centralizing the initialization and shutdown of services
 * 3. Dependency Injection by importing and managing service dependencies
 */

// Keep track of active consumers for graceful shutdown
const activeConsumers: any[] = [];

/**
 * Initializes all Kafka services
 * This method starts the Kafka producer and all consumer services
 * 
 * @returns Promise resolving to true if all services initialized successfully, false otherwise
 */
export async function initializeServices() {
  try {
    console.log('Initializing Kafka services...');
    
    // Step 1: Initialize the Kafka producer first
    // This ensures we can publish messages before starting consumers
    const producerConnected = await initializeKafka();
    if (!producerConnected) {
      console.error('Failed to connect Kafka producer. Services will not be initialized.');
      return false;
    }
    
    // Step 2: Initialize all consumer services
    // Each consumer subscribes to a specific Kafka topic
    const notificationConsumer = await initializeNotificationConsumer();
    const contactConsumer = await initializeContactConsumer();
    const machineConsumer = await initializeMachineConsumer();
    const requestConsumer = await initializeRequestConsumer();
    
    // Step 3: Track active consumers for graceful shutdown
    // This ensures we can properly disconnect all consumers when shutting down
    activeConsumers.push(
      notificationConsumer,
      contactConsumer,
      machineConsumer,
      requestConsumer
    );
    
    console.log('All Kafka services initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing Kafka services:', error);
    return false;
  }
}

/**
 * Shuts down all Kafka services
 * This method gracefully disconnects all consumers and the producer
 * 
 * @returns Promise resolving to true if all services shut down successfully, false otherwise
 */
export async function shutdownServices() {
  try {
    console.log('Shutting down Kafka services...');
    
    // Step 1: Disconnect all consumers first
    // This ensures we stop processing messages before disconnecting the producer
    for (const consumer of activeConsumers) {
      if (consumer && typeof consumer.disconnect === 'function') {
        await consumer.disconnect();
      }
    }
    
    // Step 2: Clear the active consumers list
    activeConsumers.length = 0;
    
    // Step 3: Disconnect the producer last
    // This ensures all messages have been sent before disconnecting
    await disconnectProducer();
    
    console.log('All Kafka services shut down successfully');
    return true;
  } catch (error) {
    console.error('Error shutting down Kafka services:', error);
    return false;
  }
} 