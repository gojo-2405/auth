def COLOR_MAP = ['SUCCESS': 'good', 'FAILURE': 'danger', 'UNSTABLE': 'danger', 'ABORTED': 'danger']

pipeline {
  agent any

  stages {

    stage('build') {
      steps {
        echo 'Preparing build script...'
        sh '''
        sed -i "s/\\r$//" ./scripts/build
        chmod +x ./scripts/build
        '''

        echo 'Building a docker image'
        sh './scripts/build'
      }
    }

    stage('deploy') {
      steps {
        echo 'Preparing deploy script...'
        sh '''
        sed -i "s/\\r$//" ./scripts/deploy
        chmod +x ./scripts/deploy
        '''

        echo 'Deployment is in progress'
        sh './scripts/deploy'
      }
    }
  }
}
