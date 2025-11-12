# 🚀 Deploy na AWS - Resumo Executivo

## ✅ O que foi configurado

### 1. Dockerfile
- ✅ Renomeado de `DockerFile` para `Dockerfile`
- ✅ Corrigido caminho do servidor: `dist/app/server.js`
- ✅ Adicionado health check
- ✅ Multi-stage build otimizado
- ✅ Usuário não-root para segurança
- ✅ Migrações automáticas no startup

### 2. Arquivos de Configuração AWS
- ✅ `aws/ecs-task-definition.json` - Definição da tarefa ECS
- ✅ `aws/ecs-service-definition.json` - Definição do serviço ECS
- ✅ `aws/iam-policies.json` - Políticas IAM necessárias
- ✅ `aws/setup-aws.sh` - Script de setup inicial
- ✅ `aws/deploy.sh` - Script de deploy automatizado
- ✅ `aws/create-iam-roles.sh` - Script para criar IAM Roles
- ✅ `aws/quick-start.sh` - Script completo de configuração

### 3. Docker Compose
- ✅ `docker-compose.yml` - Para testes locais
- ✅ Configuração com PostgreSQL
- ✅ Health checks configurados

### 4. Documentação
- ✅ `DEPLOY.md` - Guia completo de deploy
- ✅ `ENV_VARIABLES.md` - Documentação de variáveis de ambiente
- ✅ `aws/README.md` - Guia específico para AWS

## 🎯 Próximos Passos para Deploy

### Opção 1: Deploy Rápido (Recomendado)

```bash
cd aws
chmod +x quick-start.sh
./quick-start.sh
```

Este script irá:
1. Criar IAM Roles
2. Criar recursos AWS básicos (ECR, CloudWatch, ECS Cluster)
3. Configurar Secrets (interativo)
4. Orientar sobre próximos passos

### Opção 2: Deploy Manual

#### 1. Configurar AWS CLI
```bash
aws configure
```

#### 2. Criar IAM Roles
```bash
cd aws
chmod +x create-iam-roles.sh
./create-iam-roles.sh
```

#### 3. Setup Inicial AWS
```bash
chmod +x setup-aws.sh
./setup-aws.sh
```

#### 4. Criar Secrets no AWS Secrets Manager
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

#### 5. Atualizar Arquivos de Configuração

Edite `aws/ecs-task-definition.json`:
- Substitua `YOUR_ACCOUNT_ID` pelo seu AWS Account ID
- Substitua `YOUR_REGION` pela sua região AWS
- Atualize os ARNs dos secrets

Edite `aws/ecs-service-definition.json`:
- Substitua os IDs de subnet pelos seus IDs reais
- Substitua os IDs de security group pelos seus IDs reais
- Atualize o ARN do target group (se usar Load Balancer)

#### 6. Registrar Task Definition
```bash
aws ecs register-task-definition \
  --cli-input-json file://aws/ecs-task-definition.json \
  --region us-east-1
```

#### 7. Criar ECS Service
```bash
aws ecs create-service \
  --cli-input-json file://aws/ecs-service-definition.json \
  --region us-east-1
```

#### 8. Deploy de Novas Versões
```bash
cd aws
chmod +x deploy.sh
./deploy.sh
```

## 📋 Checklist de Pré-requisitos

- [ ] AWS CLI instalado e configurado
- [ ] Docker instalado
- [ ] Conta AWS com permissões adequadas
- [ ] VPC configurada (ou usar padrão)
- [ ] Subnets configuradas (pelo menos 2 em diferentes AZs)
- [ ] Security Groups configurados
- [ ] Load Balancer configurado (opcional mas recomendado)
- [ ] Banco de dados PostgreSQL acessível
- [ ] Secrets criados no AWS Secrets Manager

## 🔧 Configurações Necessárias

### Variáveis de Ambiente

A aplicação requer as seguintes variáveis:

| Variável | Obrigatória | Onde Configurar |
|----------|-------------|-----------------|
| `DATABASE_URL` | Sim | AWS Secrets Manager |
| `JWT_SECRET` | Sim | AWS Secrets Manager |
| `CORS_ORIGIN` | Não | AWS Secrets Manager |
| `PORT` | Não | Task Definition |
| `NODE_ENV` | Não | Task Definition |

### Recursos AWS Necessários

1. **ECR Repository**: `lucra-backend`
2. **ECS Cluster**: `lucra-backend-cluster`
3. **ECS Service**: `lucra-backend-service`
4. **CloudWatch Log Group**: `/ecs/lucra-backend`
5. **Secrets Manager**: 
   - `lucra-backend/DATABASE_URL`
   - `lucra-backend/JWT_SECRET`
   - `lucra-backend/CORS_ORIGIN`
6. **IAM Roles**:
   - `ecsTaskExecutionRole`
   - `ecsTaskRole`

## 🧪 Testar Localmente

Antes de fazer deploy na AWS, teste localmente:

```bash
# Usando Docker Compose
docker-compose up -d

# Verificar logs
docker-compose logs -f app

# Testar health check
curl http://localhost:8800/health

# Parar
docker-compose down
```

## 📊 Monitoramento

### CloudWatch Logs
```bash
aws logs tail /ecs/lucra-backend --follow --region us-east-1
```

### Status do Serviço
```bash
aws ecs describe-services \
  --cluster lucra-backend-cluster \
  --services lucra-backend-service \
  --region us-east-1
```

### Health Check
```bash
curl https://your-load-balancer-url/health
```

## 🐛 Troubleshooting

### Container não inicia
1. Verifique os logs no CloudWatch
2. Verifique se as secrets estão configuradas
3. Verifique se o DATABASE_URL está acessível

### Migrações falham
1. Verifique se o DATABASE_URL está correto
2. Verifique se o banco de dados está acessível
3. Verifique as permissões do usuário do banco

### Serviço não estabiliza
1. Verifique os health checks
2. Verifique os logs do container
3. Verifique as configurações de security group

## 📚 Documentação Completa

Para mais detalhes, consulte:
- [DEPLOY.md](./DEPLOY.md) - Guia completo de deploy
- [ENV_VARIABLES.md](./ENV_VARIABLES.md) - Variáveis de ambiente
- [aws/README.md](./aws/README.md) - Guia específico AWS

## 🎉 Pronto para Deploy!

Tudo está configurado e pronto para deploy. Execute o script de quick start ou siga os passos manuais acima.

Para dúvidas ou problemas, consulte a documentação ou os logs do CloudWatch.

