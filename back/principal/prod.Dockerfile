FROM node:23-bookworm-slim

# Estableix el directori de treball
WORKDIR /usr/src/app

# Instal·lar Python i pip
RUN apt-get update && apt-get install -y python3 python3-venv python3-pip && rm -rf /var/lib/apt/lists/*

# Copia tots els fitxers de l'aplicació
COPY back/ .

# Instal·la les dependències de Node.js
RUN npm install --no-bin-links

# Instal·la les dependències de Python
RUN python3 -m venv venv && \
    ./venv/bin/pip install -r requirements.txt

# Copia el fitxer .env
COPY back/.env.PROD .env




