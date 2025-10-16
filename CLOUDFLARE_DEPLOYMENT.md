# Cloudflare Workers Deployment Guide

This application is designed to run **completely FREE** on Cloudflare Workers with NO database required.

## Features
- ✅ Random 10-14 minute pinging to prevent service sleep
- ✅ In-memory status tracking (resets on worker restart)
- ✅ Real-time dashboard
- ✅ 100% FREE - No D1 database needed

## Prerequisites
1. Cloudflare account (free tier)
2. Node.js and npm installed
3. Wrangler CLI installed

## Quick Setup

### 1. Install Wrangler
```bash
npm install -g wrangler
```

### 2. Login to Cloudflare
```bash
wrangler login
```

### 3. Configure Your Target URL
Edit `wrangler.toml` and set your target URL:
```toml
[vars]
TARGET_URL = "https://your-service.onrender.com"
```

### 4. Build the Frontend
```bash
npm run build
```

### 5. Deploy to Cloudflare Workers
```bash
wrangler deploy
```

## How It Works

### Randomized Pinging
- Worker runs every minute (Cloudflare Cron: `*/1 * * * *`)
- Checks if it's time to ping (based on random 10-14 minute interval)
- Executes ping and schedules next one with new random interval

### In-Memory Storage (Free Tier Trade-off)
- Keeps last 20 ping logs in memory
- Timing and logs reset on Worker cold start
- **This is intentional** - keeps it 100% free
- Cold starts are rare on active workers
- Service still stays awake with regular pings

**Why no persistent storage?**
- Cloudflare KV costs $0.50/month minimum
- D1 has limited free tier
- Durable Objects cost money
- **This solution is completely FREE**

### API Endpoints
- `GET /api/status` - Get current status and next ping time
- `GET /api/ping-logs` - Get recent ping history (in-memory)
- `POST /api/manual-ping` - Manually trigger a ping

## Cost Breakdown
- **Cloudflare Workers Free Tier**: 100,000 requests/day
- **Cron Triggers**: ~1,440 checks/day (every minute)
- **Estimated API calls**: ~2,000/day
- **Total Cost**: $0.00 ✅

## Environment Variables

Set in `wrangler.toml`:
```toml
[vars]
TARGET_URL = "https://your-target-url.com"
```

Or override via Cloudflare Dashboard:
1. Go to Workers & Pages
2. Select your worker
3. Settings → Variables
4. Add `TARGET_URL` environment variable

## Monitoring

Access your dashboard at: `https://ping-monitor.<your-subdomain>.workers.dev`

The dashboard shows:
- ✅ Service status (active/idle)
- ✅ Last ping time
- ✅ Next ping countdown
- ✅ Recent ping history (last 20)

## Troubleshooting

### Worker not pinging?
- Check Cloudflare Workers dashboard for errors
- Verify cron trigger is enabled
- Check logs: `wrangler tail`

### Frontend not loading?
- Ensure you ran `npm run build` before deploying
- Check assets are in `dist/public` directory

### Need to change ping interval?
The worker automatically randomizes between 10-14 minutes. To change:
1. Edit `worker.ts`
2. Modify `getRandomInterval()` function
3. Redeploy: `wrangler deploy`

## Development

### Local Development
```bash
npm run dev
```

### Test Worker Locally
```bash
wrangler dev
```

### View Live Logs
```bash
wrangler tail
```

## Updating

1. Make your changes
2. Build: `npm run build`
3. Deploy: `wrangler deploy`

## Notes

- **In-memory storage**: Logs persist while worker is warm (usually hours), reset on cold start
- **No database**: Completely free, no D1 or KV costs
- **Cloudflare limits**: Free tier has 100k requests/day - plenty for this use case
- **Random intervals**: True randomization between 10-14 minutes per ping

## Support

For issues with Cloudflare Workers, see:
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
