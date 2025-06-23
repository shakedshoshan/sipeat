import KafkaTest from '@/components/KafkaTest';

/**
 * Kafka Test Page
 * 
 * This page provides a UI for testing the Kafka integration.
 */
export default function KafkaTestPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Kafka Integration Test Page</h1>
      
      <div className="mb-6">
        <p className="mb-2">
          This page allows you to test the Kafka integration by sending test messages
          through the API route.
        </p>
        <p className="text-sm text-gray-600">
          Note: Make sure Kafka is running with <code>npm run kafka:up</code> before testing.
        </p>
      </div>
      
      <KafkaTest />
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">How to verify it's working</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Start Kafka with <code>npm run kafka:up</code></li>
          <li>Click the "Send Test Message" button above</li>
          <li>If successful, you should see a success message with event details</li>
          <li>Check your server logs to see if the message was processed</li>
        </ol>
      </div>
    </div>
  );
} 