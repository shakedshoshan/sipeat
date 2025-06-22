# SipEat

## Project Overview
SipEat is a modern web application built with Next.js, designed to streamline interactions with food and beverage services. It provides a seamless user experience for managing requests, machines, and contacts.

![sipeatImage1](https://github.com/user-attachments/assets/4b12ca7f-950b-453a-a4a2-4b9c8841712a) ![sipeatImage2](https://github.com/user-attachments/assets/4953ad93-89a4-440e-a88e-2d189fbe6e08) 

![sipeatImage3](https://github.com/user-attachments/assets/61d41dc5-6063-4ca1-9b63-3d2b960953a5)


## Features
- **Request Management**: Submit and track service requests.
- **Machine Management**: Add and manage beverage machines.
- **Contact Integration**: Easily create and manage contacts.
- **Multi-language Support**: Supports multiple languages for a global audience.
- **Responsive Design**: Optimized for all device sizes.

## Technologies Used
- [Next.js](https://nextjs.org/) - React framework for server-side rendering.
- [Supabase](https://supabase.com/) - Open-source Firebase alternative for backend services.
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework.
- [TypeScript](https://www.typescriptlang.org/) - Static typing for JavaScript.
- [Vercel](https://vercel.com/) - Deployment platform.

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- Supabase account (for backend services)

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
   # or
   yarn install
   ```
4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

### Environment Variables
Create a `.env.local` file in the root directory and add the following variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

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
