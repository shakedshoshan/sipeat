/**
 * Kafka Event Types and Definitions
 * 
 * This file defines the structure of events that flow through the Kafka event bus.
 * It implements a type-safe approach to event handling using TypeScript interfaces
 * and enums to ensure consistency across producers and consumers.
 * 
 * The implementation follows:
 * 1. Domain-Driven Design principles by modeling events based on domain concepts
 * 2. Event Sourcing pattern by defining events that represent state changes
 * 3. Command Query Responsibility Segregation (CQRS) by separating write operations (events) from reads
 */

// Kafka Topics - Enum ensures we use consistent topic names across the application
export enum KafkaTopic {
  CONTACT_CREATED = 'contact-created',
  MACHINE_CREATED = 'machine-created',
  REQUEST_CREATED = 'request-created',
  NOTIFICATION = 'notification',
}

/**
 * Contact Event Types
 * Represents the data structure for contact creation events
 */
export interface ContactCreatedEvent {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  timestamp: string;
}

/**
 * Machine Event Types
 * Represents the data structure for machine registration events
 */
export interface MachineCreatedEvent {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  timestamp: string;
}

/**
 * Request Event Types
 * Represents the data structure for drink request events
 */
export interface RequestCreatedEvent {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  drinksList: string[];
  timestamp: string;
}

/**
 * Notification Event Types
 * Represents the data structure for system notification events
 * This is a cross-cutting concern that can be triggered by various sources
 */
export interface NotificationEvent {
  type: 'contact' | 'machine' | 'request';
  message: string;
  recipientEmail?: string;
  timestamp: string;
}

/**
 * Generic Event Interface
 * Provides a consistent envelope structure for all events
 * This follows the Envelope pattern for message passing
 */
export interface KafkaEvent<T> {
  eventId: string;         // Unique identifier for the event
  eventType: KafkaTopic;   // Type of event (corresponds to Kafka topic)
  data: T;                 // Event payload (varies by event type)
  metadata: {
    timestamp: string;     // When the event was created
    producer: string;      // Which service produced the event
  };
}

/**
 * Event Factory Function
 * Creates properly formatted events with all required metadata
 * Implements the Factory pattern for creating event objects
 * 
 * @param eventType - The type of event (from KafkaTopic enum)
 * @param data - The event payload
 * @param producer - The name of the producing service
 * @returns A properly formatted event object
 */
export const createKafkaEvent = <T>(
  eventType: KafkaTopic,
  data: T,
  producer = 'sipeat-app'
): KafkaEvent<T> => {
  return {
    eventId: `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
    eventType,
    data,
    metadata: {
      timestamp: new Date().toISOString(),
      producer,
    },
  };
}; 