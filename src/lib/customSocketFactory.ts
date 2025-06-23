/**
 * Custom Socket Factory for KafkaJS
 * 
 * This factory provides a compatible socket implementation that works in both
 * Node.js and browser environments. In browser environments, it provides a mock
 * implementation since browser-side code doesn't directly connect to Kafka.
 */

const KEEP_ALIVE_DELAY = 60000; // in ms

// Define the socket factory interface
interface SocketFactory {
  (options: { host: string; port: number; ssl?: any; onConnect?: () => void }): any;
}

/**
 * Creates a socket factory compatible with both browser and Node.js environments
 */
const createCustomSocketFactory = (): SocketFactory => {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
  
  if (isBrowser) {
    // In browser environments, return a mock implementation
    return ({ host, port, ssl, onConnect }) => {
      console.warn('KafkaJS socket requested in browser environment - creating mock socket');
      
      // Create a mock socket object with required methods
      const mockSocket = {
        on: (event: string, listener: any) => mockSocket,
        once: (event: string, listener: any) => mockSocket,
        off: (event: string, listener: any) => mockSocket,
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
  } else {
    // In Node.js environment, use dynamic imports to avoid browser issues
    return ({ host, port, ssl, onConnect }) => {
      // This code will only run on the server side
      // We need to check if we're in a Node.js environment before requiring modules
      if (typeof process !== 'undefined' && process.versions && process.versions.node) {
        // We're in Node.js, safe to use require
        // Using a try-catch block for each module to handle potential issues
        let net;
        let tls;
        
        try {
          // Using dynamic import with eval to prevent webpack from processing this
          net = eval('require')('net');
        } catch (e) {
          console.error('Failed to load net module:', e);
          throw new Error('Net module is required for Kafka connections');
        }
        
        try {
          // Using dynamic import with eval to prevent webpack from processing this
          tls = eval('require')('tls');
        } catch (e) {
          console.warn('TLS module not available, SSL connections will not be supported');
        }
        
        let socket;
        
        if (ssl && tls) {
          socket = tls.connect(
            Object.assign({ host, port }, !net.isIP(host) ? { servername: host } : {}, ssl),
            onConnect
          );
        } else {
          socket = net.connect({ host, port }, onConnect);
        }
        
        socket.setKeepAlive(true, KEEP_ALIVE_DELAY);
        return socket;
      } else {
        // We're not in Node.js but also not in a browser (e.g., Edge functions)
        // Return a mock socket as a fallback
        console.warn('Unknown environment - creating mock socket');
        const mockSocket = {
          on: (event: string, listener: any) => mockSocket,
          once: (event: string, listener: any) => mockSocket,
          off: (event: string, listener: any) => mockSocket,
          connect: () => mockSocket,
          end: () => mockSocket,
          destroy: () => mockSocket,
          setTimeout: () => mockSocket,
          setKeepAlive: () => mockSocket,
          setNoDelay: () => mockSocket,
          unref: () => mockSocket,
        };
        
        if (typeof onConnect === 'function') {
          setTimeout(onConnect, 0);
        }
        
        return mockSocket;
      }
    };
  }
};

// Export as default for direct import
export default createCustomSocketFactory;

// Also export in the format that KafkaJS expects
export const socketFactory = createCustomSocketFactory(); 