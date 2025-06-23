import type { NextApiRequest, NextApiResponse } from 'next';
import { sendMessage } from '@/lib/kafka';
import { KafkaTopic, createKafkaEvent } from '@/types/kafka-events';

/**
 * API route to test Kafka integration
 * This route sends a test message to Kafka and returns the result
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Create a test notification event
    const testEvent = createKafkaEvent(KafkaTopic.NOTIFICATION, {
      type: 'contact',
      message: 'This is a test message from the API route',
      recipientEmail: 'test@example.com',
      timestamp: new Date().toISOString(),
    });

    // Send the test message to Kafka
    const result = await sendMessage(KafkaTopic.NOTIFICATION, testEvent);

    if (result) {
      return res.status(200).json({ 
        success: true, 
        message: 'Test message sent to Kafka successfully',
        event: testEvent
      });
    } else {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to send test message to Kafka'
      });
    }
  } catch (error) {
    console.error('Error in test-kafka API route:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    });
  }
} 