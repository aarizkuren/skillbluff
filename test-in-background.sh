#!/bin/bash
cd /Users/asiera/Proiektuak/aarizkuren/fake-skill/fake-skill
TURBO=0 npx next dev > /tmp/dev.log 2>&1 &
SERVER_PID=$!
echo "Server started with PID: $SERVER_PID"
sleep 5
curl -s -X POST http://localhost:3000/api/generate-skill -H "Content-Type: application/json" -d '{"prompt": "regar las plantas de mi casa"}' || echo "API test failed"
sleep 2
kill $SERVER_PID 2>/dev/null
