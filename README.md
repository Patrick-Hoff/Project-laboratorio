# 🧪 Sistema de Laboratório - React + Node.js + MySQL

Este projeto é um sistema completo de laboratório, onde é possível:

* Cadastrar pacientes
* Cadastrar exames
* Criar atendimentos selecionando pacientes e os exames relacionados

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

---

## 📁 Estrutura do Projeto

### Backend (`/api`)

```
api/
├── controllers/
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
│   ├── routes
│   ├── App.jsx
│   ├── index.css
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
index.js nodemon
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
GET    /atendimentos/:id/exames      -> Listar exames de um atendimento
```

### Exames por Atendimento

```
GET    /exames-atendimento/:id       -> Buscar exames de um atendimento específico
POST   /exames-atendimento/add       -> Adicionar exame ao atendimento
PUT    /exames-atendimento/:id       -> Atualizar exame do atendimento
DELETE /exames-atendimento/:id       -> Remover exame do atendimento
```


---

## 📸 Telas do Sistema (Frontend)

* Home com navegação entre módulos
* Tela de cadastro de pacientes
* Tela de cadastro de exames
* Tela de criação de atendimento

---

## ✅ To-Do Futuro

* Autenticação de usuário (Login)
* Exportar resultados de exames em PDF
* Dashboard de relatórios
* Validações adicionais e melhorias UX/UI

---

## 👨‍💻 Desenvolvedor


| [<img src="https://avatars.githubusercontent.com/u/139597982?s=400&u=dec4b8ef35f778a0444c4b55043b7652dfb2606b&v=4" width=115><br><sub>Patrick Hoffmann Campos</sub>](https://github.com/Patrick-Hoff/)

---

## 📝 Licença

Este projeto está sob a licença MIT.
