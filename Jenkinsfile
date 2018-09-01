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
                sshPut remote: remote, from: 'archive.zip', into: '.'
                sshCommand remote: remote, command: """
                    mkdir -p /var/www/revisions/$GIT_COMMIT && \
                    unzip -d /var/www/revisions/$GIT_COMMIT /root/archive.zip && \
                    rm /root/archive.zip && \
                    if [ test -L /var/www/html ]; then unlink /var/www/html; fi && \
                    ln -s /var/www/revisions/$GIT_COMMIT /var/www/html && \
                    if [ \$(ls /var/www/revisions | wc -l) -gt 5 ]; then ls -t /var/www/revisions | tail -n +5 | xargs rm -rf; fi
                    """
            }
        }
        stage('Deploy to Dev') {
            steps {
                sh 'rm /var/www/html/*'
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
