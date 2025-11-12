#!/bin/bash

# Script de Quick Start - Configura tudo necessário para deploy na AWS
# Execute este script para configurar automaticamente os recursos AWS

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

AWS_REGION="${AWS_REGION:-us-east-1}"
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID:-}"

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Verificar pré-requisitos
log_info "Verificando pré-requisitos..."

if ! command -v aws &> /dev/null; then
    log_error "AWS CLI não está instalado. Por favor, instale primeiro."
    exit 1
fi

if ! command -v docker &> /dev/null; then
    log_error "Docker não está instalado. Por favor, instale primeiro."
    exit 1
fi

if ! aws sts get-caller-identity &> /dev/null; then
    log_error "Não está autenticado no AWS. Execute 'aws configure' primeiro."
    exit 1
fi

# Obter AWS Account ID
if [ -z "$AWS_ACCOUNT_ID" ]; then
    AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    log_info "AWS Account ID: $AWS_ACCOUNT_ID"
fi

log_info "Região: $AWS_REGION"
log_info ""

# Passo 1: Criar IAM Roles
log_step "1. Criando IAM Roles..."
if [ -f "./create-iam-roles.sh" ]; then
    chmod +x ./create-iam-roles.sh
    ./create-iam-roles.sh
else
    log_warn "Script create-iam-roles.sh não encontrado. Pulando criação de IAM Roles."
    log_warn "Execute manualmente: ./aws/create-iam-roles.sh"
fi

log_info ""

# Passo 2: Setup inicial AWS
log_step "2. Configurando recursos AWS básicos..."
if [ -f "./setup-aws.sh" ]; then
    chmod +x ./setup-aws.sh
    ./setup-aws.sh
else
    log_warn "Script setup-aws.sh não encontrado. Pulando setup inicial."
    log_warn "Execute manualmente: ./aws/setup-aws.sh"
fi

log_info ""

# Passo 3: Configurar Secrets
log_step "3. Configurando Secrets no AWS Secrets Manager..."
log_warn "IMPORTANTE: Você precisa criar os secrets manualmente no AWS Secrets Manager."
log_warn ""
log_warn "Execute os seguintes comandos:"
log_warn ""
log_warn "# DATABASE_URL"
log_warn "aws secretsmanager create-secret \\"
log_warn "  --name lucra-backend/DATABASE_URL \\"
log_warn "  --secret-string 'postgresql://user:password@host:5432/database' \\"
log_warn "  --region $AWS_REGION"
log_warn ""
log_warn "# JWT_SECRET"
log_warn "aws secretsmanager create-secret \\"
log_warn "  --name lucra-backend/JWT_SECRET \\"
log_warn "  --secret-string 'your_super_secret_jwt_key_min_32_chars' \\"
log_warn "  --region $AWS_REGION"
log_warn ""
log_warn "# CORS_ORIGIN"
log_warn "aws secretsmanager create-secret \\"
log_warn "  --name lucra-backend/CORS_ORIGIN \\"
log_warn "  --secret-string 'https://yourdomain.com' \\"
log_warn "  --region $AWS_REGION"
log_warn ""

read -p "Deseja criar os secrets agora? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    log_info "Criando secrets..."
    
    # DATABASE_URL
    read -p "Digite o DATABASE_URL (postgresql://user:password@host:5432/database): " DATABASE_URL
    if [ ! -z "$DATABASE_URL" ]; then
        aws secretsmanager create-secret \
            --name lucra-backend/DATABASE_URL \
            --secret-string "$DATABASE_URL" \
            --region $AWS_REGION 2>/dev/null || \
        aws secretsmanager update-secret \
            --secret-id lucra-backend/DATABASE_URL \
            --secret-string "$DATABASE_URL" \
            --region $AWS_REGION
        log_info "DATABASE_URL configurado!"
    fi
    
    # JWT_SECRET
    read -p "Digite o JWT_SECRET (min 32 caracteres): " JWT_SECRET
    if [ ! -z "$JWT_SECRET" ]; then
        aws secretsmanager create-secret \
            --name lucra-backend/JWT_SECRET \
            --secret-string "$JWT_SECRET" \
            --region $AWS_REGION 2>/dev/null || \
        aws secretsmanager update-secret \
            --secret-id lucra-backend/JWT_SECRET \
            --secret-string "$JWT_SECRET" \
            --region $AWS_REGION
        log_info "JWT_SECRET configurado!"
    fi
    
    # CORS_ORIGIN
    read -p "Digite o CORS_ORIGIN (ou * para todas as origens): " CORS_ORIGIN
    if [ ! -z "$CORS_ORIGIN" ]; then
        aws secretsmanager create-secret \
            --name lucra-backend/CORS_ORIGIN \
            --secret-string "$CORS_ORIGIN" \
            --region $AWS_REGION 2>/dev/null || \
        aws secretsmanager update-secret \
            --secret-id lucra-backend/CORS_ORIGIN \
            --secret-string "$CORS_ORIGIN" \
            --region $AWS_REGION
        log_info "CORS_ORIGIN configurado!"
    fi
fi

log_info ""

# Passo 4: Atualizar arquivos de configuração
log_step "4. Atualizando arquivos de configuração..."
log_warn "IMPORTANTE: Você precisa atualizar os arquivos de configuração manualmente."
log_warn ""
log_warn "1. Atualize aws/ecs-task-definition.json:"
log_warn "   - Substitua YOUR_ACCOUNT_ID por: $AWS_ACCOUNT_ID"
log_warn "   - Substitua YOUR_REGION por: $AWS_REGION"
log_warn "   - Atualize os ARNs dos secrets"
log_warn ""
log_warn "2. Atualize aws/ecs-service-definition.json:"
log_warn "   - Substitua os IDs de subnet pelos seus IDs reais"
log_warn "   - Substitua os IDs de security group pelos seus IDs reais"
log_warn "   - Atualize o ARN do target group (se usar Load Balancer)"
log_warn ""

# Passo 5: Próximos passos
log_step "5. Próximos passos..."
log_info ""
log_info "Após configurar tudo acima, execute:"
log_info ""
log_info "1. Registrar Task Definition:"
log_info "   aws ecs register-task-definition \\"
log_info "     --cli-input-json file://aws/ecs-task-definition.json \\"
log_info "     --region $AWS_REGION"
log_info ""
log_info "2. Criar ECS Service:"
log_info "   aws ecs create-service \\"
log_info "     --cli-input-json file://aws/ecs-service-definition.json \\"
log_info "     --region $AWS_REGION"
log_info ""
log_info "3. Ou fazer deploy:"
log_info "   ./aws/deploy.sh"
log_info ""
log_info "Para mais informações, consulte:"
log_info "  - DEPLOY.md"
log_info "  - aws/README.md"
log_info "  - ENV_VARIABLES.md"
log_info ""

log_info "✅ Configuração inicial concluída!"

