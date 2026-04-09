# 🐾 VetCare — Sistema de Gestão de Clínica Veterinária

**Aluno:** Gustavo Berg Ribeiro  
**Disciplina:** Desenvolvimento Web  
**Tecnologias:** React · Node.js · Express · MySQL · Axios

---

## 📋 Sobre o Projeto

O **VetCare** é um sistema web completo para gerenciamento de clínica veterinária. Permite cadastrar e gerenciar **Tutores**, **Animais** e **Consultas** com todas as operações CRUD (Create, Read, Update, Delete).

---

## 🗂️ Estrutura do Projeto

```
Código/
├── backend/
│   ├── config/
│   │   └── db.js                   # Conexão com o MySQL
│   ├── controllers/
│   │   ├── tutoresController.js    # Lógica CRUD de tutores
│   │   ├── animaisController.js    # Lógica CRUD de animais
│   │   └── consultasController.js  # Lógica CRUD de consultas
│   ├── routes/
│   │   └── index.js                # Todas as rotas RESTful
│   ├── server.js                   # Entrada do servidor Express
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/             # Layout, Sidebar, Toast
│   │   ├── pages/                  # Dashboard, Tutores, Animais, Consultas, Sobre
│   │   ├── services/
│   │   │   └── api.js              # Configuração do Axios
│   │   ├── App.js                  # Rotas do React
│   │   ├── index.js                # Entrada do React
│   │   └── index.css               # Estilos globais
│   └── package.json
└── banco.sql                       # Script SQL (criação + dados de exemplo)
```

---

## ⚙️ Como Rodar o Projeto

> ✅ **Pré-requisitos:** Node.js v18+, MySQL v8+

---

### 1️⃣ Banco de Dados

1. Abra o **MySQL Workbench** e conecte ao servidor local
2. Vá em **File → Open SQL Script**, selecione o arquivo `banco.sql`
3. Execute com `Ctrl+Shift+Enter` ou apertando em 
4. O banco `clinica_vet` será criado com as tabelas e dados de exemplo

---

### 2️⃣ Backend

Abra um terminal na pasta do projeto e execute:

```bash
cd backend
npm install
node server.js
```

> ⚠️ **Atenção:** Antes de rodar, abra `backend/config/db.js` e coloque a senha do seu MySQL:
> ```js
> password: 'gustavo1234567890',
> ```

✅ Quando funcionar, aparecerá no terminal:
```
🚀 Servidor rodando em http://localhost:3001
✅ Conectado ao MySQL com sucesso!
```

**Deixe esse terminal aberto!**

---

### 3️⃣ Frontend

Abra **outro terminal** na pasta do projeto e execute:

```bash
cd frontend
npm install
npm start
```

✅ O sistema abrirá automaticamente em: **http://localhost:3000**

---

## 🔌 Endpoints da API

Base URL: `http://localhost:3001/api`

### 👤 Tutores
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/tutores` | Listar todos (paginação + busca) |
| GET | `/tutores/:id` | Buscar por ID |
| GET | `/tutores/:id/animais` | Listar animais do tutor |
| POST | `/tutores` | Criar novo tutor |
| PUT | `/tutores/:id` | Atualizar tutor |
| DELETE | `/tutores/:id` | Remover tutor |

### 🐾 Animais
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/animais` | Listar todos (paginação + busca) |
| GET | `/animais/:id` | Buscar por ID |
| POST | `/animais` | Criar novo animal |
| PUT | `/animais/:id` | Atualizar animal |
| DELETE | `/animais/:id` | Remover animal |

### 📋 Consultas
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/consultas` | Listar todas (paginação + busca) |
| GET | `/consultas/:id` | Buscar por ID |
| POST | `/consultas` | Criar nova consulta |
| PUT | `/consultas/:id` | Atualizar consulta |
| DELETE | `/consultas/:id` | Remover consulta |

---

## 🗄️ Banco de Dados

### Tabela `tutores`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT PK AUTO_INCREMENT | Identificador único |
| nome | VARCHAR(150) | Nome completo |
| cpf | VARCHAR(14) UNIQUE | CPF (formato: 000.000.000-00) |
| telefone | VARCHAR(20) | Telefone de contato |
| email | VARCHAR(150) | E-mail |
| endereco | VARCHAR(255) | Endereço completo |

### Tabela `animais`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT PK AUTO_INCREMENT | Identificador único |
| nome | VARCHAR(100) | Nome do animal |
| especie | VARCHAR(50) | Espécie (Cachorro, Gato, etc.) |
| raca | VARCHAR(100) | Raça |
| data_nascimento | DATE | Data de nascimento |
| peso | DECIMAL(5,2) | Peso em kg |
| tutor_id | FK → tutores | Tutor responsável |
| observacoes | TEXT | Observações gerais |

### Tabela `consultas`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT PK AUTO_INCREMENT | Identificador único |
| animal_id | FK → animais | Animal da consulta |
| data_consulta | DATE | Data da consulta |
| hora_consulta | TIME | Horário da consulta |
| motivo | VARCHAR(255) | Motivo da consulta |
| diagnostico | TEXT | Diagnóstico do veterinário |
| tratamento | TEXT | Tratamento prescrito |
| valor | DECIMAL(10,2) | Valor cobrado |
| status | ENUM | agendada / realizada / cancelada |

---

## ✅ Funcionalidades Implementadas

- [x] CRUD completo de Tutores, Animais e Consultas
- [x] Paginação em todas as listagens
- [x] Busca/filtro em tempo real
- [x] Tela de detalhes para cada entidade
- [x] Validações no backend (CPF, e-mail, campos obrigatórios)
- [x] Tratamento de erros com notificações visuais (toast)
- [x] Dashboard com estatísticas gerais
- [x] Nome do aluno visível no sistema (sidebar, banner e página Sobre)
- [x] Comunicação frontend/backend via Axios
- [x] CORS configurado no backend

---

**Desenvolvido por Gustavo Berg Ribeiro**
