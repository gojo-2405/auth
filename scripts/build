#!/bin/bash

# ─────────────────────────────────────────────────────────────────
#  NexCore Build Script
#  Builds and pushes both server + client images to ECR
# ─────────────────────────────────────────────────────────────────

ECR_REGISTRY=463367046625.dkr.ecr.eu-north-1.amazonaws.com
ECR_REPO_SERVER=$ECR_REGISTRY/nexcore-server
ECR_REPO_CLIENT=$ECR_REGISTRY/nexcore-client
DOCKER_BUILD_TAG=$GIT_BRANCH-${BUILD_NUMBER}
AWS_REGION=eu-north-1
AWS_PROFILE=testuser

# ── ECR Login ────────────────────────────────────────────────────
ecrLogin()
{
  aws sts get-caller-identity --profile $AWS_PROFILE
  aws ecr get-login-password --region $AWS_REGION --profile $AWS_PROFILE \
    | docker login --username AWS --password-stdin $ECR_REGISTRY
  if [ $? -ne 0 ]; then
    echo "ECR login failed"
    exit 1
  fi
}

# ── Build + Push Server ──────────────────────────────────────────
buildServer()
{
  echo "==> Building SERVER image: $ECR_REPO_SERVER:$DOCKER_BUILD_TAG"
  docker build -f Dockerfile.server -t $ECR_REPO_SERVER:$DOCKER_BUILD_TAG --pull=true .
  if [ $? -ne 0 ]; then echo "Server build failed"; exit 1; fi

  SERVER_IMAGE_ID=$(docker images -q $ECR_REPO_SERVER | awk "NR==1{print $1}")
  docker tag $SERVER_IMAGE_ID $ECR_REPO_SERVER:latest
  docker inspect $SERVER_IMAGE_ID

  docker push $ECR_REPO_SERVER:$DOCKER_BUILD_TAG && docker push $ECR_REPO_SERVER:latest
  if [ $? -ne 0 ]; then echo "Server push failed"; docker logout $ECR_REGISTRY; exit 1; fi
  echo "Server image pushed successfully"
}

# ── Build + Push Client ──────────────────────────────────────────
buildClient()
{
  echo "==> Building CLIENT image: $ECR_REPO_CLIENT:$DOCKER_BUILD_TAG"
  docker build -f Dockerfile.client -t $ECR_REPO_CLIENT:$DOCKER_BUILD_TAG --pull=true .
  if [ $? -ne 0 ]; then echo "Client build failed"; exit 1; fi

  CLIENT_IMAGE_ID=$(docker images -q $ECR_REPO_CLIENT | awk "NR==1{print $1}")
  docker tag $CLIENT_IMAGE_ID $ECR_REPO_CLIENT:latest
  docker inspect $CLIENT_IMAGE_ID

  docker push $ECR_REPO_CLIENT:$DOCKER_BUILD_TAG && docker push $ECR_REPO_CLIENT:latest
  if [ $? -ne 0 ]; then echo "Client push failed"; docker logout $ECR_REGISTRY; exit 1; fi
  echo "Client image pushed successfully"
}

# ── Main ─────────────────────────────────────────────────────────
startBuild()
{
  ecrLogin
  buildServer
  buildClient
  docker logout $ECR_REGISTRY
  echo "==> Both images built and pushed successfully"
  echo "    Server: $ECR_REPO_SERVER:$DOCKER_BUILD_TAG"
  echo "    Client: $ECR_REPO_CLIENT:$DOCKER_BUILD_TAG"
}

# ── Branch Gate ──────────────────────────────────────────────────
if [[ "$GIT_BRANCH" == "development" || "$GIT_BRANCH" == "uat" || "$GIT_BRANCH" == "preprod" || "$GIT_BRANCH" == "main" ]]; then
  startBuild
else
  echo "Skipping build — branch not permitted: ${GIT_BRANCH}"
fi
