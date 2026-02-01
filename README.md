# 🧪 Sistema de Laboratório - React + Node.js + MySQL

Este projeto é um sistema completo de laboratório, onde é possível:

* Cadastrar pacientes
* Cadastrar exames
* Visualizar logs de exames e pacientes por data (somente administrador)
* Criar atendimentos selecionando pacientes e os exames relacionados
* Visualizar o valor total do atendimento e realizar o pagamento de diferentes formas
* Visualizar meu login e alterar nome e avatar
* Alterar email, senha e acesso de administrador de diversos usuários (somente administrador)
* Agendar consultas, editar consultas e visualizar consultas agendadas
* Dashboard do laboratório para visualizar:
  * Quantidade de consultas no dia
  * Exames cadastrados nos atendimentos do dia
  * Novos pacientes cadastrados no dia
  * Faturamento do dia
  * Listagem de novas consultas marcadas para o dia


---

## 🛠️ Tecnologias Utilizadas

### Backend:

* Node.js
* Express
* MySQL2
* Nodemon
* CORS

### Frontend:

* React.js
* Vite
* Axios
* React Router DOM
* React Icons
* React Toastify
* Bootstrap / React Bootstrap
* Flowbite React
* date-fns
* PrimeReact (InputMask)

---

## 📁 Estrutura do Projeto

### Backend (`/api`)

```
api/
├── controllers/
├── public/
│   └── uploads/
├── routes/
├── db.js
├── index.js
└── package.json
```

### Frontend (`/front`)

```
front/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── routes/
│   ├── utils/
│   ├── index.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
└── package.json
```

---

## 🔧 Como Rodar o Projeto

### Pré-requisitos

* Node.js instalado
* MySQL instalado e rodando

### 1. Clonar o repositório

```bash
git clone https://github.com/Patrick-Hoff/Project-laboratorio.git
cd project-laboratorio
```

### 2. Configurar o banco de dados

* Criar um banco de dados MySQL com o nome `lab`
* Executar o script SQL
* Atualizar as configurações de conexão no backend (em `api/db.js`):

```js
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sua_senha',
  database: 'laboratorio'
});
```

### 3. Rodar o Backend

```bash
cd api
npm install
nodemon index.js
```

Servidor rodando em: `http://localhost:8081`

### 4. Rodar o Frontend

```bash
cd front
npm install
npm run dev
```

Frontend rodando em: `http://localhost:5173`

---


## 📌 Funcionalidades

### Pacientes

* Cadastro de novos pacientes
* Listagem e busca por nome ou ID

### Exames

* Cadastro de novos exames
* Listagem com filtros

### Atendimentos

* Seleção de um paciente existente
* Adição de múltiplos exames ao atendimento
* Armazenamento da relação paciente + exames
* Baixa de pagamento diretamente pelo atendimento (controle financeiro)

### Agendamentos

* Criar novos agendamentos de consultas
* Editar consultas agendadas
* Visualizar lista de consultas agendadas
* Página dedicada para visualização de todos os agendamentos
* Exclusão de agendamentos (em desenvolvimento)

### Administrador

* Cadastrar novos usuários
* Alterar informações de usuários
* Visualizar log de paciente e exame, incluindo adicionar, atualizar e deletar


---

## 📬 API Endpoints

### Pacientes

```
GET    /pacientes              -> Listar todos os pacientes
POST   /pacientes              -> Criar paciente
PUT    /pacientes/:id/edit     -> Atualizar paciente
DELETE /pacientes/:id/remove  -> Remover paciente
```

### Exames

```
GET    /exames                 -> Listar todos os exames
POST   /exames                 -> Criar exame
PUT    /exames/:id/edit        -> Atualizar exame
DELETE /exames/:id/remove     -> Remover exame
```

### Atendimentos

```
GET    /atendimentos                   -> Listar todos os atendimentos
POST   /atendimentos/add              -> Criar atendimento
PUT    /atendimentos/:id/edit         -> Atualizar atendimento
DELETE /atendimentos/:id/remove      -> Remover atendimento
```

### Exames por Atendimento

```
GET    /exames-atendimento/:id       -> Buscar exames de um atendimento específico
POST   /exames-atendimento/add       -> Adicionar exame ao atendimento
PUT    /exames-atendimento/:id       -> Atualizar exame do atendimento
DELETE /exames-atendimento/:id       -> Remover exame do atendimento
```

### Pagamento no atendimento

```
POST  /pagamentos/realizar_pagamento/atendimentoid=?/:id
-> Realizar pagamento
GET   /pagamentos/info_pagamentos/:id
-> Informações de pagamento realizado no atendimento
```

### Usuários

```
POST   /auth/register                -> Cadastrar novo usuário
POST   /auth/login                   -> Realizar login
GET    /auth/user                    -> Obter dados do usuário logado
PUT    /usuarios/:id/edit            -> Atualizar dados do usuário
GET    /usuarios/search              -> Buscar usuários com filtros (id, nome, email)
POST   /auth/logout                  -> Logout do sistema
POST   /usuarios/upload              -> Enviar/atualizar imagem de perfil
```

### Agendamento

```
GET    /agendamento                  -> Buscar agendamentos
POST   /agendamento                  -> Agendar consulta
PUT    /agendamento/:id              -> Alterar consulta
DELETE /agendamento/:id              -> Remover da agenda
```

### Dashboard

```
GET    /dashboard                    -> Dashboard do relatorio diário
```

---

## 📸 Telas do Sistema (Frontend)

* Dashboard com informações da agenda do dia
* Tela de listagem de atendimentos
* Tela de cadastro de pacientes
* Tela de cadastro de exames
* Tela de criação de atendimento
* Tela de log de exames e pacientes (admin)
* Tela do meu usuário
* Tela de todos usuários (admin)

---

## ✅ To-Do Futuro

* ✅ Autenticação de usuário (Login)
* Exportar resultados de exames em PDF
* ✅ Dashboard de relatórios
* Validações adicionais e melhorias UX/UI

---

## 👨‍💻 Desenvolvedor


| [<img src="https://avatars.githubusercontent.com/u/139597982?s=400&u=dec4b8ef35f778a0444c4b55043b7652dfb2606b&v=4" width=115><br><sub>Patrick Hoffmann Campos</sub>](https://github.com/Patrick-Hoff/)

---

## 📝 Licença

Este projeto está sob a licença MIT.
