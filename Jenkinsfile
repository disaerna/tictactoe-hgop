node {
    checkout scm
    stage('Build') {
        echo 'Building...'
        npm install
    }
    stage('Test') {
        echo 'Testing..'
        npm test
    }
    stage('Deploy') {
        echo 'Deploying....'
    }
}