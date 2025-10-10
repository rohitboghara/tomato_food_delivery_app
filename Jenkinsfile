@Library("Shared") _
pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'root938/tomato-food-app'
<<<<<<< HEAD
=======
        SONAR_HOME = tool 'Sonar'
>>>>>>> 05eb95a (add sonarqube trive scan)
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Cloning project from GitHub...'
                git url: 'https://github.com/rohitboghara/tomato_food_delivery_app.git', branch: 'main'
            }
        }

        stage("SonarQube Quality Analysis") {
            steps {
                withSonarQubeEnv("Sonar") {
                    sh '''
                        $SONAR_HOME/bin/sonar-scanner \
                        -Dsonar.projectName=tomato_food_delivery_app \
                        -Dsonar.projectKey=tomato_food_delivery_app
                    '''
                }
            }
        }

        stage("SonarQube Quality Gate") {
            steps {
                timeout(time: 2, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: false
                }
            }
        }

        stage("OWASP Dependency Scan") {
            steps {
                dependencyCheck additionalArguments: '--scan ./', odcInstallation: 'dc'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }

        stage("Trivy File System Scan") {
            steps {
                sh 'trivy fs --format table -o trivy-fs-report.html .'
            }
        }

        stage('Start Docker Service') {
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
<<<<<<< HEAD
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
=======

        stage('Firewall Permission') {
            steps {
                sh '''
                    sudo firewall-cmd --add-port=3000/tcp --permanent
                    sudo firewall-cmd --add-port=3001/tcp --permanent
                    sudo firewall-cmd --add-port=3002/tcp --permanent
                    sudo firewall-cmd --add-port=4000/tcp --permanent
                    sudo firewall-cmd --add-port=9000/tcp --permanet
                    sudo firewall-cmd --reload
                '''
            }
        }

        stage('Deploy with Docker Compose') {
>>>>>>> 05eb95a (add sonarqube trive scan)
            steps {
                echo 'Deploying containers...'
                sh 'docker compose up -d'

                echo 'Showing running containers:'
                sh 'docker ps'

                echo 'Server IP address:'
                sh 'ifconfig enp0s3 | grep inet'
            }
        }
    }
}
