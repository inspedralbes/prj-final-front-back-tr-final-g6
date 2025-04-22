FROM node:23-bookworm-slim

# Estableix el directori de treball
WORKDIR /usr/src/app

# Copia el fitxer requirements.txt dins del contenidor
#COPY requirements.txt ./

# Crea un entorn virtual i instal·la les dependències de Python
#RUN /usr/bin/python3 -m venv venv
#RUN ./venv/bin/pip install -r requirements.txt

# Instal·la nodemon globalment
RUN npm install -g nodemon

# Copia el codi de l'aplicació
#COPY back/ ./