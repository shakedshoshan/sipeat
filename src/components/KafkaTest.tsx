'use client';

import { useState } from 'react';

/**
 * KafkaTest Component
 * 
 * A simple UI component to test Kafka integration by sending test messages
 * through the API route.
 */
export default function KafkaTest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Function to send a test message to Kafka
  const sendTestMessage = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      // Call the API route to send a test message
      const response = await fetch('/api/test-kafka', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to send test message');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-4">Kafka Integration Test</h2>
      
      <button
        onClick={sendTestMessage}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {loading ? 'Sending...' : 'Send Test Message'}
      </button>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {result && (
        <div className="mt-4">
          <div className="p-3 bg-green-100 border border-green-300 text-green-700 rounded mb-2">
            <strong>Success:</strong> {result.message}
          </div>
          
          <div className="mt-2">
            <h3 className="font-medium mb-1">Event Details:</h3>
            <pre className="bg-gray-100 p-2 rounded overflow-auto text-sm">
              {JSON.stringify(result.event, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
} 