import { Kafka } from 'kafkajs';
// Import our custom socket factory
// @ts-ignore - Ignore TypeScript errors for the custom module
import createCustomSocketFactory from './customSocketFactory';

/**
 * Kafka Client Implementation
 * 
 * This file implements the core Kafka functionality for the application:
 * - Creates a connection to the Kafka broker
 * - Provides a producer for sending messages to topics
 * - Provides a factory for creating consumers that listen to topics
 * 
 * The implementation follows the Singleton pattern for the producer
 * to ensure we have only one connection to Kafka throughout the application.
 */

// Determine if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

// Create a Kafka client with connection to the broker
const kafka = new Kafka({
  clientId: 'sipeat-app',  // Unique identifier for this application instance
  brokers: ['localhost:9092'],  // Kafka broker addresses
  // The socketFactory is now handled by our webpack alias in next.config.ts
  // This ensures the correct implementation is used in both browser and server environments
});

// Create a singleton producer instance to be reused across the application
// This follows the Singleton pattern to avoid creating multiple connections
const producer = kafka.producer();

/**
 * Factory function for creating consumer instances
 * This follows the Factory pattern to create configured consumers
 * 
 * @param groupId - Consumer group ID for managing offsets and consumer balancing
 * @returns A configured Kafka consumer instance
 */
const createConsumer = (groupId: string) => {
  return kafka.consumer({ groupId });
};

/**
 * Initializes the Kafka producer connection
 * Should be called when the application starts
 * 
 * @returns Promise resolving to true if connection successful, false otherwise
 */
export const initializeKafka = async () => {
  try {
    // In browser environments, we don't actually connect to Kafka
    if (isBrowser) {
      console.log('Browser environment detected - skipping actual Kafka connection');
      return true;
    }
    
    await producer.connect();
    console.log('Kafka producer connected successfully');
    return true;
  } catch (error) {
    console.error('Failed to connect to Kafka:', error);
    return false;
  }
};

/**
 * Sends a message to a Kafka topic
 * Implements the Publisher part of the Publisher-Subscriber pattern
 * 
 * @param topic - The Kafka topic to send the message to
 * @param message - The message payload to send
 * @returns Promise resolving to true if message sent successfully, false otherwise
 */
export const sendMessage = async (topic: string, message: any) => {
  try {
    // In browser environments, we don't actually send to Kafka
    if (isBrowser) {
      console.log(`Browser environment - mock sending message to ${topic}:`, message);
      return true;
    }
    
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    return true;
  } catch (error) {
    console.error(`Error sending message to ${topic}:`, error);
    return false;
  }
};

/**
 * Creates and initializes a consumer for a specific topic
 * Implements the Subscriber part of the Publisher-Subscriber pattern
 * 
 * @param groupId - Consumer group ID for managing offsets
 * @param topic - The Kafka topic to subscribe to
 * @param messageHandler - Callback function to process received messages
 * @returns Promise resolving to the initialized consumer instance
 */
export const createTopicConsumer = async (groupId: string, topic: string, messageHandler: (message: any) => Promise<void>) => {
  // In browser environments, we return a mock consumer
  if (isBrowser) {
    console.log(`Browser environment - creating mock consumer for ${topic}`);
    const mockConsumer = {
      connect: async () => {},
      disconnect: async () => {},
      subscribe: async () => {},
      run: async () => {},
      stop: async () => {},
    };
    return mockConsumer;
  }
  
  const consumer = createConsumer(groupId);
  
  try {
    // Connect to Kafka broker
    await consumer.connect();
    
    // Subscribe to the specified topic
    await consumer.subscribe({ topic, fromBeginning: true });
    
    // Start consuming messages
    await consumer.run({
      eachMessage: async ({ message }) => {
        if (message.value) {
          // Parse the JSON message and pass to handler
          const parsedMessage = JSON.parse(message.value.toString());
          await messageHandler(parsedMessage);
        }
      },
    });
    
    return consumer;
  } catch (error) {
    console.error(`Error creating consumer for ${topic}:`, error);
    throw error;
  }
};

/**
 * Disconnects the Kafka producer
 * Should be called during application shutdown
 * 
 * @returns Promise resolving to true if disconnected successfully, false otherwise
 */
export const disconnectProducer = async () => {
  try {
    // In browser environments, we don't actually disconnect from Kafka
    if (isBrowser) {
      console.log('Browser environment - skipping Kafka disconnection');
      return true;
    }
    
    await producer.disconnect();
    return true;
  } catch (error) {
    console.error('Error disconnecting producer:', error);
    return false;
  }
}; 