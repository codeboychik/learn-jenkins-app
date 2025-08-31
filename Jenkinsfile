pipeline {
    agent any

    environment {
        NETLIFY_AUTH_TOKEN = credentials('NETLIFY_ACCESS_TOKEN')
        NETLIFY_SITE_ID = '58c1ac0a-6afb-408b-8cc6-97902bd56764'
        REACT_APP_VERSION = "v1.0.$BUILD_ID"
    }

    stages {
        stage('Docker build') {
            steps {
                sh '''
                    docker build -f Dockerfile.pw -t playwright .
                   '''
            }
        }
        stage('Deploy & Test preview') {
            agent {
                docker {
                    image 'playwright'
                    reuseNode true
                }
            }
            steps {
                sh """
                    echo REACT_APP_VERSION=${REACT_APP_VERSION} > .env
                    npx netlify deploy --dir=build --json > deploy-output.json
                   """
                script {
                    env.CI_ENVIRONMENT_URL = sh(script: "npx node-jq -r '.deploy_url' deploy-output.json", returnStdout: true)
                }
                sh """                    
                    echo CI_ENVIRONMENT_URL=${env.CI_ENVIRONMENT_URL} >> .env
                    npx playwright test --reporter=html
                    npm test
                   """
            }
            post {
                always {
                    junit 'test-results/junit.xml'
                    publishHTML(
                            [
                                    allowMissing: false,
                                    alwaysLinkToLastBuild: false,
                                    icon: '',
                                    keepAll: false,
                                    reportDir: 'playwright-report',
                                    reportFiles: 'index.html',
                                    reportName: 'PW Report',
                                    reportTitles: '',
                                    useWrapperFileDirectly: true
                            ]
                    )
                }
            }
        }
        stage('Deploy & Test prod') {
            agent {
                docker {
                    image 'playwright'
                    reuseNode true
                }
            }
            environment {
                CI_ENVIRONMENT_URL = 'https://celebrated-melomakarona-2c6052.netlify.app'
            }
            steps {
                sh """
                    npx netlify deploy --dir=build --prod
                    npx playwright test --reporter=html
                    npm test
                   """
            }
            post {
                always {
                    junit 'test-results/junit.xml'
                    publishHTML(
                        [
                            allowMissing: false,
                            alwaysLinkToLastBuild: false,
                            icon: '',
                            keepAll: false,
                            reportDir: 'playwright-report',
                            reportFiles: 'index.html',
                            reportName: 'PW Report Prod',
                            reportTitles: '',
                            useWrapperFileDirectly: true
                        ]
                    )
                }
            }
        }
    }
}
