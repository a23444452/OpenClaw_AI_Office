#!/bin/bash

echo "🚀 啟動 Lucy 任務管理系統..."
echo ""

cd "$(dirname "$0")"

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ 找不到 Node.js，請先安裝 Node.js"
    exit 1
fi

# Start server
node server.js
