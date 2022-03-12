<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

video tutorial: https://www.youtube.com/watch?v=GHTA143_b-s

to runm docker in the background according the config in docker-compose.yml file:
docker compose up dev-db -d

we use prisma as the ORM
yarn add -D prisma (cli)
yarn add @prisma/client (client, here javascript)

to init prisma cli: 
npx prisma init (generating .env file and the prisma folder)

We declare the prisma modules in this folder
We update the DATABASE_URL env from the config set in the docker-compose.yml
in order to generate database from my prisma schema (to create migrations from the schema) and to apply them to the db we use:
npx prisma migrate dev

(in dev env this command will reset the db before applying the migration. We'll use another command in prod)
it generates the migration file in the migrations folder with the script which creates our db like create table

to generate the typescript types for the schema in the schema.prisma file:
npx prisma generate

and I can use them in the service for instance:
import { User, Bookmark } from '@prisma/client

to see our db:
npx prisma studio
we can add, filter, etc....

create our prisma module:
nest g module prisma
to create the service:
nest g service prisma --no-spec
we extend the service with PrismaClient to manipulate the DB through the client

In order to export a module globally we need to use the Global decorator
In order to use Pipe class validator we will need to install class-validator class-transformer. See https://docs.nestjs.com/pipes#class-validator
We will also need to tell nestjs to use the validationPipe globally by adding the app.useGlobalPipes(new ValidationPipe()) in the main.js
If I pass { whiteList: true } to the ValidationPipe constructor then i will restrict the input parameters to only the one defined in the class validator

argon2 is used to hashing the password (encrypt it)

TIP: after running migration, restart studio

it's common to create a few scripts in package.json to restart the docker db and anotherone to apply the migrations
restart:
"db:dev:rm": "docker compose rm dev-db -s -f -v",
"db:dev:up": "docker compose up -d",
to apply all the existing migrations:
"prisma:dev:deploy": "prisma migrate deploy",
to execute all these steps (sleep 1 second to make sure the db is running before applying the migrations)
"db:dev:restart": "yarn db:dev:rm && yarn db:dev:up && sleep 1 && yarn prisma:dev:deploy",

in order to not to hardcode the url of the db in the prisma service, we can use the config module supplied by nestjs:
yarn add @nestjs/config

for the jwt auth we need to install a few packages: see (https://docs.nestjs.com/security/authentication#authentication-requirements)
no need to install passport-local neither @types/passport-local
yarn add @nestjs/passport passport @nestjs/jwt passport-jwt
yarn add -D @types/passport-jwt
in signin and signup we return the access token which is actually our jwt token
the client will need to use this token every time it will nows uses api (Bearer). This process is called strategy. see https://docs.nestjs.com/security/authentication#implementing-passport-jwt
Now the strategy is defined and set as a provider in the auth module we can use the strategy as a guard for our routes. see https://docs.nestjs.com/guards

To useour custom decorator (see the user module) see doc: https://docs.nestjs.com/custom-decorators

For E2E testing, default library is supertest but in our case we will use pactumJS https://pactumjs.github.io/#/ to use the requests
Nest.js uses jest for test framework
yarn add -D pactum
First we will need to create our test DB for our e2e test so we don't have to delete our real db everytime we run the tests
The test module will actually compile the app module so we can use a test module on top of it
To run e2e tests:
yarn test:e2e

in order to manage several .env files the vest solution is to use the dotenv-cli package:
yarn add dotenv-cli
because nestjs knows only .env file. But for our e2e we need the code to access to our test-db database
and then in the package.json for the test related deploy script only:
"prisma:test:deploy": "dotenv -e .env.test -- prisma migrate deploy",
same for running the e2e test:
"test:e2e": "dotenv -e .env.test -- jest --watch --no-cache --config ./jest-e2e.json"
Because before running our e2e tests we need to first run then restart script, we can define a package.json hook for pre running a script.
The convention is to use the "pre" prefix following by yhe name of the related test we want to load:
"pretest:e2e": "yarn db:test:restart",
"test:e2e": "dotenv -e .env.test -- jest --watch --no-cache --config ./jest-e2e.json"
and then we just need to run yarnm test:e2e
make sure the docker is running by docker ps (we should see our two dbs)
and to access to the db-test prisma we will need to force the cmd line to use the correct .env.test:
npx dotenv -e .env.test -- prisma studio

in order to resolve src paths automatically:
in tsconfig:
"paths": {
      "@/*": ["src/*"]
    }
in jest-e2e.json:
"rootDir": ".",
"moduleNameMapper": {
    "^@/(.*)$": "<rootDir>/src/$1"
  },

stopped at 3:08:41