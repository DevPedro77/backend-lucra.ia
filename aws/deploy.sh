#!/bin/bash

# Script de deploy para AWS ECS
# Este script faz o build da imagem Docker, envia para ECR e atualiza o serviço ECS

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variáveis de configuração (ajuste conforme necessário)
AWS_REGION="${AWS_REGION:-us-east-1}"
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID:-}"
ECR_REPOSITORY="lucra-backend"
ECS_CLUSTER="lucra-backend-cluster"
ECS_SERVICE="lucra-backend-service"
IMAGE_TAG="${IMAGE_TAG:-latest}"

# Função para exibir mensagens
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

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    log_error "Docker não está instalado. Por favor, instale primeiro."
    exit 1
fi

# Verificar se está autenticado no AWS
if ! aws sts get-caller-identity &> /dev/null; then
    log_error "Não está autenticado no AWS. Execute 'aws configure' primeiro."
    exit 1
fi

# Obter AWS Account ID se não fornecido
if [ -z "$AWS_ACCOUNT_ID" ]; then
    AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    log_info "AWS Account ID: $AWS_ACCOUNT_ID"
fi

# ECR Repository URI
ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}"

log_info "Iniciando deploy do lucra-backend..."
log_info "Região: $AWS_REGION"
log_info "ECR Repository: $ECR_URI"
log_info "Image Tag: $IMAGE_TAG"

# 1. Criar repositório ECR se não existir
log_info "Verificando repositório ECR..."
if ! aws ecr describe-repositories --repository-names $ECR_REPOSITORY --region $AWS_REGION &> /dev/null; then
    log_warn "Repositório ECR não existe. Criando..."
    aws ecr create-repository --repository-name $ECR_REPOSITORY --region $AWS_REGION
    log_info "Repositório ECR criado com sucesso!"
else
    log_info "Repositório ECR já existe."
fi

# 2. Autenticar no ECR
log_info "Autenticando no ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_URI

# 3. Build da imagem Docker
log_info "Fazendo build da imagem Docker..."
docker build -t $ECR_REPOSITORY:$IMAGE_TAG .
docker tag $ECR_REPOSITORY:$IMAGE_TAG $ECR_URI:$IMAGE_TAG

# 4. Push da imagem para ECR
log_info "Enviando imagem para ECR..."
docker push $ECR_URI:$IMAGE_TAG

# 5. Atualizar serviço ECS
log_info "Atualizando serviço ECS..."
aws ecs update-service \
    --cluster $ECS_CLUSTER \
    --service $ECS_SERVICE \
    --force-new-deployment \
    --region $AWS_REGION > /dev/null

log_info "Deploy iniciado com sucesso!"
log_info "Acompanhe o status do deploy em: https://console.aws.amazon.com/ecs/v2/clusters/$ECS_CLUSTER/services/$ECS_SERVICE"

# 6. Aguardar estabilização do serviço (opcional)
read -p "Deseja aguardar a estabilização do serviço? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    log_info "Aguardando estabilização do serviço..."
    aws ecs wait services-stable \
        --cluster $ECS_CLUSTER \
        --services $ECS_SERVICE \
        --region $AWS_REGION
    log_info "Serviço estabilizado com sucesso!"
fi

log_info "Deploy concluído!"

