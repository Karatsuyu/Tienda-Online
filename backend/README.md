# MiTienda Backend

Backend API para la aplicación de e-commerce MiTienda.

## Tecnologías

- FastAPI
- SQLAlchemy (async)
- PostgreSQL
- Alembic (migraciones)
- Poetry (gestión de dependencias)

## Desarrollo

### Con Docker (Recomendado)

```bash
docker-compose up backend
```

### Local

```bash
poetry install
poetry run uvicorn app.main:app --reload
```

## Base de datos

Las migraciones se ejecutan automáticamente al iniciar el contenedor.
