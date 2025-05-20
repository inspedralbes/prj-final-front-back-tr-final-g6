# prj-final-front-back-tr-final-g6

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

<br>

# Manual d'Instal·lació en una Màquina Nova

Aquest manual explica com desplegar el projecte **prj-final-front-back-tr-final-g6** en una màquina nova, des de zero.

---

## 1. Requisits previs

Abans de començar, assegura't que la màquina compleix els següents requisits:

- **Sistema operatiu:** Ubuntu 20.04/22.04 (o similar)
- **Accés root** o permisos sudo
- **Git**
- **Docker** i **Docker Compose**
- **Node.js** (només si vols executar scripts fora de Docker)
- **Accés a internet**

---

## 2. Clonar el repositori

```bash
cd /ruta/on/vols/instal-lar
git clone https://github.com/nom-usuari/prj-final-front-back-tr-final-g6.git
cd prj-final-front-back-tr-final-g6
```

---

## 3. Configuració d'arxius d'entorn

Copia els arxius d'entorn de producció als seus llocs corresponents:

```bash
cp ./back/principal/.env.PROD ./back/principal/.env
cp ./front/nuxt/.env.PROD ./front/nuxt/.env
cp ./back/services/DBinsert/.env.PROD ./back/services/DBinsert/.env
cp ./back/services/sensor/.env.PROD ./back/services/sensor/.env
cp .env.PROD.DOCKER .env.PROD.DOCKER
```

Edita els arxius `.env` i `.env.PROD.DOCKER` per afegir les variables d'entorn reals (usuaris, contrasenyes, URIs, etc.) segons la teva configuració.

---

## 4. Arrencada dels serveis amb Docker Compose

```bash
docker compose -f compose.prod.yaml up -d --build
```

Aquesta comanda construirà i aixecarà tots els serveis definits a `compose.prod.yaml`.

---

## 5. Verificació

Comprova que tots els contenidors estan funcionant:

```bash
docker ps
```

Accedeix als serveis principals des del navegador:

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:3020
- **Adminer (MySQL):** http://localhost:8080
- **Mongo Express:** http://localhost:8081
- **RabbitMQ:** http://localhost:15672
- **Portainer:** http://localhost:9000

---

## 6. Actualització del projecte

Per actualitzar el projecte a una nova versió:

```bash
git pull
docker compose -f compose.prod.yaml up -d --build
```

---

## 7. Notes addicionals

- Si algun contenidor falla, consulta els logs amb:
  ```bash
  docker logs <nom_o_id_del_contenidor>
  ```
- Pots gestionar els contenidors gràficament amb Portainer (`http://localhost:9000`).

---

## 8. Desplegament automàtic (opcional)

Si vols automatitzar el desplegament, configura els secrets i el workflow de GitHub Actions (`.github/workflows/deploy-production.yaml`) segons la teva infraestructura.

---

**Fi del manual**
