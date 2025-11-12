# Guia de Deploy - Lucra Backend

Este guia explica como fazer o deploy da aplicação lucra-backend na AWS.

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Configuração Inicial](#configuração-inicial)
3. [Deploy Manual](#deploy-manual)
4. [Deploy Automatizado](#deploy-automatizado)
5. [Verificação](#verificação)
6. [Troubleshooting](#troubleshooting)

## Pré-requisitos

### 1. Ferramentas Necessárias

- **AWS CLI** instalado e configurado
- **Docker** instalado
- **Node.js** 20+ (para desenvolvimento local)
- **Conta AWS** com permissões adequadas

### 2. Configurar AWS CLI

```bash
aws configure
```

Você precisará fornecer:
- AWS Access Key ID
- AWS Secret Access Key
- Default region (ex: us-east-1)
- Default output format (json)

### 3. Permissões AWS Necessárias

Sua conta AWS precisa ter permissões para:
- ECS (Elastic Container Service)
- ECR (Elastic Container Registry)
- CloudWatch Logs
- Secrets Manager
- IAM (para criar roles)
- VPC, Security Groups, Load Balancer

## Configuração Inicial

### Passo 1: Executar Script de Setup

O script de setup cria os recursos básicos necessários:

```bash
cd aws
chmod +x setup-aws.sh
./setup-aws.sh
```

Este script cria:
- ✅ Repositório ECR
- ✅ CloudWatch Log Group
- ✅ ECS Cluster

### Passo 2: Configurar Secrets

Crie os secrets necessários no AWS Secrets Manager:

```bash
# DATABASE_URL
aws secretsmanager create-secret \
  --name lucra-backend/DATABASE_URL \
  --secret-string "postgresql://user:password@host:5432/database" \
  --region us-east-1

# JWT_SECRET
aws secretsmanager create-secret \
  --name lucra-backend/JWT_SECRET \
  --secret-string "your_super_secret_jwt_key_min_32_chars" \
  --region us-east-1

# CORS_ORIGIN
aws secretsmanager create-secret \
  --name lucra-backend/CORS_ORIGIN \
  --secret-string "https://yourdomain.com" \
  --region us-east-1
```

### Passo 3: Configurar IAM Roles

Crie as seguintes roles no IAM (veja `aws/iam-policies.json`):

1. **ECS Task Execution Role** - Permite que o ECS execute tarefas e acesse secrets
2. **ECS Task Role** - Permite que a aplicação acesse outros serviços AWS (opcional)

### Passo 4: Configurar VPC e Networking

1. Crie ou use uma VPC existente
2. Crie subnets (pelo menos 2 em diferentes AZs)
3. Crie Security Group com:
   - Inbound: Porta 8800 do Load Balancer
   - Outbound: Todas as portas

### Passo 5: Configurar Load Balancer (Opcional)

1. Crie Application Load Balancer
2. Crie Target Group apontando para porta 8800
3. Configurar Health Check para `/health`
4. Configurar Listener na porta 80/443

### Passo 6: Atualizar Arquivos de Configuração

Edite os arquivos de configuração:

1. **`aws/ecs-task-definition.json`**:
   - Substitua `YOUR_ACCOUNT_ID` pelo seu AWS Account ID
   - Substitua `YOUR_REGION` pela sua região AWS
   - Substitua os ARNs dos secrets pelos seus ARNs reais

2. **`aws/ecs-service-definition.json`**:
   - Substitua os IDs de subnet pelos seus IDs reais
   - Substitua os IDs de security group pelos seus IDs reais
   - Substitua o ARN do target group pelo seu ARN real (se usar Load Balancer)

### Passo 7: Registrar Task Definition

```bash
aws ecs register-task-definition \
  --cli-input-json file://aws/ecs-task-definition.json \
  --region us-east-1
```

### Passo 8: Criar ECS Service

```bash
aws ecs create-service \
  --cli-input-json file://aws/ecs-service-definition.json \
  --region us-east-1
```

## Deploy Automatizado

Após a configuração inicial, use o script de deploy para fazer deploy de novas versões:

```bash
cd aws
chmod +x deploy.sh
./deploy.sh
```

Este script:
1. Faz build da imagem Docker
2. Envia para ECR
3. Atualiza o serviço ECS
4. Aguarda estabilização (opcional)

### Variáveis de Ambiente do Script

Você pode configurar as seguintes variáveis:

```bash
export AWS_REGION=us-east-1
export AWS_ACCOUNT_ID=123456789012
export IMAGE_TAG=latest
./deploy.sh
```

## Deploy Manual

Se preferir fazer o deploy manualmente:

### 1. Build e Push da Imagem

```bash
# Obter credenciais ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Build da imagem
docker build -t lucra-backend:latest .

# Tag da imagem
docker tag lucra-backend:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/lucra-backend:latest

# Push para ECR
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/lucra-backend:latest
```

### 2. Atualizar Serviço ECS

```bash
aws ecs update-service \
  --cluster lucra-backend-cluster \
  --service lucra-backend-service \
  --force-new-deployment \
  --region us-east-1
```

## Verificação

### 1. Verificar Status do Serviço

```bash
aws ecs describe-services \
  --cluster lucra-backend-cluster \
  --services lucra-backend-service \
  --region us-east-1
```

### 2. Verificar Logs

```bash
aws logs tail /ecs/lucra-backend --follow --region us-east-1
```

### 3. Testar Health Check

```bash
# Se usar Load Balancer
curl https://your-load-balancer-url/health

# Se usar IP direto (após configurar Security Group)
curl http://YOUR_IP:8800/health
```

### 4. Testar API

```bash
curl https://your-load-balancer-url/api/health
```

## Troubleshooting

### Container não inicia

1. Verifique os logs no CloudWatch:
   ```bash
   aws logs tail /ecs/lucra-backend --follow
   ```

2. Verifique se as secrets estão configuradas:
   ```bash
   aws secretsmanager get-secret-value --secret-id lucra-backend/DATABASE_URL
   ```

3. Verifique se o DATABASE_URL está acessível do container

### Migrações falham

1. Verifique se o DATABASE_URL está correto
2. Verifique se o banco de dados está acessível
3. Verifique as permissões do usuário do banco

### Serviço não estabiliza

1. Verifique os health checks:
   ```bash
   aws ecs describe-services --cluster lucra-backend-cluster --services lucra-backend-service
   ```

2. Verifique os logs do container
3. Verifique as configurações de security group

### Erro de autenticação ECR

```bash
# Re-autenticar no ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
```

### Erro de permissões IAM

Verifique se as roles estão configuradas corretamente:
- ECS Task Execution Role precisa de permissão para acessar ECR e Secrets Manager
- Verifique as políticas no arquivo `aws/iam-policies.json`

## Monitoramento

### CloudWatch Logs

Os logs são enviados automaticamente para:
```
/ecs/lucra-backend
```

### CloudWatch Metrics

Métricas disponíveis:
- CPUUtilization
- MemoryUtilization
- TaskCount
- ServiceCount

### Health Check

A aplicação expõe um endpoint de health check:
```
GET /health
```

## Próximos Passos

- [ ] Configurar CI/CD com GitHub Actions
- [ ] Configurar auto-scaling baseado em métricas
- [ ] Configurar backup automático do banco de dados
- [ ] Configurar monitoramento com CloudWatch Alarms
- [ ] Configurar SSL/TLS no Load Balancer
- [ ] Configurar CDN para assets estáticos

## Recursos Adicionais

- [Documentação AWS ECS](https://docs.aws.amazon.com/ecs/)
- [Documentação AWS ECR](https://docs.aws.amazon.com/ecr/)
- [Documentação AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/)
- [Guia de Variáveis de Ambiente](./ENV_VARIABLES.md)
- [README AWS](./aws/README.md)

