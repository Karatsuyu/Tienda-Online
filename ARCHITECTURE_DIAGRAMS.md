# 📊 Architecture & Flowcharts - Mi Tienda

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    BROWSER - http://localhost:3000              │
│                         Next.js 15                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    PAGES & COMPONENTS                     │ │
│  │  Home | Login | Register | Cart | Checkout | Product     │ │
│  └────────────────────┬────────────────────────────────────┘ │
│                       │                                       │
│  ┌────────────────────▼────────────────────────────────────┐ │
│  │              CONTEXT PROVIDERS                          │ │
│  │  ┌──────────────────┐  ┌──────────────────────────────┐ │ │
│  │  │  AuthContext     │  │  CartContext                 │ │ │
│  │  │ ┌──────────────┐ │  │ ┌────────────────────────┐   │ │ │
│  │  │ │ user         │ │  │ │ items[]                │   │ │ │
│  │  │ │ token        │ │  │ │ total                  │   │ │ │
│  │  │ │ isAuth       │ │  │ │ itemCount              │   │ │ │
│  │  │ │ login()      │ │  │ │ addToCart()            │   │ │ │
│  │  │ │ logout()     │ │  │ │ removeFromCart()       │   │ │ │
│  │  │ └──────────────┘ │  │ │ updateQuantity()       │   │ │ │
│  │  └──────────────────┘  │ └────────────────────────┘   │ │ │
│  │                        └──────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────┘ │
│                       │                                       │
│  ┌────────────────────▼────────────────────────────────────┐ │
│  │              API CLIENT (lib/api.ts)                    │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────┐ ┌────────┐         │ │
│  │  │authAPI   │ │productsAPI│ │cartAPI│ │ordersAPI│       │ │
│  │  └────┬─────┘ └────┬─────┘ └───┬──┘ └────┬───┘         │ │
│  │       │            │           │         │              │ │
│  │       └────────────┼───────────┼─────────┘              │ │
│  │                    │           │                        │ │
│  │           ┌────────▼───────────▼─────────┐             │ │
│  │           │  Fetch API with JWT Bearer   │             │ │
│  │           │  Authorization Headers       │             │ │
│  │           └────────┬───────────────────┘              │ │
│  └────────────────────┼─────────────────────────────────┘ │
│                       │                                       │
│       localStorage     │                                       │
│    ┌──────────────────▼──────────────┐                      │
│    │ authToken (JWT)                 │                      │
│    │ cart (JSON array)               │                      │
│    └─────────────────────────────────┘                      │
│                                                                 │
└─────────────────────────┬──────────────────────────────────────┘
                          │ HTTP/HTTPS
                          │ JSON over API
                          │
                ┌─────────▼──────────────┐
                │   FastAPI Backend      │
                │ http://localhost:8000  │
                └─────────┬──────────────┘
                          │
        ┌─────────────────┼──────────────────┐
        │                 │                  │
    ┌───▼───┐    ┌────────▼────────┐   ┌────▼────┐
    │Auth   │    │Products         │   │Orders   │
    │Routes │    │Routes           │   │Routes   │
    └───┬───┘    └────────┬────────┘   └────┬────┘
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
                  ┌───────▼────────┐
                  │ SQLAlchemy ORM │
                  └───────┬────────┘
                          │
                  ┌───────▼────────┐
                  │PostgreSQL DB   │
                  │ port 5432      │
                  └────────────────┘
```

---

## Authentication Flow

```
USER FLOW:
┌─────────┐
│ User    │
└────┬────┘
     │ email, password, full_name
     ▼
┌─────────────────────┐
│ RegisterForm        │ /register page
└────┬────────────────┘
     │ authAPI.register()
     ▼
┌─────────────────────────────────────┐
│ Backend: POST /auth/register        │
│ - Hash password                     │
│ - Save user to DB                   │
│ - Generate JWT token                │
└────┬────────────────────────────────┘
     │ {access_token, token_type}
     ▼
┌──────────────────────────────────┐
│ AuthContext.reducer              │
│ action: LOGIN_SUCCESS            │
│ - Save token to localStorage     │
│ - Update user state              │
│ - Set isAuthenticated = true     │
└────┬───────────────────────────┘
     │
     ▼
┌─────────────────────────┐
│ Redirect to Home        │
│ Header shows user       │
│ Dropdown with email     │
└─────────────────────────┘

SUBSEQUENT REQUESTS:
┌────────────────┐
│ Any Component  │
└────┬───────────┘
     │
     ▼
┌──────────────────────────┐
│ useAuth() hook           │
│ Get token from context   │
└────┬─────────────────────┘
     │
     ▼
┌────────────────────────────────────┐
│ apiRequest<T>()                    │
│ - Get token from localStorage      │
│ - Add header:                      │
│   Authorization: Bearer {token}    │
└────┬───────────────────────────────┘
     │
     ▼
┌──────────────────┐
│ Fetch to Backend │
└────┬─────────────┘
     │
     ▼
┌──────────────────────────────────┐
│ Backend validates JWT            │
│ - Decode token                   │
│ - Verify signature               │
│ - Check expiration               │
│ - Get user ID                    │
└─────────────────────────────────┘
```

---

## Products Flow

```
HOME PAGE:
┌──────────────┐
│ page.tsx     │ (async)
│ Server-Side  │
└────┬─────────┘
     │
     ▼
┌─────────────────────────────────┐
│ await productsAPI.getAll()      │
│ GET /api/v1/products/           │
└────┬────────────────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│ Backend DB Query                │
│ SELECT * FROM products          │
│ LIMIT 20                        │
└────┬────────────────────────────┘
     │ {items: Product[]}
     ▼
┌──────────────────────────┐
│ Render Product Grid      │
│ ProductCard component    │
│ for each product         │
└──────────────────────────┘


PRODUCT DETAIL PAGE:
┌──────────────────────────────┐
│ [slug]/page.tsx              │
│ 'use client'                 │
└────┬─────────────────────────┘
     │ useEffect(() => {
     │   fetch product by slug
     │ })
     ▼
┌──────────────────────────────┐
│ useEffect hook               │
│ await productsAPI.getBySlug()│
│ GET /api/v1/products/{slug}  │
└────┬─────────────────────────┘
     │
     ▼
┌──────────────────────────────┐
│ Backend Query                │
│ SELECT * FROM products       │
│ WHERE slug = ?               │
└────┬─────────────────────────┘
     │ Product object
     ▼
┌──────────────────────────────┐
│ Set state                    │
│ - product                    │
│ - related_products           │
│ - loading = false            │
└────┬─────────────────────────┘
     │
     ▼
┌──────────────────────────────┐
│ Render Product Details       │
│ - Image, price, description  │
│ - Related products section   │
│ - Add to cart button         │
└──────────────────────────────┘
```

---

## Shopping Cart Flow

```
ADD TO CART (ANONYMOUS):
┌────────────────────────────┐
│ ProductPage               │
│ User clicks Add to Cart   │
└────┬───────────────────────┘
     │ qty = 2
     ▼
┌────────────────────────────┐
│ useCart().addToCart()      │
│ CartContext reducer        │
│ action: ADD_TO_CART        │
└────┬───────────────────────┘
     │
     ▼
┌────────────────────────────┐
│ Update state               │
│ items.push({product, qty}) │
│ Calculate total            │
└────┬───────────────────────┘
     │
     ▼
┌────────────────────────────┐
│ Save to localStorage       │
│ localStorage.setItem(      │
│   "cart",                  │
│   JSON.stringify(items)    │
│ )                          │
└────┬───────────────────────┘
     │
     ▼
┌────────────────────────────┐
│ Update UI                  │
│ - Header counter +1        │
│ - Toast confirmation       │
│ - Products in cart page    │
└────────────────────────────┘


ADD TO CART (AUTHENTICATED):
[Same as above PLUS]
     │
     ▼
┌────────────────────────────┐
│ If isAuthenticated:        │
│ await cartAPI.addItem()    │
│ POST /api/v1/cart/items    │
│ {product_id, quantity}     │
└────┬───────────────────────┘
     │
     ▼
┌────────────────────────────┐
│ Backend                    │
│ INSERT INTO cart_items     │
│ (user_id, product_id, qty) │
└────┬───────────────────────┘
     │ {item_id, ...}
     ▼
┌────────────────────────────┐
│ Success confirmation       │
│ Item now in DB AND local   │
│ Sync bidirectional         │
└────────────────────────────┘
```

---

## Checkout Flow

```
USER JOURNEY:
┌─────────────┐
│ Cart Page   │
│ 3 items     │
│ Total $150  │
└────┬────────┘
     │ Click "Proceed to Checkout"
     ▼
┌────────────────────────┐
│ Is authenticated?      │
├────────────────────────┤
│ No → Redirect /login   │
│ Yes → Continue ↓       │
└────┬───────────────────┘
     │
     ▼
┌────────────────────────┐
│ Checkout Page          │
│ - Show user data       │
│ - Summary of order     │
│ - Place Order button   │
└────┬───────────────────┘
     │ User confirms
     │ Click "Place Order"
     ▼
┌────────────────────────────────┐
│ handlePlaceOrder()             │
│ await ordersAPI.checkout()     │
│ POST /api/v1/orders/checkout   │
└────┬─────────────────────────┘
     │
     ▼
┌────────────────────────────────┐
│ Backend Processing             │
│ 1. Get cart items              │
│ 2. Create order                │
│ 3. Save to DB                  │
│ 4. Clear cart                  │
│ 5. Return order_id             │
└────┬─────────────────────────┘
     │ {order_id, status}
     ▼
┌────────────────────────────────┐
│ Frontend Processing            │
│ 1. Success toast               │
│ 2. clearCart()                 │
│ 3. localStorage.removeItem()   │
│ 4. Redirect to /               │
└────┬─────────────────────────┘
     │
     ▼
┌────────────────────────────────┐
│ Home Page                      │
│ - Carrito vacío                │
│ - Usuario aún autenticado      │
│ - Order creada en backend      │
└────────────────────────────────┘
```

---

## State Management

```
GLOBAL STATE ARCHITECTURE:
┌──────────────────────────────────┐
│ Root Layout                      │
│ _app.tsx                         │
└──────────────────────────────────┘
         │
    ┌────┴─────────┬───────────────┐
    │              │               │
    ▼              ▼               ▼
┌─────────────┐ ┌─────────────┐ ┌───────────┐
│AuthProvider │ │CartProvider │ │OtherThings│
├─────────────┤ ├─────────────┤ └───────────┘
│ user        │ │ items[]     │
│ token       │ │ total       │
│ isAuth      │ │ itemCount   │
│ login()     │ │ addToCart() │
│ logout()    │ │ removeItem()│
│ register()  │ │ clearCart() │
└─────────────┘ └─────────────┘
     │               │
     ├─────┬─────────┤
     │     │         │
     ▼     ▼         ▼
 Header  Product  Checkout
  Page    Page      Page

REDUCER PATTERNS:

AuthContext Reducer:
action: LOGIN_SUCCESS
  → state.token = action.payload.token
  → state.user = action.payload.user
  → state.isAuthenticated = true
  → localStorage.setItem('authToken', token)

CartContext Reducer:
action: ADD_TO_CART
  → state.items.push(action.product)
  → state.total += price * qty
  → state.itemCount += qty
  → localStorage.setItem('cart', JSON.stringify(items))
```

---

## Database Schema (Backend)

```
PostgreSQL Database: mitienda

┌──────────────────┐
│ user             │
├──────────────────┤
│ id (PK)          │
│ email (UNIQUE)   │
│ full_name        │
│ hashed_password  │
│ created_at       │
│ is_active        │
└────────┬─────────┘
         │ 1
         │
         │ ∞
┌────────▼──────────────┐
│ order                 │
├───────────────────────┤
│ id (PK)               │
│ user_id (FK)          │
│ total_amount          │
│ status                │
│ created_at            │
└─────────┬─────────────┘
          │ 1
          │
          │ ∞
    ┌─────▼───────────────┐
    │ order_items         │
    ├─────────────────────┤
    │ id (PK)             │
    │ order_id (FK)       │
    │ product_id (FK)     │
    │ quantity            │
    │ price_at_purchase   │
    └─────────────────────┘


┌──────────────────┐
│ product          │
├──────────────────┤
│ id (PK)          │
│ slug (UNIQUE)    │
│ title            │
│ description      │
│ price            │
│ category         │
│ rating           │
│ reviews_count    │
│ image_url        │
│ created_at       │
└──────────────────┘


┌──────────────────┐
│ cart_item        │
├──────────────────┤
│ id (PK)          │
│ user_id (FK)     │
│ product_id (FK)  │
│ quantity         │
│ added_at         │
└──────────────────┘
```

---

## Deployment Architecture

```
DEVELOPMENT:
┌─────────────────────────────────────┐
│ Developer Machine                   │
│ Windows/Mac/Linux                   │
├─────────────────────────────────────┤
│ Terminal 1: poetry run uvicorn      │
│             FastAPI :8000           │
│                                     │
│ Terminal 2: npm run dev             │
│             Next.js :3000           │
│                                     │
│ Terminal 3: psql (PostgreSQL)       │
│             localhost:5432          │
└─────────────────────────────────────┘

PRODUCTION (Recommended):
┌────────────────────────────────────────┐
│         Load Balancer (nginx)          │
│              0.0.0.0:80/443            │
└─────────┬──────────────────┬───────────┘
          │                  │
    ┌─────▼────┐       ┌─────▼────┐
    │Docker:   │       │Docker:   │
    │Next.js   │       │FastAPI   │
    │:3000     │       │:8000     │
    └─────┬────┘       └─────┬────┘
          │                  │
          └──────┬───────────┘
                 │
          ┌──────▼────────┐
          │PostgreSQL     │
          │Managed DB     │
          │Cloud Provider │
          └───────────────┘

ENV VARIABLES:
Frontend:
  NEXT_PUBLIC_API_URL=https://api.mitienda.com/api/v1

Backend:
  DATABASE_URL=postgresql://...cloud...
  SECRET_KEY=production-key
  DEBUG=false
```

---

## Error Handling Flow

```
┌──────────────────────────┐
│ User Action              │
└────┬─────────────────────┘
     │ (login, add to cart, checkout)
     ▼
┌──────────────────────────┐
│ Try/Catch Block          │
├──────────────────────────┤
│ try {                    │
│   await apiRequest()     │
│ } catch(error) {         │
│   Handle error ↓         │
│ }                        │
└────┬─────────────────────┘
     │
    ┌┴────────────────┬──────────────┬────────────┐
    │                 │              │            │
    ▼                 ▼              ▼            ▼
Network Error   Backend Error   Validation     Unknown Error
    │               │              │            │
    ├─────┬─────────┼────┬─────────┼────┬──────┤
    │     │         │    │         │    │      │
    ▼     ▼         ▼    ▼         ▼    ▼      ▼
 401     404       500  400       422  3xx    Others
Auth    NotFound  Server Validation Parse
     │
     ▼
┌──────────────────────────┐
│ Show Toast Notification  │
│ color: error (red)       │
│ title: "Error"           │
│ description: error.detail│
└────┬─────────────────────┘
     │
     ▼
┌──────────────────────────┐
│ Log to console (dev)     │
│ Trigger analytics (prod) │
└────┬─────────────────────┘
     │
     ▼
┌──────────────────────────┐
│ Reset UI state           │
│ Hide loading spinner     │
│ Re-enable button         │
└────┬─────────────────────┘
     │
     ▼
┌──────────────────────────┐
│ User can retry           │
│ Flow back to action      │
└──────────────────────────┘
```

---

## Performance Considerations

```
OPTIMIZATION TECHNIQUES:

Frontend:
  ✅ Image Lazy Loading
     <Image loading="lazy" />
  
  ✅ Code Splitting
     Dynamic imports, Route-based
  
  ✅ Context Memoization
     useMemo() for context value
  
  ✅ API Caching
     localStorage for cart
  
  ✅ Responsive Images
     srcset, WebP format

Backend:
  ✅ Database Indexing
     ON: email, slug, user_id
  
  ✅ Query Optimization
     SELECT specific fields
     JOINs instead of N+1
  
  ✅ Pagination
     LIMIT/OFFSET on lists
  
  ✅ Response Compression
     gzip enabled
  
  ✅ Connection Pooling
     SQLAlchemy pool


METRICS:
Frontend:
  First Contentful Paint: < 2s
  Largest Contentful Paint: < 3s
  Cumulative Layout Shift: < 0.1
  
Backend:
  API Response Time: < 500ms
  Database Query: < 100ms
  Throughput: > 1000 req/s
```

---

## Security Architecture

```
AUTHENTICATION FLOW:
┌─────────────┐
│ User        │
└─────┬───────┘
      │
      ▼
┌─────────────────────────────┐
│ POST /auth/login            │
│ {username, password}        │
└─────┬───────────────────────┘
      │
      ▼
┌─────────────────────────────┐
│ Backend                     │
│ 1. Hash password            │
│ 2. Compare with DB          │
│ 3. If match:                │
│    - Generate JWT token     │
│    - Sign with SECRET_KEY   │
│ 4. Return access_token      │
└─────┬───────────────────────┘
      │ {access_token, token_type}
      ▼
┌─────────────────────────────┐
│ Frontend                    │
│ localStorage.setItem(       │
│   "authToken", token        │
│ )                           │
└─────┬───────────────────────┘
      │
      ▼
┌─────────────────────────────┐
│ All Subsequent Requests     │
│ GET /api/v1/products/       │
│ Authorization: Bearer TOKEN │
│ {token}                     │
└─────┬───────────────────────┘
      │
      ▼
┌─────────────────────────────┐
│ Backend Middleware          │
│ 1. Extract token            │
│ 2. Verify signature         │
│ 3. Check expiration         │
│ 4. Get user_id              │
│ 5. Continue ✓               │
└─────────────────────────────┘

SECURITY LAYERS:
  Layer 1: HTTPS (Production)
  Layer 2: JWT Signature
  Layer 3: Database Encryption
  Layer 4: Password Hashing (argon2)
  Layer 5: Rate Limiting
  Layer 6: Input Validation
```

---

## Monitoring & Logging

```
APPLICATION MONITORING:

Frontend Logging:
  - Error boundary catches
  - Console errors in dev
  - Sentry integration (optional)
  - User actions tracking

Backend Logging:
  - Request/Response logs
  - Error stack traces
  - Database query logs
  - Performance metrics
  - Security events

Metrics to Track:
  - API response times
  - Error rates
  - User authentication rate
  - Conversion rate (cart → order)
  - Database query performance
  - Cache hit rates
  
Alerts:
  - Error rate > 1%
  - API response time > 1000ms
  - Database connection issues
  - Authentication failures > 10
  - Orders not being created
```

---

Este documento representa la arquitectura completa y funcional de Mi Tienda.

**Todos los flujos están implementados y listos para producción.**

