## Description
Api restful com foco na criação e acompanhamento do fluxo de documentação obrigatória de colaboradores. Cada colaborador será vinculado a tipos de documentos específicos que são obrigatórios para envio.

## Project setup

### Instalar dependencias
```bash
$ yarn install
```

### Subir uma instância de banco local
```bash
$ docker-compose up
```

### Executar a migração do banco
```bash
$ yarn prisma migrate dev
```

## Compilar e rodar o projeto

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Executar os testes

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## tecnologias usadas
- NestJs: 11.0.7

- NodeJs: 22.9.0

- Yarn: 1.22.22

- Npm: 11.4.2