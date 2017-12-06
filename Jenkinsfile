node {
    checkout scm
    def nodeHome = tool name: 'node-6.9.1', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
    env.PATH = "${nodeHome}/bin:${env.PATH}"
    sh 'npm install'
    stage('Build') {
        echo 'Building...'
    }
    stage('Test') {
        echo 'Testing..'
    }
    stage('Deploy') {
        echo 'Deploying....'
    }
}