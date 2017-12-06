node {
    checkout scm
    env.NODEJS_HOME = "${tool 'Node 6.9.1'}"
    // on linux / mac
    env.PATH="${env.NODEJS_HOME}/bin:${env.PATH}"
    // on windows
    sh 'npm --version'
    stage('Build') {
        echo 'Building...'
        sh npm install
    }
    stage('Test') {
        echo 'Testing..'
    }
    stage('Deploy') {
        echo 'Deploying....'
    }
}