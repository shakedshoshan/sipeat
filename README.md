# SipEat

## Visit website: https://sipeat.app/

## Project Overview
Built as a freelance project for SipEat, a company specializing in vending machines, this web application streamlines interactions with food and beverage services. It allows users to create contacts for requesting machine placements and customize beverage selections for specific machines, enhancing the experience for customers who purchase from them.

![sipeatImage1](https://github.com/user-attachments/assets/4b12ca7f-950b-453a-a4a2-4b9c8841712a) ![sipeatImage2](https://github.com/user-attachments/assets/4953ad93-89a4-440e-a88e-2d189fbe6e08) 

![sipeatImage3](https://github.com/user-attachments/assets/61d41dc5-6063-4ca1-9b63-3d2b960953a5)


## Features
- **Request Management**: Submit and track service requests.
- **Machine Management**: Add and manage beverage machines.
- **Contact Integration**: Easily create and manage contacts.
- **Multi-language Support**: Supports multiple languages for a global audience.
- **Responsive Design**: Optimized for all device sizes.
- **Discord Notifications**: Real-time event notifications via Discord webhooks.

## Technologies Used
- [Next.js](https://nextjs.org/) - React framework for server-side rendering.
- [Supabase](https://supabase.com/) - Open-source Firebase alternative for backend services.
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework.
- [TypeScript](https://www.typescriptlang.org/) - Static typing for JavaScript.
- [Vercel](https://vercel.com/) - Deployment platform.
- [Apache Kafka](https://kafka.apache.org/) - Event streaming platform.
- [Discord Webhooks](https://discord.com/developers/docs/resources/webhook) - For real-time notifications.

## 🚀 Getting Started with Event-Driven Architecture

### Prerequisites
- Node.js (v18 or later)
- Docker & Docker Compose (for Kafka)
- Supabase account (for backend services)
- Discord server with webhook URL (for notifications)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/sipeat.git
   ```
2. Navigate to the project directory:
   ```bash
   cd sipeat
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### 🎯 Kafka Event System Setup

1. **Start Kafka Infrastructure:**
   ```bash
   npm run kafka:start
   ```

2. **Set Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   KAFKA_BROKER=localhost:9092
   DISCORD_WEBHOOK=your-discord-webhook-url
   ```

3. **Start Applications:**
   ```bash
   # Terminal 1: Start the web application
   npm run dev
   
   # Terminal 2: Start event consumers
   npm run consumers
   ```

### 🔄 Event-Driven Features

This project demonstrates a complete event-driven architecture with:

- **📧 Contact Events**: Automated email workflows, sales notifications, CRM integration
- **🥤 Request Events**: Drink order processing with inventory validation and payment
- **🏭 Machine Events**: Automated machine setup and configuration

**Design Patterns Implemented:**
- Observer Pattern (Event handlers)
- Strategy Pattern (Notification strategies) 
- Chain of Responsibility (Request processing)
- Command Pattern (Machine setup with undo)
- Factory Pattern (Processing chain creation)

📖 **[See full Kafka documentation](docs/kafka-setup.md)**

### 🔔 Discord Integration

SipEat includes Discord webhook integration for real-time event notifications:

1. **Create a Discord Webhook:**
   - Go to your Discord server
   - Edit a channel > Integrations > Webhooks
   - Create a new webhook and copy the URL

2. **Add the Webhook URL to Environment:**
   - Add `DISCORD_WEBHOOK=your-webhook-url` to your `.env.local` file

3. **Notification Features:**
   - Real-time alerts for all Kafka events
   - Color-coded messages (green for success, red for errors)
   - Detailed event data in embedded format
   - Error information when events fail

4. **Testing Discord Integration:**
   - Submit a contact form
   - Create a new machine
   - Submit a drink request
   - Check your Discord channel for notifications

## API Endpoints
- **Contact**: `/api/contact` - Create a new contact.
- **Machines**: `/api/machines` - Manage beverage machines.
- **Requests**: `/api/requests` - Submit and track service requests.

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Learn More
To learn more about Next.js, take a look at the following resources:
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel
The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
