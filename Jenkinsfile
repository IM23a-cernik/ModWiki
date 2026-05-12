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
                    sh '''
		                npm install
				        GENERATE_SOURCEMAP=false \
        		        NODE_OPTIONS="--max-old-space-size=1024" \
        		        PUBLIC_URL=/projects/${PROJECT_NAME}/${BRANCH_NAME} \
            		    REACT_APP_API_BASE=/api/${PROJECT_NAME}/${BRANCH_NAME}/api \
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
                sh '''
                    echo "Deploying frontend to $TARGET_DIR"

                    mkdir -p "$TARGET_DIR"
                    rm -rf "$TARGET_DIR"/*

                    cp -r dist/* "$TARGET_DIR"/
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
