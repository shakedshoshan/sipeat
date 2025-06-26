# SipEat Kafka Event-Driven Architecture - Complete Flow Explanation

## Table of Contents
1. [Overview](#overview)
2. [Kafka Theory and Concepts](#kafka-theory-and-concepts)
3. [Architecture Components](#architecture-components)
4. [Event Flow Detailed Explanation](#event-flow-detailed-explanation)
5. [Design Patterns Implementation](#design-patterns-implementation)
6. [Code Implementation Details](#code-implementation-details)
7. [Discord Integration](#discord-integration)
8. [Infrastructure Setup](#infrastructure-setup)
9. [Monitoring and Troubleshooting](#monitoring-and-troubleshooting)

## Overview

SipEat implements a sophisticated event-driven architecture using Apache Kafka as the central message broker. The system processes three main types of events:
- **Contact Events**: Customer contact form submissions
- **Request Events**: Drink requests from vending machines
- **Machine Events**: New vending machine installations

Each event type implements different design patterns and triggers various business processes, with real-time Discord notifications providing visibility into the system's operation.

## Kafka Theory and Concepts

### What is Apache Kafka?
Apache Kafka is a distributed event streaming platform designed for high-throughput, fault-tolerant, and scalable event processing. Key concepts:

#### Topics
- **Purpose**: Named streams where events are published
- **SipEat Topics**:
  - `sipeat.contact.events` - Contact form submissions
  - `sipeat.request.events` - Drink requests
  - `sipeat.machine.events` - Machine installations

#### Producers
- **Role**: Components that publish events to Kafka topics
- **SipEat Implementation**: API handlers that publish events after database operations

#### Consumers
- **Role**: Applications that read and process events from topics
- **SipEat Implementation**: Dedicated event processors with specific business logic

#### Consumer Groups
- **Purpose**: Allows horizontal scaling and load distribution
- **SipEat Groups**:
  - `sipeat-contact-processor` - Processes contact events
  - `sipeat-request-processor` - Processes request events
  - `sipeat-machine-processor` - Processes machine events

## Architecture Components

### 1. Event Publishers (Located in `src/api/`)
**File Locations:**
- `src/api/CreateContact.ts` - Contact event publisher
- `src/api/CreateRequest.ts` - Request event publisher
- `src/api/CreateMachine.ts` - Machine event publisher

**Flow:**
1. Receive HTTP POST request
2. Validate and store data in Supabase database
3. Create typed event object
4. Publish event to appropriate Kafka topic
5. Return response (event publishing failure doesn't affect API response)

### 2. Kafka Infrastructure (`src/lib/kafka.ts`)
**Core Components:**
- **Producer Management**: Singleton producer instance for publishing
- **Consumer Factory**: Creates consumer instances with proper configuration
- **Event Types**: TypeScript interfaces for type safety
- **Topic Management**: Centralized topic name configuration

### 3. Event Consumers (`src/events/`)
**Main Consumer Controller** (`src/events/consumer.ts`):
- Manages three separate consumer instances
- Each consumer handles one event type
- Implements graceful shutdown handling
- Provides health check endpoints

**Event Handlers** (`src/events/handlers/`):
- `ContactHandlers.ts` - Strategy Pattern implementation
- `RequestHandlers.ts` - Chain of Responsibility Pattern
- `MachineHandlers.ts` - Command Pattern implementation

## Event Flow Detailed Explanation

### 1. Contact Event Flow (`contact.created`)

**Trigger**: Customer submits contact form at `/contactUs`

**Publisher Code** (`src/api/CreateContact.ts:47-60`):
```typescript
const event: ContactCreatedEvent = {
  id: `contact-${createdContact.id}`,
  type: 'contact.created',
  timestamp: new Date().toISOString(),
  source: 'sipeat-web-app',
  data: {
    contactId: createdContact.id,
    name: createdContact.name,
    email: createdContact.email,
    phone: createdContact.phone.toString(),
    company_name: createdContact.company_name,
    message: createdContact.message,
  }
};
```

**Processing Strategies** (`src/events/handlers/ContactHandlers.ts`):
1. **Email Notification Strategy** (Lines 13-22):
   - Sends welcome email to customer
   - Simulates email service integration (SendGrid, AWS SES)

2. **Sales Team Notification Strategy** (Lines 29-40):
   - Alerts sales team about new lead
   - Integrates with collaboration tools (Slack, Teams)

3. **CRM Update Strategy** (Lines 47-66):
   - Updates CRM with lead information
   - Calculates lead score based on message content
   - Integrates with CRM systems (Salesforce, HubSpot)

### 2. Request Event Flow (`request.created`)

**Trigger**: Customer requests drink at `/request`

**Publisher Code** (`src/api/CreateRequest.ts:45-58`):
```typescript
const event: RequestCreatedEvent = {
  id: `request-${createdRequest.id}`,
  type: 'request.created',
  timestamp: new Date().toISOString(),
  source: 'sipeat-web-app',
  data: {
    requestId: createdRequest.id,
    customer_name: createdRequest.customer_name,
    drink_name: createdRequest.drink_name,
    machine_id: createdRequest.machine,
    machine_name: machineData?.name || 'Unknown Machine',
  }
};
```

**Processing Chain** (`src/events/handlers/RequestHandlers.ts`):
1. **Inventory Validation** (Lines 32-50):
   - Checks drink availability (90% success rate simulation)
   - Throws error if out of stock

2. **Payment Processing** (Lines 52-75):
   - Processes payment for drink (95% success rate simulation)
   - Calculates price based on drink type (premium drinks cost more)

3. **Machine Dispensing** (Lines 77-95):
   - Commands machine to dispense drink (98% success rate simulation)
   - Handles machine malfunctions

4. **Customer Notification** (Lines 97-109):
   - Sends pickup notification to customer
   - Integrates with SMS/Push notification services

### 3. Machine Event Flow (`machine.created`)

**Trigger**: New vending machine added via admin interface

**Publisher Code** (`src/api/CreateMachine.ts:40-53`):
```typescript
const event: MachineCreatedEvent = {
  id: `machine-${createdMachine.id}`,
  type: 'machine.created',
  timestamp: new Date().toISOString(),
  source: 'sipeat-web-app',
  data: {
    machineId: createdMachine.id,
    name: createdMachine.name,
    country: createdMachine.country,
    city: createdMachine.city,
    street: createdMachine.street || undefined,
  }
};
```

**Setup Commands** (`src/events/handlers/MachineHandlers.ts`):
1. **Location Validation Command** (Lines 9-24):
   - Validates machine placement location
   - Checks against restricted areas

2. **Inventory Setup Command** (Lines 32-47):
   - Configures initial drink inventory
   - Sets up 8 default drink options

3. **Network Configuration Command** (Lines 65-80):
   - Establishes machine connectivity
   - Generates API keys and machine ID

4. **Maintenance Schedule Command** (Lines 49-63):
   - Creates maintenance calendar
   - Schedules first maintenance after 30 days

## Design Patterns Implementation

### 1. Strategy Pattern (Contact Processing)
**Location**: `src/events/handlers/ContactHandlers.ts`

**Pattern Purpose**: Allows different notification strategies to be executed independently

**Implementation**:
- `NotificationStrategy` interface (Lines 7-9)
- `EmailNotificationStrategy` (Lines 11-22)
- `SalesTeamNotificationStrategy` (Lines 29-40)
- `CRMUpdateStrategy` (Lines 47-66)

**Benefits**:
- Easy to add new notification methods
- Strategies can be enabled/disabled independently
- Parallel execution of all strategies

### 2. Chain of Responsibility Pattern (Request Processing)
**Location**: `src/events/handlers/RequestHandlers.ts`

**Pattern Purpose**: Creates a pipeline of processing steps that can be extended

**Implementation**:
- Abstract `RequestProcessor` base class (Lines 6-26)
- Concrete processors: Inventory, Payment, Dispensing, Notification
- Chain setup in `RequestProcessorChainFactory` (Lines 122-134)

**Benefits**:
- Easy to add new processing steps
- Each processor has single responsibility
- Automatic rollback on failure

### 3. Command Pattern (Machine Setup)
**Location**: `src/events/handlers/MachineHandlers.ts`

**Pattern Purpose**: Encapsulates setup operations with undo support

**Implementation**:
- `Command` interface with execute/undo methods (Lines 6-9)
- Setup commands: Location, Inventory, Network, Maintenance
- `MachineSetupInvoker` with rollback capability (Lines 83-118)

**Benefits**:
- Operations can be undone if setup fails
- Commands can be queued and executed in order
- Easy to add new setup steps

### 4. Factory Pattern
**Usage**: Throughout the system for creating:
- Event publisher instances (`src/lib/kafka.ts:88-90`)
- Event handler instances (`src/events/handlers/`)
- Processing chains and command sets

### 5. Observer Pattern
**Implementation**: Kafka itself implements observer pattern
- Topics act as subjects
- Consumers act as observers
- Events are published to all interested consumers

## Code Implementation Details

### Kafka Configuration (`src/lib/kafka.ts`)

**Producer Management** (Lines 10-19):
```typescript
let producer: Producer | null = null;
export const getProducer = async (): Promise<Producer> => {
  if (!producer) {
    producer = kafka.producer();
    await producer.connect();
  }
  return producer;
};
```

**Event Types** (Lines 24-62):
- `BaseEvent` interface with common fields
- Specific event interfaces extending BaseEvent
- Type union for all possible events

**Consumer Factory** (Lines 125-170):
- Creates consumer with proper error handling
- Implements retry logic
- Parallel handler execution

### Event Consumer Architecture (`src/events/consumer.ts`)

**Initialization** (Lines 18-48):
- Creates separate consumers for each event type
- Registers appropriate handlers
- Subscribes to specific topics

**Graceful Shutdown** (Lines 50-58):
- Handles SIGINT and SIGTERM signals
- Cleanly closes all consumer connections
- Prevents data loss during shutdown

### Error Handling Strategy

**Publisher Error Handling**:
- Event publishing failures don't affect API responses
- Errors are logged but don't break user experience
- Database operations complete even if events fail

**Consumer Error Handling**:
- Individual handler failures are caught and logged
- Discord notifications sent for both success and failure
- Retry logic implemented for transient failures
- Rollback mechanisms for command pattern failures

## Discord Integration

**File**: `src/lib/discord.ts`

**Features**:
- Rich embed formatting for different event types
- Color coding (green for success, red for failure)
- Rate limit handling with retry logic
- Field validation to respect Discord limits
- Error notifications with detailed context

**Notification Trigger Points**:
- After successful event processing
- When event processing fails
- Include full event data and error details

**Implementation in Handlers**:
Every event handler calls `sendKafkaEventNotification` at the end of processing:
```typescript
await sendKafkaEventNotification({
  eventType: event.type,
  eventData: event.data,
  success: true/false,
  error: error // if applicable
});
```

## Infrastructure Setup

### Docker Configuration (`docker-compose.yml`)
- **Zookeeper**: Coordination service for Kafka
- **Kafka Broker**: Single broker setup for development
- **Ports**: 9092 for external connections, 29092 for internal

### NPM Scripts (`package.json`)
- `npm run kafka:start` - Start Kafka infrastructure
- `npm run kafka:stop` - Stop Kafka infrastructure  
- `npm run consumers` - Start event consumers
- `npm run dev` - Start Next.js application

### Environment Variables
```
KAFKA_BROKER=localhost:9092
DISCORD_WEBHOOK=your-discord-webhook-url
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
```

## Consumer Startup Process

**Script**: `scripts/start-consumers.ts`

**Process**:
1. Initialize singleton consumer instance
2. Create consumer groups for each event type
3. Register event handlers with appropriate design patterns
4. Subscribe to respective Kafka topics
5. Start consuming events with health checks
6. Handle graceful shutdown on process termination

**Health Monitoring**:
- Health checks every 30 seconds
- Consumer status reporting
- Topic subscription verification

## Monitoring and Troubleshooting

### Logging Strategy
- **Publisher Logs**: Event publishing success/failure
- **Consumer Logs**: Event processing details for each step
- **Discord Logs**: Notification delivery status
- **Error Logs**: Detailed error context and stack traces

### Performance Considerations
- **Parallel Processing**: Strategies and handlers run concurrently
- **Connection Pooling**: Singleton producer instance
- **Error Isolation**: Handler failures don't affect other handlers
- **Resource Management**: Proper cleanup on shutdown

### Common Issues and Solutions

1. **Kafka Connection Failed**:
   - Check Docker containers: `docker ps`
   - Verify KAFKA_BROKER environment variable
   - Ensure Kafka is running: `npm run kafka:start`

2. **Event Processing Failures**:
   - Check consumer logs for specific error details
   - Verify Discord webhook is correctly configured
   - Ensure database connectivity is stable

3. **Discord Notifications Not Sending**:
   - Verify DISCORD_WEBHOOK environment variable
   - Check webhook URL format and permissions
   - Look for rate limiting errors in logs

### Testing the Complete Flow

1. **Start Infrastructure**:
   ```bash
   npm run kafka:start
   npm run consumers
   npm run dev
   ```

2. **Test Contact Flow**:
   - Submit contact form at http://localhost:3000
   - Watch consumer logs for strategy execution
   - Check Discord for notification

3. **Test Request Flow**:
   - Submit drink request at http://localhost:3000/request
   - Observe chain of responsibility execution
   - Verify Discord notification with processing details

4. **Test Machine Flow**:
   - Create machine via API
   - Watch command pattern execution with potential rollback
   - Check Discord for setup completion status

This architecture provides a robust, scalable, and maintainable event-driven system with excellent observability through Discord integration and comprehensive error handling throughout the entire flow. 