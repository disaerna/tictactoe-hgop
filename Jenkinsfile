node {
    checkout scm
    def nodeHome = tool 'nodejs5'
    env.PATH="${env.PATH}:${nodeHome}/bin"
    ...
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