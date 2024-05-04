#!/bin/bash

# Load environment variables
source ../.env2

# Change directory to the client package
cd ..

# build the frontend
pnpm build

# Change directory to the location of the built frontend
cd ./dist

# Deploy for Garnet
NETLIFY_SITE_ID=$GARNET_CLIENT_ID netlify deploy --dir=. --prod --auth=$NETLIFY_AUTH_TOKEN

# Deploy for Garnet Account Kit test
NETLIFY_SITE_ID=$GARNET_ACCOUNT_KIT_CLIENT_ID netlify deploy --dir=. --prod --auth=$NETLIFY_AUTH_TOKEN

# Deploy for Redstone test
NETLIFY_SITE_ID=$REDSTONE_TEST_CLIENT_ID netlify deploy --dir=. --prod --auth=$NETLIFY_AUTH_TOKEN

# Deploy for Redstone preview
NETLIFY_SITE_ID=$REDSTONE_PREVIEW_CLIENT_ID netlify deploy --dir=. --prod --auth=$NETLIFY_AUTH_TOKEN

# Deploy for Redstone public
NETLIFY_SITE_ID=$REDSTONE_PUBLIC_CLIENT_ID netlify deploy --dir=. --prod --auth=$NETLIFY_AUTH_TOKEN
