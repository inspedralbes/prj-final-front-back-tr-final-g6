FROM node:23-bookworm-slim

# Estableix el directori de treball
WORKDIR /usr/src/app

# Actualitza el repositori de paquets i instal·la Python i pip
RUN apt-get update --fix-missing && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copia el fitxer requirements.txt dins del contenidor
#COPY requirements.txt ./

# Crea un entorn virtual i instal·la les dependències de Python
#RUN /usr/bin/python3 -m venv venv
#RUN ./venv/bin/pip install -r requirements.txt

# Instal·la nodemon globalment
RUN npm install -g nodemon

# Copia el codi de l'aplicació
#COPY back/ ./