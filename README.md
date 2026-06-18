# ftc-unidad4

API REST en Spring Boot (Java 17) con CRUD básico sobre una colección de Firebase Firestore.

## Requisitos
- Java 17
- Maven 3.9+
- Proyecto Firebase con credenciales de servicio

## Configuración
1. Genera una service account en Firebase.
2. Define la ruta del JSON con:
   - `firebase.service-account-path=/ruta/credenciales.json`
   - o usa credenciales por defecto de Google (`GOOGLE_APPLICATION_CREDENTIALS`).

Opcionalmente cambia la colección:
- `app.firebase.collection=items`

## Ejecutar
```bash
mvn spring-boot:run
```

## Swagger
- UI: `http://localhost:8080/swagger-ui/index.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

## Endpoints
- `GET /api/items`
- `GET /api/items/{id}`
- `POST /api/items`
- `PUT /api/items/{id}`
- `DELETE /api/items/{id}`
