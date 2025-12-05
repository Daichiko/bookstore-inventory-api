# 📚 Bookstore Inventory API

Bienvenido al proyecto **Bookstore Inventory API**, una aplicación backend desarrollada con **NestJS** y **Prisma** (utilizando **PostgreSQL**). Este proyecto está completamente **dockerizado** para asegurar un entorno de desarrollo consistente.

---

## ACTUALIZACION

Con la ultima actualizacion el costo de los libros no se obtiene por la Api asociada, si no por la base de datos que almacena la tasa de cambio diaria que expone la Api, debido a ello si se quiere probar el funcionamiento del sistema en un corto periodo de tiempo se debe dirigir al siguiente archivo **"src/exchange-rate/exchange=rate=cron.service.ts"**, ya estando en el archivo puede modificar la linea 17 donde se situa el intervalo de ejecucion del cron job para establecer un plazo mas corto:

```ts
// Para efectos de prueba se puede cambiar a EVERY_MINUTE o EVERY_5_MINUTES
@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'fetchRates',
    timeZone: 'UTC',
  })
```

---

## 🚀 1. Requisitos del Sistema

- **Node.js:** Versión utilizada **24.11.1** (o superior).
- **Gestor de Paquetes:** `npm`.
- **Docker:** Necesario para la ejecución dockerizada.
- **PostgreSQL:** Requerido si se ejecuta la aplicación sin Docker.
- **Exchangerate:** Se debe colocar la key asociada a una cuenta de Exchangerate en las enviroment (https://v6.exchangerate-api.com/v6/KEY/latest/USD).

---

## 🐳 2. Ejecución con Docker (Recomendado)

La forma más rápida y recomendada de levantar el entorno es usando **Docker Compose**, ya que gestiona la base de datos PostgreSQL, las migraciones y la aplicación NestJS automáticamente.

> **Nota sobre el puerto:** Debido a la naturaleza de PostgreSql para tomar el puerto `5432` se opto por el puerto `5433` como salida del contenedor para evitar inconvenientes si se tiene postgresql instalado. La aplicación interna **siempre** se conecta a `db:5432`.

### Comandos de Inicio

Ejecuta el siguiente comando en la raíz del proyecto para construir las imágenes, levantar los contenedores, aplicar las migraciones de Prisma y arrancar el servidor en modo _watch_:

```bash
docker-compose up --build
```

| Resultado  | Puerto                |
| ---------- | --------------------- |
| API NestJS | http://localhost:3001 |
| PostgreSQL | localhost:5433        |

---

## 💻 3. Ejecución Sin Docker

Si deseas correr la aplicación directamente en tu sistema operativo, debes tener una instancia de PostgreSQL corriendo localmente.

**A. Base de Datos (Local)**
A
Asegúrate de que tienes una base de datos PostgreSQL el sistema se encargara de crear la base de datos necesaria en caso de ser necesario.

**B. Instalacion de dependencias y ejecucion**

```shell
npm install
```

Generar Cliente Prisma:

```shell
npx prisma generate
```

Aplicar Migraciones de Prisma:

```shell
npx prisma migrate deploy
```

Iniciar la Aplicación (Modo Desarrollo):

```shell
npm run start:dev
```

La API estará disponible en http://localhost:3001.

> **Nota Postman:** El repositorio posee un archivo denominado `Bookstore Inventory API - CRUD.postman_collection.json` el cual se puede importar en postman para un uso rapido de los endpoints, de igual manera el sistema cuenta con swagger en la ruta `http://localhost:3001/api/docs`.
