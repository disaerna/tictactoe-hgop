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
        echo 'Testing..'
        sh 'npm run test'
    }
    stage('Deploy') {
        echo 'Deploying....'
        sh './provisioning/create-aws-docker-host-instance.sh'
    }
} 