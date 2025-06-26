"use server"

import { DiscordNotificationEvent } from '@/lib/kafka';
import { sendKafkaEventNotification } from '@/lib/discord';

/**
 * Handler for Discord notification events
 * Processes events from the Discord notification topic and sends them to Discord
 */
class DiscordNotificationHandler {
  async handle(event: DiscordNotificationEvent): Promise<void> {
    console.log(`\n📢 Processing discord.notification event (ID: ${event.id})`);
    
    try {
      const { eventType, originalEventData, success, error } = event.data;
      
      console.log(`Discord notification for ${eventType} event (success: ${success})`);
      
      // Send the notification to Discord using the original function
      await sendKafkaEventNotification({
        eventType,
        eventData: originalEventData,
        success,
        error: error ? new Error(error) : null
      });
      
      console.log(`✅ Discord notification sent successfully for ${eventType} event (ID: ${event.id})`);
      
    } catch (discordError) {
      console.error(`❌ Failed to send Discord notification for event ${event.id}:`, discordError);
      
      // In production, you might want to:
      // 1. Retry the notification with exponential backoff
      // 2. Send to a dead letter queue after max retries
      // 3. Alert admins about persistent Discord issues
      
      // For now, we'll just log the error and continue
      // The event will be marked as processed to avoid infinite retries
    }
  }
}

export async function createDiscordNotificationHandler(): Promise<DiscordNotificationHandler> {
  console.log('Creating DiscordNotificationHandler');
  return new DiscordNotificationHandler();
} 