[![Build Status](https://travis-ci.com/memory-cloud/lambda.svg?branch=master)](https://travis-ci.com/memory-cloud/lambda)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=backend-memorycloud&metric=coverage)](https://sonarcloud.io/dashboard?id=backend-memorycloud)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=backend-memorycloud&metric=alert_status)](https://sonarcloud.io/dashboard?id=backend-memorycloud)
[![Maintainability](https://sonarcloud.io/api/project_badges/measure?project=backend-memorycloud&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=backend-memorycloud)
[![Reliability](https://sonarcloud.io/api/project_badges/measure?project=backend-memorycloud&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=backend-memorycloud)
[![Security](https://sonarcloud.io/api/project_badges/measure?project=backend-memorycloud&metric=security_rating)](https://sonarcloud.io/dashboard?id=backend-memorycloud)

[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=backend-memorycloud&metric=ncloc)](https://sonarcloud.io/dashboard?id=backend-memorycloud)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=backend-memorycloud&metric=code_smells)](https://sonarcloud.io/dashboard?id=backend-memorycloud)
[![Duplicated Lines](https://sonarcloud.io/api/project_badges/measure?project=backend-memorycloud&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=backend-memorycloud)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=backend-memorycloud&metric=bugs)](https://sonarcloud.io/dashboard?id=backend-memorycloud)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=backend-memorycloud&metric=sqale_index)](https://sonarcloud.io/dashboard?id=backend-memorycloud)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=backend-memorycloud&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=backend-memorycloud)

[![StackShare](https://img.shields.io/badge/tech-stack-0690fa.svg?style=flat)](https://stackshare.io/rafaelnsantos/backendmemorycloud)

# Memory Cloud

Backend platform for games

## Features

- [x] Facebook login
- [x] Save and load player's state(integers, floats, booleans, strings and JSON objects)
- [x] Float and integer Global and Friends leaderboard
- [x] Float and integer Global and Friends position on leaderboard
- [x] Admin dashboard
- [x] Achievements

## Running

Rename .env.example to .env

Set enviroment settings in .env

```
npm install

npm run dev
```

MySQL, Redis and MongoDB are required.

Can be started with:
```
docker-compose up -d
```

## Running tests

The tests need 2 test users from Facebook.

Go to Facebook Developers > My App > Roles > Test Users to create them.

### Locally

Rename .env.test.example to .env.test

Set mysql and Facebook App settings and in .env.test

```
npm run local-test
```

### Travis

Create environment variables TEST_APPID and TEST_APPSECRET


