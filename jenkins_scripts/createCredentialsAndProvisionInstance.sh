#!/usr/bin/env bash -xv

THISDIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
source ${THISDIR}/functions.sh

AMI_IMAGE_ID="ami-1a962263"
USERNAME=$(aws iam get-user --query 'User.UserName' --output text)
PEM_NAME=jenkins-${USERNAME}
JENKINS_SECURITY_GROUP=jenkins-${USERNAME}
INSTANCE_INIT_SCRIPT=$THISDIR/bootstrap-jenkins.sh
echo $INSTANCE_INIT_SCRIPT

if [ ! -d ./ec2_instance/ ]; then
    mkdir ./ec2_instance/
fi

echo > ./ec2_instance/${PEM_NAME}.txt

if [ ! -e ./ec2_instance/${PEM_NAME}.pem ]; then
    create-key-pair ${PEM_NAME} ${THISDIR}/ec2_instance ${JENKINS_SECURITY_GROUP}
else
    PEM_NAME=$(cat ./ec2_instance/pem-name.txt)

fi
echo PEM-NAME.TXT!!!!! $PEM_NAME

if [ ! -e ./ec2_instance/security-group-id.txt ]; then
    create-security-group ${JENKINS_SECURITY_GROUP}
    SECURITY_GROUP_ID=$(cat ./ec2_instance/security-group-id.txt)
else
    SECURITY_GROUP_ID=$(cat ./ec2_instance/security-group-id.txt)
fi
echo SECURITY_GROUP_ID!!!!!! $SECURITY_GROUP_ID

authorize-access ${JENKINS_SECURITY_GROUP}

if [ ! -e ./ec2_instance/instance-id.txt ]; then
    create-ec2-instance ${AMI_IMAGE_ID} ${SECURITY_GROUP_ID} ${INSTANCE_INIT_SCRIPT} ${PEM_NAME}
fi
