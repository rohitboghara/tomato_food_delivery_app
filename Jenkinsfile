pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'root938/tomato-food-app'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Git Clone Project'
                git branch: 'main', url: 'https://github.com/rohitboghara/tomato_food_delivery_app.git'
            }
        }
        stage('Docker service'){
            steps {
                sh '''
                   sudo systemctl start docker
                   sudo systemctl status docker
                   '''
            }
        }
                   
        stage('Docker Build') {
            steps {
                sh '''
                    docker build -t $DOCKER_IMAGE-frontend:1.0 ./frontend
                    docker build -t $DOCKER_IMAGE-admin:1.0 ./admin
                    docker build -t $DOCKER_IMAGE-backend:1.0 ./backend
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                    sh '''
                        echo $PASSWORD | docker login -u $USERNAME --password-stdin
                        docker push $DOCKER_IMAGE-frontend:1.0
                        docker push $DOCKER_IMAGE-admin:1.0
                        docker push $DOCKER_IMAGE-backend:1.0
                    '''
                }
            }
        }
        stage('firewall permission') {
            steps {
                sh '''
                  sudo firewall-cmd --add-port=3000/tcp
                  sudo firewall-cmd --add-port=3001/tcp
                  sudo firewall-cmd --add-port=3002/tcp
                  sudo firewall-cmd --add-port=4000/tcp
                  '''
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying containers...'
                sh 'docker compose up -d'

                echo 'Show running containers'
                sh 'docker ps'
                sh 'ifconfig enp0s3 | grep inet'
            }
        }
        post {
          success {
             echo '✅ Build and Deployment Successful!'
         }
          failure {
             echo '❌ Build or Deployment Failed!'
        }
    }
}
