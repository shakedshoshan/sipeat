/**
 * Discord webhook integration
 * Sends messages to Discord using webhooks
 */

// Default webhook URL - can be overridden by environment variable
const DEFAULT_WEBHOOK_URL = 'https://discord.com/api/webhooks/1387040293273997364/fXNylCgitWkduCpY7QtqG2cqiaBAnn72t0TaAZL2gFTM6Pd4hulliMOSH2KOODaJIIow';

// Rate limit handling constants
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

/**
 * Send a message to Discord via webhook
 * @param content The message content to send
 * @param username Optional username to display for the webhook
 * @param avatarUrl Optional avatar URL for the webhook
 * @param embeds Optional embeds to include in the message
 * @returns Promise that resolves when the message is sent
 */
export async function sendDiscordMessage({
  content,
  username,
  avatarUrl,
  embeds = [],
}: {
  content: string;
  username?: string;
  avatarUrl?: string;
  embeds?: Array<{
    title?: string;
    description?: string;
    color?: number;
    fields?: Array<{ name: string; value: string; inline?: boolean }>;
    footer?: { text: string; icon_url?: string };
    timestamp?: string;
  }>;
}) {
  // Use environment variable if available, otherwise use default
  const webhookUrl = process.env.DISCORD_WEBHOOK || DEFAULT_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.error('Discord webhook URL is not available');
    return;
  }

  // Validate the webhook URL format
  if (!webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
    console.error('Invalid Discord webhook URL format');
    return;
  }

  // Prepare the payload according to Discord's API
  const payload = {
    content,
    username,
    avatar_url: avatarUrl,
    embeds: embeds.map(embed => ({
      ...embed,
      // Ensure fields don't exceed Discord's limits
      fields: embed.fields?.map(field => ({
        ...field,
        // Truncate values if they're too long (Discord has a 1024 char limit)
        value: field.value.length > 1024 ? field.value.substring(0, 1021) + '...' : field.value
      })).slice(0, 25) // Discord allows max 25 fields
    })).slice(0, 10), // Discord allows max 10 embeds
  };

  console.log('Sending Discord message with payload:', JSON.stringify(payload).substring(0, 200) + '...');

  // Implement retry logic for rate limits
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Handle rate limiting (429 status code)
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const retryMs = retryAfter ? parseInt(retryAfter) * 1000 : RETRY_DELAY;
        console.warn(`Discord rate limit hit, retrying after ${retryMs}ms`);
        await new Promise(resolve => setTimeout(resolve, retryMs));
        continue;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Discord webhook error (${response.status}): ${errorText}`);
      }

      console.log('Discord message sent successfully');
      return response;
    } catch (error) {
      if (attempt === MAX_RETRIES - 1) {
        console.error('Failed to send Discord webhook message after retries:', error);
        throw error;
      }
      console.warn(`Attempt ${attempt + 1} failed, retrying...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
}

/**
 * Send a Kafka event notification to Discord
 * @param eventType The type of event (e.g., 'contact.created')
 * @param eventData The event data
 * @param success Whether the event was processed successfully
 * @param error Optional error message if processing failed
 */
export async function sendKafkaEventNotification({
  eventType,
  eventData,
  success = true,
  error = null,
}: {
  eventType: string;
  eventData: any;
  success?: boolean;
  error?: Error | null;
}) {
  // Log the event notification
  console.log(`Preparing Discord notification for ${eventType} event:`, 
    JSON.stringify(eventData).substring(0, 100) + '...');
  
  // Determine color based on success/failure (green for success, red for failure)
  const color = success ? 0x00FF00 : 0xFF0000;
  
  // Create a title based on the event type
  let title = '';
  let icon = '🔔';
  
  if (eventType === 'contact.created') {
    title = 'New Contact Form Submission';
    icon = '📝';
  } else if (eventType === 'request.created') {
    title = 'New Drink Request';
    icon = '🥤';
  } else if (eventType === 'machine.created') {
    title = 'New Machine Added';
    icon = '🤖';
  } else {
    title = 'Kafka Event';
  }
  
  try {
    // Ensure eventData is not null or undefined
    if (!eventData) {
      console.error('Event data is null or undefined');
      eventData = { error: 'No event data available' };
    }
    
    // Create fields based on event data - handle null or undefined values
    const fields = Object.entries(eventData || {}).map(([key, value]) => {
      // Convert value to string safely
      let stringValue = 'N/A';
      if (value !== null && value !== undefined) {
        try {
          if (typeof value === 'object') {
            stringValue = JSON.stringify(value);
          } else {
            stringValue = String(value);
          }
        } catch (err) {
          console.error('Error converting value to string:', err);
          stringValue = 'Error: Could not convert value to string';
        }
      }
      
      return {
        name: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
        value: stringValue,
        inline: true,
      };
    });
    
    // Add timestamp field
    const timestamp = new Date().toISOString();
    
    // Create embeds
    const embeds = [
      {
        title: `${icon} ${title}`,
        color,
        fields,
        footer: {
          text: success ? 'Successfully processed' : 'Processing failed',
        },
        timestamp,
      },
    ];
    
    // Add error field if there's an error
    if (error) {
      embeds[0].fields.push({
        name: 'Error',
        value: error.message || String(error),
        inline: false,
      });
    }
    
    console.log('Sending Kafka event notification to Discord...');
    
    // Send the message
    await sendDiscordMessage({
      content: `${icon} **${eventType}** event ${success ? 'processed' : 'failed'}`,
      username: 'SipEat Kafka',
      embeds,
    });
    
    console.log('Kafka event notification sent successfully to Discord');
    return true;
  } catch (err) {
    console.error('Failed to send Kafka event notification to Discord:', err);
    // Don't throw here - we don't want Discord failures to affect Kafka processing
    return false;
  }
}
