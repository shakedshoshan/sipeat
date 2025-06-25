"use server"

import { createEventConsumerInstance, getTopics } from '@/lib/kafka';
import { createContactCreatedHandler } from './handlers/ContactHandlers';
import { createRequestCreatedHandler } from './handlers/RequestHandlers';
import { createMachineCreatedHandler } from './handlers/MachineHandlers';

class SipeatEventConsumer {
  private contactConsumer: any | null; // Using any temporarily
  private requestConsumer: any | null; // Using any temporarily
  private machineConsumer: any | null; // Using any temporarily
  private topics: any; // Store topics

  constructor() {
    // Initialize consumers as null, will create them in initialize method
    this.contactConsumer = null;
    this.requestConsumer = null;
    this.machineConsumer = null;
    this.topics = null;
  }

  async initialize() {
    try {
      console.log('🚀 Initializing SipEat Event Consumers...');

      // Get topics
      this.topics = await getTopics();

      // Create consumers using the async factory function
      this.contactConsumer = await createEventConsumerInstance('sipeat-contact-processor');
      this.requestConsumer = await createEventConsumerInstance('sipeat-request-processor');
      this.machineConsumer = await createEventConsumerInstance('sipeat-machine-processor');

      // Register event handlers using factory functions
      const contactHandler = await createContactCreatedHandler();
      const requestHandler = await createRequestCreatedHandler();
      const machineHandler = await createMachineCreatedHandler();
      
      this.contactConsumer.registerHandler('contact.created', contactHandler);
      this.requestConsumer.registerHandler('request.created', requestHandler);
      this.machineConsumer.registerHandler('machine.created', machineHandler);

      // Subscribe to topics
      await Promise.all([
        this.contactConsumer.subscribe([this.topics.CONTACT_EVENTS]),
        this.requestConsumer.subscribe([this.topics.REQUEST_EVENTS]),
        this.machineConsumer.subscribe([this.topics.MACHINE_EVENTS]),
      ]);

      console.log('✅ All event consumers initialized successfully');
      console.log('📡 Listening for events on topics:');
      console.log(`   - ${this.topics.CONTACT_EVENTS}`);
      console.log(`   - ${this.topics.REQUEST_EVENTS}`);
      console.log(`   - ${this.topics.MACHINE_EVENTS}`);
      
    } catch (error) {
      console.error('❌ Failed to initialize event consumers:', error);
      throw error;
    }
  }

  async shutdown() {
    console.log('🛑 Shutting down event consumers...');
    await Promise.all([
      this.contactConsumer.shutdown(),
      this.requestConsumer.shutdown(),
      this.machineConsumer.shutdown(),
    ]);
    console.log('✅ All consumers shut down gracefully');
  }

  // Health check method
  getHealthStatus() {
    if (!this.topics) return { status: 'not initialized' };
    
    return {
      status: 'healthy',
      consumers: {
        contact: 'running',
        request: 'running',
        machine: 'running',
      },
      topics: [
        this.topics.CONTACT_EVENTS,
        this.topics.REQUEST_EVENTS,
        this.topics.MACHINE_EVENTS,
      ]
    };
  }
}

// Singleton instance
export const sipeatEventConsumer = new SipeatEventConsumer();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  await sipeatEventConsumer.shutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  await sipeatEventConsumer.shutdown();
  process.exit(0);
}); 