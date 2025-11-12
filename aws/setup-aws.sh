#!/bin/bash

# Script para configurar recursos AWS necessários para o deploy
# Execute este script antes do primeiro deploy

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variáveis de configuração
AWS_REGION="${AWS_REGION:-us-east-1}"
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID:-}"
CLUSTER_NAME="lucra-backend-cluster"
SERVICE_NAME="lucra-backend-service"
TASK_FAMILY="lucra-backend-task"

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

log_info "Configurando recursos AWS para lucra-backend..."
log_info "Região: $AWS_REGION"

# 1. Criar ECR Repository
log_info "Criando repositório ECR..."
if aws ecr describe-repositories --repository-names lucra-backend --region $AWS_REGION &> /dev/null; then
    log_warn "Repositório ECR já existe."
else
    aws ecr create-repository --repository-name lucra-backend --region $AWS_REGION
    log_info "Repositório ECR criado com sucesso!"
fi

# 2. Criar CloudWatch Log Group
log_info "Criando CloudWatch Log Group..."
if aws logs describe-log-groups --log-group-name-prefix "/ecs/lucra-backend" --region $AWS_REGION --query 'logGroups[0].logGroupName' --output text | grep -q "/ecs/lucra-backend"; then
    log_warn "Log Group já existe."
else
    aws logs create-log-group --log-group-name "/ecs/lucra-backend" --region $AWS_REGION
    log_info "Log Group criado com sucesso!"
fi

# 3. Criar Secrets no Secrets Manager (se necessário)
log_info "Verificando secrets no Secrets Manager..."
log_warn "IMPORTANTE: Você precisa criar os seguintes secrets manualmente no AWS Secrets Manager:"
log_warn "  - lucra-backend/DATABASE_URL"
log_warn "  - lucra-backend/JWT_SECRET"
log_warn "  - lucra-backend/CORS_ORIGIN"
log_warn ""
log_warn "Use o seguinte comando para criar cada secret:"
log_warn "  aws secretsmanager create-secret --name lucra-backend/DATABASE_URL --secret-string 'postgresql://user:pass@host:5432/db' --region $AWS_REGION"

# 4. Criar ECS Cluster
log_info "Criando ECS Cluster..."
if aws ecs describe-clusters --clusters $CLUSTER_NAME --region $AWS_REGION --query 'clusters[0].status' --output text 2>/dev/null | grep -q "ACTIVE"; then
    log_warn "Cluster ECS já existe."
else
    aws ecs create-cluster --cluster-name $CLUSTER_NAME --region $AWS_REGION
    log_info "Cluster ECS criado com sucesso!"
fi

log_info ""
log_info "Próximos passos:"
log_info "1. Crie os secrets no AWS Secrets Manager (veja mensagens acima)"
log_info "2. Configure VPC, Subnets e Security Groups"
log_info "3. Crie Application Load Balancer (opcional mas recomendado)"
log_info "4. Atualize o arquivo aws/ecs-task-definition.json com seus ARNs"
log_info "5. Atualize o arquivo aws/ecs-service-definition.json com seus IDs de subnet e security group"
log_info "6. Execute: aws ecs register-task-definition --cli-input-json file://aws/ecs-task-definition.json --region $AWS_REGION"
log_info "7. Execute: aws ecs create-service --cli-input-json file://aws/ecs-service-definition.json --region $AWS_REGION"
log_info "8. Ou use o script de deploy: ./aws/deploy.sh"

log_info ""
log_info "Configuração inicial concluída!"

