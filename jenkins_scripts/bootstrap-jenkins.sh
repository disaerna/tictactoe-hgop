#!/usr/bin/env bash

exec > >(tee /var/log/user-data.log | logger -t user-data -s 2>/dev/console) 2>&1

sudo yum update
#remove java 1.7 and install 1.8 for jenkins
sudo yum -y remove java-1.7.0-openjdk
sudo yum -y install java-1.8.0

#install jenkins
sudo wget -O /etc/yum.repos.d/jenkins.repo http://pkg.jenkins.io/redhat/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat/jenkins.io.key
sudo yum install jenkins -y
sudo service jenkins start
sudo chkconfig jenkins on
sudo usermod -a -G docker jenkins

#install docker and git
sudo yum -y install docker
sudo yum install git
sudo service docker start
sudo usermod -a -G docker ec2-user

touch ec2-init-done.markerfile
