pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = 'scalelab'
    }

    stages {
        stage('Checkout') {
            // Jenkins automatically checks out the repository when using a Pipeline from SCM, 
            // but this step makes it explicit and clear.
            steps {
                checkout scm
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Stop existing containers and remove them
                    sh 'docker compose down || true'

                    // Build fresh images and start the containers in detached mode
                    // We use withCredentials to securely pull the DATABASE_URL from Jenkins without exposing it in logs or Git
                    withCredentials([string(credentialsId: 'scalelab-db-url', variable: 'DATABASE_URL')]) {
                        sh 'docker compose up -d --build'
                    }
                }
            }
        }

        stage('Cleanup') {
            steps {
                script {
                    // Clean up old, unused dangling images to free up space on your VPS
                    sh 'docker image prune -f'
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment successful! Both frontend and backend are running.'
        }
        failure {
            echo 'Deployment failed. Check the logs above to see what went wrong.'
        }
    }
}
