#!/bin/bash
GIT_COMMIT=$(git rev-parse HEAD)
INSTANCE_ID=$(cat ~/ec2_instance/instance-id.txt)
echo "TAG=${GIT_COMMIT}" > .env
./update-env.sh $GIT_COMMIT $INSTANCE_ID