# Configuración de Autenticación Google OAuth

## Descripción General

CoreFoundry ahora incluye autenticación completa con Google OAuth utilizando NextAuth.js v5 (Auth.js). El sistema protege automáticamente todas las rutas y proporciona una experiencia de usuario fluida con páginas de inicio de sesión personalizadas en español.

## Características Implementadas

### ✅ Autenticación Google OAuth
- Integración completa con Google OAuth 2.0
- Páginas de inicio de sesión y error personalizadas en español
- Gestión segura de sesiones con base de datos

### ✅ Protección de Rutas
- Middleware que protege automáticamente todas las rutas
- Redirección automática a `/auth/signin` para usuarios no autenticados
- Exclusión inteligente de rutas públicas (API auth, assets estáticos)

### ✅ Gestión de Sesiones
- Almacenamiento de sesiones en base de datos PostgreSQL
- Adaptador Prisma para NextAuth.js
- Gestión automática de tokens y refresh tokens

### ✅ Interfaz de Usuario
- Componente `UserNav` que muestra información del usuario
- Botones de inicio y cierre de sesión
- Diseño responsive con Tailwind CSS

## Archivos Creados/Modificados

### Configuración de Autenticación
- `src/lib/auth.ts` - Configuración principal de NextAuth.js
- `src/lib/prisma.ts` - Cliente Prisma con fallback a mock
- `prisma/schema.prisma` - Esquema de base de datos para autenticación

### API Routes
- `src/app/api/auth/[...nextauth]/route.ts` - Rutas de API de NextAuth.js

### Páginas de Autenticación
- `src/app/auth/signin/page.tsx` - Página de inicio de sesión
- `src/app/auth/error/page.tsx` - Página de errores de autenticación

### Componentes
- `src/components/providers.tsx` - SessionProvider wrapper
- `src/components/user-nav.tsx` - Navegación de usuario
- `src/middleware.ts` - Middleware de protección de rutas

### Páginas Actualizadas
- `src/app/layout.tsx` - Layout principal con SessionProvider
- `src/app/page.tsx` - Página principal protegida con módulos CoreFoundry

## Variables de Entorno Requeridas

El archivo `.env.local` debe contener:

```ini
# Base de datos
DATABASE_URL=postgresql://postgres:password@localhost:5454/mydb?schema=public

# NextAuth.js
NEXTAUTH_SECRET=una_cadena_segura
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SALT=una_cadena_segura_para_salt
AUTH_TRUST_HOST=true

# Google OAuth
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret

# PostgreSQL (para Docker)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=mydb
```

## Configuración de Google OAuth

### 1. Crear Proyecto en Google Cloud Console
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+ o Google Identity

### 2. Configurar OAuth 2.0
1. Ve a "Credenciales" en el menú lateral
2. Clic en "Crear credenciales" > "ID de cliente OAuth 2.0"
3. Configura las URLs autorizadas:
   - **Orígenes autorizados**: `http://localhost:3001`
   - **URIs de redirección**: `http://localhost:3001/api/auth/callback/google`

### 3. Obtener Credenciales
- Copia el **Client ID** y **Client Secret**
- Añádelos a tu archivo `.env.local`

## Base de Datos

### Configuración con Docker
```bash
docker run --name postgres-core-foundry \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=mydb \
  -p 5454:5432 \
  -d postgres:15
```

### Migración de Base de Datos
```bash
# Generar cliente Prisma
npx prisma generate

# Aplicar migraciones
npx prisma db push

# Ver base de datos (opcional)
npx prisma studio
```

## Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build para producción
npm run build

# Lint
npm run lint
```

## Flujo de Autenticación

1. Usuario visita cualquier página protegida
2. Middleware verifica sesión
3. Si no hay sesión, redirige a `/auth/signin`
4. Usuario hace clic en "Continuar con Google"
5. Redirección a Google OAuth
6. Después de autorización, regresa a la aplicación
7. NextAuth.js crea sesión en base de datos
8. Usuario es redirigido a la página principal

## Estructura de la Aplicación

```
src/
├── app/
│   ├── api/auth/[...nextauth]/route.ts
│   ├── auth/
│   │   ├── signin/page.tsx
│   │   └── error/page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── providers.tsx
│   └── user-nav.tsx
├── lib/
│   ├── auth.ts
│   └── prisma.ts
└── middleware.ts
```

## Solución de Problemas

### Error de Conexión a Google
- Verifica que las URLs de redirección estén configuradas correctamente
- Confirma que `NEXTAUTH_URL` coincida con tu dominio
- Asegúrate de que `AUTH_TRUST_HOST=true` esté configurado

### Error de Base de Datos
- Verifica que PostgreSQL esté ejecutándose
- Confirma que `DATABASE_URL` sea correcta
- Ejecuta `npx prisma db push` para crear las tablas

### Problemas de Sesión
- Limpia cookies del navegador
- Verifica que `NEXTAUTH_SECRET` esté configurado
- Reinicia el servidor de desarrollo

## Próximos Pasos

1. Configurar base de datos PostgreSQL real
2. Implementar roles y permisos de usuario
3. Añadir autenticación de dos factores
4. Integrar con otros proveedores OAuth (GitHub, Microsoft, etc.)
5. Implementar gestión de equipos/organizaciones