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
        sh 'ssh root@terratex.eu "pm2 stop tsbot"'
      }
    }
    stage('Copy new TS-Bot') {
      steps {
        sh 'ssh root@terratex.eu "move \\"D:\\TerraTex\\Node-Apps\\tsbot\\config.json\\" \\"D:\\TerraTex\\Node-Apps\\tsbot_pipeline_storage\\config.json\\""'
        sh 'ssh root@terratex.eu "move \\"D:\\TerraTex\\Node-Apps\\tsbot\\storage.db\\" \\"D:\\TerraTex\\Node-Apps\\tsbot_pipeline_storage\\storage.db\\""'
        sh 'ssh root@terratex.eu "rmdir \\"D:/TerraTex/Node-Apps/tsbot\\" /s /q"'
        sh 'ssh root@terratex.eu "mkdir \\"D:/TerraTex/Node-Apps/tsbot\\""'
        sh 'scp -r ./ root@terratex.eu:"D:/TerraTex/Node-Apps/tsbot"'
      }
    }
    stage('Install new TS-Bot') {
      steps {
        sh 'ssh root@terratex.eu "D: && cd \\"D:/TerraTex/Node-Apps/tsbot\\" && yarn install"'
        sh 'ssh root@terratex.eu "move \\"D:\\TerraTex\\Node-Apps\\tsbot_pipeline_storage\\config.json\\" \\"D:\\TerraTex\\Node-Apps\\tsbot\\config.json\\""'
        sh 'ssh root@terratex.eu "move \\"D:\\TerraTex\\Node-Apps\\tsbot_pipeline_storage\\storage.db\\" \\"D:\\TerraTex\\Node-Apps\\tsbot\\storage.db\\""'
      }
    }
    stage('Start new TS-Bot') {
      steps {
        sh 'ssh root@terratex.eu "pm2 start tsbot"'
      }
    }
  }
}