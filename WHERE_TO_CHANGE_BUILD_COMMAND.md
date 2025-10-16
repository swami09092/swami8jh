# ⚠️ WHERE TO CHANGE THE BUILD COMMAND IN CLOUDFLARE

## THE PROBLEM:
You keep using `npm run build` but that's WRONG! ❌

---

## 📍 EXACT LOCATION TO CHANGE IT:

### When Creating New Project:

1. Go to Cloudflare Dashboard
2. Click **Workers & Pages**
3. Click **Create application**
4. Click **Pages** tab
5. Click **Connect to Git**
6. Select your repository: `ping-monitoruj`
7. Click **Begin setup**

### 🔴 THIS IS WHERE YOU CHANGE IT:

You'll see a form with these fields:

```
┌─────────────────────────────────────────┐
│ Framework preset:                       │
│ [None ▼]                                │
├─────────────────────────────────────────┤
│ Build command:                          │
│ [                                    ]  │  ← CHANGE THIS!
├─────────────────────────────────────────┤
│ Build output directory:                 │
│ [                                    ]  │
└─────────────────────────────────────────┘
```

### ✅ TYPE EXACTLY THIS:

In the **"Build command"** box, type:

```
bash build-cloudflare.sh
```

OR (if the script doesn't work):

```
vite build --config vite.config.cloudflare.ts
```

### In the **"Build output directory"** box, type:

```
dist/public
```

---

## 🚫 DO NOT TYPE:

- ❌ `npm run build`
- ❌ `npm build`
- ❌ `yarn build`
- ❌ Anything else!

---

## ✅ CORRECT SETTINGS SUMMARY:

```
Framework preset: None
Build command: bash build-cloudflare.sh
Build output directory: dist/public
```

**Environment variables** (click "Add variable"):
```
NODE_VERSION = 18
```

---

## 📸 WHAT YOU SHOULD SEE:

After deployment starts, the logs should show:

```
✅ Executing user build command: bash build-cloudflare.sh
```

NOT:
```
❌ Executing user build command: npm run build
```

---

## IF YOU ALREADY CREATED THE PROJECT:

1. Go to your project in Cloudflare
2. Click **Settings**
3. Click **Builds & deployments**
4. Scroll to **Build configurations**
5. Click **Edit configuration**
6. Change **Build command** to: `bash build-cloudflare.sh`
7. Click **Save**
8. Go to **Deployments**
9. Click **Retry deployment** on the latest failed deployment

---

## ⚡ QUICK TEST:

After you set it up, check the build logs.

If you see:
- ✅ `vite v5.4.20 building for production...` = CORRECT!
- ❌ `Could not resolve entry module` = You used wrong command!

---

**Remember: The file `build-cloudflare.sh` is included in your repository. Just use it as the build command!**
