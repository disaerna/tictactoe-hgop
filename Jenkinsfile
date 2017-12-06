node {

    stage('Initialize') {
        echo 'Initializing...'
        def nodeHome = tool name: 'node', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
        env.PATH = "${nodeHome}/bin:${env.PATH}"
        checkout scm
        sh 'npm install'
        sh 'npm --prefix install ./client
    }
    stage('Build'){
        echo 'Building'
        sh  'npm run build'
    }
    stage('Test') {
        echo 'Testing..'
        sh 'npm run test'
    }
    stage('Deploy') {
        echo 'Deploying....'
    }
}