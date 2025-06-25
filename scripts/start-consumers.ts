#!/usr/bin/env npx tsx

/**
 * Standalone script to run SipEat event consumers
 * This runs independently from the Next.js application
 * 
 * Usage:
 *   npm run consumers
 *   or
 *   npx tsx scripts/start-consumers.ts
 */

import { sipeatEventConsumer } from '../src/events/consumer';

async function main() {
  console.log('🎯 Starting SipEat Event Processing System');
  console.log('=====================================');
  
  try {
    // Initialize all event consumers
    await sipeatEventConsumer.initialize();
    
    console.log('\n🎉 SipEat Event Processing System is now running!');
    console.log('💡 The system will process the following events:');
    console.log('   • contact.created - Welcome emails, sales notifications, CRM updates');
    console.log('   • request.created - Inventory validation, payment processing, drink dispensing');
    console.log('   • machine.created - Location validation, inventory setup, network configuration');
    console.log('   • discord.notification - Discord webhook notifications for all events');
    console.log('\n🔄 Processing events in real-time...');
    console.log('📊 Press Ctrl+C to stop the consumers gracefully');
    
    // Keep the process running
    setInterval(() => {
      const health = sipeatEventConsumer.getHealthStatus();
      console.log(`💓 Health check: ${health.status} (${new Date().toLocaleTimeString()})`);
    }, 30000); // Health check every 30 seconds
    
  } catch (error) {
    console.error('❌ Failed to start event consumers:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Promise Rejection:', error);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Start the consumers
main().catch((error) => {
  console.error('❌ Fatal error starting consumers:', error);
  process.exit(1);
}); 