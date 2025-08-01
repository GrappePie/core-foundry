# 🏭 CoreFoundry

**CoreFoundry** es una plataforma SaaS modular multi-tenant con una interfaz interactiva y gamificada al estilo videojuego «Satisfactory», que permite a cada cliente activar módulos, configurarlos visualmente y observar cómo los datos fluyen entre ellos sin escribir código.

---

## 🎮 Concepto Principal

> Imagina un SaaS donde cada módulo (Inventario, Ventas, Informes) se presenta como una máquina en un mapa 2D interactivo. Puedes:
>
> - 🔧 Activar o desactivar módulos desde un panel visual,
> - 🔌 Conectarlos lógicamente con «cables de datos» arrastrando y soltando,
> - 🌐 Ver animaciones de flujo de datos viajando de un módulo a otro,
> - ⚙️ Configurar reglas de negocio sin escribir una sola línea de código.

Esta experiencia inmersiva ofrece una manera intuitiva y dinámica de gestionar procesos empresariales.

---

## ✨ Características Principales

- **Arquitectura Multi-Tenant**: soporte para múltiples clientes con datos aislados en PostgreSQL.
- **Módulos Dinámicos**: activar y desactivar módulos de negocio en tiempo real.
- **Interfaz Gamificada**: mapa 2D interactivo renderizado con **Phaser 3**.
- **Autenticación Segura**: gestionada con **NextAuth.js (Auth.js v5)**.
- **Persistencia de Datos**: Prisma ORM sobre PostgreSQL.
- **Observabilidad Completa**:
    - Métricas expuestas para **Prometheus** (`/api/metrics`).
    - Logs estructurados.
    - Endpoint de salud (`/api/health`).
- **CI/CD y Contenedores**:
    - GitHub Actions para lint, tests, build y despliegue.
    - Docker y Helm listos para producción.

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener:

- **Node.js** ≥ 20.x y **npm** o **Yarn**.
- **Docker** y **Docker Compose**.
- **Helm** y un clúster **Kubernetes** (p.ej. Minikube, k3s).
- Cuenta de Docker Hub (o similar) para alojar imágenes.
- Variables de entorno:
    - `DATABASE_URL` (conexión a PostgreSQL)
    - `NEXTAUTH_SECRET`
    - `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`

---

## 🔧 Instalación Local

1. Clona este repositorio:
   ```bash
   git clone https://github.com/tu-org/corefoundry.git
   cd corefoundry
   ```
2. Instala dependencias:
   ```bash
   npm install
   # o
   yarn install
   ```
3. Crea un archivo `.env.local` copiando el ejemplo:
   ```bash
   cp .env.example .env.local
   ```
4. Ajusta las variables en `.env.local`.
5. Inicia la aplicación en modo desarrollo:
   ```bash
   npm run dev
   # o
   yarn dev
   ```
6. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## ⚙️ Uso y Comandos

- **Desarrollo**: `npm run dev` / `yarn dev`
- **Build para producción**: `npm run build` && `npm start`
- **Lint**: `npm run lint`
- **Tests**: `npm run test`

---

## 🛠️ Configuración de Variables de Entorno

En `.env.local` define al menos:

```ini
DATABASE_URL=postgresql://user:pass@localhost:5432/corefoundry
NEXTAUTH_SECRET=una_cadena_segura
GOOGLE_CLIENT_ID=tu_id_google
GOOGLE_CLIENT_SECRET=tu_secreto_google
```

Añade cualquier otra variable que requiera tu configuración específica.

---

## 📊 Observabilidad

- **Métricas**: expuestas en `/api/metrics` (Prometheus).
- **Endpoint de salud**: `/api/health`.
- **Logs**: estructurados con Pino.
- **Trazas**: integradas con OpenTelemetry.

---

## 🗄️ Arquitectura

```mermaid
flowchart LR
  subgraph Frontend
    FE[Next.js + Phaser 3]
  end
  subgraph Backend
    API[Next.js API Routes]
    Auth[NextAuth.js]
  end
  DB[(PostgreSQL)]
  FE -->|REST/GraphQL| API
  API --> Auth
  API --> DB
  Auth --> DB
```

Cada módulo (Inventario, Ventas, Informes) se despliega como servicio independiente que se registra en el panel visual.

---

## 📝 Referencia de la API

- `GET /api/modules`: lista de módulos disponibles.
- `POST /api/flows`: crea una nueva conexión de datos.
- `GET /api/flows`: obtiene las conexiones actuales.
- **Auth**: rutas en `/api/auth/*` (Iniciar sesión, callback, etc.).

Para más detalles, consulta la carpeta `./docs/api`.

---

## 🚀 Despliegue en Producción

### Docker

1. Construye la imagen:
   ```bash
   docker build -t corefoundry:latest .
   ```
2. Etiqueta y sube a tu registry:
   ```bash
   docker tag corefoundry:latest tu-registry/corefoundry:latest
   docker push tu-registry/corefoundry:latest
   ```
3. Ejecuta con Docker Compose:
   ```bash
   docker-compose up -d
   ```

### Kubernetes con Helm

```bash
helm repo add corefoundry https://tu-org.github.io/helm-charts
helm install corefoundry corefoundry/corefoundry \
  --namespace corefoundry --create-namespace \
  --set image.repository=tu-registry/corefoundry \
  --set appSecrets.NEXTAUTH_SECRET=$(echo -n "$NEXTAUTH_SECRET" | base64)
```

---

## 📈 CI/CD

Este proyecto utiliza **GitHub Actions** (`.github/workflows/ci.yml`):

1. Instalación de dependencias.
2. Lint y pruebas.
3. Construcción de la aplicación.
4. Creación y publicación de la imagen Docker.
5. Despliegue automático en Kubernetes (opcional).

---

## 🤝 Contribuciones

¡Se agradecen issues y pull requests! Sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`).
3. Asegúrate de agregar pruebas y actualizar la documentación.
4. Abre un Pull Request describiendo tu cambio.

---

## 📜 Licencia

Este proyecto está bajo licencia [MIT](LICENSE).

---

## 📅 Changelog

Consulta [CHANGELOG.md](./CHANGELOG.md) para ver las versiones y cambios destacados.

