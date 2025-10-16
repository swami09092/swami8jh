# Cloudflare Keep-Alive Monitor

## Overview

This is a **100% FREE** monitoring solution that runs on Cloudflare Workers to ping services at randomized 10-14 minute intervals, preventing them from sleeping. The application features a real-time React dashboard for monitoring ping status and activity logs, with no database required - all data is stored in-memory.

## Recent Changes (October 16, 2025)

- **Removed Express backend**: Deleted the `server/` directory and all Node.js/Express-specific files that don't work on Cloudflare
- **Simplified architecture**: Now uses only `worker.ts` (Cloudflare Worker) as the backend
- **Cleaned configurations**: Updated tsconfig.json and vite.config.cloudflare.ts to remove references to deleted directories
- **Cloudflare-only deployment**: Updated all documentation to focus exclusively on Cloudflare deployment

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite (using `vite.config.cloudflare.ts`)
- **UI Components**: Radix UI primitives with custom shadcn/ui components
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack React Query for server state
- **Routing**: Wouter (lightweight client-side routing)

The frontend is a single-page application with a dashboard view showing:
- Real-time service status
- Ping metrics (interval, total count, target URL)
- Activity log with recent ping results
- All components use a consistent design system with light/dark mode support

### Backend Architecture
- **Runtime**: Cloudflare Workers (serverless)
- **Framework**: Hono (lightweight web framework)
- **Entry Point**: `worker.ts` - Single file containing all backend logic
- **HTTP Client**: Native fetch API
- **Storage**: In-memory (resets on worker restart - no database)
- **Execution Model**: Cron-triggered at 1-minute intervals with randomized ping logic

**Key Design Decisions**:
1. **No Database**: Uses in-memory storage to stay on free tier - data resets on worker restart, which is acceptable for keep-alive monitoring
2. **Randomized Intervals**: Pings occur every 10-14 minutes (randomized) to avoid predictable patterns
3. **Cloudflare Workers**: Chosen for serverless deployment and global edge distribution
4. **Single Worker File**: All backend logic in `worker.ts` for simplicity

### Deployment Strategy
- **Build Command**: `vite build --config vite.config.cloudflare.ts`
- **Build Output**: `dist/public` for static assets served by Cloudflare Workers
- **Deployment Method 1**: GitHub → Cloudflare Pages (automatic deployments)
- **Deployment Method 2**: Direct Wrangler CLI deployment

### API Structure
RESTful endpoints served by Hono in `worker.ts`:
- `GET /api/status` - Returns current ping status, next ping time, and configuration
- `GET /api/ping-logs` - Returns recent ping activity (in-memory logs, max 20 entries)
- `POST /api/manual-ping` - Trigger manual ping
- `GET /*` - Serve static assets from Cloudflare Pages

### Monitoring Logic
- **Cron Schedule**: `*/1 * * * *` (every minute via Cloudflare Cron Triggers)
- **Execution Flow**:
  1. Cron trigger fires every minute
  2. Worker checks if current time >= next scheduled ping time
  3. If yes, execute HTTP GET to target URL
  4. Record result (success/failure, response time, timestamp)
  5. Calculate next random interval (10-14 minutes)
  6. Store up to 20 most recent logs in memory

## File Structure

```
.
├── worker.ts                      # Cloudflare Worker (backend)
├── wrangler.toml                  # Cloudflare configuration
├── vite.config.cloudflare.ts     # Vite build config for Cloudflare
├── client/                        # React frontend
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   ├── pages/
│   │   └── lib/
│   └── index.html
├── tsconfig.json                  # TypeScript configuration
└── Documentation/                 # Deployment guides
```

## External Dependencies

### Core Runtime
- **Cloudflare Workers**: Serverless execution environment
- **Cloudflare Cron Triggers**: Scheduled execution (1-minute intervals)
- **Cloudflare Pages**: Static asset hosting and deployment

### Third-Party Libraries

**Frontend**:
- `react`, `react-dom` - UI framework
- `@tanstack/react-query` - Server state management and caching
- `wouter` - Lightweight routing
- `@radix-ui/*` - Headless UI primitives (dialogs, dropdowns, etc.)
- `tailwindcss` - Utility-first CSS framework
- `class-variance-authority`, `clsx`, `tailwind-merge` - CSS utility helpers
- `lucide-react` - Icon library
- `date-fns` - Date formatting and manipulation

**Backend**:
- `hono` - Lightweight web framework for Cloudflare Workers
- `hono/cors` - CORS middleware

**Build Tools**:
- `vite` - Frontend build tool
- `esbuild` - JavaScript bundler (for local builds, not used in Cloudflare)
- `typescript` - Type safety
- `wrangler` - Cloudflare CLI deployment tool

**Note**: The package.json includes some legacy dependencies (database-related, Express, etc.) that are NOT used in the Cloudflare deployment. The application intentionally avoids databases to remain on Cloudflare's free tier.

### Environment Variables
- `TARGET_URL` - The service URL to ping (configured in `wrangler.toml` or Cloudflare dashboard)
- `NODE_VERSION=18` - Required for Cloudflare Pages build

### Deployment Platforms
- **Primary**: Cloudflare Pages (connected to GitHub repository)
- **Alternative**: Direct Wrangler CLI deployment (`wrangler deploy`)
- **Not Supported**: Traditional Node.js/Express hosting (backend removed)

## How to Deploy

See [CLOUDFLARE_READY.md](CLOUDFLARE_READY.md) for complete deployment instructions.

**Quick Deploy:**
1. Push to GitHub
2. Connect to Cloudflare Pages
3. Build command: `vite build --config vite.config.cloudflare.ts`
4. Build output: `dist/public`
5. Add environment variable: `NODE_VERSION=18`
6. After deploy: Add compatibility flag `nodejs_compat` and cron trigger `*/1 * * * *`
