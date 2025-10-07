pipeline {
    agent any

    stages {
        stage('check user'){
            steps {
                sh 'whoami'
                sh 'id'
            }
        }
        stage('Ceckout') {
            steps {
                echo 'Git Clone Project'
                  git branch: 'main', url: 'https://github.com/rohitboghara/tomato_food_delivery_app.git'
            }
        }
       stage('build and test') {
           steps {
               echo 'build and test'
               sh 'docker compose -f docker-compose.yml build'
               sh 'docker compose up -d'
           }
       }

      stage('Deploy') {
          steps {
              echo 'Deploy'
          }
      }
    }
}
