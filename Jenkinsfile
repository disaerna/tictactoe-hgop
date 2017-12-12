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
        echo 'Building app and docker image'
        //sh  'npm run build'
        sh 'npm run dockerbuild'
    }
    stage('Test') {
        echo 'Testing unit test..'
        sh 'npm run test'
        echo 'Testing api test..'
        sh 'npm run apitest'        
        echo 'Testing load test..'
        sh 'npm run loadtest'
    }
    stage('Deploy') {
        echo 'Deploying....'
        sh 'cd provisioning && ./create-aws-docker-host-instance.sh'
        sh 'cd provisioning && ./deploy-on-instance.sh'
       // sh 'cd provisioning && ./provision-new-environment.sh'
    }
} 