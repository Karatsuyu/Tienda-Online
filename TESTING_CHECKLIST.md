# Testing Checklist - Mi Tienda Frontend-Backend Integration

**Proyecto:** Mi Tienda E-commerce  
**Fecha:** 2024  
**Estado:** Ready for Testing ✅

---

## 📋 Pre-Testing Setup

### Requisitos
- [ ] Python 3.10+ instalado
- [ ] Node.js 18+ instalado
- [ ] PostgreSQL corriendo en puerto 5432
- [ ] Git clonado / Workspace abierto
- [ ] Terminal con acceso a bash/pwsh

### Configuración Inicial

**Backend:**
```bash
cd backend
poetry install
poetry run alembic upgrade head
poetry run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
# Esperar: Uvicorn running on http://0.0.0.0:8000
```

**Frontend:**
```bash
cd frontend
npm install
# Verificar .env.local con: NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
npm run dev
# Esperar: ▲ Next.js 15.x.x
#         Local:        http://localhost:3000
```

**Verificación de Conectividad:**
```bash
# En otra terminal
curl http://localhost:8000/docs
# Debe retornar HTML de Swagger UI

curl http://localhost:3000
# Debe retornar HTML del home
```

---

## 🧪 Test Suite

### Sección 1: Autenticación

#### Test 1.1: Registro de Usuario
**Objetivo:** Crear nuevo usuario con email, password, nombre

**Pasos:**
1. Ir a http://localhost:3000/register
2. Llenar formulario:
   - Full Name: "Test User"
   - Email: "test@example.com"
   - Password: "password123"
3. Clic en "Create Account"

**Resultados Esperados:**
- [ ] Formulario envía datos sin errores
- [ ] Backend retorna `access_token`
- [ ] Token se guarda en localStorage: `localStorage.authToken`
- [ ] Página redirige a http://localhost:3000 (home)
- [ ] Header muestra usuario autenticado (dropdown con email)
- [ ] Toast verde "Account created successfully"

**Verificación Backend:**
```bash
# En logs de backend debe aparecer:
# POST /api/v1/auth/register - 200 OK
```

---

#### Test 1.2: Login Existente
**Objetivo:** Autenticar usuario con credenciales

**Pasos:**
1. Logout desde header dropdown (si aún autenticado)
2. Ir a http://localhost:3000/login
3. Llenar:
   - Email: "test@example.com"
   - Password: "password123"
4. Clic en "Login"

**Resultados Esperados:**
- [ ] Formulario envía credenciales
- [ ] Backend retorna JWT válido
- [ ] Header muestra usuario (test@example.com en dropdown)
- [ ] Toast verde "Login successful"
- [ ] Página redirige a home

**DevTools Verificación:**
```
Application > localStorage > authToken
# Debe contener JWT (3 partes separadas por puntos)
```

---

#### Test 1.3: Logout
**Objetivo:** Terminar sesión y limpiar datos

**Pasos:**
1. Header > Usuario dropdown > Logout
2. Verificar header cambia

**Resultados Esperados:**
- [ ] localStorage.authToken se elimina
- [ ] Header muestra icono usuario (no dropdown)
- [ ] useAuth().isAuthenticated = false
- [ ] Página se actualiza (sin carrito personal)

---

#### Test 1.4: Manejo de Errores
**Objetivo:** Verificar errores se muestran correctamente

**Test 1.4.1: Contraseña Incorrecta**
1. Login > Email: "test@example.com" > Password: "wrongpassword"
2. Clic "Login"

**Resultados Esperados:**
- [ ] Backend retorna error 401
- [ ] Toast rojo "Invalid credentials"
- [ ] Usuario NO se autentica

**Test 1.4.2: Email no existe**
1. Login > Email: "nonexistent@example.com" > Password: "anypassword"

**Resultados Esperados:**
- [ ] Toast rojo con mensaje de error
- [ ] Usuario NO se autentica

**Test 1.4.3: Email duplicado en registro**
1. Register > email: "test@example.com" (ya existe)
2. Clic "Create Account"

**Resultados Esperados:**
- [ ] Backend retorna error 400
- [ ] Toast rojo "Email already registered"
- [ ] NO redirige a home

---

### Sección 2: Productos

#### Test 2.1: Listado de Productos
**Objetivo:** Home carga productos desde backend

**Pasos:**
1. Ir a http://localhost:3000
2. Esperar página carga
3. Observar productos listados

**Resultados Esperados:**
- [ ] Home carga sin errores
- [ ] Mínimo 5 productos visibles
- [ ] Cada ProductCard muestra:
  - [ ] Imagen (placeholder si no hay URL)
  - [ ] Título del producto
  - [ ] Precio
  - [ ] Rating (estrellas)
  - [ ] Botón "Add to Cart"
- [ ] Datos vienen de backend (verificar Network tab)

**DevTools Verificación:**
```
Network > XHR/Fetch > GET /api/v1/products/
# Status: 200
# Response contiene: {"items": [...]}
```

---

#### Test 2.2: Detalle de Producto
**Objetivo:** Página de detalle carga datos del backend

**Pasos:**
1. Home > Clic en cualquier producto
2. Esperar carga de página
3. Observar detalles

**Resultados Esperados:**
- [ ] URL cambió a `/product/{slug}`
- [ ] Página carga dinámicamente
- [ ] Muestra:
  - [ ] Imagen grande del producto
  - [ ] Título exacto
  - [ ] Descripción completa
  - [ ] Precio
  - [ ] Botón "Add to Cart" con input de cantidad
  - [ ] Rating con número de reviews
- [ ] Sección "Related Products" visible
- [ ] Relacionados son otros productos diferentes

**DevTools Verificación:**
```
Network > GET /api/v1/products/{slug}
# Status: 200
# Response contiene datos del producto

Network > GET /api/v1/products/?skip=X&limit=Y
# Para traer relacionados
```

---

#### Test 2.3: Cambiar Cantidad antes de Agregar
**Objetivo:** Selector de cantidad funciona

**Pasos:**
1. Página de producto detalle
2. Input cantidad (+ - botones)
3. Aumentar a 5
4. Clic "Add to Cart"

**Resultados Esperados:**
- [ ] Cantidad se actualiza en input
- [ ] Carrito se agrega con cantidad correcta

---

### Sección 3: Carrito

#### Test 3.1: Carrito Anonimo (Sin Login)
**Objetivo:** Usuario sin login puede usar carrito

**Pasos:**
1. Logout (si autenticado)
2. Ir a home
3. Producto > "Add to Cart" (qty: 2)
4. Otro producto > "Add to Cart" (qty: 1)
5. Ir a /cart

**Resultados Esperados:**
- [ ] Header muestra contador "3" (2+1 items)
- [ ] Página /cart muestra 2 items
- [ ] Total se calcula correctamente
- [ ] Datos persisten en localStorage (clave: "cart")
- [ ] Si recargo página, carrito sigue ahí

**DevTools Verificación:**
```
Application > localStorage > cart
# Contiene array JSON con items y cantidad
```

---

#### Test 3.2: Carrito Autenticado
**Objetivo:** Usuario logeado sincroniza carrito con backend

**Pasos:**
1. Login con cuenta (usar test@example.com del Test 1.1)
2. Si tenía carrito anterior, debe sincronizar
3. Agregar nuevo producto > "Add to Cart"
4. Ir a /cart

**Resultados Esperados:**
- [ ] Al login, carrito anterior se sincroniza
- [ ] Header muestra contador actualizado
- [ ] Nuevo item se agrega tanto a localStorage como a backend
- [ ] DevTools Network muestra POST /api/v1/cart/items (Status: 201)

**DevTools Verificación:**
```
Network > POST /api/v1/cart/items
# Request body: {product_id: "1", quantity: 2}
# Response: {item_id, product_id, quantity}
```

---

#### Test 3.3: Actualizar Cantidad en Carrito
**Objetivo:** Cambiar cantidad de items

**Pasos:**
1. Carrito page (/cart)
2. Producto 1 > + botón (aumentar cantidad)
3. Producto 2 > - botón (disminuir cantidad)
4. Esperar sincronización

**Resultados Esperados:**
- [ ] Cantidad se actualiza en UI
- [ ] Total recalcula automáticamente
- [ ] Si autenticado: DevTools muestra PUT /api/v1/cart/items/{id}
- [ ] localStorage actualiza

---

#### Test 3.4: Remover Item del Carrito
**Objetivo:** Eliminar producto del carrito

**Pasos:**
1. Carrito page (/cart)
2. Cualquier item > Clic trash icon
3. Confirmar
4. Verificar carrito

**Resultados Esperados:**
- [ ] Item desaparece del carrito
- [ ] Contador en header actualiza
- [ ] Total recalcula
- [ ] Si autenticado: DELETE /api/v1/cart/items/{id} se ejecuta

---

#### Test 3.5: Carrito Vacío
**Objetivo:** Comportamiento cuando carrito está vacío

**Pasos:**
1. Remover todos los items
2. O acceder a /cart sin items

**Resultados Esperados:**
- [ ] Página muestra "Your cart is empty"
- [ ] Botón "Continue Shopping" redirige a home
- [ ] NO hay botón "Proceed to Checkout"

---

### Sección 4: Checkout

#### Test 4.1: Checkout Sin Login
**Objetivo:** Requiere autenticación para checkout

**Pasos:**
1. Logout (si autenticado)
2. Agregar producto al carrito (anonimo)
3. /cart > "Proceed to Checkout"

**Resultados Esperados:**
- [ ] Página redirige a /login
- [ ] O muestra mensaje "Login Required"
- [ ] Botón "Go to Login"

---

#### Test 4.2: Checkout Con Login
**Objetivo:** Usuario logeado puede hacer checkout

**Pasos:**
1. Login (test@example.com)
2. Agregar 2-3 productos al carrito
3. /cart > "Proceed to Checkout"

**Resultados Esperados:**
- [ ] URL es /checkout
- [ ] Muestra "Customer Information"
  - [ ] Email mostrado correctamente
  - [ ] Full Name mostrado correctamente
- [ ] Muestra "Order Summary"
  - [ ] Todos los items listados
  - [ ] Imágenes correctas
  - [ ] Cantidades correctas
  - [ ] Precios correctos
  - [ ] Subtotal calculado bien
  - [ ] Shipping: $5.00
  - [ ] Total = Subtotal + Shipping

---

#### Test 4.3: Place Order
**Objetivo:** Crear orden en backend

**Pasos:**
1. Página checkout (con items y logeado)
2. Clic "Place Order"
3. Esperar procesamiento

**Resultados Esperados:**
- [ ] Botón pasa a estado "Processing..."
- [ ] Backend crea orden (POST /api/v1/orders/checkout)
- [ ] Status en respuesta: 201 Created
- [ ] Toast verde "Order placed successfully"
- [ ] Carrito se limpia (localStorage + backend)
- [ ] Redirige a home
- [ ] Header muestra carrito vacío (contador desaparece)

**DevTools Verificación:**
```
Network > POST /api/v1/orders/checkout
# Status: 201
# Response contiene orden creada con ID

Application > localStorage > cart
# Debe estar vacío o no existir
```

---

#### Test 4.4: Error en Checkout
**Objetivo:** Manejo de errores durante orden

**Pasos:**
1. Si backend se cae, clic "Place Order"
2. O backend retorna error

**Resultados Esperados:**
- [ ] Toast rojo con mensaje de error
- [ ] Botón vuelve a estado normal
- [ ] NO redirige
- [ ] Carrito NO se limpia

---

### Sección 5: Header y Navegación

#### Test 5.1: Header Anonimo
**Objetivo:** Elementos correctos cuando no autenticado

**Pasos:**
1. Logout (si autenticado)
2. Observar header

**Resultados Esperados:**
- [ ] Logo visible
- [ ] "Categorías" dropdown presente
- [ ] Search bar presente
- [ ] Icono usuario (simple, no dropdown)
- [ ] Carrito con contador

---

#### Test 5.2: Header Autenticado
**Objetivo:** Dropdown de usuario visible

**Pasos:**
1. Login
2. Observar header

**Resultados Esperados:**
- [ ] Icono usuario es clickeable
- [ ] Dropdown muestra:
  - [ ] Email del usuario
  - [ ] Link "Profile"
  - [ ] Link "My Orders"
  - [ ] Link "Logout" en rojo
- [ ] Clic email: (disabled, no action)
- [ ] Clic "Profile": navega a /profile (puede no existir)
- [ ] Clic "My Orders": navega a /orders (puede no existir)
- [ ] Clic "Logout": logout funciona

---

#### Test 5.3: Carrito Counter
**Objetivo:** Contador actualiza correctamente

**Pasos:**
1. Home > Agregar producto (qty: 2)
2. Header > contador = 2
3. Agregar otro (qty: 3)
4. Contador = 5

**Resultados Esperados:**
- [ ] Contador muestra número correcto
- [ ] Si contador > 99, muestra "99+"
- [ ] Si contador = 0, no se ve badge

---

#### Test 5.4: Categorías Dropdown
**Objetivo:** Dropdown de categorías abre

**Pasos:**
1. Header > "Categorías" dropdown
2. Clic en categoría

**Resultados Esperados:**
- [ ] Dropdown abre
- [ ] Muestra 5+ categorías
- [ ] Clic en categoría: (navegación puede no estar implementada, pero no errores)

---

### Sección 6: Persistencia y Estados

#### Test 6.1: Persistencia de Sesión
**Objetivo:** Token se guarda y restaura

**Pasos:**
1. Login (test@example.com)
2. Recargar página (F5)
3. Verificar estado

**Resultados Esperados:**
- [ ] Header sigue mostrando usuario autenticado
- [ ] NO requiere re-login
- [ ] AuthContext se restaura
- [ ] localStorage.authToken existe

---

#### Test 6.2: Persistencia de Carrito
**Objetivo:** Carrito se guarda entre sesiones

**Pasos:**
1. Agregar 2 productos al carrito
2. Recargar página
3. Ir a /cart

**Resultados Esperados:**
- [ ] Carrito sigue teniendo los 2 productos
- [ ] Cantidades son las mismas

---

#### Test 6.3: Persistencia Entre Autenticación
**Objetivo:** Carrito persiste al autenticar

**Pasos:**
1. Logout
2. Agregar producto (anonimo)
3. Login
4. Verificar carrito

**Resultados Esperados:**
- [ ] Carrito anterior se sincroniza
- [ ] Nuevo item disponible en /cart
- [ ] Backend tiene los items

---

### Sección 7: Responsive / Mobile

#### Test 7.1: Mobile Menu
**Objetivo:** Menú funciona en mobile

**Pasos:**
1. DevTools > Toggle Device Toolbar (mobile view)
2. Header > Hamburger menu
3. Observar opciones

**Resultados Esperados:**
- [ ] Menú abre
- [ ] Muestra logo y categorías
- [ ] Clic en categoría navega
- [ ] Cierra al navegar

---

#### Test 7.2: Mobile Search Bar
**Objetivo:** Search bar visible en mobile

**Pasos:**
1. Mobile view
2. Scroll hacia abajo del header

**Resultados Esperados:**
- [ ] Search bar visible
- [ ] Input focus funciona

---

### Sección 8: Error Handling

#### Test 8.1: API Timeout
**Objetivo:** Comportamiento si backend es lento

**Pasos:**
1. Network tab > throttle (Slow 3G)
2. Clic "Add to Cart"
3. Observar

**Resultados Esperados:**
- [ ] UI muestra loading state (si implementado)
- [ ] NO congela
- [ ] Eventualmente se completa o muestra error

---

#### Test 8.2: Backend Down
**Objetivo:** Comportamiento si backend cae

**Pasos:**
1. Backend corriendo normalmente
2. Detener backend (Ctrl+C)
3. Frontend > intenta acción que necesite API (ej: login)

**Resultados Esperados:**
- [ ] Toast rojo con mensaje de error
- [ ] NO se congela
- [ ] Propone reintentar o navegar

---

### Sección 9: Performance

#### Test 9.1: Load Time
**Objetivo:** Tiempos de carga aceptables

**Pasos:**
1. DevTools > Lighthouse
2. Run audit
3. Observar scores

**Resultados Esperados:**
- [ ] Performance: > 70
- [ ] Accessibility: > 80
- [ ] Best Practices: > 80

---

#### Test 9.2: Network Requests
**Objetivo:** Número razonable de requests

**Pasos:**
1. Network tab > Reload
2. Contar requests

**Resultados Esperados:**
- [ ] Página carga con <20 requests principales
- [ ] Total payload < 2MB
- [ ] API requests < 500ms cada una

---

### Sección 10: Data Validation

#### Test 10.1: Login Form Validation
**Objetivo:** Validación de campo en login

**Pasos:**
1. Login page
2. Dejar email vacío > Submit
3. Observar

**Resultados Esperados:**
- [ ] HTML5 validation muestra "Required"
- [ ] NO envía request si campos vacíos

---

#### Test 10.2: Register Form Validation
**Objetivo:** Validación de campos en registro

**Pasos:**
1. Register page
2. Intentar registrar con:
   - [ ] Email inválido (sin @)
   - [ ] Password vacío
   - [ ] Nombre vacío

**Resultados Esperados:**
- [ ] Validación HTML5 bloquea submit
- [ ] Mensajes de error apropiados

---

## 📊 Resumen de Resultados

Después de completar todos los tests, llenar esta tabla:

| Sección | Tests | Pasados | Fallados | % |
|---|---|---|---|---|
| 1. Autenticación | 4 | ___ | ___ | ___% |
| 2. Productos | 3 | ___ | ___ | ___% |
| 3. Carrito | 5 | ___ | ___ | ___% |
| 4. Checkout | 4 | ___ | ___ | ___% |
| 5. Header | 4 | ___ | ___ | ___% |
| 6. Persistencia | 3 | ___ | ___ | ___% |
| 7. Responsive | 2 | ___ | ___ | ___% |
| 8. Error Handling | 2 | ___ | ___ | ___% |
| 9. Performance | 2 | ___ | ___ | ___% |
| 10. Validation | 2 | ___ | ___ | ___% |
| **TOTAL** | **32** | **___** | **___** | **___**% |

---

## 🐛 Issues Encontrados

Use este formato para reportar issues:

```
Issue #1
--------
Sección: [1-10]
Test: [Test Name]
Descripción: [Qué pasó]
Pasos para reproducir: [Paso a paso]
Resultado esperado: [Qué debería pasar]
Resultado actual: [Qué pasó realmente]
Severidad: [Crítica | Alta | Media | Baja]
```

---

## ✅ Sign-Off

- [ ] Todos los tests completados
- [ ] Documentación revisada
- [ ] Sin issues críticos
- [ ] Sistema listo para producción

**Tester:** _________________________ **Fecha:** _________

**Revisor:** _________________________ **Fecha:** _________

---

## 📞 Contacto

Para preguntas o issues durante testing:
- Revisar `INTEGRATION_GUIDE.md`
- Revisar `IMPLEMENTATION_SUMMARY.md`
- Logs del backend: `poetry run uvicorn app.main:app --reload`
- Logs del frontend: `npm run dev`

