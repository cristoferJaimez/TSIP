# Catálogo Virtual para Pastelería

Sistema profesional de catálogo virtual desarrollado para una pastelería, implementado con Angular (frontend), Node.js/Express (backend) y MySQL (base de datos relacional en 3FN). Incluye autenticación, gestión de roles, productos, carrito, pedidos, imágenes, búsquedas avanzadas, productos destacados, documentación y diagramas UML.

## Tabla de Contenidos
- [Descripción General](#descripción-general)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación y Configuración](#instalación-y-configuración)
- [Base de Datos](#base-de-datos)
- [Funcionalidades Principales](#funcionalidades-principales)
- [Diagramas y Documentación](#diagramas-y-documentación)
- [Control de Versiones](#control-de-versiones)
- [Créditos](#créditos)

---

## Descripción General
Este sistema permite a una pastelería gestionar y mostrar su catálogo de productos de manera virtual, facilitando la administración de artículos, características, imágenes, pedidos y usuarios, con control de roles y autenticación segura. Incluye funcionalidades de búsqueda avanzada, productos destacados y generación de facturas con código QR.

## Tecnologías Utilizadas
- **Frontend:** Angular 17+
- **Backend:** Node.js 20+, Express.js
- **Base de Datos:** MySQL (modelo en 3FN)
- **ORM/Conexión:** mysql2
- **Autenticación:** JWT, roles y permisos
- **Documentación:** UML (draw.io), README, comentarios en código

## Estructura del Proyecto
```
catalog-backend/        # Backend Node.js/Express
catalog-frontend/       # Frontend Angular
catalogo_virtual.sql    # Script SQL de la base de datos
*.xml, *.png, *.mwb     # Diagramas UML y modelo ER
.gitignore              # Reglas de control de versiones
package.json            # Dependencias globales
```

## Instalación y Configuración
### 1. Clonar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_REPOSITORIO>
```

### 2. Configurar la base de datos
- Crear una base de datos MySQL y ejecutar el script `catalogo_virtual.sql`.
- Configurar las credenciales en `catalog-backend/src/config/db.js` o archivo `.env`.

### 3. Instalar dependencias
#### Backend
```bash
cd catalog-backend
npm install
```
#### Frontend
```bash
cd ../catalog-frontend
npm install
```

### 4. Ejecutar el sistema
#### Backend
```bash
npm run dev
```
#### Frontend
```bash
ng serve
```

### 5. Acceso
- Frontend: [http://localhost:4200](http://localhost:4200)
- Backend API: [http://localhost:3000/api](http://localhost:3000/api)

## Base de Datos
- Modelo relacional en 3FN.
- Script SQL: `catalogo_virtual.sql`.
- Diagrama ER: `ER-TSIP.png`.
- Modelo visual: `proyect tsip.mwb` (MySQL Workbench).

## Funcionalidades Principales
- **Autenticación y roles:** Registro, login, control de acceso por rol (admin, cliente, etc.).
- **Gestión de productos:** CRUD de artículos, características, imágenes.
- **Carrito y pedidos:** Añadir al carrito, gestionar pedidos, historial.
- **Búsqueda avanzada:** Filtros por nombre, categoría, características, destacados.
- **Productos destacados:** Visualización y gestión.
- **Facturación:** Generación de facturas con QR.
- **Panel de administración:** Gestión de usuarios, productos y pedidos.
- **Documentación y diagramas:** UML (clases, casos de uso, flujo, secuencia, componentes, despliegue, ER, requerimientos).

## Diagramas y Documentación
- **Casos de uso:** `diagrama_casos_uso.xml`, `caso_uso_*.xml`
- **Clases:** `diagrama_clases.xml`
- **Flujo:** `diagrama_flujo.xml`
- **Requerimientos:** `diagrama_rec.xml`
- **Secuencia:** `diagrama_secuencia.xml`
- **Componentes:** `diagrama_componentes.xml`
- **Despliegue:** `diagrama_despliegue.xml`
- **Modelo ER:** `ER-TSIP.png`, `proyect tsip.mwb`

> Los archivos `.xml` pueden abrirse y editarse en [draw.io](https://app.diagrams.net/).

## Control de Versiones
- `.gitignore` profesional para Node.js, Angular, archivos temporales, backups, lockfiles, IDE, etc.
- Estructura de carpetas y archivos optimizada para trabajo en equipo y despliegue.
- Recomendación: No subir `node_modules`, archivos de entorno, ni builds.

## Créditos
- **Desarrollador:** [Tu Nombre]
- **Contacto:** [Tu Email]
- **Institución:** [Nombre de la institución o curso]

---

> Para dudas, sugerencias o reportes de errores, por favor abre un issue o contacta al desarrollador.
