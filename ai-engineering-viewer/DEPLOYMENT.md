# Deployment Guide

This document provides comprehensive instructions for deploying the AI Engineering Book Viewer to various hosting platforms.

## 🚀 Pre-Deployment Checklist

### Content Preparation
- [ ] Ensure `public/extracted-content/` contains all book content
- [ ] Verify `book-metadata.json` is valid and accessible
- [ ] Check all chapter JSON files are present
- [ ] Confirm images and assets are included

### Build Verification
- [ ] Run `npm run build` successfully
- [ ] Test production build with `npm run preview`
- [ ] Verify all routes work correctly
- [ ] Check console for errors
- [ ] Test responsive design on different screen sizes

### Performance Check
- [ ] Bundle size is reasonable (< 1MB for main chunk)
- [ ] Lighthouse score > 90 for Performance
- [ ] Core Web Vitals are within acceptable ranges
- [ ] Images are optimized
- [ ] No console errors or warnings

## 🌐 Static Hosting Platforms

### Vercel (Recommended)

#### Quick Deploy
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel

# Follow prompts to configure
```

#### Configuration (vercel.json)
```json
{
  "version": 2,
  "name": "ai-engineering-viewer",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/extracted-content/(.*)",
      "dest": "/extracted-content/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

#### Build Settings
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Node.js Version**: 18.x

### Netlify

#### Deploy via Git
1. Connect your repository to Netlify
2. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 18

#### Configuration (_redirects)
```
# Handle client-side routing
/*    /index.html   200

# Ensure content files are served correctly
/extracted-content/*  /extracted-content/:splat  200
```

#### netlify.toml
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### GitHub Pages

#### Setup
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts
"deploy": "gh-pages -d dist"
```

#### Deploy
```bash
# Build and deploy
npm run build
npm run deploy
```

#### Configuration
- Enable GitHub Pages in repository settings
- Set source to `gh-pages` branch
- Configure custom domain if needed

### AWS S3 + CloudFront

#### S3 Setup
```bash
# Create S3 bucket
aws s3 mb s3://ai-engineering-viewer

# Configure for static website hosting
aws s3 website s3://ai-engineering-viewer \
  --index-document index.html \
  --error-document index.html

# Upload build files
aws s3 sync dist/ s3://ai-engineering-viewer --delete
```

#### CloudFront Configuration
```json
{
  "Origins": [{
    "DomainName": "ai-engineering-viewer.s3-website-us-east-1.amazonaws.com",
    "Id": "S3-ai-engineering-viewer",
    "CustomOriginConfig": {
      "HTTPPort": 80,
      "OriginProtocolPolicy": "http-only"
    }
  }],
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-ai-engineering-viewer",
    "ViewerProtocolPolicy": "redirect-to-https",
    "Compress": true,
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {"Forward": "none"}
    }
  },
  "CustomErrorResponses": [{
    "ErrorCode": 404,
    "ResponseCode": 200,
    "ResponsePagePath": "/index.html"
  }]
}
```

## 🔧 Build Optimization

### Vite Configuration for Production

#### vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable for production
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  },
  base: './' // For relative paths
})
```

### Bundle Analysis
```bash
# Analyze bundle size
npm run build -- --analyze

# Or use bundle-analyzer
npm install --save-dev rollup-plugin-analyzer
```

### Performance Optimizations

#### Code Splitting
```typescript
// Lazy load components
const ChapterReader = lazy(() => import('./components/Content/ChapterReader'))

// Use Suspense
<Suspense fallback={<LoadingSpinner />}>
  <ChapterReader chapterId={chapterId} />
</Suspense>
```

#### Asset Optimization
```typescript
// Optimize images
import imageOptimize from 'vite-plugin-imagemin'

export default defineConfig({
  plugins: [
    react(),
    imageOptimize({
      gifsicle: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      pngquant: { quality: [0.65, 0.8] }
    })
  ]
})
```

## 🌍 Custom Domain Setup

### DNS Configuration
```
# A Record
@    1.2.3.4

# CNAME Record
www  your-app.vercel.app
```

### SSL Certificate
Most platforms provide automatic SSL:
- **Vercel**: Automatic Let's Encrypt
- **Netlify**: Automatic Let's Encrypt
- **CloudFront**: AWS Certificate Manager

## 📊 Monitoring and Analytics

### Performance Monitoring
```typescript
// Add to main.tsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

getCLS(console.log)
getFID(console.log)
getFCP(console.log)
getLCP(console.log)
getTTFB(console.log)
```

### Error Tracking
```typescript
// Add error boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    // Log to monitoring service
    console.error('Error caught by boundary:', error, errorInfo)
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorMessage />
    }
    return this.props.children
  }
}
```

### Analytics Integration
```typescript
// Google Analytics 4
import { gtag } from 'ga-gtag'

// Track page views
useEffect(() => {
  gtag('config', 'GA_MEASUREMENT_ID', {
    page_title: document.title,
    page_location: window.location.href
  })
}, [location])
```

## 🔒 Security Considerations

### Content Security Policy
```html
<!-- Add to index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data:;">
```

### Headers Configuration
```javascript
// For Netlify (_headers)
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## 🚨 Troubleshooting Deployment

### Common Issues

#### Build Failures
```bash
# Clear cache and rebuild
rm -rf node_modules/.vite dist
npm install
npm run build
```

#### Routing Issues
- Ensure SPA fallback is configured
- Check that all routes redirect to index.html
- Verify base URL configuration

#### Content Loading Issues
- Confirm content files are included in build
- Check file paths are correct
- Verify MIME types for JSON files

#### Performance Issues
- Enable gzip compression
- Configure proper caching headers
- Optimize images and assets
- Use CDN for static assets

### Deployment Verification

#### Automated Testing
```bash
# Test production build locally
npm run build
npm run preview

# Run lighthouse audit
npx lighthouse http://localhost:4173 --output html --output-path ./lighthouse-report.html
```

#### Manual Testing Checklist
- [ ] All pages load correctly
- [ ] Navigation works properly
- [ ] Content displays correctly
- [ ] Images load properly
- [ ] Mobile responsiveness works
- [ ] Performance is acceptable
- [ ] No console errors

## 📈 Scaling Considerations

### CDN Configuration
- Use CDN for static assets
- Configure proper cache headers
- Enable compression (gzip/brotli)

### Performance Monitoring
- Set up real user monitoring
- Track Core Web Vitals
- Monitor error rates
- Set up alerts for issues

### Backup Strategy
- Regular backups of content
- Version control for code
- Database backups if applicable
- Disaster recovery plan

This deployment guide covers the most common scenarios. Adjust configurations based on your specific requirements and hosting platform.
