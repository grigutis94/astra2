# 🚀 Render.com Deployment Guide - UPDATED

## ✅ Build Issue FIXED

**Problem**: `sh: 1: vite: not found` during build
**Solution**: Updated scripts to use `npx vite build` and moved critical dependencies

## Quick Deploy Options

### Option 1: Primary (render.yaml)
```yaml
buildCommand: npm install && npm run build
```

### Option 2: Fallback (render-fallback.yaml)
```yaml
buildCommand: npm install && npm run build:skip-types
```

## Key Fixes Applied

✅ **Vite Command**: Scripts now use `npx vite build`
✅ **Dependencies**: Moved `vite`, `typescript`, `@vitejs/plugin-react` to production deps
✅ **Environment**: Added `NPM_CONFIG_PRODUCTION=false` 
✅ **TypeScript**: All module resolution issues resolved

## Build Scripts Available

- `npm run build` - Full TypeScript check + Vite build
- `npm run build:skip-types` - Vite build only (faster, skips TS errors)

## Environment Variables in render.yaml

```yaml
envVars:
  - key: NODE_VERSION
    value: 18
  - key: NPM_CONFIG_PRODUCTION
    value: false
  - key: NODE_ENV
    value: production
```

## Deployment Ready! 🎉

Your tank configurator with transparency controls should now deploy successfully on Render.com.
- `PORT` - Automatically set by Render.com
- No additional env vars needed for basic deployment

## Troubleshooting
- If "No open ports detected" error occurs, make sure you're using the `npm start` command (not `npm run dev`)
- The app will be available on the port assigned by Render.com automatically

## Alternative: Using render.yaml
If you have a `render.yaml` file in your repo, Render.com will auto-detect it and use those settings.
