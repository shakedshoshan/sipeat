# Kafka Implementation in SipEat

This document explains how Kafka is implemented in the SipEat project as an event bus to handle various events in the system.

## Architecture Overview

The Kafka implementation follows an event-driven architecture with the following components:

1. **Event Publishers**: API endpoints that publish events to Kafka topics when certain actions occur.
2. **Event Consumers**: Services that consume events from Kafka topics and process them.
3. **Event Types**: Strongly typed event definitions for various domain events.

## Kafka Topics

The system uses the following Kafka topics:

- `contact-created`: Events related to new contact submissions
- `machine-created`: Events related to new machine registrations
- `request-created`: Events related to new drink requests
- `notification`: Events related to system notifications

## Getting Started

### Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ and npm

### Running Kafka

To start the Kafka infrastructure:

```bash
npm run kafka:up
```

This will start Zookeeper and Kafka in Docker containers.

To stop Kafka:

```bash
npm run kafka:down
```

### Running the Kafka Worker

The Kafka worker is a separate process that runs the event consumers. To run it in development mode:

```bash
npm run worker:dev
```

For production, you need to build and then run the worker:

```bash
npm run worker:build
npm run worker:start
```

## Development Guide

### Creating a New Event Type

1. Add the event type to `src/types/kafka-events.ts`
2. Create a consumer for the event in `src/services/`
3. Register the consumer in `src/services/ServiceManager.ts`

### Publishing Events

Use the `sendMessage` function from `src/lib/kafka.ts` to publish events:

```typescript
import { sendMessage } from '@/lib/kafka';
import { KafkaTopic, createKafkaEvent } from '@/types/kafka-events';

// Create the event
const event = createKafkaEvent(KafkaTopic.CONTACT_CREATED, contactData);

// Send the event
await sendMessage(KafkaTopic.CONTACT_CREATED, event);
```

### Consuming Events

Create a consumer function and register it with a topic:

```typescript
import { createTopicConsumer } from '@/lib/kafka';
import { KafkaTopic } from '@/types/kafka-events';

// Handler function
async function handleEvent(message: any) {
  // Process the message
}

// Create and initialize the consumer
const consumer = await createTopicConsumer(
  'consumer-group-id',
  KafkaTopic.TOPIC_NAME,
  handleEvent
);
```

## Design Patterns Used

1. **Publisher-Subscriber Pattern**: Events are published to topics and consumed by subscribers.
2. **Event Sourcing**: System state changes are captured as a sequence of events.
3. **Command Query Responsibility Segregation (CQRS)**: Separates read and write operations.
4. **Factory Pattern**: Used for creating event objects.

## Implementation Details

- The Kafka client is initialized in the application layout component.
- Events are published when API endpoints are called.
- Consumers run in a separate worker process to avoid blocking the main application.
- Events are strongly typed using TypeScript interfaces.

## Troubleshooting

If you encounter issues with Kafka:

1. Check if Kafka and Zookeeper containers are running: `docker ps`
2. Check Kafka logs: `docker logs sipeat-kafka-1`
3. Ensure the worker is running and connected to Kafka
4. Check for errors in the worker logs 