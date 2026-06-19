# Fundamentos de Tecnología Cloud - Unidad 4

Aplicación para gestión de estudiantes con un backend en Spring Boot y un frontend en React + Vite.

El backend expone un CRUD sobre Firebase Firestore y además permite cargar registros en lote desde un archivo CSV en `/api/items/loadFile`.

## Estructura
- `back/`: API REST en Spring Boot.
- `front/`: interfaz web en React.

## Requisitos
- Java 17
- Maven 3.9+ o el wrapper equivalente
- Node.js 18+ y npm
- Proyecto Firebase con credenciales de servicio

## Levantar el backend
1. Entra a la carpeta `back`.
2. Verifica la configuración en `src/main/resources/application.properties`.
3. Ejecuta el servidor:

```bash
mvn spring-boot:run
```

El backend queda disponible en `http://localhost:8080`.

## Levantar el frontend
1. Entra a la carpeta `front`.
2. Instala dependencias:

```bash
npm install
```

3. Inicia Vite:

```bash
npm run dev
```

El frontend queda disponible en `http://localhost:5173`.

El front ya apunta al backend mediante proxy de Vite hacia `http://localhost:8080`, así que no hace falta cambiar la URL manualmente para desarrollo local.

## Funcionalidades principales
- Listar estudiantes.
- Crear, editar y eliminar estudiantes.
- Buscar registros por varios campos.
- Cargar estudiantes desde un archivo CSV.

## Formato del CSV
El archivo debe incluir los encabezados:

```csv
id,nombre,apellido,telefono,edad,correo,direccion,universidad,semestre,jornada,sexo
```

Ejemplo de uso:

```csv
1,Carlos Andrés,Martínez López,3101234567,20,carlos.martinez@gmail.com,"Calle 12 # 5-34, Bogotá",UNAD,3,Virtual,Masculino
```
