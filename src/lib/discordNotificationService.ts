"use server"

import { getEventPublisher, getTopics, DiscordNotificationEvent } from './kafka';

/**
 * Service to publish Discord notification events to Kafka
 * This decouples Discord notifications from business logic
 */
export class DiscordNotificationService {
  private static instance: DiscordNotificationService;
  
  private constructor() {}
  
  public static getInstance(): DiscordNotificationService {
    if (!DiscordNotificationService.instance) {
      DiscordNotificationService.instance = new DiscordNotificationService();
    }
    return DiscordNotificationService.instance;
  }

  /**
   * Publish a Discord notification event to Kafka
   * @param eventType The original event type (e.g., 'contact.created')
   * @param originalEventData The original event data
   * @param success Whether the original event was processed successfully
   * @param error Optional error message if processing failed
   */
  async publishDiscordNotification({
    eventType,
    originalEventData,
    success = true,
    error = null,
  }: {
    eventType: string;
    originalEventData: any;
    success?: boolean;
    error?: Error | null;
  }): Promise<void> {
    try {
      console.log(`📢 Publishing Discord notification event for ${eventType}...`);
      
      const notificationId = `discord-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const discordEvent: DiscordNotificationEvent = {
        id: notificationId,
        type: 'discord.notification',
        timestamp: new Date().toISOString(),
        source: 'sipeat-discord-service',
        data: {
          eventType,
          originalEventData,
          success,
          error: error?.message || undefined,
          notificationId,
        }
      };

      const publisher = await getEventPublisher();
      const topics = await getTopics();
      
      await publisher.publishEvent(topics.DISCORD_NOTIFICATIONS, discordEvent);
      
      console.log(`✅ Discord notification event published successfully (ID: ${notificationId})`);
    } catch (publishError) {
      console.error('❌ Failed to publish Discord notification event:', publishError);
      // Don't throw here - we don't want Discord notification failures to affect main event processing
    }
  }
}

// Export a singleton instance
export const discordNotificationService = DiscordNotificationService.getInstance(); 