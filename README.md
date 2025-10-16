# Cloudflare Keep-Alive Monitor

A **100% FREE** monitoring solution that pings your services every 10-14 minutes (randomized) to prevent them from sleeping. Runs entirely on Cloudflare Workers with no database required.

## ✨ Features

- 🎲 **Randomized Pinging**: 10-14 minute intervals
- 💾 **No Database**: In-memory storage (completely free)
- 📊 **Live Dashboard**: Real-time status monitoring
- 🚀 **Cloudflare Workers**: Serverless deployment
- 💰 **Free Forever**: No storage costs

## 🚀 Deploy to Cloudflare

### Method 1: Deploy from GitHub (Recommended)

**See [DEPLOYMENT_INSTRUCTIONS.md](DEPLOYMENT_INSTRUCTIONS.md) for the complete guide.**

Quick steps:
1. Push this repo to GitHub
2. Connect GitHub to Cloudflare Pages
3. Use build command: `vite build --config vite.config.cloudflare.ts`
4. Your app goes live automatically!

### Method 2: Direct Deploy with Wrangler CLI

#### 1. Install Wrangler
```bash
npm install -g wrangler
```

#### 2. Login to Cloudflare
```bash
wrangler login
```

#### 3. Configure Target URL
Edit `wrangler.toml`:
```toml
[vars]
TARGET_URL = "https://your-service-to-keep-alive.com"
```

#### 4. Build & Deploy
```bash
vite build --config vite.config.cloudflare.ts
wrangler deploy
```

Your monitor will be live at: `https://ping-monitor.<your-subdomain>.workers.dev`

## 📖 How It Works

1. **Cloudflare Cron** checks every minute
2. **Worker** determines if it's time to ping (based on random 10-14 min interval)
3. **Ping executes** and logs are stored in memory
4. **Next ping** is scheduled with new random interval

## 📊 Dashboard Features

- ✅ Service status indicator
- ✅ Last ping timestamp
- ✅ Next ping countdown
- ✅ Recent ping history (last 20)
- ✅ Response time tracking

## 🔧 Configuration

### Change Target URL
Edit `wrangler.toml` or set via Cloudflare Dashboard:
1. Workers & Pages → Your Worker
2. Settings → Variables
3. Add/Update `TARGET_URL`

### Modify Ping Interval
Edit `worker.ts` - `getRandomInterval()` function:
```typescript
function getRandomInterval(): number {
  const minMinutes = 10;  // Change minimum
  const maxMinutes = 14;  // Change maximum
  // ...
}
```

## 💰 Cost

- **Cloudflare Workers Free Tier**: 100,000 requests/day
- **Cron triggers**: ~1,440/day (every minute check)
- **Dashboard API calls**: ~2,000/day
- **Total**: $0.00 ✅

## 📝 API Endpoints

- `GET /api/status` - Current status & next ping time
- `GET /api/ping-logs` - Recent ping history
- `POST /api/manual-ping` - Trigger manual ping

## 🐛 Troubleshooting

**Worker not pinging?**
```bash
wrangler tail  # View live logs
```

**Frontend not loading?**
```bash
vite build --config vite.config.cloudflare.ts
wrangler deploy
```

## 🎯 Use Cases

- Keep Render free tier services alive
- Monitor API uptime
- Prevent Heroku dyno sleep
- Any service that sleeps after inactivity

## ⚠️ Important Notes

### In-Memory State (Trade-off for Free Tier)
- **Logs**: Last 20 pings stored in memory, reset on Worker cold start
- **Timing**: Random 10-14 min intervals reset on cold start
- **Trade-off**: No storage costs = occasional timing resets (still pings regularly)

### Why This Works
- Worker cold starts are infrequent on active workers
- Even with resets, service stays awake with regular pings
- **100% FREE** - No KV, D1, or Durable Objects needed

### If You Need Persistent Timing
Use Cloudflare KV (costs on free tier):
1. Add KV binding to wrangler.toml
2. Store nextPingAt in KV
3. Read/write on each cron run

**Current implementation prioritizes FREE over perfect timing**

## 🛠️ Tech Stack

- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Hono (Cloudflare Workers)
- **Deployment**: Cloudflare Workers + Pages
- **Storage**: In-memory (no database)

## 📚 Additional Documentation

- [DEPLOYMENT_INSTRUCTIONS.md](DEPLOYMENT_INSTRUCTIONS.md) - Quick deployment guide
- [CLOUDFLARE_GITHUB_DEPLOYMENT.md](CLOUDFLARE_GITHUB_DEPLOYMENT.md) - GitHub integration
- [CLOUDFLARE_DEPLOYMENT.md](CLOUDFLARE_DEPLOYMENT.md) - Detailed Cloudflare setup

## 📄 License

MIT
