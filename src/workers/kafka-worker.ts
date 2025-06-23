import { initializeServices, shutdownServices } from '@/services/ServiceManager';

/**
 * Kafka Worker
 * 
 * This is a standalone process that runs the Kafka consumers.
 * It's designed to run separately from the main application to:
 * 1. Improve scalability by allowing independent scaling of producers and consumers
 * 2. Enhance reliability by isolating consumer failures from the main application
 * 3. Optimize resource usage by dedicating resources to message processing
 * 
 * The worker follows:
 * 1. Process Pattern by running as a separate Node.js process
 * 2. Graceful Shutdown Pattern by handling termination signals
 * 3. Facade Pattern by using the ServiceManager to interact with services
 */

/**
 * Main worker function
 * Entry point for the worker process
 */
async function main() {
  console.log('Starting Kafka worker...');
  
  try {
    // Step 1: Initialize all Kafka services
    // This connects to Kafka and starts all consumers
    const initialized = await initializeServices();
    if (!initialized) {
      console.error('Failed to initialize services. Exiting worker.');
      process.exit(1);
    }
    
    console.log('Kafka worker started successfully. Listening for events...');
    
    // Step 2: Set up handlers for graceful shutdown
    // This ensures resources are cleaned up properly when the process terminates
    setupShutdownHandlers();
  } catch (error) {
    console.error('Error starting Kafka worker:', error);
    process.exit(1);
  }
}

/**
 * Sets up handlers for graceful shutdown
 * Registers handlers for various process termination signals
 */
function setupShutdownHandlers() {
  // Handle SIGINT (Ctrl+C)
  process.on('SIGINT', handleShutdown);
  
  // Handle SIGTERM (kill command)
  process.on('SIGTERM', handleShutdown);
  
  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
    handleShutdown();
  });
}

/**
 * Handles graceful shutdown
 * Ensures all resources are properly cleaned up before exiting
 */
async function handleShutdown() {
  console.log('Shutting down Kafka worker...');
  
  try {
    // Disconnect all Kafka consumers and producer
    await shutdownServices();
    console.log('Kafka worker shut down successfully.');
  } catch (error) {
    console.error('Error during shutdown:', error);
  } finally {
    // Exit the process with success code
    process.exit(0);
  }
}

// Start the worker
main().catch((error) => {
  console.error('Fatal error in Kafka worker:', error);
  process.exit(1);
}); 