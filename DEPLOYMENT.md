# Deployment Guide

This guide covers deploying the HR Document Review System to various platforms.

## Prerequisites

Before deploying, ensure you have:
- Completed the Notion setup (see NOTION_SETUP.md)
- Your `.env` variables ready
- Tested the application locally

## Vercel Deployment (Recommended)

Vercel is the easiest way to deploy Next.js applications.

### Steps:

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Push your code to GitHub** (if not already done)

3. **Deploy via Vercel Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Configure project:
     - Framework Preset: Next.js (auto-detected)
     - Root Directory: ./
     - Build Command: `npm run build`
     - Output Directory: .next (default)
   
4. **Add Environment Variables**:
   - In project settings, go to "Environment Variables"
   - Add:
     ```
     NOTION_API_KEY=your_token
     NOTION_DATABASE_ID=your_database_id
     OWNER_PASSWORD=your_password
     ```
   - Apply to: Production, Preview, and Development

5. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Your app is live!

### Using Vercel CLI:

```bash
# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Netlify Deployment

### Steps:

1. **Push to GitHub**

2. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose GitHub and select your repository
   
3. **Configure Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
   
4. **Add Environment Variables**:
   - Go to Site settings → Environment variables
   - Add your Notion credentials
   
5. **Deploy**

## Self-Hosted (Docker)

### Create Dockerfile:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Update next.config.js:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'www.notion.so',
      },
    ],
  },
}

module.exports = nextConfig
```

### Build and Run:

```bash
# Build the Docker image
docker build -t hr-docs .

# Run the container
docker run -p 3000:3000 \
  -e NOTION_API_KEY=your_token \
  -e NOTION_DATABASE_ID=your_id \
  -e OWNER_PASSWORD=your_password \
  hr-docs
```

## Environment Variables

Required environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `NOTION_API_KEY` | Notion integration token | `secret_abc123...` |
| `NOTION_DATABASE_ID` | Notion database ID | `a1b2c3d4...` |
| `OWNER_PASSWORD` | Password for owner access | `secure_password_123` |
| `NODE_ENV` | Environment mode | `production` |

## Post-Deployment Checklist

- [ ] Verify environment variables are set correctly
- [ ] Test owner login functionality
- [ ] Test document viewing
- [ ] Test version upload (owner mode)
- [ ] Test comments (public and private)
- [ ] Set up SSL/HTTPS
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring/logging
- [ ] Test on mobile devices
- [ ] Set up backups for Notion data

## Performance Optimization

### Enable Caching:

In `next.config.js`:
```javascript
const nextConfig = {
  // ... existing config
  swcMinify: true,
  compress: true,
}
```

### Image Optimization:

Images from Notion are automatically optimized by Next.js Image component.

### API Rate Limiting:

Consider implementing rate limiting for API routes to prevent abuse:

```bash
npm install express-rate-limit
```

## Monitoring

### Vercel Analytics:

Enable Vercel Analytics in your dashboard for built-in monitoring.

### Custom Logging:

Add logging service:
```bash
npm install @vercel/analytics
```

## Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **HTTPS**: Always use HTTPS in production
3. **CORS**: Configure CORS if needed
4. **Rate Limiting**: Implement rate limiting on API routes
5. **Input Validation**: Validate all user inputs
6. **Authentication**: Consider implementing OAuth for production
7. **Notion Token**: Rotate integration tokens regularly
8. **CSP**: Set up Content Security Policy headers

## Troubleshooting

### Build Fails

**Error**: "Cannot find module..."
- Solution: Run `npm install` locally and commit package-lock.json

**Error**: Notion API errors during build
- Solution: Builds query Notion API. Ensure env vars are set in build environment

### Runtime Errors

**Error**: "Failed to fetch documents"
- Check environment variables are set correctly
- Verify Notion integration permissions

**Error**: 404 on API routes
- Ensure API routes are properly deployed
- Check build logs

## Scaling

For high-traffic applications:

1. **Use CDN**: Serve static assets via CDN
2. **Database**: Consider caching Notion responses
3. **Rate Limiting**: Implement request throttling
4. **Monitoring**: Set up error tracking (Sentry, etc.)
5. **Load Balancing**: Use multiple instances if needed

## Backup Strategy

1. **Regular Exports**: Export Notion database regularly
2. **Version Control**: Keep code in Git
3. **Documentation**: Maintain setup documentation
4. **Test Restores**: Regularly test backup restoration

## Support

For issues:
1. Check the logs in your deployment platform
2. Verify environment variables
3. Test locally with the same config
4. Check Notion API status
5. Review GitHub issues

## Updates

To update the deployed application:

### Vercel/Netlify:
- Push to main branch → Auto-deploys

### Docker:
```bash
git pull
docker build -t hr-docs .
docker stop <container_id>
docker run -p 3000:3000 [env vars] hr-docs
```
