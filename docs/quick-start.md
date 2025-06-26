# Quick Start Guide - SipEat Kafka Implementation

## 🚀 Test the Event-Driven System in 5 Minutes

### Step 1: Start Infrastructure (2 minutes)

```bash
# 1. Start Kafka
npm run kafka:start

# 2. Wait for containers to be ready (about 30 seconds)
# 3. Verify containers are running
docker ps
```

You should see `zookeeper` and `broker` containers running.

### Step 2: Start Applications (1 minute)

Open **2 terminals** in your project directory:

**Terminal 1 - Web App:**
```bash
npm run dev
```

**Terminal 2 - Event Consumers:**
```bash
npm run consumers
```

### Step 3: Test Events (2 minutes)

#### Test Contact Event Flow
1. Open http://localhost:3000
2. Scroll down to the contact form
3. Fill out the form with test data:
   - Name: "Test User"
   - Email: "test@example.com" 
   - Phone: "1234567890"
   - Message: "This is an urgent test message"
4. Click Submit

**Expected Result:** In Terminal 2, you'll see:
```
🎯 Processing contact.created event for: Test User
📧 Sending welcome email to test@example.com
🔔 Notifying sales team about new contact: Test User
📊 Updating CRM with contact: contact-xxxxx
   Lead Score: 120
✅ All notifications completed
```

#### Test Request Event Flow
1. Go to http://localhost:3000/request
2. Fill out the drink request form:
   - Name: "Customer Test"
   - Drink: Select any drink from the dropdown
   - Machine: Select any available machine
3. Click Submit Request

**Expected Result:** In Terminal 2, you'll see:
```
🎯 Processing request.created event for: Customer Test
📦 Validating inventory for [drink] at machine [machine]
💳 Processing payment for [drink]
🥤 Dispensing [drink] from machine [machine]
📱 Sending notification to Customer Test
✅ Request processing completed
```

## 🎉 Success!

You've successfully implemented and tested:
- ✅ Kafka event publishing
- ✅ Event consumption with design patterns
- ✅ Observer Pattern (event handlers)
- ✅ Strategy Pattern (notification strategies)
- ✅ Chain of Responsibility (request processing)
- ✅ Error handling and retry mechanisms

## 🧹 Cleanup

When you're done testing:

```bash
# Stop Kafka infrastructure
npm run kafka:stop

# Stop the applications with Ctrl+C in both terminals
```

## 🔍 What's Happening Behind the Scenes?

1. **Contact Form Submission:**
   - Database insert → Event published to `sipeat.contact.events` topic
   - 3 strategies execute in parallel: Email, Sales notification, CRM update

2. **Drink Request:**
   - Database insert → Event published to `sipeat.request.events` topic
   - Chain of responsibility: Inventory → Payment → Dispensing → Notification

3. **Machine Creation:**
   - Database insert → Event published to `sipeat.machine.events` topic
   - Command pattern: Location validation → Inventory setup → Network config → Maintenance

## 🎯 Next Steps

Try these advanced scenarios:
- Submit multiple requests simultaneously to see parallel processing
- Add a machine via the API to trigger machine setup events
- Introduce failures by stopping one of the containers temporarily
- Scale up by running multiple consumer instances

## 📊 Monitoring

Watch the consumer health checks every 30 seconds:
```
💓 Health check: healthy (10:30:15 AM)
```

This shows all consumers are running and processing events successfully. 