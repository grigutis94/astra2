# 🚀 Render.com Deployment Instructions

## Quick Deploy
1. Connect your GitHub repository to Render.com
2. Use these settings:
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node.js
   - **Plan**: Free

## Manual Deploy Steps
1. Push your code to GitHub
2. Create a new Web Service on Render.com
3. Connect your repo: `astra2`
4. Set environment to **Node.js**
5. Build Command: `npm ci && npm run build`
6. Start Command: `npm start`
7. Deploy!

## Environment Variables (if needed)
- `PORT` - Automatically set by Render.com
- No additional env vars needed for basic deployment

## Troubleshooting
- If "No open ports detected" error occurs, make sure you're using the `npm start` command (not `npm run dev`)
- The app will be available on the port assigned by Render.com automatically

## Alternative: Using render.yaml
If you have a `render.yaml` file in your repo, Render.com will auto-detect it and use those settings.
