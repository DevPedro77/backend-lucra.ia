# Variáveis de Ambiente

Este arquivo documenta todas as variáveis de ambiente necessárias para a aplicação.

## Variáveis Obrigatórias

### DATABASE_URL
**Descrição**: URL de conexão com o banco de dados PostgreSQL  
**Formato**: `postgresql://user:password@host:port/database`  
**Exemplo**: `postgresql://lucra_user:lucra_password@localhost:5432/lucra_db`  
**AWS**: Configurar no Secrets Manager como `lucra-backend/DATABASE_URL`

### JWT_SECRET
**Descrição**: Chave secreta para assinatura de tokens JWT  
**Recomendação**: Use uma string aleatória forte (mínimo 32 caracteres)  
**Exemplo**: `your_super_secret_jwt_key_change_this_in_production_12345`  
**AWS**: Configurar no Secrets Manager como `lucra-backend/JWT_SECRET`

## Variáveis Opcionais

### PORT
**Descrição**: Porta em que o servidor irá escutar  
**Padrão**: `8800`  
**Exemplo**: `8800`

### NODE_ENV
**Descrição**: Ambiente de execução da aplicação  
**Padrão**: `development`  
**Valores**: `development`, `production`, `test`  
**Exemplo**: `production`

### CORS_ORIGIN
**Descrição**: Origens permitidas para CORS (separadas por vírgula)  
**Padrão**: `*` (todas as origens)  
**Exemplo**: `https://app.lucra.ia,https://www.lucra.ia`  
**AWS**: Configurar no Secrets Manager como `lucra-backend/CORS_ORIGIN`

### RATE_LIMIT_MAX
**Descrição**: Número máximo de requisições permitidas por janela de tempo  
**Padrão**: `100`  
**Exemplo**: `100`

### RATE_LIMIT_TIME_WINDOW
**Descrição**: Janela de tempo em milissegundos para rate limiting  
**Padrão**: `60000` (1 minuto)  
**Exemplo**: `60000`

## Configuração no AWS Secrets Manager

Para configurar as secrets no AWS Secrets Manager, use os seguintes comandos:

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

## Configuração Local

Para desenvolvimento local, crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL=postgresql://lucra_user:lucra_password@localhost:5432/lucra_db
PORT=8800
NODE_ENV=development
CORS_ORIGIN=*
RATE_LIMIT_MAX=100
RATE_LIMIT_TIME_WINDOW=60000
JWT_SECRET=development_jwt_secret_change_in_production
```

## Configuração no Docker

Para desenvolvimento com Docker, use o arquivo `docker-compose.yml` que já está configurado com as variáveis de ambiente.

## Segurança

⚠️ **IMPORTANTE**: Nunca commite o arquivo `.env` no repositório. Ele deve estar no `.gitignore`.

✅ **Boas Práticas**:
- Use secrets fortes e únicos para JWT_SECRET em produção
- Configure CORS adequadamente para produção
- Use conexões SSL/TLS para o banco de dados em produção
- Armazene todas as secrets no AWS Secrets Manager em produção

