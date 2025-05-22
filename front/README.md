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
