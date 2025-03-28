FROM node:20-slim

WORKDIR /app

# Installer les dépendances de l'application
COPY package*.json ./

RUN npm install --legacy-peer-deps


# Copier tous les fichiers du projet
COPY . .

# Créer un build statique pour l'application (supposons que c'est un projet React par exemple)
RUN npm run build

# Utilisation de l'ARG pour définir la variable d'environnement pour DATABASE_URL
ARG POSTGRES_HOST=""
ARG POSTGRES_PORT=""
ARG POSTGRES_DB=""
ARG POSTGRES_USER=""
ARG POSTGRES_PASSWORD=""
ARG JWT_SECRET=""
ARG JWT_EXPIRES=""
ARG CORS_ORIGIN=""
ENV POSTGRES_HOST=${POSTGRES_HOST}
ENV POSTGRES_PORT=${POSTGRES_PORT}
ENV POSTGRES_DB=${POSTGRES_DB}
ENV POSTGRES_USER=${POSTGRES_USER}
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
ENV JWT_SECRET=${JWT_SECRET}
ENV JWT_EXPIRES=${JWT_EXPIRES}
ENV CORS_ORIGIN=${CORS_ORIGIN}
ENV PORT=9094

# Création du dossier des uploads pour éviter les erreurs si le volume n’est pas encore monté
RUN mkdir -p /app/public/uploads && chmod -R 777 /app/public/uploads

# Exposer le port que nous utiliserons pour le serveur 'serve'
EXPOSE 9094

# Utilisation de 'npm run start:prod' pour démarrer l'application
CMD ["npm", "run", "start:prod"]