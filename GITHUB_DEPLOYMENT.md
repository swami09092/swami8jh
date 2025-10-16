# Deploy to Cloudflare via GitHub

## Quick Steps

### 1. Download from Replit
- Click the 3 dots menu (⋮) in the top left
- Select "Download as ZIP"
- Extract the ZIP file to your computer

### 2. Upload to GitHub

```bash
# Navigate to extracted folder
cd your-extracted-folder

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Cloudflare ping monitor"

# Add your GitHub repo
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Deploy to Cloudflare

**Option A: Direct Deploy (Fastest)**

```bash
# Install dependencies
npm install

# Build the frontend
npm run build

# Login to Cloudflare
npx wrangler login

# Deploy!
npx wrangler deploy
```

**Option B: GitHub Integration**

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click **Workers & Pages** → **Create application**
3. Select **Pages** → **Connect to Git**
4. Choose your repository
5. Configure build:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist/public`
   - **Root directory:** `/`
6. Click **Save and Deploy**

### 4. Configure Your Target URL

Edit `wrangler.toml`:
```toml
[vars]
TARGET_URL = "https://your-render-api.onrender.com"
```

Then redeploy:
```bash
npx wrangler deploy
```

## Your App Will Be Live At:

`https://ping-monitor.YOUR-SUBDOMAIN.workers.dev`

## What Gets Deployed:

✅ **Backend:** Cloudflare Worker (Hono API)  
✅ **Frontend:** React dashboard  
✅ **Cron Jobs:** Automatic pinging every 10-14 minutes  
✅ **100% FREE** on Cloudflare!

## Monitoring Your Pings

After deployment, visit your app URL to see:
- Live ping status
- Next ping countdown
- Recent ping history (last 20)
- Response times and success rates

## Troubleshooting

### Build fails?
Make sure you ran `npm install` first

### Worker not pinging?
Check Cloudflare dashboard → Workers & Pages → Your worker → Logs

### View live logs:
```bash
npx wrangler tail
```

---

**That's it! Your Render API will stay awake 24/7 for FREE!** 🚀
