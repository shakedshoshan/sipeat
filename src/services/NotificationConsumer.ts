import { createTopicConsumer } from '@/lib/kafka';
import { KafkaTopic, NotificationEvent } from '@/types/kafka-events';

/**
 * Notification Consumer Service
 * 
 * This service implements the Consumer part of the Publisher-Subscriber pattern.
 * It subscribes to the notification topic and processes notification events.
 * 
 * The service follows:
 * 1. Single Responsibility Principle by focusing only on notification processing
 * 2. Open/Closed Principle by allowing extension for new notification types
 * 3. Dependency Injection by accepting the message handler as a parameter
 */

/**
 * Handles notification events from Kafka
 * This is the main event handler that routes notifications to specific processors
 * based on their type
 * 
 * @param message The notification event message
 */
async function handleNotification(message: any) {
  try {
    const notification = message.data as NotificationEvent;
    
    console.log('Received notification:', notification);
    
    // Strategy Pattern: Select different processing strategies based on notification type
    switch (notification.type) {
      case 'contact':
        await sendContactNotification(notification);
        break;
      case 'machine':
        await sendMachineNotification(notification);
        break;
      case 'request':
        await sendRequestNotification(notification);
        break;
      default:
        console.log('Unknown notification type:', notification.type);
    }
  } catch (error) {
    console.error('Error handling notification:', error);
  }
}

/**
 * Sends a notification for a new contact submission
 * This is a specific notification strategy for contact events
 * 
 * @param notification The notification event
 */
async function sendContactNotification(notification: NotificationEvent) {
  // In a real application, you would send an email or other notification
  console.log('Sending contact notification:', notification.message);
  
  // Example: Send email to admin
  if (notification.recipientEmail) {
    // await sendEmail(notification.recipientEmail, 'New Contact Submission', notification.message);
    console.log(`Email would be sent to ${notification.recipientEmail}`);
  }
}

/**
 * Sends a notification for a new machine registration
 * This is a specific notification strategy for machine events
 * 
 * @param notification The notification event
 */
async function sendMachineNotification(notification: NotificationEvent) {
  // In a real application, you would send an email or other notification
  console.log('Sending machine notification:', notification.message);
  
  // Example: Update dashboard or send alert to operations team
  // await updateDashboard('machines', notification.message);
}

/**
 * Sends a notification for a new drink request
 * This is a specific notification strategy for request events
 * 
 * @param notification The notification event
 */
async function sendRequestNotification(notification: NotificationEvent) {
  // In a real application, you would send an email or other notification
  console.log('Sending request notification:', notification.message);
  
  // Example: Notify machine operator
  // await notifyOperator(notification.message);
}

/**
 * Initializes the notification consumer
 * This method creates and starts a Kafka consumer for the notification topic
 * 
 * @returns The initialized consumer instance
 */
export async function initializeNotificationConsumer() {
  try {
    console.log('Initializing notification consumer...');
    
    // Create a consumer for the notification topic
    // This implements the Subscriber part of the Publisher-Subscriber pattern
    const consumer = await createTopicConsumer(
      'sipeat-notification-consumer',  // Consumer group ID
      KafkaTopic.NOTIFICATION,         // Topic to subscribe to
      handleNotification               // Message handler function
    );
    
    console.log('Notification consumer initialized successfully');
    
    return consumer;
  } catch (error) {
    console.error('Failed to initialize notification consumer:', error);
    throw error;
  }
} 