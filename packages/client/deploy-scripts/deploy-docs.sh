#!/bin/bash

# Load environment variables
source ../.env2

# Change directory to where the forge command should be executed
cd ../../contracts

# Build the docs using forge
forge doc -b 

# Change directory to the location of the built docs
cd docs/book

# Deploy dev docs to Netlify
NETLIFY_SITE_ID=$DOCS_ID netlify deploy --dir=. --prod --auth=$NETLIFY_AUTH_TOKEN
