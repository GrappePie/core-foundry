# --- Etapa de Builder ---
FROM node:18-alpine AS builder
WORKDIR /app

# 1) Instalamos dependencias
COPY package*.json ./
RUN npm ci

# 2) Generamos el Prisma Client
COPY prisma ./prisma
RUN npx prisma generate

# 3) Copiamos el resto y compilamos Next.js
COPY . .
RUN npm run build

# --- Etapa de Producción ---
FROM node:18-alpine
WORKDIR /app

# 4) Solo los artefactos que necesitamos
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

EXPOSE 3000

# 5) Al inicio del contenedor aplicamos migraciones y luego levantamos
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
