# SipEat Kafka Event-Driven Architecture

This document explains how to set up and use the Kafka-based event-driven architecture in the SipEat project.

## Overview

SipEat uses Apache Kafka to implement an event-driven architecture with the following design patterns:

- **Observer Pattern**: Event handlers that respond to published events
- **Strategy Pattern**: Different notification strategies for contact processing
- **Chain of Responsibility**: Request processing pipeline
- **Command Pattern**: Machine setup operations with undo support
- **Factory Pattern**: Creating processing chains and command sets

## Events

### 1. Contact Created Event (`contact.created`)
Triggered when a customer submits a contact form.

**Handlers:**
- Email notification to customer
- Sales team notification
- CRM update with lead scoring
- Discord webhook notification

### 2. Request Created Event (`request.created`)
Triggered when a customer requests a drink from a vending machine.

**Processing Chain:**
1. Inventory validation
2. Payment processing
3. Machine dispensing
4. Customer notification
5. Discord webhook notification

### 3. Machine Created Event (`machine.created`)
Triggered when a new vending machine is added to the system.

**Setup Commands:**
1. Location validation
2. Inventory setup
3. Network configuration
4. Maintenance scheduling
5. Discord webhook notification

## Setup Instructions

### 1. Start Kafka Infrastructure

```bash
# Start Kafka and Zookeeper using Docker
npm run kafka:start

# Verify Kafka is running
docker ps
```

### 2. Install Dependencies

```bash
# Install project dependencies including KafkaJS
npm install
```

### 3. Environment Configuration

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Kafka Configuration
KAFKA_BROKER=localhost:9092

# Discord Webhook (for event notifications)
DISCORD_WEBHOOK=your-discord-webhook-url
```

### 4. Start the Applications

```bash
# Terminal 1: Start the Next.js web application
npm run dev

# Terminal 2: Start the event consumers
npm run consumers
```

## Discord Integration

SipEat integrates with Discord to send real-time notifications for all Kafka events.

### Setting Up Discord Webhook

1. **Create a Discord Webhook:**
   - Open Discord and navigate to your server
   - Go to Server Settings > Integrations > Webhooks
   - Click "New Webhook"
   - Name it (e.g., "SipEat Kafka Events")
   - Choose a channel for the notifications
   - Copy the webhook URL

2. **Configure the Application:**
   - Add the webhook URL to your `.env.local` file:
   ```
   DISCORD_WEBHOOK=your-discord-webhook-url
   ```

### Notification Format

Discord notifications include:

- **Event Type**: The type of event (contact.created, request.created, machine.created)
- **Status**: Success or failure indicator (color-coded)
- **Event Data**: All relevant data from the event
- **Timestamp**: When the event was processed
- **Error Details**: If the event processing failed

### Benefits of Discord Integration

- **Real-time Monitoring**: Instantly see when events are processed
- **Error Alerting**: Quickly identify and respond to failures
- **Team Visibility**: Keep the entire team informed of system activity
- **Audit Trail**: Maintain a record of all events for troubleshooting

## Testing the System

### 1. Test Contact Event Flow
1. Go to http://localhost:3000
2. Fill out and submit the contact form
3. Check the consumer terminal for event processing logs
4. Verify Discord notification appears in your configured channel

### 2. Test Request Event Flow
1. Go to http://localhost:3000/request
2. Submit a drink request
3. Watch the processing chain execute in the consumer logs
4. Verify Discord notification appears in your configured channel

### 3. Test Machine Event Flow
1. Create a new machine via the API or admin interface
2. Observe the setup commands being executed
3. Verify Discord notification appears in your configured channel

## Architecture Benefits

### 1. **Scalability**
- Each event type has its own consumer group
- Horizontal scaling by adding more consumer instances
- Asynchronous processing prevents blocking

### 2. **Reliability**
- Event persistence in Kafka topics
- Retry mechanisms in event handlers
- Graceful error handling with rollback support

### 3. **Maintainability**
- Clear separation of concerns
- Design patterns make code predictable
- Easy to add new event types and handlers

### 4. **Observability**
- Comprehensive logging throughout the event flow
- Health checks for consumer status
- Event tracing with unique IDs
- Real-time Discord notifications for all events

## Production Considerations

### 1. **Kafka Configuration**
- Use multiple brokers for high availability
- Configure proper retention policies
- Set up monitoring and alerting

### 2. **Error Handling**
- Implement dead letter queues for failed events
- Add circuit breakers for external service calls
- Set up proper logging and monitoring

### 3. **Security**
- Enable Kafka authentication and authorization
- Use TLS encryption for data in transit
- Secure API endpoints and database access
- Protect your Discord webhook URL

### 4. **Monitoring**
- Track event processing metrics
- Monitor consumer lag
- Set up alerts for failed processing
- Configure Discord notification filters for high-priority events

## Troubleshooting

### Common Issues

1. **Kafka Connection Failed**
   - Ensure Docker containers are running
   - Check KAFKA_BROKER environment variable
   - Verify network connectivity

2. **Consumer Not Processing Events**
   - Check consumer group status
   - Verify topic exists and has messages
   - Review consumer logs for errors

3. **Event Publishing Failed**
   - Verify Kafka broker is accessible
   - Check event payload format
   - Review producer logs

4. **Discord Notifications Not Working**
   - Verify DISCORD_WEBHOOK is set correctly
   - Check for webhook rate limiting
   - Ensure webhook hasn't been deleted in Discord

### Useful Commands

```bash
# Check running containers
docker ps

# View Kafka logs
docker logs broker

# Stop Kafka infrastructure
npm run kafka:stop

# Restart consumers
npm run consumers
```

## Design Patterns Used

### 1. Observer Pattern
Event handlers subscribe to specific event types and react when they occur.

### 2. Strategy Pattern
Different notification strategies can be selected based on contact type or preferences.

### 3. Chain of Responsibility
Request processing flows through a chain of processors, each handling specific responsibilities.

### 4. Command Pattern
Machine setup operations are encapsulated as commands with undo capability.

### 5. Factory Pattern
Creates appropriate processing chains and command sets based on event data.

This event-driven architecture provides a solid foundation for building scalable, maintainable applications with clear separation of concerns and robust error handling. 