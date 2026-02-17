# Vercel Deployment Guide - Tanwar Tailor

This guide will help you deploy your Tanwar Tailor website to Vercel with MongoDB Atlas.

## Prerequisites

- [Vercel Account](https://vercel.com/signup)
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas/register)
- GitHub repository connected to Vercel

## Step 1: Configure MongoDB Atlas

### 1.1 Whitelist Vercel IP Addresses

MongoDB Atlas blocks connections by default. You must allow Vercel's servers to connect:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Select your cluster → **Network Access** (left sidebar)
3. Click **"Add IP Address"**
4. Choose **"Allow Access from Anywhere"**
   - IP Address: `0.0.0.0/0`
   - Description: `Vercel Deployment`
5. Click **"Confirm"**

> **Note:** `0.0.0.0/0` allows all IPs. This is safe when using strong authentication (username/password). For additional security, you can restrict to Vercel's IP ranges, but `0.0.0.0/0` is the simplest approach.

### 1.2 Verify Database User Permissions

1. Go to **Database Access** (left sidebar)
2. Ensure your user (`tailortanwar_db_user`) has:
   - **Read and write to any database** role
   - Or at minimum: `readWrite` role on `tanwar_tailor` database

## Step 2: Configure Vercel Environment Variables

### 2.1 Add Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project → **Settings** → **Environment Variables**
3. Add the following variables (copy from your `.env.local` file):

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `MONGO_URI` | `mongodb+srv://tailortanwar_db_user:kJtBEoXuiC2maJSQ@tailortanwar.fujr1kz.mongodb.net/tanwar_tailor?retryWrites=true&w=majority` | Production, Preview, Development |
| `EMAIL_USER` | `tailortanwar@gmail.com` | Production, Preview, Development |
| `EMAIL_PASS` | `lvboeptrgffeqndw` | Production, Preview, Development |
| `TWILIO_ACCOUNT_SID` | Your Twilio SID | Production, Preview, Development |
| `TWILIO_AUTH_TOKEN` | Your Twilio Token | Production, Preview, Development |
| `TWILIO_WHATSAPP_NUMBER` | `+14155238886` | Production, Preview, Development |
| `JWT_SECRET` | `your_secure_random_secret_key` | Production, Preview, Development |

> **Important:** 
> - Variable names must match **exactly** (case-sensitive)
> - Select all three environments: Production, Preview, Development
> - Click **"Save"** after adding each variable

### 2.2 Generate a Strong JWT Secret

For production, generate a secure random string:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Replace `your_secure_random_secret_key` with the generated value.

## Step 3: Deploy to Vercel

### 3.1 Deploy via Git Push

If your repository is connected to Vercel:

1. Commit and push your changes to GitHub:
   ```bash
   git add .
   git commit -m "Fix MongoDB connection for Vercel deployment"
   git push origin main
   ```

2. Vercel will automatically deploy your changes

### 3.2 Manual Deployment

Alternatively, deploy from the command line:

```bash
npm install -g vercel
vercel --prod
```

## Step 4: Verify Deployment

### 4.1 Check Health Endpoint

After deployment completes, test the database connection:

```bash
curl https://your-app.vercel.app/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-02-18T00:36:00Z",
  "environment": "production"
}
```

### 4.2 Test Application Features

1. **Contact Form:**
   - Visit your live site
   - Submit a test contact form
   - Check if email is received at `tailortanwar@gmail.com`

2. **Admin Panel:**
   - Visit `https://your-app.vercel.app/admin`
   - Log in with admin credentials
   - Verify contact submissions are visible

## Troubleshooting

### Error: "MongoDB connection failed"

**Check the health endpoint first:**
```bash
curl https://your-app.vercel.app/api/health
```

**Common causes:**

1. **IP Not Whitelisted**
   - Solution: Add `0.0.0.0/0` to MongoDB Atlas → Network Access

2. **Wrong Environment Variable**
   - Solution: Verify `MONGO_URI` in Vercel Dashboard matches your `.env.local`
   - Ensure variable name is exactly `MONGO_URI` (not `MONGODB_URI`)

3. **Database User Permissions**
   - Solution: Check MongoDB Atlas → Database Access
   - User needs `readWrite` role

4. **Connection String Format**
   - Must include database name: `...mongodb.net/tanwar_tailor?...`
   - Must include parameters: `?retryWrites=true&w=majority`

### Error: "Please define the MONGO_URI environment variable"

**Cause:** Environment variable not set in Vercel

**Solution:**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add `MONGO_URI` variable
3. **Redeploy** the application (environment changes require redeployment)

### View Deployment Logs

1. Go to Vercel Dashboard → Your Project
2. Click on latest deployment
3. Click **"Functions"** tab
4. Click on any API route to see logs
5. Look for MongoDB connection errors

### Force Redeploy

If you've added/changed environment variables:

1. Go to Vercel Dashboard → Deployments
2. Click "..." menu on latest deployment
3. Click **"Redeploy"**
4. Check **"Use existing Build Cache"** is **unchecked**

## Security Best Practices

1. **Never commit `.env.local` to Git**
   - Already in `.gitignore`
   - Keep credentials secret

2. **Use Strong JWT Secret in Production**
   - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

3. **Rotate Credentials Regularly**
   - Change MongoDB password every 90 days
   - Update Vercel environment variables after rotation

4. **Monitor Access Logs**
   - Check MongoDB Atlas → Metrics for unusual activity
   - Review Vercel function logs regularly

## Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com/
- **Health Check:** `https://your-app.vercel.app/api/health`

---

**Last Updated:** 2026-02-18
