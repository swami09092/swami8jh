# Deploy to Cloudflare from GitHub

This guide shows you how to deploy your ping monitor application to Cloudflare Workers by connecting your GitHub repository.

## Step 1: Push to GitHub

1. Create a new repository on GitHub
2. Push your code:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

## Step 2: Connect GitHub to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click **Workers & Pages**
3. Click **Create application**
4. Click **Pages** tab
5. Click **Connect to Git**
6. Select your GitHub repository
7. Click **Begin setup**

## Step 3: Configure Build Settings

Use these **EXACT** settings:

### Framework preset
- Select: **None** (or Vite if available)

### Build command
```
vite build --config vite.config.cloudflare.ts
```

### Build output directory
```
dist/public
```

### Root directory (advanced)
```
/
```
(Leave as default - root of repository)

### Environment variables
Add these in the **Environment variables** section:

| Variable Name | Value |
|--------------|-------|
| `NODE_VERSION` | `18` |

## Step 4: Deploy

1. Click **Save and Deploy**
2. Wait for the build to complete (2-3 minutes)
3. Your application will be live at: `https://YOUR_PROJECT_NAME.pages.dev`

## Step 5: Configure the Worker

After the Pages deployment succeeds:

1. In your Cloudflare dashboard, go to **Workers & Pages**
2. Click on your deployed Pages project
3. Go to **Settings** → **Functions**
4. Scroll down to **Compatibility flags**
5. Add: `nodejs_compat`

## Step 6: Set Environment Variables for the Worker

1. Still in **Settings**, go to **Environment variables**
2. Click **Add variable**
3. Add:
   - Variable name: `TARGET_URL`
   - Value: `https://ipaddress-1-tucc.onrender.com` (or your target URL)
4. Click **Save**

## Step 7: Enable Cron Triggers

1. Go to **Workers & Pages** → Your project
2. Click on **Triggers** tab
3. Scroll to **Cron Triggers**
4. Click **Add Cron Trigger**
5. Enter: `*/1 * * * *` (runs every minute)
6. Click **Add trigger**

## How It Works

- **GitHub**: Stores your code
- **Cloudflare Pages**: Builds and hosts your React frontend
- **Cloudflare Workers**: Runs the `worker.ts` code
- **Cron Triggers**: Schedules automatic pings every 10-14 minutes

## Updating Your Application

When you make changes:

1. Commit and push to GitHub:
```bash
git add .
git commit -m "Update application"
git push
```

2. Cloudflare will automatically rebuild and deploy (if you enabled automatic deployments)

## Troubleshooting

### Build fails with "Cannot find module"
- Make sure you're using the correct build command: `vite build --config vite.config.cloudflare.ts`

### Worker not running
- Check that `nodejs_compat` flag is enabled in Settings → Functions
- Verify cron trigger is added: `*/1 * * * *`

### Environment variables not working
- Make sure `TARGET_URL` is set in Settings → Environment variables
- Redeploy after adding variables

## Alternative: Deploy with Wrangler CLI

If you prefer using CLI:

```bash
# Install wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Build frontend
vite build --config vite.config.cloudflare.ts

# Deploy
wrangler pages deploy dist/public --project-name=ping-monitor
```

## Cost

- **100% FREE** on Cloudflare's free tier
- No credit card required for basic usage
