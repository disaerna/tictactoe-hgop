#! /bin/bash
# Test machine 192.168.50.4
set -e

GIT_COMMIT=$1
INSTANCE_ID=$2

INSTANCE_PUBLIC_NAME=$(cat ./ec2_instance/instance-public-name.txt)
SECURITY_GROUP_NAME=$(cat ./ec2_instance/security-group-name.txt)

echo Deploy revision ${GIT_COMMIT} to http://${INSTANCE_PUBLIC_NAME}

echo SCP

#wait for succesfull connection to instance
echo "Waiting for connection to instance"
status='unknown'
while [ ! "${status}" == "ok" ]
do
   status=$(ssh -i "./ec2_instance/${SECURITY_GROUP_NAME}.pem"  -o StrictHostKeyChecking=no -o BatchMode=yes -o ConnectTimeout=5 ec2-user@${INSTANCE_PUBLIC_NAME} echo ok 2>&1)
   sleep 2
done

echo Status ${status}

scp -o StrictHostKeyChecking=no -i "./ec2_instance/${SECURITY_GROUP_NAME}.pem" ./ec2-instance-check.sh ec2-user@${INSTANCE_PUBLIC_NAME}:~/ec2-instance-check.sh
scp -o StrictHostKeyChecking=no -i "./ec2_instance/${SECURITY_GROUP_NAME}.pem" ./docker-compose.yaml ec2-user@${INSTANCE_PUBLIC_NAME}:~/docker-compose.yaml
scp -o StrictHostKeyChecking=no -i "./ec2_instance/${SECURITY_GROUP_NAME}.pem" ./docker-compose-and-run.sh ec2-user@${INSTANCE_PUBLIC_NAME}:~/docker-compose-and-run.sh
scp -o StrictHostKeyChecking=no -i "./ec2_instance/${SECURITY_GROUP_NAME}.pem" ./.env ec2-user@${INSTANCE_PUBLIC_NAME}:~/.env
scp -o StrictHostKeyChecking=no -i "./ec2_instance/${SECURITY_GROUP_NAME}.pem" ./deploy-on-instance.sh ec2-user@${INSTANCE_PUBLIC_NAME}:~/deploy-on-instance.sh

echo Wait for instance to be ready
ssh -o StrictHostKeyChecking=no -i "./ec2_instance/${SECURITY_GROUP_NAME}.pem" ec2-user@${INSTANCE_PUBLIC_NAME} "cat ~/ec2-instance-check.sh"

echo Instance ready...going to run this:
ssh -o StrictHostKeyChecking=no -i "./ec2_instance/${SECURITY_GROUP_NAME}.pem" ec2-user@${INSTANCE_PUBLIC_NAME} "cat ~/docker-compose-and-run.sh"

echo Running script
ssh -o StrictHostKeyChecking=no -i "./ec2_instance/${SECURITY_GROUP_NAME}.pem" ec2-user@${INSTANCE_PUBLIC_NAME} "~/docker-compose-and-run.sh ${GIT_COMMIT}"

echo Done updating environment