#!/bin/bash -vx
set -e

echo "Check for instance information..."
INSTANCE_DIR=~/ec2_instance

export AMI_IMAGE_ID="ami-1a962263"

#if [ -d "${INSTANCE_DIR}" ]; then  
#    exit
#fi

#create ec2_instance dir
[ -d "${INSTANCE_DIR}" ] || mkdir ${INSTANCE_DIR}

USERNAME=$(aws iam get-user --query 'User.UserName' --output text)

SECURITY_GROUP_NAME=hgop-${USERNAME}

echo "Using security group name ${SECURITY_GROUP_NAME}"

if [ ! -e ~/ec2_instance/security-group-name.txt ]; then
    echo ${SECURITY_GROUP_NAME} > ~/ec2_instance/security-group-name.txt
fi

if [ ! -e ${INSTANCE_DIR}/${SECURITY_GROUP_NAME}.pem ]; then
    aws ec2 create-key-pair --key-name ${SECURITY_GROUP_NAME} --query 'KeyMaterial' --output text > ${INSTANCE_DIR}/${SECURITY_GROUP_NAME}.pem
    chmod 400 ${INSTANCE_DIR}/${SECURITY_GROUP_NAME}.pem
fi

if [ ! -e ~/ec2_instance/security-group-id.txt ]; then
    SECURITY_GROUP_ID=$(aws ec2 create-security-group --group-name ${SECURITY_GROUP_NAME} --description "security group for dev environment in EC2" --query "GroupId"  --output=text)
    echo ${SECURITY_GROUP_ID} > ~/ec2_instance/security-group-id.txt
    echo Created security group ${SECURITY_GROUP_NAME} with ID ${SECURITY_GROUP_ID}
else
    SECURITY_GROUP_ID=$(cat ~/ec2_instance/security-group-id.txt)
fi

MY_PUBLIC_IP=$(curl http://checkip.amazonaws.com)
MY_PRIVATE_IP=$(hostname -I | cut -d' ' -f1)
if [ ! -e ~/ec2_instance/instance-id.txt ]; then
    echo Create ec2 instance on security group ${SECURITY_GROUP_ID} ${AMI_IMAGE_ID}
    INSTANCE_ID=$(aws ec2 run-instances  --user-data file://docker-instance-init.sh --image-id ${AMI_IMAGE_ID} --security-group-ids ${SECURITY_GROUP_ID} --count 1 --instance-type t2.micro --key-name ${SECURITY_GROUP_NAME} --query 'Instances[0].InstanceId'  --output=text)
    echo ${INSTANCE_ID} > ~/ec2_instance/instance-id.txt

    echo Waiting for instance to be running
    echo aws ec2 wait --region eu-west-1 instance-running --instance-ids ${INSTANCE_ID}
    aws ec2 wait --region eu-west-1 instance-running --instance-ids ${INSTANCE_ID}
    echo EC2 instance ${INSTANCE_ID} ready and available on ${INSTANCE_PUBLIC_NAME}
fi

if [ ! -e ~/ec2_instance/instance-public-name.txt ]; then
    export INSTANCE_PUBLIC_NAME=$(aws ec2 describe-instances --instance-ids ${INSTANCE_ID} --query "Reservations[*].Instances[*].PublicDnsName" --output=text)
    echo ${INSTANCE_PUBLIC_NAME} > ~/ec2_instance/instance-public-name.txt
fi


MY_CIDR=${MY_PUBLIC_IP}/32
MY_PRIVATE_CIDR=${MY_PRIVATE_IP}/32

echo Using CIDR ${MY_CIDR} for access restrictions.
if [ ! -d ~/ec2_instance ]; then
    set +e
    aws ec2 authorize-security-group-ingress --group-name ${SECURITY_GROUP_NAME} --protocol tcp --port 22 --cidr ${MY_PRIVATE_CIDR}
    aws ec2 authorize-security-group-ingress --group-name ${SECURITY_GROUP_NAME} --protocol tcp --port 22 --cidr ${MY_CIDR}
    aws ec2 authorize-security-group-ingress --group-name ${SECURITY_GROUP_NAME} --protocol tcp --port 80 --cidr ${MY_CIDR}
    aws ec2 authorize-security-group-ingress --group-name ${SECURITY_GROUP_NAME} --protocol tcp --port 8000 --cidr ${ALL}
    aws ec2 authorize-security-group-ingress --group-name ${SECURITY_GROUP_NAME} --protocol tcp --port 8080 --cidr ${ALL}
fi
