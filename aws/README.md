# Deploy na AWS - Guia Completo

Este guia explica como fazer o deploy da aplicação lucra-backend na AWS usando ECS Fargate.

## Pré-requisitos

1. **AWS CLI instalado e configurado**
   ```bash
   aws --version
   aws configure
   ```

2. **Docker instalado**
   ```bash
   docker --version
   ```

3. **Conta AWS com permissões para:**
   - ECS (Elastic Container Service)
   - ECR (Elastic Container Registry)
   - CloudWatch Logs
   - Secrets Manager
   - IAM (para criar roles)
   - VPC, Security Groups, Load Balancer (se necessário)

## Passo a Passo

### 1. Configuração Inicial

Execute o script de setup para criar os recursos básicos:

```bash
chmod +x aws/setup-aws.sh
./aws/setup-aws.sh
```

Este script cria:
- Repositório ECR
- CloudWatch Log Group
- ECS Cluster

### 2. Configurar Secrets no AWS Secrets Manager

Crie os seguintes secrets no AWS Secrets Manager:

```bash
# DATABASE_URL
aws secretsmanager create-secret \
  --name lucra-backend/DATABASE_URL \
  --secret-string "postgresql://user:password@host:5432/database" \
  --region us-east-1

# JWT_SECRET
aws secretsmanager create-secret \
  --name lucra-backend/JWT_SECRET \
  --secret-string "your_super_secret_jwt_key" \
  --region us-east-1

# CORS_ORIGIN
aws secretsmanager create-secret \
  --name lucra-backend/CORS_ORIGIN \
  --secret-string "https://yourdomain.com" \
  --region us-east-1
```

### 3. Configurar IAM Roles

Crie as seguintes roles no IAM:

#### a) ECS Task Execution Role

Esta role permite que o ECS execute tarefas e acesse secrets:

```json
{
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
}
```

#### b) ECS Task Role

Esta role permite que a aplicação acesse outros serviços AWS (se necessário):

```json
{
  "Version": "2012-10-17",
  "Statement": []
}
```

### 4. Configurar VPC e Networking

1. **Criar VPC** (ou usar uma existente)
2. **Criar Subnets** (pelo menos 2 em diferentes AZs)
3. **Criar Security Group** com as seguintes regras:
   - Inbound: Porta 8800 do Load Balancer
   - Outbound: Todas as portas (0.0.0.0/0)

### 5. Configurar Application Load Balancer (Opcional mas Recomendado)

1. Criar Application Load Balancer
2. Criar Target Group apontando para a porta 8800
3. Configurar Health Check para `/health`
4. Configurar Listener na porta 80/443

### 6. Atualizar Arquivos de Configuração

Edite os arquivos `aws/ecs-task-definition.json` e `aws/ecs-service-definition.json`:

- Substitua `YOUR_ACCOUNT_ID` pelo seu AWS Account ID
- Substitua `YOUR_REGION` pela sua região AWS
- Substitua os ARNs dos secrets pelos seus ARNs reais
- Substitua os IDs de subnet e security group pelos seus IDs reais
- Substitua o ARN do target group pelo seu ARN real

### 7. Registrar Task Definition

```bash
aws ecs register-task-definition \
  --cli-input-json file://aws/ecs-task-definition.json \
  --region us-east-1
```

### 8. Criar ECS Service

```bash
aws ecs create-service \
  --cli-input-json file://aws/ecs-service-definition.json \
  --region us-east-1
```

### 9. Deploy Automatizado

Para fazer deploy de novas versões, use o script de deploy:

```bash
chmod +x aws/deploy.sh
./aws/deploy.sh
```

Este script:
1. Faz build da imagem Docker
2. Envia para ECR
3. Atualiza o serviço ECS

## Variáveis de Ambiente

A aplicação requer as seguintes variáveis de ambiente:

| Variável | Descrição | Obrigatória | Padrão |
|----------|-----------|-------------|--------|
| `DATABASE_URL` | URL de conexão com PostgreSQL | Sim | - |
| `PORT` | Porta do servidor | Não | 8800 |
| `NODE_ENV` | Ambiente de execução | Não | production |
| `CORS_ORIGIN` | Origens permitidas para CORS | Não | * |
| `RATE_LIMIT_MAX` | Máximo de requisições | Não | 100 |
| `RATE_LIMIT_TIME_WINDOW` | Janela de tempo (ms) | Não | 60000 |
| `JWT_SECRET` | Chave secreta para JWT | Sim | - |

## Monitoramento

### CloudWatch Logs

Os logs da aplicação são enviados para:
```
/ecs/lucra-backend
```

### Health Check

A aplicação expõe um endpoint de health check em:
```
GET /health
```

## Troubleshooting

### Container não inicia

1. Verifique os logs no CloudWatch
2. Verifique se as secrets estão configuradas corretamente
3. Verifique se o DATABASE_URL está acessível do container

### Migrações falham

1. Verifique se o DATABASE_URL está correto
2. Verifique se o banco de dados está acessível
3. Verifique as permissões do usuário do banco

### Serviço não estabiliza

1. Verifique os health checks
2. Verifique os logs do container
3. Verifique as configurações de security group

## Custos Estimados

- **ECS Fargate**: ~$0.04 por vCPU-hora + ~$0.004 por GB-hora
- **ECR**: Primeiros 500MB/mês gratuitos
- **CloudWatch Logs**: Primeiros 5GB/mês gratuitos
- **Application Load Balancer**: ~$0.0225 por hora
- **Secrets Manager**: $0.40 por secret por mês

## Segurança

1. **Nunca commite secrets no código**
2. **Use Secrets Manager para todas as variáveis sensíveis**
3. **Configure CORS adequadamente**
4. **Use HTTPS no Load Balancer**
5. **Mantenha as imagens Docker atualizadas**
6. **Configure backup do banco de dados**

## Próximos Passos

- [ ] Configurar CI/CD com GitHub Actions ou AWS CodePipeline
- [ ] Configurar auto-scaling baseado em métricas
- [ ] Configurar backup automático do banco de dados
- [ ] Configurar monitoramento com CloudWatch Alarms
- [ ] Configurar SSL/TLS no Load Balancer
- [ ] Configurar CDN para assets estáticos (se houver)

