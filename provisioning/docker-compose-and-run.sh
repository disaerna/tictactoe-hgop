#!/usr/bin/env bash

export GIT_COMMIT=$1
# write GIT_COMMIT to env file
echo "TAG=$1" > /.env
docker-compose down
docker-compose up -d --build
