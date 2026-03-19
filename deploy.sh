#!/bin/bash
set -e

MESSAGE=${1:-"deploy: update app"}

echo "📦 Building Meteor bundle..."
meteor build ../build --architecture os.linux.x86_64 --server-only
cp ../build/todos-app.tar.gz ./bundle.tar.gz

echo "📤 Committing and pushing to GitHub..."
git add .
git commit -m "$MESSAGE"
git push origin main

echo ""
echo "✅ Done! Render is deploying now..."
echo "🔗 Check: https://dashboard.render.com"