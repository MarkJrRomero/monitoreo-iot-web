# 🚀 Guía de Configuración - Monitoreo IoT Web

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** o **yarn**
- **Git**

## Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/MarkJrRomero/monitoreo-iot-web.git
cd monitoreo-iot-web
```

### 2. Instalar dependencias
```bash
npm install
# o
yarn install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
# API Configuration
VITE_API_URL=http://localhost:3000
VITE_API_WS_HOST=localhost:3000

```

### 4. Verificar configuración
Asegúrate de que el backend esté corriendo en `http://localhost:3000` antes de iniciar el frontend.

## 🚀 Ejecutar el Proyecto

### Desarrollo
```bash
npm run dev
# o
yarn dev
```

El proyecto estará disponible en: `http://localhost:5173`

### Build de Producción
```bash
npm run build
# o
yarn build
```

### Preview de Producción
```bash
npm run preview
# o
yarn preview
```

## 🔧 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Genera build de producción |
| `npm run preview` | Previsualiza build de producción |
| `npm run lint` | Ejecuta ESLint |
| `npm run type-check` | Verifica tipos TypeScript |

## Estructura de URLs

### Rutas Principales
- `/` - Dashboard principal
- `/auth` - Página de autenticación
- `/vehiculos` - Gestión de vehículos (solo admin)
- `/alertas` - Alertas activas
- `/ingesta` - Ingesta de datos (solo admin)
- `/simulador` - Control de simulador (solo admin)

## Credenciales de Prueba

### Usuario Administrador