# Development Environment Setup Guide

This document outlines the fixes and setup procedures for the Phase II development environment.

## Next.js 16 Configuration Fixes

### Fixed next.config.js
- Removed deprecated `experimental.appDir` property
- Removed problematic `turbo`/`turbopack` keys that caused project root detection issues
- Updated `images.domains` to `images.remotePatterns` to comply with Next.js 16 standards
- Properly configured remote patterns for API connections

**Before:**
```javascript
const nextConfig = {
  experimental: {
    appDir: true,  // Deprecated
  },
  images: {
    domains: ['localhost'],  // Deprecated
  },
  turbo: {  // Causing project root issues
    root: './'
  }
}
```

**After:**
```javascript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8001',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '8001',
      },
    ],
  },
}
```

## Frontend Structure Validation

### App Router Structure
- Confirmed `/src/app` contains required layout.tsx and page.tsx
- Verified layout.tsx implements proper Next.js 16 metadata and structure
- Ensured proper context providers are wrapped correctly

## Backend Development Workflow Fixes

### Port Conflict Prevention
- Added alternative port options in package.json scripts
- Created safe startup script that checks for port availability
- Default backend runs on port 8001
- Alternative ports (8002, 8003) available if primary port is in use

### Safe Startup Script
Added `start-backend-safe.sh` script that:
1. Checks if the requested port is available
2. Automatically selects an alternative port if the primary is in use
3. Provides clear feedback about which port is being used

## Package.json Scripts

Updated package.json with the following scripts:
- `npm run backend`: Runs backend on port 8001
- `npm run backend-dev`: Runs backend with reload on port 8001
- `npm run backend-alt`: Runs backend with reload on port 8002 (alternative)
- `npm run frontend`: Runs frontend development server
- `npm run dev`: Runs both backend and frontend concurrently
- `npm run start`: Alias for `npm run dev`

## Troubleshooting

### Common Issues and Solutions:

1. **Port Already in Use Error:**
   - Use `npm run backend-alt` to run on port 8002
   - Or use the safe startup script: `./start-backend-safe.sh`

2. **Turbopack Project Root Detection Error:**
   - Ensure next.config.js doesn't have experimental or turbo keys
   - Verify Next.js package is resolvable from project directory

3. **Image Domain Configuration Error:**
   - Replace `images.domains` with `images.remotePatterns` in next.config.js

## Running the Application

### Development Mode:
```bash
npm install
npm run dev
```

### Separate Services:
```bash
# Terminal 1 - Backend
npm run backend

# Terminal 2 - Frontend
npm run frontend
```

### Backend Only:
```bash
npm run backend-dev  # With hot reload
npm run backend-alt  # On alternative port
```

## Frontend Stabilization

### Disabled Turbopack for Stability
- Removed CLI turbo flags (deprecated in Next.js 16)
- Added `NEXT_DISABLE_TURBOPACK=1` to frontend/.env.local
- Changed `npm run dev` to use simple `next dev` command
- This prevents Turbopack workspace root detection bugs
- Prioritizes stability over experimental performance features

### Build Artifacts Cleanup
- Removed .next directory to ensure clean build
- Prepared for fresh node_modules installation

### Next.js Resolution
- Confirmed Next.js resolves properly from /frontend directory
- No workspace root detection issues with proper configuration

## API Base URL Configuration

Frontend environment is configured to connect to:
- API: `http://localhost:8001/api`
- File: `frontend/.env.local`

Ensure backend is running on the same port specified in the frontend environment file.