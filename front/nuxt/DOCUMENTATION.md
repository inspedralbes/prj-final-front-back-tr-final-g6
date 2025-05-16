# Documentación Frontend del Proyecto

## Tecnologías Principales

### 1. Nuxt.js (v3.15.2)
- Framework basado en Vue.js para crear aplicaciones web modernas
- Proporciona renderizado del lado del servidor (SSR)
- Sistema de enrutamiento automático
- Gestión de estado integrada

### 2. Vue.js (Latest)
- Framework progresivo para construir interfaces de usuario
- Sistema de componentes reactivos
- Virtual DOM para renderizado eficiente

### 3. Bibliotecas y Dependencias Principales

#### PrimeVue (v3.53.1)
- Biblioteca de componentes UI rica en características
- Temas personalizables
- Componentes utilizados:
  - Formularios
  - Botones
  - Paneles
  - Componentes de navegación

#### Chart.js (v4.4.7) y Vue-Chartjs (v5.3.2)
- Implementación de gráficos y visualizaciones de datos
- Gráficos utilizados:
  - Gráficos de temperatura
  - Gráficos de CO2
  - Gráficos de volumen

#### Konva (v9.3.18)
- Biblioteca para gráficos y manipulación de canvas
- Utilizada para crear mapas interactivos de las plantas

#### Tailwind CSS (v3.4.17)
- Framework de CSS utilitario
- Diseño responsive
- Personalización de estilos

## Estructura de Componentes

### Componentes Principales

#### 1. LoginForm.vue
- Gestión de autenticación de usuarios
- Validación de formularios
- Integración con backend para autenticación

#### 2. AdminPanel.vue
- Panel de administración
- Gestión de usuarios y permisos
- Configuración del sistema

#### 3. CreatePanel.vue
- Creación de nuevos elementos
- Formularios de entrada de datos
- Validación de datos

#### 4. AulaCard.vue
- Visualización de información de aulas
- Datos en tiempo real
- Enlaces a detalles específicos

#### 5. InfoCard.vue
- Tarjetas informativas generales
- Visualización de estadísticas
- Datos resumidos

### Componentes de Gráficos

#### 1. Charts.vue
- Componente contenedor principal para gráficos
- Gestión de datos en tiempo real
- Actualización dinámica

#### 2. Co2Chart.vue, TemperatureChart.vue, VolumeChart.vue
- Gráficos específicos para diferentes métricas
- Visualización de datos históricos
- Actualizaciones en tiempo real

### Componentes de Mapas

#### MapaPlanta-1.vue hasta MapaPlantaSubterranea.vue
- Visualización interactiva de cada planta
- Marcadores de sensores
- Información en tiempo real
- Navegación entre plantas

## Páginas

### 1. index.vue
- Página principal
- Dashboard general
- Resumen de estadísticas

### 2. login.vue
- Página de inicio de sesión
- Autenticación de usuarios
- Redirección según rol

### 3. admin.vue
- Panel de administración
- Gestión del sistema
- Configuraciones avanzadas

### 4. aulas/[id].vue
- Vista detallada de aulas individuales
- Datos específicos de sensores
- Gráficos históricos

### 5. create.vue
- Creación de nuevos elementos
- Formularios de configuración
- Validación de datos

## Funcionalidades Principales

### 1. Sistema de Autenticación
- Login/Logout
- Gestión de sesiones
- Roles y permisos

### 2. Monitorización en Tiempo Real
- Actualización automática de datos
- Gráficos dinámicos
- Alertas y notificaciones

### 3. Gestión de Datos
- CRUD de elementos
- Validación de formularios
- Integración con API backend

### 4. Visualización de Datos
- Gráficos interactivos
- Mapas de plantas
- Dashboards informativos

## Estilos y Diseño

### 1. Tailwind CSS
- Sistema de grid responsive
- Utilidades de diseño
- Temas personalizados

### 2. PrimeVue Theming
- Temas predefinidos
- Personalización de componentes
- Consistencia visual

## Optimización y Rendimiento

### 1. Lazy Loading
- Carga diferida de componentes
- Optimización de imágenes
- Mejora de tiempo de carga

### 2. Caching
- Almacenamiento en caché de datos
- Mejora de rendimiento
- Reducción de llamadas al servidor

## Integración con Backend

### 1. API Endpoints
- Comunicación con servicios backend
- Gestión de errores
- Manejo de respuestas

### 2. Websockets
- Actualización en tiempo real
- Comunicación bidireccional
- Manejo de eventos

## Mantenimiento y Desarrollo

### 1. Scripts Disponibles
- `npm run dev`: Desarrollo local
- `npm run build`: Construcción para producción
- `npm run generate`: Generación estática
- `npm run preview`: Vista previa de producción

### 2. Dependencias
- Gestión con npm/yarn
- Actualizaciones periódicas
- Control de versiones
