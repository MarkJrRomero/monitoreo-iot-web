# Monitoreo IoT Web - Documentación de Diseño

## 📋 Descripción del Proyecto
Sistema web para monitoreo de dispositivos IoT en tiempo real, desarrollado con React y TypeScript.

## 🚀 Fases de Desarrollo

### Fase 1: Configuración Inicial
- ✅ **Iniciamos un proyecto en React con Vite**
  - Configuración de TypeScript
  - Integración con Tailwind CSS
  - Estructura de carpetas organizada

### Fase 2: Dependencias y Configuración
- ✅ **Instalamos las dependencias necesarias**
  - React Router DOM para navegación
  - Tailwind CSS para estilos
  - TypeScript para tipado estático
  - ESLint para linting

### Fase 3: Router y Vistas
- ✅ **Configuramos el router y las vistas iniciales**
  - Implementación de React Router
  - Creación de páginas Home y Dashboard
  - Navegación básica entre componentes

### Fase 4: Autenticación y Formularios
- ✅ **Implementamos sistema de autenticación**
  - React Query para manejo de estado del servidor
  - Hook personalizado useAuth con localStorage
  - Formulario de login con Formik y Yup
  - Validación de campos en tiempo real
  - Manejo de errores y estados de carga

### Fase 5: Configuración de Entorno
- ✅ **Configuramos variables de entorno**
  - Archivo .env para configuración
  - Proxy en Vite para evitar CORS
  - Configuración de API endpoints
  - Estructura de configuración modular

### Fase 6: Dashboard y Estadísticas
- ✅ **Implementamos dashboard principal**
  - Hook useStats para obtener datos de vehículos y alertas
  - Estadísticas resumidas con useStatsSummary
  - Visualización de métricas por rol de usuario
  - Enmascaramiento de datos sensibles para usuarios no administradores

### Fase 7: WebSocket y Tiempo Real
- ✅ **Implementamos comunicación en tiempo real**
  - Hook useVehicleWebSocket para conexión WebSocket
  - Suscripción automática a vehículos
  - Recepción de datos de sensores en tiempo real
  - Manejo de alertas automáticas
  - Reconexión automática en caso de desconexión

### Fase 8: Mapa de Vehículos
- ✅ **Desarrollamos mapa interactivo**
  - Componente VehicleMap con React Leaflet
  - Visualización de vehículos en mapa
  - Actualización automática de ubicaciones
  - Integración con datos WebSocket
  - Indicadores de estado de conexión

### Fase 9: Sistema de Alertas
- ✅ **Implementamos sistema de alertas**
  - Página de alertas activas
  - Recepción de alertas en tiempo real
  - Notificaciones toast con react-toastify
  - Diferenciación visual de alertas nuevas
  - Manejo de múltiples tipos de alerta

### Fase 10: CRUD de Vehículos
- ✅ **Desarrollamos gestión completa de vehículos**
  - Hook useVehiculos para operaciones CRUD
  - Página de gestión con tabla responsive
  - Creación, edición y eliminación de vehículos
  - Búsqueda y paginación
  - Enmascaramiento de IDs según rol

### Fase 11: Ingesta de Datos
- ✅ **Implementamos sistema de ingesta**
  - Hook useIngesta para envío de datos
  - Formulario de ingesta con validación
  - Select de vehículos disponibles
  - Generación de datos aleatorios para pruebas
  - Envío directo a WebSocket

### Fase 12: Simulador
- ✅ **Desarrollamos sistema de simulación**
  - Hook useSimulador para control del simulador
  - Página de control con estado en tiempo real
  - Inicio/parada de simulación
  - Visualización de vehículos simulando
  - Control de estado del simulador

### Fase 13: UI/UX Responsive
- ✅ **Implementamos diseño responsive**
  - Sidebar responsive con menú móvil
  - Header móvil con botón hamburguesa
  - Layout adaptativo para diferentes pantallas
  - Navegación optimizada para móviles
  - Overlay y animaciones suaves

### Fase 14: Privacidad y Seguridad
- ✅ **Implementamos medidas de privacidad**
  - Función maskDeviceId para enmascarar IDs
  - Diferentes niveles de acceso por rol
  - Ocultación de datos sensibles para usuarios estándar
  - Protección de información de dispositivos

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 19.1.0 | Framework principal |
| TypeScript | 5.8.3 | Tipado estático |
| Vite | 7.0.4 | Build tool y dev server |
| Tailwind CSS | 4.1.11 | Framework de estilos |
| React Router | 6.28.0 | Navegación SPA |
| React Query | 5.0.0 | Manejo de estado del servidor |
| Formik | 2.4.5 | Manejo de formularios |
| Yup | 1.3.3 | Validación de esquemas |
| React Leaflet | 4.2.1 | Mapas interactivos |
| React Toastify | 9.1.3 | Notificaciones toast |
| Leaflet | 1.9.4 | Biblioteca de mapas |

## 🛠️ Estructura del Proyecto
```
monitoreo-iot-web/
├── src/
│   ├── components/
│   │   ├── Layout.tsx          # Layout principal responsive
│   │   ├── SideBar.tsx         # Sidebar con navegación
│   │   └── VehicleMap.tsx      # Mapa de vehículos
│   ├── hooks/
│   │   ├── useAuth.ts          # Autenticación
│   │   ├── useStats.ts         # Estadísticas y datos
│   │   ├── useVehicleWebSocket.ts # WebSocket tiempo real
│   │   ├── useVehiculos.ts     # CRUD de vehículos
│   │   ├── useIngesta.ts       # Ingesta de datos
│   │   └── useSimulador.ts     # Control de simulador
│   ├── pages/
│   │   ├── Home.tsx            # Dashboard principal
│   │   ├── Auth.tsx            # Página de autenticación
│   │   ├── Vehiculos.tsx       # 
