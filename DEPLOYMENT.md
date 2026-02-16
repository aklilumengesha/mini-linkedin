# Deployment Guide

This guide covers deploying the LinkedIn Clone application to production.

## Prerequisites

- Node.js 18+ installed
- MongoDB database (MongoDB Atlas recommended)
- Firebase project configured
- Cloudinary account
- Hosting platform account (Vercel, Netlify, or similar)

## Frontend Deployment (Vercel)

### 1. Prepare Environment Variables

Create environment variables in Vercel dashboard:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset
```

### 2. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd linkedin
vercel --prod
```

## Backend Deployment (Render)

### 1. Configure render.yaml

The `server/render.yaml` file is already configured.

### 2. Set Environment Variables

In Render dashboard, add:

```
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
NODE_ENV=production
```

### 3. Deploy

1. Connect your GitHub repository to Render
2. Select the `server` directory as the root
3. Deploy

## Alternative: Docker Deployment

### Build Docker Images

```bash
# Frontend
docker build -t linkedin-frontend .

# Backend
cd server
docker build -t linkedin-backend .
```

### Run with Docker Compose

```bash
docker-compose up -d
```

## Post-Deployment Checklist

- [ ] Test user registration
- [ ] Test user login
- [ ] Test post creation
- [ ] Test image uploads
- [ ] Test real-time updates
- [ ] Verify environment variables
- [ ] Check error logging
- [ ] Test on mobile devices
- [ ] Verify CORS settings
- [ ] Check SSL certificates

## Monitoring

- Set up error tracking (Sentry recommended)
- Configure analytics (Google Analytics)
- Monitor API performance
- Set up uptime monitoring

## Troubleshooting

### CORS Issues
Ensure backend allows frontend domain in CORS configuration.

### Upload Failures
Verify Cloudinary credentials and upload preset settings.

### Database Connection
Check MongoDB connection string and IP whitelist.

### Build Errors
Clear cache and rebuild: `npm run build`
