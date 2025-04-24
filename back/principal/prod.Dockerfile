FROM node:23-bookworm-slim

# Estableix el directori de treball
WORKDIR /usr/src/app

# Copia tots els fitxers de l'aplicació
COPY . .

# Instal·la les dependències de Node.js
RUN npm install --no-bin-links

# Copia el fitxer .env
COPY .env.PROD .env




