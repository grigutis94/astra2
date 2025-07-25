#!/bin/bash
# Build the application
npm run build

# Start a simple HTTP server on the port specified by Render
npx serve -s dist -l ${PORT:-3000}
