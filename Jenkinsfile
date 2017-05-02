pipeline {
  agent any
  stages {
    stage('Sonar-Scan') {
      steps {
        waitForQualityGate()
      }
    }
  }
}