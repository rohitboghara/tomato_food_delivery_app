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

        stage('Deploy') {
            steps {
                echo 'Deploying containers...'
                sh 'docker compose up -d'

                echo 'Show running containers'
                sh 'docker ps'
            }
        }
    }
}
