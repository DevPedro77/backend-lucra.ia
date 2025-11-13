# Lucra.ia Backend API

## URL de Produção
A API está disponível em produção em: https://backend-lucra-ia.onrender.com

## Descrição
API desenvolvida em Node.js com TypeScript utilizando Fastify, Prisma ORM e JWT para autenticação. O objetivo é fornecer endpoints para autenticação, onboarding, dashboard, despesas, recebimentos e compras, com documentação Swagger integrada.

## Tecnologias Utilizadas
- Node.js
- TypeScript
- Fastify
- Prisma ORM
- PostgreSQL
- JWT (JSON Web Token)
- Docker (opcional)

## Instalação

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd lucra.ia-backend
   ```
2. **Instale as dependências:**
   ```bash
   npm install
   ```
3. **Configure as variáveis de ambiente:**
   - Renomeie o arquivo `.env.example` para `.env` e ajuste as variáveis conforme necessário.

4. **Execute as migrações do banco de dados:**
   ```bash
   npx prisma migrate deploy
   ```

5. **Inicie a aplicação:**
   ```bash
   npm run build
   npm start
   ```

## Scripts Principais
- `npm run build`: Compila o projeto TypeScript para JavaScript na pasta `dist`.
- `npm start`: Inicia o servidor a partir da build.
- `npm run dev`: Inicia o servidor em modo desenvolvimento.

## Estrutura de Pastas
- `src/app/`: Inicialização do servidor Fastify.
- `src/routes/`: Rotas da API.
- `src/modules/`: Lógica de negócio separada por domínio (auth, dashboard, despesas, etc).
- `src/shared/`: Configurações compartilhadas (ex: Prisma).
- `prisma/`: Schema e migrações do banco de dados.

## Endpoints Principais
- `/auth`: Autenticação de usuários (login, registro, etc).
- `/onboarding`: Endpoints de onboarding.
- `/dashboard`: Dados de resumo e overview.
- `/despesas`: Gerenciamento de despesas.
- `/receives`: Gerenciamento de recebimentos.
- `/purchase`: Gerenciamento de compras.
- `/health`: Health check da API.

## Documentação Swagger
Acesse a documentação interativa em: `http://localhost:8800/docs`

## Variáveis de Ambiente
Veja o arquivo `.env.example` para detalhes das variáveis necessárias.

## Docker
Para rodar com Docker:
```bash
docker-compose up --build
```

## Contribuição
Pull requests são bem-vindos! Para grandes mudanças, abra uma issue primeiro para discutir o que você gostaria de mudar.

## Licença
[MIT](LICENSE)
