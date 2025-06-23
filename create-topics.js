/**
 * Kafka Topic Creation Script
 * 
 * This script verifies that the required Kafka topics exist and creates them if needed.
 */

const { Kafka } = require('kafkajs');

// Topics to create
const TOPICS = [
  'contact-created',
  'machine-created',
  'request-created',
  'notification'
];

// Create Kafka client
const kafka = new Kafka({
  clientId: 'topic-creator',
  brokers: ['localhost:9092']
});

// Create admin client
const admin = kafka.admin();

async function createTopics() {
  try {
    console.log('Connecting to Kafka...');
    await admin.connect();
    console.log('Connected to Kafka successfully');
    
    // Get existing topics
    const existingTopics = await admin.listTopics();
    console.log('Existing topics:', existingTopics);
    
    // Filter out topics that already exist
    const topicsToCreate = TOPICS.filter(topic => !existingTopics.includes(topic));
    
    if (topicsToCreate.length === 0) {
      console.log('All required topics already exist');
    } else {
      console.log(`Creating ${topicsToCreate.length} topics:`, topicsToCreate);
      
      // Create topics
      await admin.createTopics({
        topics: topicsToCreate.map(topic => ({
          topic,
          numPartitions: 1,        // For development, use 1 partition
          replicationFactor: 1     // For development, use 1 replica
        }))
      });
      
      console.log('Topics created successfully');
    }
    
    // List all topics to verify
    const updatedTopics = await admin.listTopics();
    console.log('Updated topic list:', updatedTopics);
    
    // Check if all required topics exist
    const missingTopics = TOPICS.filter(topic => !updatedTopics.includes(topic));
    if (missingTopics.length > 0) {
      console.error('Some topics were not created:', missingTopics);
      process.exit(1);
    } else {
      console.log('✅ All required topics exist');
    }
  } catch (error) {
    console.error('Error creating topics:', error);
    process.exit(1);
  } finally {
    await admin.disconnect();
    console.log('Disconnected from Kafka');
  }
}

// Run the function
createTopics(); 