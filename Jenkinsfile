node {
    checkout scm
    stage('Build') {
        echo 'Building...'
        npm install
    }
    stage('Test') {
        echo 'Testing..'
        npm run test
    }
    stage('Deploy') {
        echo 'Deploying....'
    }
}