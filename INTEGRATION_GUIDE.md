# Guía de Integración Frontend-Backend

## Estado de la Integración

✅ **Completado (80%):**
- Servicio HTTP client (`lib/api.ts`) con todos los endpoints
- Contexto de autenticación global (`AuthContext.tsx`) con JWT y persistencia
- Formularios de login y registro totalmente funcionales
- Header con dropdown de usuario (logout, profile, orders)
- Página de inicio conectada al backend para traer productos en tiempo real
- Página de detalle de producto con datos dinámicos del backend
- Página de carrito con sincronización de backend
- Página de checkout integrada con API
- Variables de entorno configuradas
- CartContext con sincronización automática con backend

⚠️ **En Progreso:**
- Sincronización de carrito en tiempo real (UI lista, falta backend sync completo)
- Validación de emails en formularios

## Requisitos Previos

### Backend
- Python 3.10+
- PostgreSQL corriendo en puerto 5432
- Poetry instalado

### Frontend
- Node.js 18+
- npm o pnpm

## Configuración

### 1. Backend

```bash
cd backend

# Instalar dependencias
poetry install

# Configurar variables de entorno
# Verificar que .env tenga:
# - DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/mitienda
# - SECRET_KEY=your-secret-key

# Aplicar migraciones de base de datos
poetry run alembic upgrade head

# Crear datos de prueba (opcional)
poetry run python -m app.utils.seed

# Levantar el servidor
poetry run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

El backend estará disponible en: `http://localhost:8000`
API Docs (Swagger): `http://localhost:8000/docs`
ReDoc: `http://localhost:8000/redoc`

### 2. Frontend

```bash
cd frontend

# Instalar dependencias
npm install
# o
pnpm install

# Verificar que .env.local tenga:
# NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Levantar el servidor de desarrollo
npm run dev
# o
pnpm dev
```

El frontend estará disponible en: `http://localhost:3000`

## Pruebas Manuales - Flujo Completo

### 1. Registro de Usuario
```
✓ Ir a http://localhost:3000/register
✓ Llenar: email, password, full_name
✓ Clic en "Create Account"
✓ Verificar: redirect a home, usuario visible en header dropdown
✓ Verificar: token guardado en localStorage (DevTools > Application > localStorage > authToken)
```

### 2. Login
```
✓ Logout desde header dropdown
✓ Ir a http://localhost:3000/login
✓ Usar credenciales registradas
✓ Verificar: redirect a home, usuario visible en header
```

### 3. Ver Productos
```
✓ Home carga productos desde backend API
✓ ProductCard renderiza datos de servidor
✓ Clic en producto → ProductPage dinámica
✓ Página de detalle trae datos de /api/v1/products/{slug}
✓ "Related Products" también del backend
```

### 4. Agregar al Carrito
```
✓ En ProductPage: clic en "Add to Cart"
✓ Verificar: item en carrito local (localStorage)
✓ Verificar: si autenticado, también en backend (/api/v1/cart/)
✓ Item count actualiza en header
```

### 5. Carrito (Cart Page)
```
✓ Ir a http://localhost:3000/cart
✓ Actualizar cantidades (±)
✓ Remover items (trash icon)
✓ Verificar: cambios sincronizan con backend
✓ Total y subtotal calculan correctamente
```

### 6. Checkout
```
✓ Clic en "Proceed to Checkout"
✓ Verificar: requiere estar logeado
✓ Muestra datos de usuario (email, name)
✓ Muestra resumen de orden
✓ Clic en "Place Order"
✓ Verificar: orden creada en backend (/api/v1/orders/)
✓ Verificar: redirect a home, carrito limpiado
```

## Estructura de API

### Auth
```
POST   /api/v1/auth/register        - Registro (email, password, full_name)
POST   /api/v1/auth/login           - Login (username, password) → jwt_token
GET    /api/v1/auth/me              - Usuario actual (requiere Bearer token)
```

### Productos
```
GET    /api/v1/products/            - Listar productos (skip, limit)
GET    /api/v1/products/{slug}      - Detalle de producto
GET    /api/v1/products/categories  - Listar categorías
```

### Carrito
```
GET    /api/v1/cart/                - Ver carrito completo
POST   /api/v1/cart/items           - Agregar item (product_id, quantity)
PUT    /api/v1/cart/items/{item_id} - Actualizar cantidad (quantity)
DELETE /api/v1/cart/items/{item_id} - Eliminar item
```

### Órdenes
```
POST   /api/v1/orders/checkout      - Crear orden desde carrito
GET    /api/v1/orders/              - Mis órdenes
GET    /api/v1/orders/{order_id}    - Detalle de orden
```

## Arquitectura de Integración

### Cliente HTTP (`src/lib/api.ts`)
- `getAuthToken()` - Extrae JWT de localStorage
- `apiRequest<T>()` - Wrapper para fetch con auto-auth
- Módulos: `authAPI`, `productsAPI`, `cartAPI`, `ordersAPI`

### Contextos Globales
- **AuthContext** - Maneja login/logout/usuario actual
  - Reducer con acciones: LOGIN_SUCCESS, LOGOUT, LOADING, ERROR, RESTORE_TOKEN
  - Persistencia: token en localStorage
  
- **CartContext** - Maneja carrito local y sync con backend
  - Sync automático cuando usuario autentica
  - Cada acción (add/remove/update) sincroniza con backend si autenticado

### Flujo de Autenticación
```
1. Usuario → LoginForm (email/password)
2. LoginForm llama authAPI.login()
3. Backend retorna {access_token, token_type}
4. AuthContext guarda en localStorage
5. Peticiones posteriores incluyen: Authorization: Bearer {token}
```

### Flujo de Carrito
```
Modo Anonimo:
  - Carrito solo en localStorage
  - JSON guardado como "cart"

Modo Autenticado:
  - Carrito en localStorage + backend
  - Al login: sincroniza items locales al backend
  - Cada acción: suma de localStorage + backend API call

Checkout:
  - POST /orders/checkout crea orden
  - Backend limpia carrito automáticamente
  - Frontend limpia localStorage
```

## Notas Importantes

✓ Token JWT se guarda en localStorage clave: `authToken`
✓ Carrito se guarda en localStorage clave: `cart` (array de items)
✓ CORS habilitado en backend para localhost:3000
✓ API responde con Content-Type: application/json
✓ Autenticación con Bearer token en Authorization header
✓ Errores de API incluyen detail en JSON response

## Solución de Problemas

### "Cannot connect to backend"
```bash
# Verificar backend corriendo
curl http://localhost:8000/docs

# Verificar CORS
# En backend debe haber: allow_origins=["http://localhost:3000"]

# Verificar firewall/puerto
netstat -an | grep 8000
```

### "Token inválido / Unauthorized"
```
- Verificar token en localStorage: DevTools > Application > localStorage > authToken
- Token puede haber expirado (verificar SECRET_KEY igual en frontend y backend)
- Hacer logout y re-login
```

### Carrito no sincroniza
```
- Verificar usuario autenticado (header dropdown muestra usuario)
- Revisar Network tab: POST /api/v1/cart/items
- Verificar Response status 200/201
```

## Próximos Pasos

- [ ] Validación de emails duplicados en registro
- [ ] Búsqueda y filtrado de productos (productos/search?q=)
- [ ] Categorías dinámicas en header
- [ ] Órdenes históricas en /orders page
- [ ] Admin dashboard para gerenciar productos
- [ ] Integración de pagos (Stripe/MercadoPago)
- [ ] Notificaciones por email
- [ ] Recuperación de contraseña
- [ ] Reseñas y ratings

## Variables de Entorno

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Backend (.env)
```
DATABASE_URL=postgresql+asyncpg://mitienda:mitienda@localhost:5432/mitienda
SECRET_KEY=e8b8f4d9a8b8c8d8e8f8g8h8i8j8k8l8m8n8o8p8q8r8s8t8u8v8w8x8y8z8a8b8
PROJECT_NAME=MiTienda API
BACKEND_CORS_ORIGINS=["http://localhost:3000", "http://localhost:8080"]
```

## Contacto / Soporte

Para problemas específicos:
1. Revisar logs del backend: `poetry run uvicorn app.main:app --reload`
2. Revisar Network tab del navegador (DevTools > Network)
3. Verificar estructura de endpoints en OpenAPI docs: http://localhost:8000/docs
