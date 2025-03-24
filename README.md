# Calendar Booking Application

A modern Calendly-like application that integrates with Google Calendar for scheduling meetings. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Google Calendar integration
- Real-time availability checking
- Responsive design for all devices
- Dark mode support
- Easy appointment booking
- Email notifications via Google Calendar

## Prerequisites

Before you begin, ensure you have the following:

- Node.js 18.x or higher
- Google Cloud Platform account
- Google Calendar API enabled

## Getting Started

1. Clone the repository

```bash
git clone https://github.com/yourusername/calendar-application.git
cd calendar-application
```

2. Install dependencies

```bash
npm install
```

3. Set up Google OAuth credentials

- Go to the [Google Cloud Console](https://console.cloud.google.com/)
- Create a new project or select an existing one
- Enable the Google Calendar API
- Create OAuth 2.0 credentials (Web application type)
- Add the following authorized redirect URIs:
  - `http://localhost:3000/api/auth/callback/google` (for development)
  - `https://your-production-domain.com/api/auth/callback/google` (for production)

4. Configure environment variables

Create a `.env.local` file in the project root with the following variables:

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_a_random_string
```

5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

### Deploying to Replit

1. Create a new Replit project
2. Import the GitHub repository
3. Set up the environment variables in the Replit Secrets tab
4. Run the following commands in the Replit Shell:

```bash
npm install
npm run build
npm start
```

4. Your application will be deployed to your Replit subdomain.

## Customization

- Edit the time slots in `src/app/api/availability/route.ts`
- Modify the UI components in `src/components/`
- Customize the email templates and notifications in Google Calendar settings

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Google Calendar API](https://developers.google.com/calendar)
