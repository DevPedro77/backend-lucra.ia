# 📋 Instruções de Deploy - Lucra Backend

## ✅ O que foi configurado

Toda a infraestrutura necessária para deploy na AWS foi configurada:

### 1. Dockerfile ✅
- Corrigido e otimizado
- Health check configurado
- Migrações automáticas
- Multi-stage build

### 2. Configurações AWS ✅
- Task Definition (ECS)
- Service Definition (ECS)
- Scripts de deploy automatizados
- Scripts de setup
- Políticas IAM

### 3. Documentação ✅
- Guias completos de deploy
- Documentação de variáveis de ambiente
- Troubleshooting

## 🚀 Próximos Passos

### Passo 1: Instalar AWS CLI

#### macOS
```bash
# Usando Homebrew
brew install awscli

# Ou usando pip
pip3 install awscli
```

#### Linux
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install awscli

# Ou usando pip
pip3 install awscli
```

#### Windows
```bash
# Usando Chocolatey
choco install awscli

# Ou baixar o instalador MSI
# https://aws.amazon.com/cli/
```

### Passo 2: Configurar AWS CLI

```bash
aws configure
```

Você precisará fornecer:
- **AWS Access Key ID**: Sua chave de acesso AWS
- **AWS Secret Access Key**: Sua chave secreta AWS
- **Default region**: Região AWS (ex: `us-east-1`)
- **Default output format**: `json`

### Passo 3: Verificar Configuração

```bash
aws sts get-caller-identity
```

Se retornar suas informações da conta AWS, está configurado corretamente.

### Passo 4: Executar Deploy

#### Opção A: Deploy Rápido (Recomendado)

```bash
cd aws
chmod +x quick-start.sh
./quick-start.sh
```

Este script irá:
1. ✅ Criar IAM Roles necessárias
2. ✅ Criar recursos AWS (ECR, CloudWatch, ECS Cluster)
3. ✅ Configurar Secrets (interativo)
4. ✅ Orientar sobre próximos passos

#### Opção B: Deploy Manual

Siga as instruções no arquivo `DEPLOY.md` para deploy manual passo a passo.

### Passo 5: Configurar Recursos AWS

Antes do deploy, você precisa configurar:

1. **VPC e Networking**
   - Criar ou usar VPC existente
   - Criar subnets (pelo menos 2 em diferentes AZs)
   - Criar Security Groups

2. **Load Balancer (Opcional mas Recomendado)**
   - Criar Application Load Balancer
   - Criar Target Group
   - Configurar Health Check

3. **Banco de Dados**
   - Criar instância RDS PostgreSQL (ou usar existente)
   - Configurar Security Groups para permitir acesso do ECS
   - Obter DATABASE_URL

4. **Secrets**
   - Criar secrets no AWS Secrets Manager
   - Configurar DATABASE_URL, JWT_SECRET, CORS_ORIGIN

### Passo 6: Atualizar Arquivos de Configuração

Edite os arquivos de configuração com seus valores reais:

1. **`aws/ecs-task-definition.json`**:
   - Substitua `YOUR_ACCOUNT_ID` pelo seu AWS Account ID
   - Substitua `YOUR_REGION` pela sua região AWS
   - Atualize os ARNs dos secrets

2. **`aws/ecs-service-definition.json`**:
   - Substitua os IDs de subnet pelos seus IDs reais
   - Substitua os IDs de security group pelos seus IDs reais
   - Atualize o ARN do target group (se usar Load Balancer)

### Passo 7: Executar Deploy

```bash
cd aws
chmod +x deploy.sh
./deploy.sh
```

## 📝 Checklist Completo

Antes de fazer deploy, verifique:

- [ ] AWS CLI instalado e configurado
- [ ] Docker instalado
- [ ] Conta AWS com permissões adequadas
- [ ] IAM Roles criadas
- [ ] ECR Repository criado
- [ ] ECS Cluster criado
- [ ] CloudWatch Log Group criado
- [ ] Secrets criados no AWS Secrets Manager
- [ ] VPC e Subnets configuradas
- [ ] Security Groups configurados
- [ ] Load Balancer configurado (opcional)
- [ ] Banco de dados PostgreSQL acessível
- [ ] Arquivos de configuração atualizados

## 🧪 Testar Localmente

Antes de fazer deploy na AWS, teste localmente:

```bash
# Build da imagem
docker build -t lucra-backend:local .

# Ou usar Docker Compose
docker-compose up -d

# Verificar logs
docker-compose logs -f app

# Testar health check
curl http://localhost:8800/health

# Parar
docker-compose down
```

## 📚 Documentação

Para mais detalhes, consulte:

- **`DEPLOY.md`** - Guia completo de deploy
- **`ENV_VARIABLES.md`** - Variáveis de ambiente
- **`aws/README.md`** - Guia específico AWS
- **`README_DEPLOY.md`** - Resumo executivo

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs do CloudWatch
2. Verifique a documentação de troubleshooting
3. Verifique as configurações de Security Groups
4. Verifique se as secrets estão configuradas corretamente

## 🎉 Pronto!

Tudo está configurado e pronto para deploy. Siga os passos acima para fazer o deploy na AWS.

**Importante**: Certifique-se de ter todas as permissões necessárias na conta AWS antes de iniciar o deploy.

