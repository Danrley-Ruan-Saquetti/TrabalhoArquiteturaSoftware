# LiphBank API

Este é o projeto BackEnd do sistema LiphBank construído para fornecer uma API para comunicação entre as aplicações FrontEnd e BackEnd.

## Sumário

- [LiphBank API](#liphbank-api)
  - [Sumário](#sumário)
  - [Stack Utilizada](#stack-utilizada)
  - [Estrutura do Projeto](#estrutura-do-projeto)
  - [Instruções para Execução](#instruções-para-execução)
  - [Requisitos e Funcionalidades da Aplicação](#requisitos-e-funcionalidades-da-aplicação)
    - [Requisitos Funcionais](#requisitos-funcionais)
    - [Regras de Negócio](#regras-de-negócio)

<div align="right">

[Back To Top ⬆️](#liphbank-api)
</div>

## Stack Utilizada

- **Linguagem de Programação**: Javascript/Typescript, [NodeJS](https://nodejs.org/pt)
- **Frameworks**: [NestJS](https://nestjs.com/)
- **Banco de Dados**: [PostgreSQL](https://www.postgresql.org/), [Redis](https://redis.io/)
- **Ferramentas de Desenvolvimento**: [Docker](https://www.docker.com/), [Postman](https://www.postman.com/)
- **ORM's**: [Prisma](https://www.prisma.io/)

<div align="right">

[Back To Top ⬆️](#liphbank-api)
</div>

## Estrutura do Projeto

A estrutura do projeto foi pensada utilizando os conceitos de Arquitetura DDD (Domain-Driven Design), separando as preocupações em camadas e seguindo um desenvolvimento orientado ao Domínio, como proposto pelo DDD.

```ini
src/
├── application/ # Implementação dos casos de uso e DTO's, fazendo uso das abstrações definidas no domínio
│   ├── common/ # Componentes genéricos reutilizáveis
│   ├── dto/ # Objetos de Transferência de Dados que fornecem um contrato de entrada para os Casos de Uso
│   ├── exceptions/ # Exceções personalizadas utilizada na camada de aplicação
│   ├── jobs/ # Serviços que executam tarefas agendados que utilizam filas (queues) ou são executadas periodicamente (cron jobs)
│   │   ├── queues/ # Serviços que executam tarefas em filas
│   │   └── cron-tabs/ # Serviços de execução periódicas
│   ├── messages/ # Objetos que centralizam as mensagens referentes às entidades do domínio
│   ├── observer/ # Organiza os eventos (events) e os ouvintes (listeners) destes eventos
│   │   ├── events/ # Definição dos eventos
│   │   └── listeners/ # Listeners dos eventos
│   ├── services/ # Classes que encapsulam lógica específica e reutilizável para suporte aos casos de uso
│   ├── types/ # Definição das tipagens reutilizáveis dentro da camada de aplicação
│   └── use-case/ # Implementação dos casos de uso
├── domain/ # Define as abstrações e entidades da aplicação
│   ├── adapters/ # Abstrações de serviços que se comunicam com bibliotecas externos ou lógica específica
│   ├── entities/ # Representação das entidades da aplicação
│   ├── enums/ # Enumerações das entidades da aplicação
│   ├── repositories/ # Abstrações das classes de camada intermediária entre a aplicação e o banco de dados
│   ├── rules/ # Regras relacionadas às entidades que fornecem parâmetros como valores padrão e configurações específicas
│   └── templates/ # Textos de template customizado e parametrizável com base em variáveis dinâmicas
├── infrastructure/ # Implementação das abstrações definidas na camada de domínio
│   ├── adapters/ # Implementação das abstrações de adapters
│   ├── mappers/ # Classes de conversão das entidades para a sua representação do banco de dados (Model) e vice-versa
│   ├── models/ # Tipagens das entidades na sua representação do banco de dados
│   └── repositories/ # Implementação das abstrações dos repositórios
├── presentation/ # Camada de apresentação que controle o ciclo de vida das requisições (Entrada e Saída de dados da requisição)
│   ├── controllers/ # Controllers contendo as rotas da aplicação
│   ├── decorators/ # Param Decorators utilizadas nas rotas para extração de dados da requisição
│   ├── filters/ # Filtros globais de exceções
│   ├── guards/ # Middlewares de rotas que validam se a requisição pode ou não ser prosseguida
│   ├── interceptors/ # Interceptadores de requisição globais para trativa de resposta
│   ├── types/ # Definição das tipagens reutilizáveis dentro da camada de apresentação
│   └── util/ # Classes e funções utils reutilizados dentro da camada de apresentação
├── shared/ # Modulo contendo componentes que podem ser utilizados em qualquer camada
│   ├── dto/ # Definição de DTO's globais e reutilizáveis
│   ├── exceptions/ # Exceções personalizadas que provem a base de todas as outras exceções definidas na aplicação
│   ├── formatters/ # Formatadores globais
│   ├── utils/ # Funções úteis e genéricas
│   └── validators/ # Validadores globais
└── tests/ # Stack de testes da aplicação
    └── unit/ # Testes unitários automatizados
```

<div align="right">

[Back To Top ⬆️](#liphbank-api)
</div>

## Instruções para Execução

- Pré-requisitos:
  - Possuir a CLI do NestJS para rodar o projeto. Para instalá-lo, basta rodar o comando:
    ```bash
    npm i -g @nestjs/cli
    ```

Passo 1: Copiar o arquivo `.env.example` para `.env` (ou apenas renomeá-lo) e preencher cada variável conforme o que se pede

Passo 2: Ter o serviço do **Redis** e **PostgreSQL** rodando. Para usá-los nesta aplicação, é possível utiliza-los via Docker rodando o comando:

```bash
docker compose up -d
```

Passo 3: Instalação das dependências do projeto:

```bash
npm install
```

Passo 4: Realizar as migrações do Prisma para fazer o setup inicial do banco de dados:

```bash
npm run prisma:deploy
```

Passo 5: Execução do projeto:

```bash
npm run start:dev
```

> Alternativamente, é possível executar o script de **setup** do projeto utilizando o comando abaixo:
>
> ```bash
> npm run setup
> ```
> Este comando irá realizar todos os passos de scripts citados a cima, após isso, basta executar a aplicação seguindo o passo 5.

<div align="right">

[Back To Top ⬆️](#liphbank-api)
</div>

## Requisitos e Funcionalidades da Aplicação

### Requisitos Funcionais

- [X] O sistema deve manter usuários
- [X] O sistema deve manter contas bancárias
- [X] O sistema deve manter transações financeiras
- [X] O sistema deve permitir a conclusão das transações financeiras
- [X] O sistema deve permitir o cancelamento das transações financeiras
- [ ] O sistema deve permitir a reabertura das transações financeiras
- [ ] O sistema deve atualizar a situação das transações financeiras para Atrasado
- [ ] O sistema deve duplicar transações financeiras que estejam marcadas para repetir
- [X] O sistema deve manter o saldo da conta bancário
- [X] O sistema deve permitir a inativação da conta bancária
- [ ] O sistema deve permitir a reabertura da conta bancária
- [ ] O sistema deve enviar um email após a criação de uma nova conta de usuário
- [ ] O sistema deve enviar um email após a criação de uma nova conta bancária
- [ ] O sistema deve enviar um email após a criação de uma nova transação financeira
- [ ] O sistema deve enviar um email após a um novo acesso à conta do usuário
- [ ] O sistema deve enviar um email após a um novo acesso à conta bancária do usuário
- [ ] O sistema deve enviar um email após a inativação da conta bancária
- [ ] O sistema deve enviar um email após a reabertura da conta bancária

### Regras de Negócio

- [X] O cadastro de Usuário deve conter: nome, CPF/CNPJ, login, senha, gênero, data de nascimento, tipo de pessoa
- [X] O nome do Usuário deve conter entre 3 caracteres 2 45 caracteres
- [X] A senha do Usuário deve: ter entre 6 a 15 dígitos, possuir letras e números e conter letras maiúsculas e minúsculas
- [X] Os tipos de Pessoa são: Física e Jurídica
- [X] O cadastro de Conta Bancária deve conter: nome
- [X] O nome da Conta Bancária deve conter entre 3 caracteres 2 45 caracteres
- [X] O cadastro de Transação Financeira deve conter: a Conta Bancária, título, descrição, valor, tipo, remetente/destinatário, data de expiração e data de competência
- [X] Os tipos da Transação Financeira são: Renda e Despesa
- [X] As situações da Transação Financeira são: Pendente, Concluído, Atrasado e Cancelado
- [X] As situações da Transação Financeira consideradas como Fechada são: Concluído e Cancelado
- [X] Só é possível atualizar as seguintes informações da Transação Financeira: título, descrição, valor, remetente/destinatário, data de expiração e data de competência
- [X] Só é possível cadastrar Transações Financeiras em Contas Bancárias ativas
- [X] A situação inicial de toda Transação Financeira é Pendente. Caso a data de expiração seja posterior à data do cadastro, então a situação inicial será Atrasado
- [X] O Usuário pode atualizar a Transação Financeira apenas se a situação não estiver Fechada
- [X] O Usuário pode concluir a Transação Financeira apenas se a situação não estiver Fechada
- [X] O Usuário pode cancelar a Transação Financeira a qualquer momento
- [ ] Para reabrir uma Transação Financeira a sua situação deve estar Fechada
- [X] O saldo da Conta Bancária deve ser atualizado quando uma transação for Concluída ou Cancelada
- [X] Caso o tipo da transação seja Renda, após concluir a transação o valor deve ser somado ao saldo da Conta Bancária
- [X] Caso o tipo da transação seja Despesa, após concluir a transação o valor deve ser subtraído do saldo da Conta Bancária
- [X] Caso uma transação que esteja Concluída e que o tipo da transação seja Renda passe a ser Cancelada, o valor deve ser subtraído do saldo da Conta Bancária
- [X] Caso uma transação que esteja Concluída e que o tipo da transação seja Despesa passe a ser Cancelada, o valor deve ser somado ao saldo da Conta Bancária
- [ ] Quando a Conta Bancária estiver inativa, não deve ser possível dar manutenção nas Transações Financeiras