#!/bin/bash
GIT_COMMIT=$1
INSTANCE_ID=$2
echo "TAG=${GIT_COMMIT}" > ./ec2_instance/.env
./update-env.sh $GIT_COMMIT $INSTANCE_ID