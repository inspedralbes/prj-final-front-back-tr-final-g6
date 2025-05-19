
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

L'arxiu /endpoints/api-endpoints.json en conté una descripció més extesa.

---

## Altres Informacions

- **Websockets:** S'utilitza Socket.IO per enviar dades en temps real.
- **RabbitMQ:** Per desacoblar l'enviament de dades dels sensors i la seva inserció a la base de dades.
- **Mongo Express/Adminer:** Permeten consultar i administrar les bases de dades des del navegador.
- **Imatges de sensors:** Es poden pujar i consultar via API, i es guarden a `back/principal/sensor/images`.

---


<br>

# Documentació del Frontend

## Tecnologies Principals

### 1. Nuxt.js (v3.15.2)
- Framework basat en Vue.js per crear aplicacions web modernes
- Proporciona renderització del costat del servidor (SSR)
- Sistema d'enrutament automàtic
- Gestió d'estat integrada

### 2. Vue.js (Latest)
- Framework progressiu per construir interfícies d'usuari
- Sistema de components reactius
- Virtual DOM per renderització eficient

### 3. Biblioteques i Dependències Principals

#### PrimeVue (v3.53.1)
- Biblioteca de components UI rica en característiques
- Temes personalitzables
- Components utilitzats:
    - Formularis
    - Botons
    - Panells
    - Components de navegació

#### Chart.js (v4.4.7) i Vue-Chartjs (v5.3.2)
- Implementació de gràfics i visualitzacions de dades
- Gràfics utilitzats:
    - Gràfics de temperatura
    - Gràfics d'humitat
    - Gràfics de volum

#### Konva (v9.3.18)
- Biblioteca per gràfics i manipulació de canvas
- Utilitzada per crear mapes interactius de les plantes

#### Tailwind CSS (v3.4.17)
- Framework de CSS utilitari
- Disseny responsive
- Personalització d'estils

## Estructura de Components

### Components Principals

#### 1. LoginForm.vue (`/nuxt/components/LoginForm.vue`)
- Gestió d'autenticació d'usuaris
- Validació de formularis
- Integració amb backend per autenticació

#### 2. AdminPanel.vue (`/nuxt/components/AdminPanel.vue`)
- Panell d'administració
- Gestió d'usuaris i permisos
- Configuració del sistema

#### 3. CreatePanel.vue (`/nuxt/components/CreatePanel.vue`)
- Creació de nous elements
- Formularis d'entrada de dades
- Validació de dades

#### 4. AulaCard.vue (`/nuxt/components/AulaCard.vue`)
- Visualització d'informació d'aules
- Dades en temps real
- Enllaços a detalls específics

#### 5. InfoCard.vue (`/nuxt/components/InfoCard.vue`)
- Targetes informatives generals
- Visualització d'estadístiques
- Dades resumides

#### 6. ConfigurarSensors.vue (`/nuxt/components/ConfigurarSensors.vue`)
- Configuració de sensors
- Gestió de paràmetres
- Control de dispositius

#### 7. ComponentMapa.vue (`/nuxt/components/ComponentMapa.vue`)
- Component base per visualització de mapes
- Integració amb Konva
- Gestió d'events interactius

### Components de Gràfics

#### Charts.vue (`/nuxt/components/Charts.vue`)
- Component contenidor principal per gràfics
- Gestió de dades en temps real
- Actualització dinàmica

#### Components de Temperatura (`/nuxt/components/charts/temperatura/`)
- TemperatureActual.vue: Mostra temperatura actual
- TemperatureChart.vue: Gràfic general de temperatura
- TemperatureCourseChart.vue: Gràfic de curs
- TemperatureDayChart.vue: Gràfic diari
- TemperatureHourChart.vue: Gràfic per hora
- TemperatureMinuteChart.vue: Gràfic per minut
- TemperatureMonthChart.vue: Gràfic mensual
- TemperatureWeekChart.vue: Gràfic setmanal

#### Components d'Humitat (`/nuxt/components/charts/humitat/`)
- HumitatActual.vue: Mostra humitat actual
- HumitatChart.vue: Gràfic general d'humitat
- HumitatCourseChart.vue: Gràfic de curs
- HumitatDayChart.vue: Gràfic diari
- HumitatHourChart.vue: Gràfic per hora
- HumitatMinuteChart.vue: Gràfic per minut
- HumitatMonthChart.vue: Gràfic mensual
- HumitatWeekChart.vue: Gràfic setmanal

#### Components de Volum (`/nuxt/components/charts/volume/`)
- VolumeActual.vue: Mostra volum actual
- VolumeChart.vue: Gràfic general de volum
- VolumeCourseChart.vue: Gràfic de curs
- VolumeDayChart.vue: Gràfic diari
- VolumeHourChart.vue: Gràfic per hora
- VolumeMinuteChart.vue: Gràfic per minut
- VolumeMonthChart.vue: Gràfic mensual
- VolumeWeekChart.vue: Gràfic setmanal

### Components de Mapes

#### Mapes de Plantes (`/nuxt/components/Plantes/`)
- MapaPlanta-1.vue: Planta -1
- MapaPlanta-2.vue: Planta -2
- MapaPlanta-3.vue: Planta -3
- MapaPlantaBaixa.vue: Planta baixa
- MapaPlantaSubterranea.vue: Planta subterrània

## Pàgines (`/nuxt/pages/`)

### 1. index.vue
- Pàgina principal
- Dashboard general
- Resum d'estadístiques

### 2. login.vue
- Pàgina d'inici de sessió
- Autenticació d'usuaris
- Redirecció segons rol

### 3. admin.vue
- Panell d'administració
- Gestió del sistema
- Configuracions avançades

### 4. aulas/[id].vue
- Vista detallada d'aules individuals
- Dades específiques de sensors
- Gràfics històrics

### 5. create.vue
- Creació de nous elements
- Formularis de configuració
- Validació de dades

### 6. mapas.vue
- Visualització de mapes
- Navegació entre plantes
- Informació en temps real

### 7. ranking.vue
- Classificació d'aules
- Estadístiques comparatives
- Mètriques de rendiment

### 8. sensors.vue
- Gestió de sensors
- Configuració de dispositius
- Monitorització d'estat

## Funcionalitats Principals

### 1. Sistema d'Autenticació
- Login/Logout
- Gestió de sessions
- Rols i permisos

### 2. Monitorització en Temps Real
- Actualització automàtica de dades
- Gràfics dinàmics
- Alertes i notificacions

### 3. Gestió de Dades
- CRUD d'elements
- Validació de formularis
- Integració amb API backend

### 4. Visualització de Dades
- Gràfics interactius
- Mapes de plantes
- Dashboards informatius

## Estils i Disseny

### 1. Tailwind CSS
- Sistema de grid responsive
- Utilitats de disseny
- Temes personalitzats

### 2. PrimeVue Theming
- Temes predefinits
- Personalització de components
- Consistència visual

## Optimització i Rendiment

### 1. Lazy Loading
- Càrrega diferida de components
- Optimització d'imatges
- Millora de temps de càrrega

### 2. Caching
- Emmagatzematge en caché de dades
- Millora de rendiment
- Reducció de crides al servidor

## Integració amb Backend

### 1. API Endpoints
- Comunicació amb serveis backend
- Gestió d'errors
- Maneig de respostes

### 2. Websockets
- Actualització en temps real
- Comunicació bidireccional
- Maneig d'events

## Manteniment i Desenvolupament

### 1. Scripts Disponibles
- `npm run dev`: Desenvolupament local
- `npm run build`: Construcció per producció
- `npm run generate`: Generació estàtica
- `npm run preview`: Vista prèvia de producció

### 2. Dependències
- Gestió amb npm/yarn
- Actualitzacions periòdiques
- Control de versions

<br>

# Producció

## Desplegament a Producció

El desplegament a producció del projecte està automatitzat mitjançant **GitHub Actions** i la infraestructura es gestiona amb **Docker Compose**.

### Automatització amb GitHub Actions

El workflow de GitHub Actions es troba a `.github/workflows/deploy-production.yaml` i s'activa automàticament quan es fa un `push` a la branca `prod`. El procés és el següent:

1. **Connexió al servidor:**  
   El workflow utilitza SSH per connectar-se al servidor de producció fent servir les credencials emmagatzemades com a secrets de GitHub.

2. **Actualització del codi:**  
   - Accedeix al directori del projecte al servidor.
   - Fa `git pull` per obtenir l'última versió del codi.

3. **Configuració d'arxius d'entorn:**  
   - Copia els arxius `.env.PROD` a `.env` per cada servei necessari (backend, frontend, DBinsert, sensor).
   - Afegeix variables d'entorn sensibles (usuari i contrasenya de MySQL, URI de MongoDB, etc.) a partir dels secrets de GitHub.
   - Genera l'arxiu `.env.PROD.DOCKER` amb les variables necessàries per als serveis Docker.

4. **Arrencada de Docker:**  
   - S'assegura que Docker està en execució.
   - Executa `docker compose -f compose.prod.yaml up -d --build` per construir i aixecar tots els serveis definits.

5. **Verificació:**  
   - Llista els contenidors actius per comprovar que tot s'ha aixecat correctament.

### Orquestració amb Docker Compose

El fitxer `compose.prod.yaml` defineix tota la infraestructura de producció. Cada servei del projecte (frontend, backend, bases de dades, serveis de sensors, etc.) s'executa en un contenidor independent.

#### Serveis Principals

- **prfg6-front:** Frontend Nuxt.js, exposat al port 3000.
- **prfg6-back:** Backend Node.js/Express, exposat al port 3020.
- **prfg6-mysql:** Base de dades MySQL, port 3306.
- **prfg6-mongodb:** Base de dades MongoDB, port 27017.
- **prfg6-sensor:** Simulador de sensors.
- **prfg6-dbinsert:** Servei d'inserció de dades a MongoDB.
- **prfg6-python:** Servei Python per tractament de dades, port 5000.
- **rabbitmq:** Broker de missatgeria, ports 5672 (API) i 15672 (GUI).
- **adminer:** GUI per MySQL, port 8080.
- **mongo-express:** GUI per MongoDB, port 8081.
- **portainer:** Gestor de contenidors Docker, port 9000.

#### Volums

S'utilitzen volums Docker per persistir les dades de MySQL, MongoDB, RabbitMQ i Portainer.

#### Variables d'entorn

Els serveis utilitzen l'arxiu `.env.PROD.DOCKER` per carregar les variables d'entorn necessàries (usuaris, contrasenyes, URIs, etc.).

---

### Procés resumit de desplegament

1. **Push a la branca de producció** (`prod`).
2. **GitHub Actions** executa el workflow de desplegament.
3. **El servidor de producció** rep el codi actualitzat, configura els arxius `.env` i aixeca els serveis amb Docker Compose.
4. **Els serveis** queden disponibles als ports configurats i amb les dades persistides.

> **Nota:**  
> Per modificar el desplegament, cal editar el workflow de GitHub Actions o el fitxer `compose.prod.yaml` segons les necessitats del projecte.

> **Nota 2:**
> Si en el procés de desplegament es produeix un error, és recomanable revisar l'estat dels contenidors amb `portainer` o `docker ps` i els logs amb `docker logs <container_id>` per identificar el problema. També es pot accedir a la GUI de RabbitMQ per verificar l'estat de les cues i missatges.