# TodoApp Frontend

This is the frontend for the TodoApp, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- User authentication (login/register)
- Task management (CRUD operations)
- Dashboard with sidebar navigation
- Dark/light mode support
- Responsive design
- JWT-based authentication

## Prerequisites

- Node.js 18+
- npm or yarn

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file in the root of the frontend directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

## Running the Application

1. Start the development server:

```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:3000`

## Environment Variables

- `NEXT_PUBLIC_API_BASE_URL`: The base URL for the backend API (e.g., http://localhost:8000/api)

## Folder Structure

```
frontend/
├── public/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── api/
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # Dashboard pages
│   │   ├── login/          # Login page
│   │   ├── register/       # Register page
│   │   ├── globals.css     # Global styles
│   │   └── layout.tsx      # Root layout
│   ├── components/         # Reusable components
│   │   └── ui/            # UI components
│   ├── context/            # React context providers
│   ├── lib/               # Utility functions
│   ├── services/          # API services
│   └── types/             # TypeScript type definitions
├── package.json
└── README.md
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linter

## API Integration

The frontend communicates with the backend API using JWT authentication. The API client automatically attaches the JWT token to all requests when available in localStorage.