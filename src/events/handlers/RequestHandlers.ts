"use server"

import { RequestCreatedEvent } from '@/lib/kafka';
import { sendKafkaEventNotification } from '@/lib/discord';

// Chain of Responsibility Pattern: Request processing pipeline
export abstract class RequestProcessor {
  protected nextProcessor?: RequestProcessor;

  public setNext(processor: RequestProcessor): RequestProcessor {
    this.nextProcessor = processor;
    return processor;
  }

  public async process(request: RequestCreatedEvent['data']): Promise<boolean> {
    const canHandle = await this.canHandle(request);
    
    if (canHandle) {
      await this.handle(request);
    }

    if (this.nextProcessor) {
      return await this.nextProcessor.process(request);
    }

    return canHandle;
  }

  protected abstract canHandle(request: RequestCreatedEvent['data']): Promise<boolean>;
  protected abstract handle(request: RequestCreatedEvent['data']): Promise<void>;
}

export class InventoryValidationProcessor extends RequestProcessor {
  protected async canHandle(request: RequestCreatedEvent['data']): Promise<boolean> {
    console.log(`📦 Validating inventory for ${request.drink_name} at machine ${request.machine_name}`);
    return true; // Always validate inventory
  }

  protected async handle(request: RequestCreatedEvent['data']): Promise<void> {
    console.log(`📦 Validating inventory for ${request.drink_name} at machine ${request.machine_name}`);
    
    // Simulate inventory check
    const isAvailable = Math.random() > 0.1; // 90% availability rate
    
    if (isAvailable) {
      console.log(`✅ ${request.drink_name} is available`);
    } else {
      console.log(`❌ ${request.drink_name} is out of stock`);
      throw new Error(`${request.drink_name} is not available at this machine`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

export class PaymentProcessor extends RequestProcessor {
  protected async canHandle(request: RequestCreatedEvent['data']): Promise<boolean> {
    console.log(`💳 Processing payment for ${request.drink_name}`);
    return true; // Always process payment
  }

  protected async handle(request: RequestCreatedEvent['data']): Promise<void> {
    console.log(`💳 Processing payment for ${request.drink_name}`);
    
    // Simulate payment processing
    const paymentSuccess = Math.random() > 0.05; // 95% success rate
    
    if (paymentSuccess) {
      const amount = this.calculatePrice(request.drink_name);
      console.log(`✅ Payment of $${amount} processed successfully`);
    } else {
      console.log(`❌ Payment failed`);
      throw new Error('Payment processing failed');
    }
    
    await new Promise(resolve => setTimeout(resolve, 150));
  }

  private calculatePrice(drinkName: string): number {
    // Simple pricing logic
    const basePrice = 2.50;
    const premiumDrinks = ['fiuzetea', 'nectar'];
    const isPremium = premiumDrinks.some(premium => 
      drinkName.toLowerCase().includes(premium)
    );
    return isPremium ? basePrice + 0.50 : basePrice;
  }
}

export class MachineDispenseProcessor extends RequestProcessor {
  protected async canHandle(request: RequestCreatedEvent['data']): Promise<boolean> {
    console.log(`🥤 Dispensing ${request.drink_name} from machine ${request.machine_name}`);
    return true; // Always try to dispense
  }

  protected async handle(request: RequestCreatedEvent['data']): Promise<void> {
    console.log(`🥤 Dispensing ${request.drink_name} from machine ${request.machine_name}`);
    
    // Simulate machine dispensing
    const dispenseSuccess = Math.random() > 0.02; // 98% success rate
    
    if (dispenseSuccess) {
      console.log(`✅ ${request.drink_name} dispensed successfully`);
    } else {
      console.log(`❌ Machine malfunction - drink not dispensed`);
      throw new Error('Machine failed to dispense drink');
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
  }
}

export class CustomerNotificationProcessor extends RequestProcessor {
  protected async canHandle(request: RequestCreatedEvent['data']): Promise<boolean> {
    console.log(`📱 Sending notification to ${request.customer_name}`);
    return true; // Always notify customer
  }

  protected async handle(request: RequestCreatedEvent['data']): Promise<void> {
    console.log(`📱 Sending notification to ${request.customer_name}`);
    console.log(`   Message: Your ${request.drink_name} is ready for pickup!`);
    
    // In production, integrate with SMS/Push notification service
    await new Promise(resolve => setTimeout(resolve, 50));
    console.log(`✅ Customer notification sent`);
  }
}

// Factory Pattern: Create the processing chain
class RequestProcessorChainFactory {
  static createChain(): RequestProcessor {
    const inventoryProcessor = new InventoryValidationProcessor();
    const paymentProcessor = new PaymentProcessor();
    const dispenseProcessor = new MachineDispenseProcessor();
    const notificationProcessor = new CustomerNotificationProcessor();

    // Build the chain
    inventoryProcessor
      .setNext(paymentProcessor)
      .setNext(dispenseProcessor)
      .setNext(notificationProcessor);

    return inventoryProcessor;
  }
}

export async function createProcessingChain(): Promise<RequestProcessor> {
  return RequestProcessorChainFactory.createChain();
}

// Main event handler
class RequestCreatedHandler {
  async handle(event: RequestCreatedEvent): Promise<void> {
    console.log(`\n🎯 Processing request.created event for: ${event.data.customer_name} (ID: ${event.id})`);
    
    try {
      console.log(`Request event data:`, JSON.stringify(event.data).substring(0, 200));
      
      const processingChain = RequestProcessorChainFactory.createChain();
      await processingChain.process(event.data);
      
      console.log(`✨ Request processing completed for: ${event.data.customer_name}\n`);
      
      // Send Discord notification for successful processing
      console.log('Sending Discord notification for successful request processing...');
      try {
        await sendKafkaEventNotification({
          eventType: event.type,
          eventData: event.data,
          success: true
        });
        console.log('Discord notification sent successfully for request event');
      } catch (discordError) {
        console.error('Failed to send Discord notification for request event:', discordError);
        // Don't fail the event processing if Discord notification fails
      }
    } catch (error) {
      console.error(`❌ Error processing request:`, error);
      
      // Send Discord notification for failed processing
      console.log('Sending Discord notification for failed request processing...');
      try {
        await sendKafkaEventNotification({
          eventType: event.type,
          eventData: event.data,
          success: false,
          error: error instanceof Error ? error : new Error(String(error))
        });
        console.log('Discord notification sent for failed request event');
      } catch (discordError) {
        console.error('Failed to send Discord notification for failed request event:', discordError);
      }
      
      // In production, you might want to:
      // 1. Refund payment if it was charged
      // 2. Send error notification to customer
      // 3. Alert maintenance team if machine malfunction
      console.log(`🔄 Initiating error recovery process...`);
    }
  }
}

export async function createRequestCreatedHandler(): Promise<RequestCreatedHandler> {
  console.log('Creating RequestCreatedHandler');
  return new RequestCreatedHandler();
} 