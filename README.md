## Configuration du Projet

Ouvrez l'interface de ligne de commande PostgreSQL et exécutez la commande suivante :
```
CREATE DATABASE exampledb;
```
(Remplacez 'nestjs' par le nom de base de données de votre choix et assurez-vous d'utiliser ce même nom dans votre fichier .env). Les tables seront générées automatiquement.

## Description
Creer un fichier .env et remplir les variables d'environnement.
```
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=exampledb
PORT=5000

JWT_SECRET=secret_key
JWT_EXPIRES=3d

CORS_ORIGINS=http://localhost:4001,http://localhost:4002

```

Application d'authentification NestJS incluant les fonctionnalités de connexion et d'inscription. Utilisez une base de données PostgreSQL connectée à NestJS. Pour gérer plus facilement la base de données, nous utilisons un outil d'Object-Relational Mapping (ORM) appelé TypeORM.

## Installation

```bash
$ npm install
```

## Exécution de l'application

```bash
# mode développement
$ npm run start

# mode surveillance
$ npm run start:dev

# mode production
$ npm run start:prod
```

## Test

```bash
# tests unitaires
$ yarn test

# tests end-to-end
$ yarn test:e2e

# couverture des tests
$ yarn test:cov
```

## Support

Nest est un projet open source sous licence MIT. Il peut croître grâce aux sponsors et au soutien des contributeurs exceptionnels. Si vous souhaitez les rejoindre, veuillez [lire plus ici](https://docs.nestjs.com/support).


## Utilisation
Création de nouveau module avec la commande suivante :

```bash
$ nest g module <module_name>
```
Création de nouvelle controller avec la commande suivante :

```bash
$ nest g controller <controller_name>
```

Création de nouvelle service avec la commande suivante :

```bash
$ nest g service <service_name>
```

Création du module, controller, service, entity et dto avec la commande suivante :

```bash
$ nest g resource <resource_name>
```
## Licence

Nest est sous licence [MIT](LICENSE).
# backend# template_NestJS_Postgresql_Swagger
# template_NestJS_Postgresql_Swagger
