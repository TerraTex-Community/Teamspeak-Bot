pipeline {
  agent any
  stages {
    stage('Sonar-Scanner') {
      steps {
        script {
          withSonarQubeEnv('TerraTex SonarQube') {
            sh "${tool 'SonarQubeScanner'}/bin/sonar-scanner -Dsonar.projectVersion=${BUILD_DISPLAY_NAME}"
          }
          
          timeout(time: 1, unit: 'HOURS') {
            def qg = waitForQualityGate()
            if (qg.status != 'OK') {
              error "Pipeline aborted due to quality gate failure: ${qg.status}"
            }
          }
        }
        
      }
    }
    stage('Stop old TS-Bot') {
      steps {
        sh 'echo test'
        sh 'ssh terratex.eu "pm2 stop tsbot"'
      }
    }
    stage('Copy new TS-Bot') {
      steps {
        sh 'ssh terratex.eu "rmdir "D:/TerraTex/Node-Apps/tsbot" /s /q"'
        sh 'ssh terratex.eu "mkdir "D:/TerraTex/Node-Apps/tsbot""'
        sh 'scp -r ./ terratex.eu:"D:/TerraTex/Node-Apps/tsbot"'
      }
    }
    stage('Install new TS-Bot') {
      steps {
        sh 'ssh terratex.eu "D: && cd D:/TerraTex/Node-Apps/tsbot && yarn install"'
      }
    }
    stage('Start new TS-Bot') {
      steps {
        sh 'ssh terratex.eu "REM pm2 start tsbot"'
      }
    }
  }
}