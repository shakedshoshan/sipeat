"use server"

import { ContactCreatedEvent } from '@/lib/kafka';
import { discordNotificationService } from '@/lib/discordNotificationService';

// Strategy Pattern: Different notification strategies
interface NotificationStrategy {
  send(contact: ContactCreatedEvent['data']): Promise<void>;
}

class EmailNotificationStrategy implements NotificationStrategy {
  async send(contact: ContactCreatedEvent['data']): Promise<void> {
    // Simulate sending welcome email
    console.log(`📧 Sending welcome email to ${contact.email}`);
    console.log(`   Subject: Welcome to SipEat, ${contact.name}!`);
    
    // In production, integrate with email service like SendGrid, AWS SES, etc.
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log(`✅ Email sent successfully to ${contact.email}`);
  }
}

export async function createEmailNotificationStrategy(): Promise<NotificationStrategy> {
  return new EmailNotificationStrategy();
}

class SalesTeamNotificationStrategy implements NotificationStrategy {
  async send(contact: ContactCreatedEvent['data']): Promise<void> {
    console.log(`🔔 Notifying sales team about new contact: ${contact.name}`);
    console.log(`   Company: ${contact.company_name || 'Individual'}`);
    console.log(`   Message: ${contact.message.substring(0, 50)}...`);
    
    // In production, integrate with Slack, Teams, or CRM
    await new Promise(resolve => setTimeout(resolve, 50));
    console.log(`✅ Sales team notified`);
  }
}

export async function createSalesTeamNotificationStrategy(): Promise<NotificationStrategy> {
  return new SalesTeamNotificationStrategy();
}

class CRMUpdateStrategy implements NotificationStrategy {
  async send(contact: ContactCreatedEvent['data']): Promise<void> {
    console.log(`📊 Updating CRM with contact: ${contact.contactId}`);
    console.log(`   Lead Score: ${this.calculateLeadScore(contact)}`);
    
    // In production, integrate with Salesforce, HubSpot, etc.
    await new Promise(resolve => setTimeout(resolve, 75));
    console.log(`✅ CRM updated with lead information`);
  }

  private calculateLeadScore(contact: ContactCreatedEvent['data']): number {
    let score = 50; // Base score
    if (contact.company_name) score += 30; // Business contact
    if (contact.message.toLowerCase().includes('urgent')) score += 20;
    if (contact.message.length > 100) score += 10; // Detailed inquiry
    return Math.min(score, 100);
  }
}

export async function createCRMUpdateStrategy(): Promise<NotificationStrategy> {
  return new CRMUpdateStrategy();
}

// Observer Pattern: Contact event handler that uses multiple strategies
class ContactCreatedHandler {
  private strategies: NotificationStrategy[] = [];
  
  constructor(strategies: NotificationStrategy[]) {
    this.strategies = strategies;
  }

  async handle(event: ContactCreatedEvent): Promise<void> {
    console.log(`\n🎯 Processing contact.created event for: ${event.data.name} (ID: ${event.id})`);
    
    try {
      console.log(`Contact event data:`, JSON.stringify(event.data).substring(0, 200));
      
      // Execute all notification strategies in parallel
      await Promise.all(
        this.strategies.map(strategy => 
          this.executeWithRetry(() => strategy.send(event.data))
        )
      );
      
      console.log(`✨ Contact processing completed for: ${event.data.name}\n`);
      
      // Send Discord notification for successful processing
      console.log('Publishing Discord notification for successful contact processing...');
      await discordNotificationService.publishDiscordNotification({
        eventType: event.type,
        originalEventData: event.data,
        success: true
      });
    } catch (error) {
      console.error(`❌ Error processing contact event:`, error);
      
      // Send Discord notification for failed processing
      console.log('Publishing Discord notification for failed contact processing...');
      await discordNotificationService.publishDiscordNotification({
        eventType: event.type,
        originalEventData: event.data,
        success: false,
        error: error instanceof Error ? error : new Error(String(error))
      });
      
      // In production, you might want to send to a retry queue
    }
  }

  private async executeWithRetry(
    fn: () => Promise<void>, 
    maxRetries: number = 3
  ): Promise<void> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await fn();
        return;
      } catch (error) {
        if (attempt === maxRetries) throw error;
        console.log(`⚠️  Attempt ${attempt} failed, retrying...`);
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
      }
    }
  }
}

export async function createContactCreatedHandler(): Promise<ContactCreatedHandler> {
  console.log('Creating ContactCreatedHandler with strategies');
  const strategies = [
    await createEmailNotificationStrategy(),
    await createSalesTeamNotificationStrategy(),
    await createCRMUpdateStrategy()
  ];
  return new ContactCreatedHandler(strategies);
} 