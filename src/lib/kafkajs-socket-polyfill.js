/**
 * KafkaJS Socket Factory Polyfill
 * 
 * This file provides a polyfill for the KafkaJS socket factory that works in browser environments.
 * It replaces the Node.js-specific modules with browser-compatible alternatives.
 */

const KEEP_ALIVE_DELAY = 60000; // in ms

// Create a mock implementation for browser environments
export default () => {
  return ({ host, port, ssl, onConnect }) => {
    console.warn('KafkaJS socket requested in browser environment - creating mock socket');
    
    // Create a mock socket object with required methods
    const mockSocket = {
      on: (event, listener) => mockSocket,
      once: (event, listener) => mockSocket,
      off: (event, listener) => mockSocket,
      connect: () => mockSocket,
      end: () => mockSocket,
      destroy: () => mockSocket,
      setTimeout: () => mockSocket,
      setKeepAlive: () => mockSocket,
      setNoDelay: () => mockSocket,
      unref: () => mockSocket,
    };
    
    // Call onConnect callback if provided
    if (typeof onConnect === 'function') {
      setTimeout(onConnect, 0);
    }
    
    return mockSocket;
  };
} 