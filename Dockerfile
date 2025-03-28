# Utilisation d'une image officielle de Node.js
FROM node:18-alpine

# Définition du répertoire de travail
WORKDIR /app

# Déclaration des arguments pour le build
ARG POSTGRES_HOST
ARG POSTGRES_PORT
ARG POSTGRES_USER
ARG POSTGRES_PASSWORD
ARG POSTGRES_DB
ARG PORT
ARG JWT_SECRET
ARG JWT_EXPIRES
ARG CORS_ORIGIN

# Définition des variables d’environnement dans le conteneur
ENV POSTGRES_HOST=${POSTGRES_HOST}
ENV POSTGRES_PORT=${POSTGRES_PORT}
ENV POSTGRES_USER=${POSTGRES_USER}
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
ENV POSTGRES_DB=${POSTGRES_DB}
ENV PORT=${PORT}
ENV JWT_SECRET=${JWT_SECRET}
ENV JWT_EXPIRES=${JWT_EXPIRES}
ENV CORS_ORIGIN=${CORS_ORIGIN}

# Copie uniquement les fichiers nécessaires pour installer les dépendances
COPY package*.json ./

# Installation des dépendances en mode production
RUN npm install --legacy-peer-deps --omit=dev

# Copie du reste du projet
COPY . .

# Création du dossier des uploads pour éviter les erreurs si le volume n’est pas encore monté
RUN mkdir -p /app/public/uploads && chmod -R 777 /app/public/uploads

# Exposition du port (configurable via les variables d’environnement)
EXPOSE ${PORT}

# Lancement de l'application
CMD ["npm", "run", "start"]
