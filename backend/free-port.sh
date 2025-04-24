#!/bin/bash

# Find and kill any processes running on port 8080
echo "Looking for processes using port 8080..."
pid=$(lsof -i:8080 -t)

if [ -z "$pid" ]; then
  echo "No process found using port 8080"
else
  echo "Found process(es) using port 8080: $pid"
  echo "Killing process(es)..."
  kill -9 $pid
  echo "Process(es) killed"
fi

echo "Port 8080 is now available"