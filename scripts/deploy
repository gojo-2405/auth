#!/bin/bash

# ─────────────────────────────────────────────────────────────────
#  NexCore Deploy Script
#  Deploys both server + client services to ECS
# ─────────────────────────────────────────────────────────────────

AWS_REGION=eu-north-1
AWS_PROFILE=testuser

# ── Deploy a single ECS service ──────────────────────────────────
startDeploy()
{
  local SERVICE_NAME=$1
  local TASK_FAMILY=$2
  local CLUSTER=$3
  local JSON_FILE=$4
  local IMAGE_VERSION=$5

  echo "==> Deploying $SERVICE_NAME to cluster $CLUSTER"

  # Inject image version and branch into task definition
  sed -e "s;GIT_COMMIT;${IMAGE_VERSION};g" ${JSON_FILE}.json > ${JSON_FILE}-new-${BUILD_NUMBER}.json
  sed -e "s;GROUP_NAME;${GIT_BRANCH};g"    ${JSON_FILE}-new-${BUILD_NUMBER}.json > ${JSON_FILE}-${BUILD_NUMBER}.json
  cat ${JSON_FILE}-${BUILD_NUMBER}.json

  # Register new task definition revision
  aws ecs register-task-definition \
    --family ${TASK_FAMILY} \
    --cli-input-json file://${JSON_FILE}-${BUILD_NUMBER}.json \
    --region $AWS_REGION \
    --profile $AWS_PROFILE

  # Get latest task revision number
  TASK_REVISION=$(aws ecs describe-task-definition \
    --task-definition ${TASK_FAMILY} \
    --region $AWS_REGION \
    --profile $AWS_PROFILE \
    | egrep "revision" | tr "/" " " | awk '{print $2}' | sed 's/"$//')
  echo "Task revision: $TASK_REVISION"

  # Get current desired count
  DESIRED_COUNT=$(aws ecs describe-services \
    --cluster ${CLUSTER} \
    --services ${SERVICE_NAME} \
    --region $AWS_REGION \
    --profile $AWS_PROFILE \
    | egrep "desiredCount" | tr "/" " " | awk '{print $2}' | sed 's/,$//')
  echo "Desired count: $DESIRED_COUNT"

  # Update the service with new task definition
  aws ecs update-service \
    --cluster ${CLUSTER} \
    --service ${SERVICE_NAME} \
    --desired-count 1 \
    --task-definition ${TASK_FAMILY} \
    --force-new-deployment \
    --region $AWS_REGION \
    --profile $AWS_PROFILE

  # Wait until service is stable
  echo "Waiting for service to stabilise..."
  aws ecs wait services-stable \
    --cluster ${CLUSTER} \
    --services ${SERVICE_NAME} \
    --region $AWS_REGION \
    --profile $AWS_PROFILE

  if [ $? -eq 0 ]; then
    echo "$SERVICE_NAME deployed successfully"
  else
    echo "$SERVICE_NAME deployment failed"
    rm -rf ${JSON_FILE}-${BUILD_NUMBER}.json ${JSON_FILE}-new-${BUILD_NUMBER}.json
    exit 1
  fi

  # Cleanup temp files
  rm -rf ${JSON_FILE}-${BUILD_NUMBER}.json ${JSON_FILE}-new-${BUILD_NUMBER}.json
}

# ── Branch config ────────────────────────────────────────────────
if [ "$GIT_BRANCH" = "development" ]; then

  IMAGE_VERSION="${GIT_BRANCH}-${BUILD_NUMBER}"
  CLUSTER="dev-nexcore"

  # Deploy server
  startDeploy "nexcore-server-dev" "nexcore-server-dev" $CLUSTER "taskdef-server-dev" $IMAGE_VERSION
  # Deploy client
  startDeploy "nexcore-client-dev" "nexcore-client-dev" $CLUSTER "taskdef-client-dev" $IMAGE_VERSION

elif [ "$GIT_BRANCH" = "uat" ]; then

  IMAGE_VERSION="${GIT_BRANCH}-${BUILD_NUMBER}"
  CLUSTER="uat-nexcore"

  startDeploy "nexcore-server-uat" "nexcore-server-uat" $CLUSTER "taskdef-server-uat" $IMAGE_VERSION
  startDeploy "nexcore-client-uat" "nexcore-client-uat" $CLUSTER "taskdef-client-uat" $IMAGE_VERSION

elif [ "$GIT_BRANCH" = "main" ]; then

  IMAGE_VERSION="${GIT_BRANCH}-${BUILD_NUMBER}"
  CLUSTER="prod-nexcore"

  startDeploy "nexcore-server-prod" "nexcore-server-prod" $CLUSTER "taskdef-server" $IMAGE_VERSION
  startDeploy "nexcore-client-prod" "nexcore-client-prod" $CLUSTER "taskdef-client" $IMAGE_VERSION

else
  echo "Skipping deploy — branch not permitted: ${GIT_BRANCH}"
fi
