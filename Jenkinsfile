pipeline {
    agent any

    environment {
        IMAGE_NAME = 'chu-backend'
        IMAGE_TAG = 'latest'
        CONTAINER_NAME = 'chu-backend-container'

        PORT = '9094'
        JWT_SECRET = 'nestjsbackend'
        JWT_EXPIRES = '1y'
        CORS_ORIGIN = '*'
        POSTGRES_DB = 'chu-base'
        POSTGRES_HOST = credentials('POSTGRES_HOST_ID')
        POSTGRES_PORT = credentials('POSTGRES_PORT_ID')
        POSTGRES_USER = credentials('POSTGRES_USER_ID')
        POSTGRES_PASSWORD = credentials('POSTGRES_PASSWORD_ID')
        
    }

    stages {

        stage('Build Docker Image') {
            steps {
                script {
                    echo 'Building the Docker image with environment variables...'
                    sh """
                    docker build \
                        --build-arg POSTGRES_HOST=${POSTGRES_HOST} \
                        --build-arg POSTGRES_PORT=${POSTGRES_PORT} \
                        --build-arg POSTGRES_USER=${POSTGRES_USER} \
                        --build-arg POSTGRES_PASSWORD=${POSTGRES_PASSWORD} \
                        --build-arg POSTGRES_DB=${POSTGRES_DB} \
                        -t ${IMAGE_NAME}:${IMAGE_TAG} .
                    """
                }
            }
        }


        stage('Deploy Containers') {
            steps {
                script {
                    echo 'Checking if the container is already running...'
                    sh '''
                    if [ "$(docker ps -q -f name=${CONTAINER_NAME})" ]; then
                        echo "Stopping and removing existing container..."
                        docker stop ${CONTAINER_NAME}
                        docker rm ${CONTAINER_NAME}
                    fi
                    '''

                    echo 'Running the Docker container with environment variables...'
                    sh '''
                    docker run -d --name ${CONTAINER_NAME} \
                        -v $(pwd)/public/uploads:/app/public/uploads \
                        -e POSTGRES_HOST=${POSTGRES_HOST} \
                        -e POSTGRES_PORT=${POSTGRES_PORT} \
                        -e POSTGRES_USER=${POSTGRES_USER} \
                        -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} \
                        -e POSTGRES_DB=${POSTGRES_DB} \
                        -e PORT=${PORT} \
                        -e JWT_SECRET=${JWT_SECRET} \
                        -e JWT_EXPIRES=${JWT_EXPIRES} \
                        -e CORS_ORIGIN=${CORS_ORIGIN} \
                        -p ${PORT}:${PORT} \
                        ${IMAGE_NAME}:${IMAGE_TAG}
                    '''
                }
            }
        }
    }

    post {
        always {
            script {
                echo 'Cleaning workspace...'
                cleanWs()
            }
        }
    }
}