pipeline {
    agent any

    options {
            disableConcurrentBuilds()
            timeout(time: 10, unit: 'MINUTES')
        }
 
    environment {
        PROJECT_NAME       = "ModWiki"
        TARGET_ROOT        = "/var/jenkins_home/projects/${PROJECT_NAME}"
        BACKEND_PORT       = "4321"
        PUBLIC_ORIGIN      = "http://ec2-54-80-83-95.compute-1.amazonaws.com"
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
                withCredentials([string(credentialsId: 'discord-webhook-url', variable: 'DISCORD_WEBHOOK_URL')]) {
                    sh '''
                        DEPLOY_BRANCH="${BRANCH_NAME:-main}"

                        npm ci
                        GENERATE_SOURCEMAP=false \
                        NODE_OPTIONS="--max-old-space-size=1024" \
                        ASTRO_BASE_PATH="/projects/${PROJECT_NAME}/${DEPLOY_BRANCH}/" \
                        PUBLIC_API_BASE="/api/${PROJECT_NAME}/${DEPLOY_BRANCH}/api" \
                        REACT_APP_API_BASE=/api/${PROJECT_NAME}/${DEPLOY_BRANCH}/api \
                        DISCORD_WEBHOOK_URL="$DISCORD_WEBHOOK_URL" \
                        npm run build
                    '''
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
                          -Dsonar.projectKey=${PROJECT_NAME}
                        """
                    }
                }
            }
        }

        stage('Deploy Frontend') {
            when {
                expression { !env.BRANCH_NAME || env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'dev' }
            }
            steps {
                sh '''
                    DEPLOY_BRANCH="${BRANCH_NAME:-main}"
                    TARGET_DIR="${TARGET_ROOT}/${DEPLOY_BRANCH}"

                    echo "Deploying static frontend to $TARGET_DIR"

                    mkdir -p "$TARGET_DIR"
                    rm -rf "$TARGET_DIR"/*

                    cp -r dist/client/* "$TARGET_DIR"/
                '''
            }
        }
		
        stage('Deploy Backend') {
            when {
                expression { !env.BRANCH_NAME || env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'dev' }
            }
            steps {
                withCredentials([string(credentialsId: 'discord-webhook-url', variable: 'DISCORD_WEBHOOK_URL')]) {
                    sh '''
                        DEPLOY_BRANCH="${BRANCH_NAME:-main}"
                        BACKEND_CONTAINER="modwiki-${DEPLOY_BRANCH}"

                        docker build -t "$BACKEND_CONTAINER" .

                        docker stop "$BACKEND_CONTAINER" || true
                        docker rm "$BACKEND_CONTAINER" || true

                        docker run -d \
                            --name "$BACKEND_CONTAINER" \
                            --network infra-net \
                            --network-alias "modwiki-backend" \
                            --network-alias "ModWiki-main" \
                            --network-alias "ModWiki-main-backend" \
                            --restart unless-stopped \
                            -p "127.0.0.1:$BACKEND_PORT:$BACKEND_PORT" \
                            -e HOST="0.0.0.0" \
                            -e PORT="$BACKEND_PORT" \
                            -e DISCORD_WEBHOOK_URL="$DISCORD_WEBHOOK_URL" \
                            "$BACKEND_CONTAINER"

                        sleep 5

                        docker ps --filter "name=$BACKEND_CONTAINER"
                        docker logs "$BACKEND_CONTAINER" --tail 100

                        docker exec "$BACKEND_CONTAINER" wget -qO- "http://127.0.0.1:$BACKEND_PORT/projects/${PROJECT_NAME}/${DEPLOY_BRANCH}/" > /dev/null
                        docker exec "$BACKEND_CONTAINER" wget -qO- \
                            --post-data="modName=Pipeline&modVersion=1.0.0&modLoader=Fabric&mcVersion=1.21.1&message=Backend+route+check&company=" \
                            "http://127.0.0.1:$BACKEND_PORT/api/bug-report" > /dev/null
                    '''
                }
            }
        }

        stage('Debug Backend Proxy') {
            when {
                expression { !env.BRANCH_NAME || env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'dev' }
            }
            steps {
                sh '''
                    DEPLOY_BRANCH="${BRANCH_NAME:-main}"
                    BACKEND_CONTAINER="modwiki-${DEPLOY_BRANCH}"

                    echo "=== Backend container ==="
                    docker ps --filter "name=$BACKEND_CONTAINER"
                    docker logs "$BACKEND_CONTAINER" --tail 80 || true

                    echo "=== infra-net containers ==="
                    docker network inspect infra-net \
                        --format '{{range .Containers}}{{.Name}} {{.IPv4Address}}{{println}}{{end}}' || true

                    echo "=== Test backend from inside container ==="
                    docker exec "$BACKEND_CONTAINER" wget -S -O- \
                        --post-data="modName=Pipeline&modVersion=1.0.0&modLoader=Fabric&mcVersion=1.21.1&message=Backend+debug&company=" \
                        "http://127.0.0.1:$BACKEND_PORT/api/bug-report" || true

                    echo "=== Test backend through host port ==="
                    wget -S -O- \
                        --post-data="modName=Pipeline&modVersion=1.0.0&modLoader=Fabric&mcVersion=1.21.1&message=Host+port+debug&company=" \
                        "http://127.0.0.1:$BACKEND_PORT/api/bug-report" || true

                    echo "=== Test public API URL ==="
                    wget -S -O- \
                        --post-data="modName=Pipeline&modVersion=1.0.0&modLoader=Fabric&mcVersion=1.21.1&message=Public+proxy+debug&company=" \
                        "$PUBLIC_ORIGIN/api/$PROJECT_NAME/$DEPLOY_BRANCH/api/bug-report" || true
                '''
            }
        }
    }
    post {
        always {
            deleteDir()
        }
    }
}
