#!/bin/bash
set -e

GREEN="\e[92m"
RED="\e[91m"
RESET="\e[0m"

DOCKER_USER="westbrom1968"
IMAGE_NAME="devops-website"
TAG="latest"
DEPLOYMENT="devops-website"

echo "Starting full devops pipeline..."

#Step 1: Build Docker image
echo -e "${GREEN}Project files:${RESET}"
docker build -t devops-website .

echo -e "${GREEN}Docker image built successfully${RESET}"
echo
#Step 2: Tag Docker image to Docker Hub
docker tag devops-website westbrom1968/devops-website:latest

#Step 3: Push Docker image to Docker Hub
echo -e "${GREEN}Pushing image to Docker Hub...${RESET}"
docker push westbrom1968/devops-website:latest
echo

#Step 4: Update Kubernetes deployment
echo "Updating Kubernetess deployment..."
kubectl set image deployment/$DEPLOYMENT $IMAGE_NAME=$DOCKER_USER/$IMAGE_NAME:$TAG
kubectl rollout status deployment/$DEPLOYMENT
echo

#Step 5: Monitor pods
echo "Checking pod status..."
kubectl get pods
echo

#Step 6: Show logs of first pod
FIRST_POD=$(kubectl get pods -l app=$DEPLOYMENT -o jsonpath='{.items[0].metadata.name}')
echo "Logs for pod $FIRST_POD:"
kubectl logs $FIRST_POD
echo

#Step 7: Get service URL
echo "Opening in browser..."
minikube service $DEPLOYMENT

echo -e "${GREEN}Local CI pipeline completed successfully${RESET}"
