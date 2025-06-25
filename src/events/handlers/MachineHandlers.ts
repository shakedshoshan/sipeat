"use server"

import { MachineCreatedEvent } from '@/lib/kafka';
import { discordNotificationService } from '@/lib/discordNotificationService';

// Command Pattern: Machine setup commands
export interface Command {
  execute(): Promise<void>;
  undo(): Promise<void>;
}

export class LocationValidationCommand implements Command {
  constructor(private machineData: MachineCreatedEvent['data']) {}

  async execute(): Promise<void> {
    console.log(`📍 Validating location: ${this.machineData.city}, ${this.machineData.country}`);
    
    // Simulate location validation
    const isValidLocation = !this.machineData.city.toLowerCase().includes('restricted');
    
    if (!isValidLocation) {
      throw new Error(`Location ${this.machineData.city} is not authorized for machine placement`);
    }
    
    console.log(`✅ Location validated successfully`);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  async undo(): Promise<void> {
    console.log(`🔄 Reverting location validation for ${this.machineData.name}`);
  }
}

export class InventorySetupCommand implements Command {
  constructor(private machineData: MachineCreatedEvent['data']) {}

  async execute(): Promise<void> {
    console.log(`📦 Setting up inventory for machine: ${this.machineData.name}`);
    
    const defaultDrinks = [
      'Coca-Cola', 'Pepsi', 'Water', 'Orange Juice', 'Coffee',
      'Fiuzetea – Peach', 'Schweppes – Lemonade', 'Nectar – Apple'
    ];
    
    console.log(`   Adding ${defaultDrinks.length} default drink options`);
    console.log(`   Initial stock: ${defaultDrinks.join(', ')}`);
    
    await new Promise(resolve => setTimeout(resolve, 150));
    console.log(`✅ Inventory setup completed`);
  }

  async undo(): Promise<void> {
    console.log(`🔄 Removing inventory setup for ${this.machineData.name}`);
  }
}

export class MaintenanceScheduleCommand implements Command {
  constructor(private machineData: MachineCreatedEvent['data']) {}

  async execute(): Promise<void> {
    console.log(`🔧 Scheduling maintenance for machine: ${this.machineData.name}`);
    
    const installationDate = new Date();
    const firstMaintenance = new Date(installationDate);
    firstMaintenance.setDate(installationDate.getDate() + 30); // 30 days
    
    console.log(`   Installation date: ${installationDate.toDateString()}`);
    console.log(`   First maintenance: ${firstMaintenance.toDateString()}`);
    console.log(`   Maintenance interval: Monthly`);
    
    await new Promise(resolve => setTimeout(resolve, 75));
    console.log(`✅ Maintenance schedule created`);
  }

  async undo(): Promise<void> {
    console.log(`🔄 Canceling maintenance schedule for ${this.machineData.name}`);
  }
}

export class NetworkConfigurationCommand implements Command {
  constructor(private machineData: MachineCreatedEvent['data']) {}

  async execute(): Promise<void> {
    console.log(`🌐 Configuring network connection for: ${this.machineData.name}`);
    
    // Generate machine ID and API keys
    const machineId = `SM-${this.machineData.machineId.substring(0, 8).toUpperCase()}`;
    const apiKey = `api_${Math.random().toString(36).substring(2, 15)}`;
    
    console.log(`   Machine ID: ${machineId}`);
    console.log(`   API Key: ${apiKey.substring(0, 8)}...`);
    console.log(`   Network Status: Connected`);
    
    await new Promise(resolve => setTimeout(resolve, 120));
    console.log(`✅ Network configuration completed`);
  }

  async undo(): Promise<void> {
    console.log(`🔄 Removing network configuration for ${this.machineData.name}`);
  }
}

// Command Invoker with undo support
class MachineSetupInvoker {
  private commands: Command[] = [];
  private executedCommands: Command[] = [];

  addCommand(command: Command): void {
    this.commands.push(command);
  }

  async executeAll(): Promise<void> {
    for (const command of this.commands) {
      try {
        await command.execute();
        this.executedCommands.push(command);
      } catch (error) {
        console.error(`❌ Command execution failed:`, error);
        await this.undoAll();
        throw error;
      }
    }
  }

  async undoAll(): Promise<void> {
    console.log(`🔄 Rolling back machine setup...`);
    
    // Undo commands in reverse order
    for (const command of this.executedCommands.reverse()) {
      try {
        await command.undo();
      } catch (error) {
        console.error(`⚠️  Failed to undo command:`, error);
      }
    }
    
    this.executedCommands = [];
  }
}

export async function createMachineSetupInvoker(): Promise<MachineSetupInvoker> {
  return new MachineSetupInvoker();
}

// Factory for creating machine setup commands
class MachineSetupCommandFactory {
  static createSetupCommands(machineData: MachineCreatedEvent['data']): Command[] {
    return [
      new LocationValidationCommand(machineData),
      new InventorySetupCommand(machineData),
      new NetworkConfigurationCommand(machineData),
      new MaintenanceScheduleCommand(machineData),
    ];
  }
}

export async function createSetupCommands(machineData: MachineCreatedEvent['data']): Promise<Command[]> {
  return MachineSetupCommandFactory.createSetupCommands(machineData);
}

// Main event handler
class MachineCreatedHandler {
  async handle(event: MachineCreatedEvent): Promise<void> {
    console.log(`\n🎯 Processing machine.created event for: ${event.data.name} (ID: ${event.id})`);
    
    const invoker = new MachineSetupInvoker();
    
    try {
      console.log(`Machine event data:`, JSON.stringify(event.data).substring(0, 200));
      
      // Create and add all setup commands
      const setupCommands = MachineSetupCommandFactory.createSetupCommands(event.data);
      setupCommands.forEach(command => invoker.addCommand(command));
      
      // Execute all commands
      await invoker.executeAll();
      
      console.log(`✨ Machine setup completed for: ${event.data.name}`);
      console.log(`📍 Location: ${event.data.street ? event.data.street + ', ' : ''}${event.data.city}, ${event.data.country}`);
      console.log(`🚀 Machine is now operational and ready for customers!\n`);
      
      // Send Discord notification for successful processing
      console.log('Publishing Discord notification for successful machine setup...');
      await discordNotificationService.publishDiscordNotification({
        eventType: event.type,
        originalEventData: event.data,
        success: true
      });
    } catch (error) {
      console.error(`❌ Machine setup failed for: ${event.data.name}`);
      console.log(`📞 Contact technical support for assistance\n`);
      
      // Send Discord notification for failed processing
      console.log('Publishing Discord notification for failed machine setup...');
      await discordNotificationService.publishDiscordNotification({
        eventType: event.type,
        originalEventData: event.data,
        success: false,
        error: error instanceof Error ? error : new Error(String(error))
      });
    }
  }
}

export async function createMachineCreatedHandler(): Promise<MachineCreatedHandler> {
  console.log('Creating MachineCreatedHandler');
  return new MachineCreatedHandler();
} 