#!/bin/sh

until nc -z mongodb 27017; do
  echo "Waiting for MongoDB..."
  sleep 2
done

echo "MongoDB connected"

node scripts/seedFoods.js

echo "Starting backend"

exec node server.js
