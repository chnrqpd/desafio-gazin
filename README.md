# Desafio Gazin - Sistema de Gerenciamento de Desenvolvedores

Sistema completo para gerenciamento de desenvolvedores e níveis, desenvolvido como parte do desafio técnico da Gazin Tech.

## 📋 Sobre o Projeto

Este projeto consiste em uma aplicação full-stack para cadastro e gerenciamento de desenvolvedores associados a diferentes níveis de senioridade. A aplicação oferece uma interface intuitiva para operações CRUD completas, com funcionalidades avançadas de busca, paginação e ordenação.

### Funcionalidades Implementadas

#### ✅ Nível 1 - Básico

- API RESTful completa com endpoints para desenvolvedores e níveis
- Frontend SPA (Single Page Application) em React
- Operações CRUD completas para ambas as entidades
- Interface responsiva e intuitiva

#### ✅ Nível 2 - Intermediário

- Paginação server-side com controles de navegação
- Sistema de busca integrado com paginação
- Ordenação por colunas clicáveis
- Validações robustas com feedback ao usuário
- Sistema de notificações (Toast)
- Modais de confirmação elegantes

#### ✅ Nível 3 - Avançado

- Componente Pagination reutilizável
- Hook customizado usePagination para centralizar lógica
- Código otimizado seguindo boas práticas
- Correção automática de páginas vazias
- **Documentação Swagger/OpenAPI interativa**
- **Suíte completa de testes backend (87 testes)**
- Documentação completa de componentes e arquitetura

#### 🔄 Nível 4 - DevOps

- ✅ Containerização completa (Backend + Frontend + PostgreSQL)
- ✅ Docker Compose para orquestração
- ⏳ Deploy online (preparado mas não executado)

## 🚀 Tecnologias Utilizadas

### Backend

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados relacional
- **Sequelize** - ORM para JavaScript
- **Docker** - Containerização
- **Jest + Supertest** - Framework de testes

### Frontend

- **React** - Biblioteca para interfaces
- **SASS/SCSS** - Pré-processador CSS
- **Axios** - Cliente HTTP
- **React Hooks** - Gerenciamento de estado

### Ferramentas

- **Docker Compose** - Orquestração de containers
- **Prettier** - Formatação de código
- **ESLint** - Análise de código

## 🧪 Testes Backend

Implementei uma suíte completa de 87 testes cobrindo toda a aplicação backend:

- **Testes de integração** das rotas da API
- **Testes unitários** dos controllers
- **Testes unitários** dos middlewares
- Configuração com Jest + Supertest + PostgreSQL
- Cobertura completa de CRUD, paginação, validações e casos de erro

### Estrutura dos Testes:

```
backend/src/__tests__/
├── setup.js                    # Configuração global
├── routes/
│   ├── niveis.test.js         # 19 testes - integração níveis
│   └── desenvolvedores.test.js # 16 testes - integração desenvolvedores
├── controllers/
│   ├── niveisController.test.js      # 12 testes - controller níveis
│   └── desenvolvedoresController.test.js # 15 testes - controller desenvolvedores
└── middlewares/
    └── middlewares.test.js     # 25 testes - validação e paginação
```

### Executar Testes:

```bash
# Todos os testes
docker-compose exec backend npm test

# Testes específicos
docker-compose exec backend npm test -- src/__tests__/routes/
docker-compose exec backend npm test -- src/__tests__/controllers/
docker-compose exec backend npm test -- src/__tests__/middlewares/

# Relatório de cobertura
docker-compose exec backend npm run test:coverage

# Modo watch (desenvolvimento)
docker-compose exec backend npm run test:watch
```

## 📁 Estrutura do Projeto

```
desafio-gazin/
├── backend/
│   ├── src/
│   │   ├── __tests__/
│   │   │   ├── setup.js
│   │   │   ├── routes/
│   │   │   ├── controllers/
│   │   │   └── middlewares/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   └── app.js
│   ├── models/
│   ├── migrations/
│   ├── seeders/
│   ├── config/
│   ├── Dockerfile
│   ├── jest.config.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Pagination/
│   │   │   ├── Modal/
│   │   │   ├── SearchBar/
│   │   │   ├── Toast/
│   │   │   └── ConfirmDialog/
│   │   ├── pages/
│   │   │   ├── Desenvolvedores/
│   │   │   └── Niveis/
│   │   ├── hooks/
│   │   │   ├── usePagination.js
│   │   │   └── useToast.js
│   │   ├── services/
│   │   └── styles/
│   ├── public/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .prettierrc
└── README.md
```

## 🛠️ Instalação e Execução

### Pré-requisitos

- Docker
- Docker Compose

### Passos para Execução

1. **Clone o repositório**

```bash
git clone https://github.com/chnrqpd/desafio-gazin.git
cd desafio-gazin
```

2. **Execute com Docker Compose**

```bash
docker-compose up --build

# Após subir os containers, execute uma única vez:
docker-compose exec backend npm run db:migrate
docker-compose exec backend npm run db:seed
```

3. **Acesse a aplicação**

- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- **Documentação da API (Swagger)**: http://localhost:3000/api-docs
- PostgreSQL: localhost:5432

### Executar sem Docker (Desenvolvimento)

**Backend:**

```bash
cd backend
npm install
npm run dev
```

**Frontend:**

```bash
cd frontend
npm install
npm start
```

### Scripts Disponíveis

**Backend:**

```bash
npm start             # Produção
npm run dev          # Desenvolvimento com nodemon
npm test             # Executar todos os testes
npm run test:watch   # Testes em modo watch
npm run test:coverage # Relatório de cobertura
npm run db:migrate   # Executar migrations
npm run db:seed      # Executar seeders
```

**Frontend:**

```bash
npm start            # Desenvolvimento
npm run build        # Build para produção
```

## 🛠️ Scripts Utilitários

### Reset Completo do Ambiente

Para testar uma instalação limpa do zero:

**WSL/Linux/Mac:**

```bash
chmod +x scripts/reset-environment.sh
./scripts/reset-environment.sh
```

**Windows:**

```cmd
scripts\reset-environment.bat
```

**Manual (qualquer sistema):**

```bash
docker-compose down -v && docker volume prune -f && docker image prune -a -f && docker-compose up --build -d && sleep 30 && docker-compose exec backend npm run db:migrate && docker-compose exec backend npm run db:seed
```

### Dados em Massa para Testes

Para popular o banco com dados realistas (20 níveis + 100 desenvolvedores):

```bash
# Método recomendado (funciona em todos os sistemas)
docker-compose exec -T postgres psql -U gazin_user -d gazin_db < scripts/mass_data.sql

# Método alternativo (Linux/Mac)
docker-compose exec postgres psql -U gazin_user -d gazin_db -f /scripts/mass_data.sql
```

**O que adiciona:**

- 20 níveis diversos (Estagiário até CTO)
- 100 desenvolvedores com dados realistas
- Ideal para testar paginação, busca e ordenação

## 📊 Documentação da API

### Swagger/OpenAPI

A API possui documentação interativa completa usando Swagger/OpenAPI 3.0:

**Acesso:** http://localhost:3000/api-docs

**Funcionalidades da documentação:**

- Interface interativa para testar endpoints
- Exemplos de request/response para todas as rotas
- Validação de schemas e parâmetros
- Documentação detalhada de cada endpoint
- Modelos de dados com exemplos

### Endpoints da API

#### Desenvolvedores

```
GET    /api/desenvolvedores     - Lista desenvolvedores (com paginação)
POST   /api/desenvolvedores     - Cria desenvolvedor
GET    /api/desenvolvedores/:id - Busca desenvolvedor por ID
PUT    /api/desenvolvedores/:id - Atualiza desenvolvedor
DELETE /api/desenvolvedores/:id - Remove desenvolvedor
```

#### Níveis

```
GET    /api/niveis     - Lista níveis (com paginação)
POST   /api/niveis     - Cria nível
GET    /api/niveis/:id - Busca nível por ID
PUT    /api/niveis/:id - Atualiza nível
DELETE /api/niveis/:id - Remove nível
```

### Parâmetros de Paginação

```
?page=1&limit=10&search=termo&sort=campo&order=asc
```

### Formato de Resposta

```json
{
  "success": true,
  "data": [...],
  "meta": {
    "total": 100,
    "per_page": 10,
    "current_page": 1,
    "last_page": 10
  }
}
```

## 🧩 Componentes Principais

### Pagination

Componente reutilizável para paginação com:

- Navegação entre páginas
- Botões primeira/última página
- Indicadores visuais de página atual
- Responsividade mobile

```jsx
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
  disabled={loading}
/>
```

### usePagination Hook

Hook customizado que centraliza toda lógica de paginação:

- Gerenciamento de estado (página atual, total, etc.)
- Handlers para busca, ordenação e navegação
- Correção automática de páginas vazias
- Estados de loading e error

```jsx
const {
  currentPage,
  totalPages,
  totalItems,
  loading,
  error,
  fetchData,
  handlePageChange,
  handleSearch,
  handleSort,
} = usePagination({
  initialPage: 1,
  itemsPerPage: 10,
  onDataFetch: apiService.getAll,
});
```

## 🎨 Padrões de Código

### SCSS

- Variáveis globais em `_variables.scss`
- Mixins reutilizáveis em `_mixins.scss`
- Componentes modulares com SCSS próprio
- Responsividade mobile-first

### JavaScript

- Hooks customizados para lógica reutilizável
- Componentes funcionais com React Hooks
- Padrão de nomenclatura consistente
- Formatação automática com Prettier

## 🔧 Funcionalidades Especiais

### Busca Inteligente

- Busca em tempo real
- Integrada com paginação
- Reset automático para primeira página

### Ordenação Dinâmica

- Clique em colunas para ordenar
- Indicadores visuais de direção
- Mantém outros filtros ativos

### Validações

- Impedimento de exclusão de níveis com desenvolvedores
- Confirmações elegantes para ações destrutivas
- Feedback visual para todas as operações

### UX Aprimorada

- Loading states durante operações
- Toast notifications para feedback
- Correção automática de páginas vazias
- Interface responsiva

## 🚀 Abordagem e Decisões Técnicas

### Estratégia de Desenvolvimento

Segui a filosofia "um passo de cada vez", desenvolvendo o projeto incrementalmente:

1. **Primeiro**: Funcionalidades básicas funcionando corretamente
2. **Segundo**: Melhorias de UX e funcionalidades avançadas
3. **Terceiro**: Refatoração e otimização de código
4. **Quarto**: Implementação de testes abrangentes

### Decisões Arquiteturais

#### Por que componente Pagination reutilizável?

- **Problema**: Código duplicado nas páginas Desenvolvedores e Niveis
- **Solução**: Componente centralizado com props configuráveis
- **Benefício**: Manutenção simplificada e consistência visual

#### Por que hook usePagination?

- **Problema**: Lógica de paginação espalhada e repetitiva
- **Solução**: Hook customizado centralizando estados e handlers
- **Benefício**: Código mais limpo e reutilização em futuras páginas

#### Por que SASS/SCSS?

- **Escolha**: Organização com variáveis globais e mixins
- **Benefício**: Manutenibilidade e consistência visual
- **Padrão**: Arquivos modulares por componente

#### Por que Jest + Supertest?

- **Escolha**: Stack padrão para testes em Node.js
- **Benefício**: Testes de integração e unitários robustos
- **Cobertura**: 87 testes cobrindo toda a aplicação backend

### Correções e Melhorias Implementadas

#### Bug de Página Vazia (Descoberto e Corrigido)

- **Problema**: Usuário ficava preso em página sem dados após exclusões
- **Solução**: Função `checkAndFixEmptyPage` com redirecionamento automático
- **Implementação**: Detecção de páginas vazias + navegação inteligente

#### Otimizações de Performance

- **useCallback**: Evita re-renderizações desnecessárias
- **Estados centralizados**: Reduz complexidade dos componentes
- **Loading states**: Feedback visual durante operações

### Testes e Validação

Antes de cada entrega, todo o projeto foi testado:

- Instalação limpa via Docker
- Funcionalidades em diferentes cenários
- Responsividade em mobile/desktop
- Estados de loading e error
- Suíte automatizada de 87 testes backend

## 📝 Notas Técnicas

### Banco de Dados

```sql
-- Estrutura das tabelas
CREATE TABLE niveis (
  id SERIAL PRIMARY KEY,
  nivel VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL,
  updatedAt TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE desenvolvedores (
  id SERIAL PRIMARY KEY,
  nivel_id INTEGER REFERENCES niveis(id),
  nome VARCHAR(255) NOT NULL,
  sexo CHAR(1) NOT NULL,
  data_nascimento DATE NOT NULL,
  hobby VARCHAR(255),
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL,
  updatedAt TIMESTAMP WITH TIME ZONE NOT NULL
);
```

### Variáveis de Ambiente

```env
DB_HOST=postgres
DB_PORT=5432
DB_NAME=gazin_db
DB_USER=gazin_user
DB_PASS=gazin_pass
NODE_ENV=development
PORT=3000
```

## 🤝 Contribuição

Este projeto foi desenvolvido seguindo as especificações do desafio técnico da Gazin Tech, implementando todas as funcionalidades solicitadas e adicionando melhorias de qualidade e experiência do usuário.

## 👨‍💻 Desenvolvedor

Desenvolvido por Caio Henrique Primo Dario como parte do processo seletivo da Gazin Tech.

---

**Status:** ✅ **95% Concluído**

- **Nível 1:** ✅ 100% (8/8)
- **Nível 2:** ✅ 100% (11/11)
- **Nível 3:** ✅ 100% (7/7) - Incluindo testes unitários completos
- **Nível 4:** 🔄 75% (3/4) - Docker completo, falta deploy online

**Destaques:** 87 testes backend implementados, documentação Swagger completa, arquitetura robusta com componentes reutilizáveis e hooks customizados.
