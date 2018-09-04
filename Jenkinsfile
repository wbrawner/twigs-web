def remote = [:]
remote.name = 'budget'
remote.host = 'budget.wbrawner.com'
remote.user = 'root'
remote.identityFile = '/var/lib/jenkins/.ssh/id_rsa'
remote.knownHosts = '/var/lib/jenkins/.ssh/known_hosts'

pipeline {
    agent any
    stages {
        stage('Build') { 
            steps {
                checkout scm
                sh 'npm install'
                sh 'ng build --prod --aot'
            }
        }
        stage('Prepare Archive') {
            steps {
                sh 'zip -j archive.zip dist/budget/*'
            }
        }
        stage('Deploy to Production') {
            when {
                expression {
                    env.BRANCH_NAME == 'master'
                }
            }
            steps {
                withCredentials([string(credentialsId: '4a0b8908-75eb-4bc3-9961-db044f848bc5', variable: 'FIREBASE_DEPLOY_TOKEN')]) {
                    sh 'firebase deploy --token "$FIREBASE_DEPLOY_TOKEN"'
                }
            }
        }
        stage('Deploy to Dev') {
            steps {
                sh 'rm -rf /var/www/html/*'
                sh 'cp -rv dist/budget/* /var/www/html/'
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: 'archive.zip', fingerprint: true
        }
        cleanup {
            cleanWs()
        }
    }
}
