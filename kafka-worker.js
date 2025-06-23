/**
 * Kafka Worker Script
 * 
 * This script runs Kafka consumers to process events from various topics.
 * It's designed to be run as a separate Node.js process.
 */

const { Kafka } = require('kafkajs');

// Topics to consume
const TOPICS = [
  'contact-created',
  'machine-created',
  'request-created',
  'notification'
];

// Create Kafka client
const kafka = new Kafka({
  clientId: 'sipeat-worker',
  brokers: ['localhost:9092']
});

// Create consumers
const consumers = {
  contact: kafka.consumer({ groupId: 'sipeat-contact-consumer' }),
  machine: kafka.consumer({ groupId: 'sipeat-machine-consumer' }),
  request: kafka.consumer({ groupId: 'sipeat-request-consumer' }),
  notification: kafka.consumer({ groupId: 'sipeat-notification-consumer' })
};

// Message handlers
const messageHandlers = {
  'contact-created': async (message) => {
    try {
      const data = JSON.parse(message.value.toString());
      console.log('📧 Processing contact event:', data);
      // Example: Log contact details
      if (data.data) {
        console.log(`Contact from: ${data.data.name} <${data.data.email}>`);
      }
    } catch (error) {
      console.error('Error processing contact message:', error);
    }
  },
  
  'machine-created': async (message) => {
    try {
      const data = JSON.parse(message.value.toString());
      console.log('🤖 Processing machine event:', data);
      // Example: Log machine details
      if (data.data) {
        console.log(`Machine: ${data.data.name} in ${data.data.city}, ${data.data.country}`);
      }
    } catch (error) {
      console.error('Error processing machine message:', error);
    }
  },
  
  'request-created': async (message) => {
    try {
      const data = JSON.parse(message.value.toString());
      console.log('🥤 Processing request event:', data);
      // Example: Log request details
      if (data.data) {
        console.log(`Request from: ${data.data.name} for ${data.data.drinksList?.join(', ')}`);
      }
    } catch (error) {
      console.error('Error processing request message:', error);
    }
  },
  
  'notification': async (message) => {
    try {
      const data = JSON.parse(message.value.toString());
      console.log('🔔 Processing notification event:', data);
      // Example: Log notification details
      if (data.data) {
        console.log(`Notification type: ${data.data.type}, Message: ${data.data.message}`);
        
        // Example: Log email recipient
        if (data.data.recipientEmail) {
          console.log(`Would send email to: ${data.data.recipientEmail}`);
        }
      }
    } catch (error) {
      console.error('Error processing notification message:', error);
    }
  }
};

// Start all consumers
async function startConsumers() {
  try {
    console.log('Starting Kafka consumers...');
    
    // Connect all consumers
    await Promise.all([
      consumers.contact.connect(),
      consumers.machine.connect(),
      consumers.request.connect(),
      consumers.notification.connect()
    ]);
    
    console.log('All consumers connected');
    
    // Subscribe to topics
    await consumers.contact.subscribe({ topic: 'contact-created', fromBeginning: true });
    await consumers.machine.subscribe({ topic: 'machine-created', fromBeginning: true });
    await consumers.request.subscribe({ topic: 'request-created', fromBeginning: true });
    await consumers.notification.subscribe({ topic: 'notification', fromBeginning: true });
    
    console.log('Subscribed to all topics');
    
    // Start consuming messages
    await consumers.contact.run({ 
      eachMessage: async ({ topic, partition, message }) => {
        await messageHandlers['contact-created'](message);
      }
    });
    
    await consumers.machine.run({ 
      eachMessage: async ({ topic, partition, message }) => {
        await messageHandlers['machine-created'](message);
      }
    });
    
    await consumers.request.run({ 
      eachMessage: async ({ topic, partition, message }) => {
        await messageHandlers['request-created'](message);
      }
    });
    
    await consumers.notification.run({ 
      eachMessage: async ({ topic, partition, message }) => {
        await messageHandlers['notification'](message);
      }
    });
    
    console.log('All consumers are running');
    console.log('Kafka worker is ready to process events');
  } catch (error) {
    console.error('Error starting consumers:', error);
    await stopConsumers();
    process.exit(1);
  }
}

// Stop all consumers
async function stopConsumers() {
  try {
    console.log('Stopping Kafka consumers...');
    
    // Disconnect all consumers
    await Promise.all([
      consumers.contact.disconnect(),
      consumers.machine.disconnect(),
      consumers.request.disconnect(),
      consumers.notification.disconnect()
    ]);
    
    console.log('All consumers disconnected');
  } catch (error) {
    console.error('Error stopping consumers:', error);
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('Received SIGINT signal');
  await stopConsumers();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM signal');
  await stopConsumers();
  process.exit(0);
});

// Start the worker
console.log('Starting Kafka worker...');
startConsumers(); 