#!/bin/bash

# Script para criar IAM Roles necessárias para ECS
# Execute este script antes do primeiro deploy

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

AWS_REGION="${AWS_REGION:-us-east-1}"
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID:-}"
TASK_EXECUTION_ROLE_NAME="ecsTaskExecutionRole"
TASK_ROLE_NAME="ecsTaskRole"

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se AWS CLI está instalado
if ! command -v aws &> /dev/null; then
    log_error "AWS CLI não está instalado. Por favor, instale primeiro."
    exit 1
fi

# Verificar autenticação
if ! aws sts get-caller-identity &> /dev/null; then
    log_error "Não está autenticado no AWS. Execute 'aws configure' primeiro."
    exit 1
fi

# Obter AWS Account ID
if [ -z "$AWS_ACCOUNT_ID" ]; then
    AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    log_info "AWS Account ID: $AWS_ACCOUNT_ID"
fi

log_info "Criando IAM Roles para ECS..."
log_info "Região: $AWS_REGION"

# 1. Criar Trust Policy para Task Execution Role
TRUST_POLICY_ECS='{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}'

# 2. Criar Policy para Task Execution Role
EXECUTION_ROLE_POLICY='{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "secretsmanager:GetSecretValue"
      ],
      "Resource": "*"
    }
  ]
}'

# 3. Criar Task Execution Role
log_info "Criando Task Execution Role..."
if aws iam get-role --role-name $TASK_EXECUTION_ROLE_NAME &> /dev/null; then
    log_warn "Task Execution Role já existe."
else
    aws iam create-role \
        --role-name $TASK_EXECUTION_ROLE_NAME \
        --assume-role-policy-document "$TRUST_POLICY_ECS" \
        --region $AWS_REGION
    
    # Criar e anexar policy
    aws iam put-role-policy \
        --role-name $TASK_EXECUTION_ROLE_NAME \
        --policy-name EcsTaskExecutionRolePolicy \
        --policy-document "$EXECUTION_ROLE_POLICY" \
        --region $AWS_REGION
    
    log_info "Task Execution Role criada com sucesso!"
fi

# 4. Criar Task Role
log_info "Criando Task Role..."
if aws iam get-role --role-name $TASK_ROLE_NAME &> /dev/null; then
    log_warn "Task Role já existe."
else
    aws iam create-role \
        --role-name $TASK_ROLE_NAME \
        --assume-role-policy-document "$TRUST_POLICY_ECS" \
        --region $AWS_REGION
    
    log_info "Task Role criada com sucesso!"
fi

log_info ""
log_info "IAM Roles criadas com sucesso!"
log_info "Task Execution Role ARN: arn:aws:iam::${AWS_ACCOUNT_ID}:role/${TASK_EXECUTION_ROLE_NAME}"
log_info "Task Role ARN: arn:aws:iam::${AWS_ACCOUNT_ID}:role/${TASK_ROLE_NAME}"
log_info ""
log_info "Atualize o arquivo aws/ecs-task-definition.json com os ARNs acima."

