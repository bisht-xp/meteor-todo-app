#!/bin/bash
set -e  # stop if any command fails

echo "🚀 Building Meteor bundle..."
meteor build ../build --architecture os.linux.x86_64 --server-only

echo "📦 Copying bundle..."
cp ../build/todos-app.tar.gz ./bundle.tar.gz

echo "✅ Bundle ready — push to GitHub to trigger Render deploy"
```