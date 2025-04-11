# Backend NestJS

A backend service built with NestJS framework.

## Description

This project is a backend service built using NestJS, a progressive Node.js framework for building efficient and scalable server-side applications. It includes WebSocket support through Socket.io.

## Prerequisites

- Node.js (v14 or higher recommended)
- Yarn (v1.22 or higher recommended)

## Installation

### Clone the repository

```bash
$ git clone https://github.com/username/backend-nest.git
$ cd backend-nest
```

### Install dependencies

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# debug mode
$ yarn start:debug

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Features

- RESTful API endpoints using Express
- WebSocket communication using Socket.io
- NestJS architecture with modules, controllers, and services

## Tech Stack

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [Socket.io](https://socket.io/) - Real-time bidirectional event-based communication
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Jest](https://jestjs.io/) - Testing framework

## Project Structure

```
src/
  ├── controllers/      # Request handlers
  ├── services/         # Business logic
  ├── modules/          # Feature modules
  ├── gateways/         # WebSocket gateways
  ├── interfaces/       # TypeScript interfaces
  └── main.ts           # Application entry point
```

## License

This project is [UNLICENSED](LICENSE).