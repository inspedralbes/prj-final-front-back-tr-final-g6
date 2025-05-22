# Documentació del Backend

## Índex

- [Estructura del Backend](#estructura-del-backend)
- [Descripció de Serveis](#descripció-de-serveis)
- [Variables d'Entorn](#variables-dentorn)
- [Ús amb Docker i Docker Compose](#ús-amb-docker-i-docker-compose)
- [Flux de Dades](#flux-de-dades)
- [Endpoints Principals](#endpoints-principals)
- [Altres Informacions](#altres-informacions)

---

## Estructura del Backend

```
back/
│
├── principal/           # Backend principal (API Node.js)
│   ├── .env, .env.*     # Fitxers de variables d'entorn
│   ├── index.js         # Punt d'entrada principal
│   ├── sensor/
│   │   ├── config.json
│   │   └── images/
│   └── package.json
│
├── services/
│   ├── DBinsert/        # Servei d'inserció a MongoDB
│   ├── python/          # Servei Python
│   └── sensor/          # Simulador de sensors
│
├── develop.Dockerfile
├── prod.Dockerfile
└── ...
```

---

## Descripció de Serveis

- **prfg6-back:** API principal (Node.js/Express) que gestiona autenticació, CRUD, inserció i consulta de dades a MySQL/MongoDB, Websockets, etc.
- **prfg6-sensor:** Simulador de sensors que envia dades a través de RabbitMQ.
- **prfg6-dbinsert:** Servei que insereix dades a MongoDB.
- **prfg6-python:** Servei Python per tractament de dades.
- **prfg6-mysql:** Base de dades MySQL.
- **prfg6-mongodb:** Base de dades MongoDB.
- **mongo-express:** GUI per MongoDB.
- **adminer:** GUI per MySQL.
- **rabbitmq:** Broker de missatgeria.

---

## Variables d'Entorn

Exemple de `.env`:

```
MONGO_URI=mongodb://root:example@prfg6-mongodb:27017/
MONGO_DB=projecte_final
MYSQL_HOST=prfg6-mysql
MYSQL_DATABASE=prf-g6
MYSQL_USER=root
MYSQL_PASSWORD=root
PORT=3020
NODE_ENV=development
```

---

## Ús amb Docker i Docker Compose

### Arrencada

```bash
docker compose up --build
```

Tenir en compte que si algun contenidor no funciona correctamenr en aixecar-los tots de cop, cal reiniciar-lo. 

### Ports per defecte

- Backend: `3020`
- Frontend: `3000`
- MySQL: `3306`
- MongoDB: `27017`
- Mongo Express: `8081`
- Adminer: `8080`
- RabbitMQ: `5672` (API), `15672` (GUI)

### Accés als serveis

- Backend: [http://localhost:3020](http://localhost:3020)
- Adminer: [http://localhost:8080](http://localhost:8080)
- Mongo Express: [http://localhost:8081](http://localhost:8081)
- RabbitMQ: [http://localhost:15672](http://localhost:15672)

---

## Flux de Dades

1. Els sensors (simulats) generen dades i les envien via RabbitMQ.
2. RabbitMQ les posa en cua i les envia al servei DBinsert que s'encarrega (via API) d'inserir-les a MongoDB
3. El servei de Python executa scripts periòdicament (cada minut, hora, etc...) que calculen agregacions i les envia a l'API.
4. L'API insereix les dades a MySql.
3. El frontend consulta dades via API REST o rep dades en temps real via Websockets.

---

## Endpoints Principals

- `/api/login`: Autenticació d'usuaris
- `/api/aules`: CRUD d'aules
- `/api/sensors`: CRUD de sensors
- `/api/data/mongodb`: Inserció/consulta de dades a MongoDB
- `/api/data/mysql`: Inserció de dades agregades a MySQL
- `/api/sensor/config`: Consulta i modificació de la configuració de sensors
- `/api/sensor/images`: Upload d’imatges de sensors
- `/api/stats/medias`: Estadístiques globals (mitjanes)
- `/api/grafics/all`: Dades agregades per gràfics

L'arxiu /doc/endpoints/api-endpoints.json en conté una descripció més extesa.

---

## Altres Informacions

- **Websockets:** S'utilitza Socket.IO per enviar dades en temps real.
- **RabbitMQ:** Per desacoblar l'enviament de dades dels sensors i la seva inserció a la base de dades.
- **Mongo Express/Adminer:** Permeten consultar i administrar les bases de dades des del navegador.
- **Imatges de sensors:** Es poden pujar i consultar via API, i es guarden a `back/principal/sensor/images`.

---