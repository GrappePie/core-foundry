# AGENTS

Este documento describe los **agentes** (microservicios o componentes autónomos) que componen la plataforma SaaS modular, explicando su propósito, responsabilidades y puntos de integración.

---

## 1. Visión general

En la arquitectura de CoreFoundry, cada módulo se implementa como un **agente** independiente que:

- Expone una API REST o WebSocket
- Se registra dinámicamente en el App Central al activarse
- Emite y recibe mensajes de negocio a través del Bus de Módulos

---

## 2. Tabla de agentes

| Nombre del agente      | Descripción breve                                          | Endpoint base         | Protocolos / Eventos                           |
|------------------------|------------------------------------------------------------|-----------------------|------------------------------------------------|
| **Auth-Agent**         | Gestiona autenticación y tokens JWT                        | `/api/auth`           | REST: login, refresh; Eventos: `userLoggedIn`   |
| **Module-Gateway**     | Orquestrador de enrutamiento a agentes de módulo activos   | `/api/modules`        | REST: list, activate, deactivate                |
| **Inventory-Agent**    | Control de inventario: stock, movimientos, ajustes         | `/api/inventory`      | REST: CRUD; Bus: `sendInventoryUpdate`          |
| **Sales-Agent**        | Procesamiento de ventas y pedidos                          | `/api/sales`          | REST: orders; Bus: `orderCreated`               |
| **Reports-Agent**      | Generación de reportes y métricas                          | `/api/reports`        | REST: generate; WebSocket: reportProgress       |
| **Billing-Agent**      | Emisión de facturas y gestión de pagos                     | `/api/billing`        | REST: invoices; Bus: `paymentCompleted`         |
| **Visual-Agent**       | Renderizado de la capa Phaser (estado de módulos y flujos) | N/A (client-side)     | Bus: `moduleLoaded`, `dataFlowVisualized`       |

---

## 3. Flujo de interacción

1. **Autenticación**: el cliente obtiene un token JWT vía `Auth-Agent`.
2. **Carga de módulos**: `Module-Gateway` devuelve la lista de agentes activos.
3. **Inicialización visual**: `Visual-Agent` recibe la config y despliega sprites en Phaser.
4. **Comunicación**:
   - `Sales-Agent` envía `orderCreated` al Bus.
   - `Inventory-Agent` suscrito recibe mensaje y actualiza stock.
   - `Visual-Agent` dibuja animación de flujo de datos.
5. **Reportes**: `Reports-Agent` genera métricas en base a eventos del Bus.
6. **Facturación**: `Billing-Agent` emite factura y notifica al Bus.

---

## 4. Convenciones de nombres

- Todos los agentes usan sufijo `-Agent`.
- Puntos de integración siguen la ruta `/api/{module}`.
- Eventos en el Bus se nombran en `camelCase` con el prefijo del módulo (`orderCreated`, `paymentCompleted`).

---

## 5. Consideraciones futuras

- Añadir `Notification-Agent` para notificaciones por email/SMS.
- Implementar `Analytics-Agent` para análisis avanzado en tiempo real.
- Migrar algunos agentes críticos a gRPC para mayor rendimiento.

