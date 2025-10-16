/// <reference types="@cloudflare/workers-types" />

import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {
  TARGET_URL?: string;
  ASSETS: Fetcher;
};

// In-memory storage (resets on worker restart - that's OK for free tier)
interface PingLog {
  id: string;
  timestamp: string;
  url: string;
  status: string;
  responseTime: number;
  success: boolean;
  error?: string;
}

function getRandomInterval(): number {
  // Random interval between 10-14 minutes in milliseconds
  const minMinutes = 10;
  const maxMinutes = 14;
  const randomMinutes = Math.random() * (maxMinutes - minMinutes) + minMinutes;
  return Math.floor(randomMinutes * 60 * 1000);
}

// Initialize with first random interval
let nextPingAt: number = Date.now() + getRandomInterval();
let lastPingResult: PingLog | null = null;
let pingLogs: PingLog[] = [];
const MAX_LOGS = 20;

async function executePing(targetUrl: string): Promise<PingLog> {
  console.log(`🔄 [${new Date().toISOString()}] Executing ping to ${targetUrl}...`);
  
  const startTime = Date.now();
  const id = crypto.randomUUID();
  
  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Cloudflare-Worker-Monitor/1.0'
      },
      signal: AbortSignal.timeout(30000),
    });
    
    const responseTime = Date.now() - startTime;
    
    const log: PingLog = {
      id,
      timestamp: new Date().toISOString(),
      url: targetUrl,
      status: `${response.status}`,
      responseTime,
      success: response.ok,
    };
    
    // Store in memory
    pingLogs.unshift(log);
    if (pingLogs.length > MAX_LOGS) {
      pingLogs = pingLogs.slice(0, MAX_LOGS);
    }
    lastPingResult = log;
    
    console.log(`✓ Ping successful: ${targetUrl} (${responseTime}ms) - Status: ${response.status}`);
    
    return log;
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    const log: PingLog = {
      id,
      timestamp: new Date().toISOString(),
      url: targetUrl,
      status: 'ERROR',
      responseTime,
      success: false,
      error: error.message,
    };
    
    // Store in memory
    pingLogs.unshift(log);
    if (pingLogs.length > MAX_LOGS) {
      pingLogs = pingLogs.slice(0, MAX_LOGS);
    }
    lastPingResult = log;
    
    console.error(`✗ Ping failed: ${targetUrl} - ${error.message}`);
    
    return log;
  }
}

const app = new Hono<{ Bindings: Bindings }>();

// CORS middleware
app.use('/*', cors());

// API Routes
app.get('/api/ping-logs', async (c) => {
  return c.json(pingLogs);
});

app.get('/api/status', async (c) => {
  const targetUrl = c.env.TARGET_URL || "https://ip-geolocation-api-40va.onrender.com";
  const now = Date.now();
  const nextPingInMs = Math.max(0, nextPingAt - now);
  
  return c.json({
    isRunning: true,
    targetUrl,
    cronSchedule: '*/1 * * * *',
    message: 'Pinging every 10-14 minutes (randomized)',
    nextPingTime: new Date(nextPingAt).toISOString(),
    lastPingTime: lastPingResult?.timestamp || null,
    nextPingInSeconds: Math.floor(nextPingInMs / 1000),
  });
});

app.post('/api/manual-ping', async (c) => {
  const targetUrl = c.env.TARGET_URL || "https://ip-geolocation-api-40va.onrender.com";
  const result = await executePing(targetUrl);
  
  // Schedule next ping with random interval
  nextPingAt = Date.now() + getRandomInterval();
  
  return c.json(result);
});

// Serve static assets from Pages
app.get('/*', async (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

export default {
  // Scheduled event handler - runs every minute, checks if it's time to ping
  async scheduled(event: ScheduledEvent, env: Bindings, ctx: ExecutionContext) {
    const now = Date.now();
    
    // Check if it's time to ping
    if (now >= nextPingAt) {
      const targetUrl = env.TARGET_URL || "https://ip-geolocation-api-40va.onrender.com";
      await executePing(targetUrl);
      
      // Schedule next ping with random interval (10-14 minutes)
      nextPingAt = now + getRandomInterval();
      console.log(`⏰ Next ping scheduled in ${Math.floor((nextPingAt - now) / 60000)} minutes`);
    }
  },

  // HTTP request handler
  async fetch(request: Request, env: Bindings, ctx: ExecutionContext) {
    return app.fetch(request, env, ctx);
  },
};
