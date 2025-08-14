# Projeto fullstack - Kirvano

Este projeto é uma aplicação web completa (full-stack) que permite aos usuários registrar-se, fazer login e gerenciar seus perfis. A funcionalidade principal é a capacidade de adicionar e visualizar Pokémon favoritos. A aplicação é composta por um frontend em React (Vite), um backend em Express.js e um banco de dados MySQL, todos orquestrados com Docker Compose.

## Tecnologias Utilizadas

- **Backend**: Node.js, Express.js, TypeScript, MySQL2, bcrypt, jsonwebtoken
- **Frontend**: Vite (com React)
- **Banco de Dados**: MySQL 8.0
- **Containerização**: Docker e Docker Compose

## Backend

O backend é construído usando uma arquitetura em camadas, separando as responsabilidades em controladores, serviços e modelos.

- **Node.js:** Ambiente de execução para o JavaScript no servidor.
- **Express:** Framework web para a construção da API RESTful.    
- **TypeScript:** Superset do JavaScript que adiciona tipagem estática ao código.
- **MySQL:** Banco de dados relacional utilizado para armazenar os dados da aplicação.
- **Docker:** A aplicação utiliza o Docker para criar um ambiente de desenvolvimento com contêiners.

### Estrutura de Diretórios

```
src/
├── controllers/      # Controladores da API
├── services/         # Lógica de negócio
├── database/         # Repositórios
│   ├── Models/       # Conexão com BD e persistências 
│   └── config/       # Configuração do banco
├── middlewares/      # Middlewares do Express
├── utils/            # Utilitários
├── types/            # Tipos e intefaces
├── routers/          # Rotas da API
```

### Endpoints da API

A API fornece endpoints para o registro de usuários, login, profile, adicionar favoritos e buscar favoritos.

- `GET /favorites`: Lista todos os personagens favoritos.
    
- `POST /users/register`: Cria um novo usuário.
    
- `GET /users/profile`: Busca os profiles.
    
- `POST /favorites`: Adiciona personagem favorito à lista de favoritos.

- `POST /login`: Faz o login na api.

## Frontend

O frontend é uma aplicação React moderna que utiliza o contextAPI para o gerenciamento do estado e o React Router para a navegação.

### Tecnologias

- **React:** Biblioteca para a construção de interfaces de usuário.
    
- **Vite:** Ferramenta de build para o desenvolvimento frontend.
    
- **Context API:** Biblioteca para o gerenciamento do estado da aplicação.
    
- **React Router:** Biblioteca para o gerenciamento de rotas na aplicação.

### Estrutura de Diretórios

```
frontend/
├── src/
│   ├── auth/           # Micro frontend de autenticação
│   │   ├── components/ # Componentes
│   │   ├── context/    # Context Api
│   │   └── services/   # Conexão backend
│   ├── external-api/   # Micro frontend da Api externa 
│   │   ├── components/ # Componentes
│   │   └── services/   # Conexão Api externa
│   ├── App.css         # CSS da aplicação
│   ├── App.jsx         # App principal
```

## Como Executar

### Pré-requisitos

- Node.js (versão 18 ou superior)
    
- Docker
    
- Git

1. **Clone o repositório:**
    
  Bash
  ```
  git clone git@github.com:devfelipesantiago/Serasa-test-fullstack.git
  ```

3. **Crie o arquivo de variáveis de ambiente:**
    
    - Renomeie o arquivo `.env.example` para `.env` e preencha com as suas credenciais do banco de dados.
        
4. **Inicie o contêiner do Docker:**
    
    Bash
    
    ```
    docker-compose up -d
    ```
### Acesse a Aplicação:

Frontend: Acesse `http://localhost:3000` em seu navegador.

Backend: A API está rodando em `http://localhost:3001`.


### **Justificativas de Arquitetura e Tecnologia**

- **Arquitetura com Docker Compose**: O uso do Docker Compose simplifica o ambiente de desenvolvimento. Ele permite que todos os serviços (frontend, backend e banco de dados) sejam iniciados com um único comando, garantindo que eles operem em ambientes isolados e consistentes, evitando conflitos de dependências ou portas.

- **Separar Frontend e Backend**: A separação das camadas em serviços distintos (front-end e back-end) facilita a escalabilidade, manutenção e o desenvolvimento por diferentes equipes. O frontend se concentra na interface do usuário, enquanto o backend lida com a lógica de negócios e o acesso ao banco de dados.

- **Backend (Nodejs/Express com TypeScript)**:
    
    - **Node.js**: É ideal para aplicações de I/O-heavy (como APIs web), pois seu modelo assíncrono e baseado em eventos é muito eficiente.
      
    - **Express.js**: É um framework minimalista e flexível que acelera o desenvolvimento de APIs.
        
    - **TypeScript**: Adiciona tipagem estática ao JavaScript, o que ajuda a prevenir erros em tempo de compilação, tornando o código mais robusto e fácil de manter.
    - **OBS**: Eu poderia ter feito com Classes, interfaces, modolus, repositórios e deixado mais parecido com a arquitetura do **Nestjs**, mas pela simplicidade do projeto achei que dessa forma daria para desenvolver mais requisitos pelo tem que tinha.
        
- **Frontend (Vite)**: Vite é uma ferramenta de construção de frontend moderna e rápida. Ele oferece um servidor de desenvolvimento instantâneo e "Hot Module Replacement" (HMR), o que melhora significativamente a experiência do desenvolvedor.
    
- **Autenticação (JWT)**: JSON Web Tokens são utilizados para autenticação sem estado (stateless). Isso é uma prática moderna e escalável, pois o servidor não precisa armazenar informações de sessão. A validação é feita através do token no cabeçalho de cada requisição.
    
- **Middleware de Autenticação**: A lógica de verificação de token foi centralizada em um middleware. Isso evita a duplicação de código em cada rota protegida, mantendo os controladores limpos e com foco em sua responsabilidade principal: lidar com a requisição e a resposta.
