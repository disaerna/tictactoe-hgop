#!/usr/bin/env bash -xv

PEM_NAME=$(cat ./ec2_instance/pem-name.txt)
INSTANCE_PUBLIC_NAME=$(cat ./ec2_instance/instance-public-name.txt)
INSTANCE_ID=$(cat ./ec2_instance/instance-id.txt)

echo "Waiting for connection to instance"
status='unknown'
while [ ! "${status}" == "ok" ]
do
   status=$(ssh -i "./ec2_instance/${PEM_NAME}.pem"  -o StrictHostKeyChecking=no -o BatchMode=yes -o ConnectTimeout=5 ec2-user@${INSTANCE_PUBLIC_NAME} echo ok 2>&1)
   sleep 2
done

set +e
scp -o StrictHostKeyChecking=no -i "./ec2_instance/${PEM_NAME}.pem" ec2-user@${INSTANCE_PUBLIC_NAME}:/var/log/cloud-init-output.log ./ec2_instance/cloud-init-output.log
scp -o StrictHostKeyChecking=no -i "./ec2_instance/${PEM_NAME}.pem" ec2-user@${INSTANCE_PUBLIC_NAME}:/var/log/user-data.log ./ec2_instance/user-data.log

aws ec2 associate-iam-instance-profile --instance-id ${INSTANCE_ID} --iam-instance-profile Name=CICDServer-Instance-Profile
