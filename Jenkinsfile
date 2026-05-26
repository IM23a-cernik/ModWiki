pipeline {
    agent any

    options {
            disableConcurrentBuilds()
            timeout(time: 10, unit: 'MINUTES')
        }
 
    environment {
        PROJECT_NAME       = "ModWiki"
        TARGET_DIR         = "/var/jenkins_home/projects/${PROJECT_NAME}/${BRANCH_NAME}"
        SONAR_SCANNER_OPTS = "-Xmx512m"
        NODE_OPTIONS       = "--max-old-space-size=384"
    }
 
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    withCredentials([string(credentialsId: 'discord-webhook-url', variable: 'DISCORD_WEBHOOK_URL')]) {
                        sh '''
                            npm install
                            GENERATE_SOURCEMAP=false \
                            NODE_OPTIONS="--max-old-space-size=1024" \
                            ASTRO_BASE_PATH="/projects/${PROJECT_NAME}/${BRANCH_NAME}/" \
                            REACT_APP_API_BASE=/api/${PROJECT_NAME}/${BRANCH_NAME}/api \
                            DISCORD_WEBHOOK_URL="$DISCORD_WEBHOOK_URL" \
                            npm run build
                        '''
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            when {
                branch 'dev'
            }
            steps {
                sh """
                    echo "Starting SonarQube analysis of $PROJECT_NAME"
                    echo "SONAR_SCANNER_OPTS=$SONAR_SCANNER_OPTS"
                    echo "NODE_OPTIONS=$NODE_OPTIONS"
                """
                script {
                    def scannerHome = tool 'sonar-scanner'
                    withSonarQubeEnv('SonarQube') {
                        sh """
                        ${scannerHome}/bin/sonar-scanner \
                          -Dsonar.projectKey=${PROJECT_NAME} \
                          -Dsonar.branch.name=${BRANCH_NAME}
                        """
                    }
                }
            }
        }
		
            stage('Deploy Frontend') {
                when {
                    anyOf {
                        branch 'main'
                        branch 'dev'
                    }
                }
            
                steps {
                    withCredentials([string(credentialsId: 'discord-webhook-url', variable: 'DISCORD_WEBHOOK_URL')]) {
                        sh '''
                            echo "Deploying frontend to $TARGET_DIR"

                            mkdir -p "$TARGET_DIR"
                            rm -rf "$TARGET_DIR"/*

                            cp -r dist "$TARGET_DIR"/
                            cp package.json package-lock.json "$TARGET_DIR"/
                            (cd "$TARGET_DIR" && npm ci --omit=dev)

                            printf 'DISCORD_WEBHOOK_URL=%s\n' "$DISCORD_WEBHOOK_URL" > "$TARGET_DIR/.env"
                            chmod 600 "$TARGET_DIR/.env"
                        '''
                    }
                }
            }
    }
    post {
        always {
            deleteDir()
        }
    }
}
