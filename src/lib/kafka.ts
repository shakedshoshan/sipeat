"use server"

import { Kafka, Producer, Consumer, EachMessagePayload } from 'kafkajs';

// Kafka configuration
const kafka = new Kafka({
  clientId: 'sipeat-app',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

// Create producer instance
let producer: Producer | null = null;
export const getProducer = async (): Promise<Producer> => {
  if (!producer) {
    producer = kafka.producer();
    await producer.connect();
  }
  return producer;
};

// Create consumer instance
export const createConsumer = async (groupId: string): Promise<Consumer> => {
  const consumer = kafka.consumer({ groupId });
  await consumer.connect();
  return consumer;
};

// Event types for type safety
export interface BaseEvent {
  id: string;
  timestamp: string;
  source: string;
}

export interface ContactCreatedEvent extends BaseEvent {
  type: 'contact.created';
  data: {
    contactId: string;
    name: string;
    email: string;
    phone: string;
    company_name?: string;
    message: string;
  };
}

export interface RequestCreatedEvent extends BaseEvent {
  type: 'request.created';
  data: {
    requestId: string;
    customer_name: string;
    drink_name: string;
    machine_id: string;
    machine_name?: string;
  };
}

export interface MachineCreatedEvent extends BaseEvent {
  type: 'machine.created';
  data: {
    machineId: string;
    name: string;
    country: string;
    city: string;
    street?: string;
  };
}

export type SipeatEvent = ContactCreatedEvent | RequestCreatedEvent | MachineCreatedEvent;

// Topic names - converted to async function
const TOPICS_CONST = {
  CONTACT_EVENTS: 'sipeat.contact.events',
  REQUEST_EVENTS: 'sipeat.request.events',
  MACHINE_EVENTS: 'sipeat.machine.events',
} as const;

export async function getTopics() {
  return TOPICS_CONST;
}

// Event publisher utility - not exported directly
class EventPublisher {
  private producer: Producer | null = null;

  async initialize() {
    this.producer = await getProducer();
  }

  async publishEvent(topic: string, event: SipeatEvent) {
    if (!this.producer) {
      await this.initialize();
    }

    await this.producer!.send({
      topic,
      messages: [{
        key: event.id,
        value: JSON.stringify(event),
        headers: {
          eventType: Buffer.from(event.type),
          timestamp: Buffer.from(event.timestamp),
        },
      }],
    });

    console.log(`Published event ${event.type} to topic ${topic}:`, event.id);
  }
}

// Singleton event publisher
const eventPublisher = new EventPublisher();

// Export an async function to get the event publisher
export async function getEventPublisher(): Promise<EventPublisher> {
  return eventPublisher;
}

// Event handler interface - not exported directly
interface EventHandler<T extends SipeatEvent> {
  handle(event: T): Promise<void>;
}

// Export an async function to create an event handler type
export async function createEventHandler<T extends SipeatEvent>(
  handler: (event: T) => Promise<void>
): Promise<{ handle(event: T): Promise<void> }> {
  return {
    handle: handler
  };
}

// Consumer utility for processing events - not exported directly
class EventConsumer {
  private consumer: Consumer | null = null;
  private handlers: Map<string, EventHandler<any>[]> = new Map();

  constructor(private groupId: string) {}

  async initialize() {
    this.consumer = await createConsumer(this.groupId);
  }

  registerHandler<T extends SipeatEvent>(eventType: string, handler: EventHandler<T>) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);
    console.log(`Registered handler for event type: ${eventType}`);
  }

  async subscribe(topics: string[]) {
    if (!this.consumer) {
      await this.initialize();
    }

    await this.consumer!.subscribe({ topics });

    await this.consumer!.run({
      eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
        try {
          // Ensure message has a value
          if (!message.value) {
            console.error('Received message with no value');
            return;
          }

          // Parse the message value
          const messageValue = message.value.toString();
          console.log(`Received raw message: ${messageValue.substring(0, 100)}...`);
          
          let eventData: SipeatEvent;
          try {
            eventData = JSON.parse(messageValue) as SipeatEvent;
          } catch (parseError) {
            console.error('Failed to parse message as JSON:', parseError);
            console.error('Raw message:', messageValue);
            return;
          }

          // Validate event data
          if (!eventData || !eventData.type) {
            console.error('Invalid event data, missing type:', eventData);
            return;
          }

          console.log(`Processing event ${eventData.type} from topic ${topic} (ID: ${eventData.id})`);
          
          // Get handlers for this event type
          const handlers = this.handlers.get(eventData.type) || [];
          
          if (handlers.length === 0) {
            console.warn(`No handlers registered for event type: ${eventData.type}`);
            return;
          }
          
          console.log(`Found ${handlers.length} handler(s) for event type: ${eventData.type}`);

          // Process handlers in parallel for better performance
          await Promise.all(
            handlers.map(async (handler) => {
              try {
                console.log(`Executing handler for event ${eventData.type} (ID: ${eventData.id})`);
                await handler.handle(eventData);
                console.log(`Handler executed successfully for event ${eventData.type} (ID: ${eventData.id})`);
              } catch (handlerError) {
                console.error(`Handler error for event ${eventData.type}:`, handlerError);
              }
            })
          );
        } catch (error) {
          console.error('Error processing message:', error);
          // In production, you might want to send to a dead letter queue
        }
      },
    });
    
    console.log(`Subscribed to topics: ${topics.join(', ')}`);
  }

  async shutdown() {
    if (this.consumer) {
      await this.consumer.disconnect();
    }
  }
}

// Export an async function to create an event consumer
export async function createEventConsumerInstance(groupId: string): Promise<EventConsumer> {
  const consumer = new EventConsumer(groupId);
  return consumer;
} 