# 📦 Documentação: Projeto de Controle de Encomendas

Este documento descreve os passos necessários para configurar e rodar o ambiente de desenvolvimento local deste projeto.

---

## 🧩 1. Pré-requisitos

Antes de começar, certifique-se de que você tem as seguintes ferramentas instaladas:

- **Node.js** (versão 18+ recomendada)
- **npm** (geralmente instalado com o Node.js)
- **PostgreSQL** em execução

---

## ⚙️ 2. Instalação

1. Clone este repositório para a sua máquina local.
2. Acesse a pasta do projeto e instale todas as dependências necessárias:

```bash
npm install
```

---

## 🗄️ 3. Configuração do Banco de Dados (Prisma)

### 3.1. Crie o arquivo `.env`

Na raiz do projeto, crie um arquivo chamado `.env`.  
Ele deve conter a sua string de conexão (`DATABASE_URL`) com o PostgreSQL.

**Exemplo:**

```env
# Exemplo de DATABASE_URL para PostgreSQL
DATABASE_URL="postgresql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO"
```

**Parâmetros:**

- `USUARIO`: Seu usuário do PostgreSQL (ex: `postgres`)
- `SENHA`: Sua senha do PostgreSQL
- `HOST`: Onde o banco está rodando (ex: `localhost`)
- `PORTA`: A porta do PostgreSQL (ex: `5432`)
- `NOME_DO_BANCO`: O nome do banco de dados que você criou (ex: `encomendas_db`)

---

### 3.2. Aplique as Migrações (Prisma)

Este comando irá ler o arquivo `schema.prisma` e aplicar todas as migrações existentes, criando a estrutura de tabelas no banco.

```bash
npx prisma migrate dev
```

---

### 3.3. Gere o Prisma Client

Para garantir que o Prisma Client (`@prisma/client`) esteja sincronizado com o `schema.prisma`, execute:

```bash
npx prisma generate
```

---

### 3.4. Povoe o Banco (Seed)

Rode o script de seed unificado (`prisma/seed.ts`) para limpar o banco e criar todos os dados de teste (Plano, Condomínio, Síndico, Morador, Porteiros e Encomendas):

```bash
npx prisma db seed
```

> 💡 O Prisma sabe qual script rodar porque ele está configurado no seu arquivo `package.json`.

---

## 🚀 4. Rodando a Aplicação

Após a instalação e configuração do banco, inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra **[http://localhost:3000](http://localhost:3000)** no seu navegador para ver o projeto.

---

## 👤 5. Usuários de Teste

O script de seed (`prisma/seed.ts`) cria os seguintes usuários.  
A senha padrão para todos é **`Casa#2459`**.

| Perfil   | Email              | CPF         | Unidade       |
| -------- | ------------------ | ----------- | ------------- |
| Morador  | yaya@gmail.com     | 05955422048 | Bloco A - 101 |
| Síndico  | sindico@gmail.com  | 68282302058 | N/A           |
| Porteiro | porteiro1@seed.com | 11111111101 | N/A           |
| Porteiro | porteiro2@seed.com | 11111111102 | N/A           |

---
