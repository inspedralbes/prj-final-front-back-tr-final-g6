FROM node:23-bookworm-slim

# Estableix el directori de treball
WORKDIR /usr/src/app

# Actualitza el repositori de paquets i instal·la Python i virtualenv
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv

# Copia el fitxer requirements.txt dins del contenidor
COPY back/requirements.txt ./

# Crea un entorn virtual i instal·la les dependències de Python
RUN python3 -m venv venv
RUN ./venv/bin/pip install -r requirements.txt

# Instal·la nodemon globalment
RUN npm install -g nodemon

# Afegeix l'entorn virtual al PATH
ENV PATH="/usr/src/app/venv/bin:$PATH"

# Copia el codi de l'aplicació
COPY back/ ./