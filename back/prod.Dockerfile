FROM node:23-bookworm-slim

# Estableix el directori de treball
WORKDIR /usr/src/app

# Copia tots els fitxers de l'aplicació
COPY back/ .

# Instal·la les dependències de Node.js
RUN npm install --no-bin-links

# Instal·la les dependències de Python
RUN python3 -m venv venv && \
    ./venv/bin/pip install -r requirements.txt

# Copia el fitxer .env
COPY back/.env.PROD .env

# Defineix el comando per iniciar l'aplicació
CMD ["nodemon", "-L", "index.js"]




