# Jenkins - setup 

Using the following scripts and files
cicd-access-policy.json
createAndConfigureRole.sh
createCredentialsAndProvisionInstance.sh
deployOnInstance.sh
bootstrap-jenkins.sh
functions.sh
destroyInstance.sh

## Create and configure Role
run corresponding script

CreateRole operations creates role with name: StudentCICDServer
CreateInstanceProfile operation creates instance profile CICDServer-Instance-Profile

## Create credentials and provision Instance
run corresponding script

## Deploy on instances
run corresponding script

# Configure AWS jenkins server

'''ssh -i ./ec2_instance/pem-file-name.pem ec2-user@instance-public-name'''
'''sudo su -s /bin/bash jenkins'''
'''cd /var/lib/jenkins'''
'''ssh-keygen'''
press enter until randomart shows up
'''cat .ssh/id_rsa.pub'''

Copy public key to clipboard
Add key to github

type exit in the console to exit from jenkins users
enter following commands
'''sudo vim /var/lib/jenkins/config.xml'''
change <useSecurity>true</useSecurity> to false
and remove <authorizeStrategy> and <securityRealm>
'''sudo service jenkins restart'''
'''sudo reboot'''

## Configure jenkins in browser
navigate to INSTANCE_PUBLIC_NAME:8080
select Manage Jenkins -> Configure Global Security
then select enable security and Jenkins' own user database
and also select logged in users can do anything

### Create Jenkinsfile in root of the app project repo
```
node {
    checkout scm
    stage('Build') {
        echo 'Building..'
    }
    stage('Test') {
        echo 'Testing..'
    }
    stage('Deploy') {
        echo 'Deploying....'
    }
}
```

## Create Jenkins project
### Install following plugins
* pipeline
* git plugin for SCM
* GitHub Integration plugin

### Create a new job
* Select Create new job
* Select pipeline
* navigate to pipeline tab
* set definition as pipeline script from SCM
* select git as SCM

### Configure Jenkins

* Enter your SSH repo url in the Repository url field
* Create new credentials
  * select kind as SSH username with private key
  * enter your username
  * select From the Jenkins master ~/.ssh
* open terminal where you are logged into the linux AMI machine
* enter the following commands
'''sudo yum install git'''
'''sudo su -s /bin/bash jenkins'''
'''ssh git@github.com'''
'''yes'''
'''exit'''

* add, commit and push the Jenkinsfile to your repo and see it getting polled by jenkins

### Configure your git repository
* Go to your git repository
* settings -> integration & services
* Add service -> select Jenkins(GitHub plugin)
* in the Jenkins hook url input field paste your url plus /github-webhook/
  * e.g 
* click add service

### Install NPM on ec2 instance and jenkins

'''curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.6/install.sh | bash'''
'''. ~/.nvm/nvm.sh'''
'''nvm install 6.9.1'''
'''npm install'''
'''npm install -g nodemon'''
'''sudo su -s /bin/bash jenkins'''
'''curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.6/install.sh | bash'''
'''. ~/.nvm/nvm.sh'''
'''nvm install 6.9.1'''
'''cd /var/lib/jenkins/jobs/week2/workspace/client'''
'''npm install'''

### Add Node JS plugin
* Add Node JS plugin for jenkins
* restart jenkins
* manage jenkins -> configure Tools
* NodeJS -> Add Node
* Name: node <!-- Important that name is exactly as tool name in Jenkinsfile -->
* version: 6.9.1

### Configure Jenkinsfile
```
node {

    stage('Initialize') {
        echo 'Initializing...'
        def nodeHome = tool name: 'node', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
        env.PATH = "${nodeHome}/bin:${env.PATH}"
        checkout scm
        sh 'npm install'
        sh 'cd client && npm install'
    }
    stage('Build'){
        echo 'Building app and docker imageeee'
        sh 'npm run dockerbuild'
    }
    stage('Test') {
        echo 'Testing..'
        sh 'npm run test'
    }
    stage('Deploy') {
        echo 'Deploying....'
        sh 'cd provisioning && ./create-aws-docker-host-instance.sh'
        sh 'cd provisioning && ./deploy-on-instance.sh'
       // sh 'cd provisioning && ./provision-new-environment.sh'
    }
} 
```

### AWS configure on jenkins
'''aws configure'''
enter or create new access key and enter
region: eu-west-1


## Link to Jenkins instance
http://ec2-34-242-90-170.eu-west-1.compute.amazonaws.com:8080
username: hgop
pw: *see canvas*