#!/bin/bash
set -e

GREEN="\e[92m"
RED="\e[91m"
RESET="\e[0m"

#!/bin/bash
set -e  # Stop on error

# Config
DOCKER_USER="westbrom1968"
IMAGE_NAME="devops-website"
TAG="latest"
DEPLOYMENT="devops-website"
SERVICE_NAME="devops-website"

echo "Starting deployment..."

# Step 1: Pull the latest image from Docker Hub
echo "Pulling latest Docker image..."
docker pull $DOCKER_USER/$IMAGE_NAME:$TAG

# Step 2: Force Kubernetes to update the deployment with the new image
echo "Updating Kubernetes deployment..."
kubectl set image deployment/$DEPLOYMENT $IMAGE_NAME=$DOCKER_USER/$IMAGE_NAME:$TAG --record
kubectl rollout restart deployment/$DEPLOYMENT
kubectl rollout status deployment/$DEPLOYMENT

# Step 4: Update Kubernetes deployment
kubectl set image deployment/$DEPLOYMENT $IMAGE_NAME=$DOCKER_USER/$IMAGE_NAME:$TAG --record
kubectl rollout restart deployment/$DEPLOYMENT
kubectl rollout status deployment/$DEPLOYMENT

# Step 5: Ensure service exists
if ! kubectl get svc $SERVICE_NAME > /dev/null 2>&1; then
    kubectl expose deployment $DEPLOYMENT --type=NodePort --port=80
fi

# Step 6: Get website URL
MINIKUBE_IP=$(minikube ip)
SERVICE_PORT=$(kubectl get svc $SERVICE_NAME -o jsonpath='{.spec.ports[0].nodePort}')
SERVICE_URL="http://$MINIKUBE_IP:$SERVICE_PORT"
echo "Website available at: $SERVICE_URL"

#Step 7: Get service URL
echo "Opening in browser..."
minikube service $DEPLOYMENT

echo -e "${GREEN}Local CI pipeline completed successfully${RESET}"

#Monitoring and logging

echo "Checking pod status..."
kubectl get pods -l app=$DEPLOYMENT

POD_NAME=$(kubectl get pods -l app=$DEPLOYMENT -o jsonpath='{.items[0].metadata.name}')

echo "Describing pod..."
kubectl describe pod $POD_NAME | tail -n 20

echo "Recent logs:"
kubectl logs --tail=20 $POD_NAME


