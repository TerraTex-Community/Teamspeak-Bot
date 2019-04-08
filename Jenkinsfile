pipeline {
  agent {
    node {
        label "windows"
    }
  }

  stages {
    stage('Install all libraries') {
        steps {
            bat 'npm install --prefer-offline'
        }
    }

/*    stage('Sonar-Scanner') {
      steps {
        script {
          withSonarQubeEnv('SonarQube-Scanner') {
            sh "sonar-scanner -Dsonar.projectVersion=${BUILD_DISPLAY_NAME}"
          }
          timeout(time: 1, unit: 'HOURS') {
            def qg = waitForQualityGate()
            if (qg.status != 'OK') {
              error "Pipeline aborted due to quality gate failure: ${qg.status}"
            }
          }
        }
      }
    } */
    
    stage('Stop old TS-Bot') {
      when {
        branch 'master'
      }
      steps {
        bat 'pm2 stop tsbot'
      }
    }

    stage('Copy new TS-Bot') {
      when {
        branch 'master'
      }
      steps {
        bat 'move "D:/TerraTex/Node-Apps/tsbot\\ormconfig.json" "D:/TerraTex/Node-Apps/tsbot_pipeline_storage\\ormconfig.json" || exit 0'
        bat 'move "D:/TerraTex/Node-Apps/tsbot\\config.json" "D:/TerraTex/Node-Apps/tsbot_pipeline_storage\\config.json" || exit 0'
        bat 'rm -rf D:/TerraTex/Node-Apps/tsbot/*'
        bat 'rm -rf .git'
        bat 'mv * D:/TerraTex/Node-Apps\\tsbot'

        bat 'move "D:/TerraTex/Node-Apps/tsbot_pipeline_storage\\ormconfig.json" "D:/TerraTex/Node-Apps/tsbot\\ormconfig.json"'
        bat 'move "D:/TerraTex/Node-Apps/tsbot_pipeline_storage\\config.json" "D:/TerraTex/Node-Apps/tsbot\\config.json"'
      }
    }

    stage('Start new TS-Bot') {
      when {
        branch 'master'
      }
      steps {
        bat "pm2 start tsbot"
      }
    }
  }
}
