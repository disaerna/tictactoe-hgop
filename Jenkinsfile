node {
    def nodeHome = tool name: 'node', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
    env.PATH = "${nodeHome}/bin:${env.PATH}"
    sh 'npm install'

    checkout scm
    stage('Build') {
        echo 'Building...'
        npm install
    }
    stage('Test') {
        echo 'Testing..'
    }
    stage('Deploy') {
        echo 'Deploying....'
    }
}