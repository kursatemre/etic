# ETIC Architecture Documentation

## Overview

ETIC is a multi-tenant e-commerce SaaS platform built with a modern monorepo architecture using Turborepo.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                          │
│  ┌──────────┐  ┌──────────┐  ┌────────────┐            │
│  │   Web    │  │  Admin   │  │ Storefront │            │
│  │(Next.js) │  │(Next.js) │  │ (Next.js)  │            │
│  └────┬─────┘  └────┬─────┘  └─────┬──────┘            │
└───────┼─────────────┼──────────────┼───────────────────┘
        │             │              │
        └─────────────┼──────────────┘
                      │
        ┌─────────────▼──────────────┐
        │      API Gateway           │
        │   (Express/Fastify)        │
        └─────────────┬──────────────┘
                      │
        ┌─────────────▼──────────────┐
        │    Business Logic          │
        │   (Controllers/Services)   │
        └─────────────┬──────────────┘
                      │
        ┌─────────────▼──────────────┐
        │    Data Layer              │
        │  (Prisma ORM + PostgreSQL) │
        └────────────────────────────┘
```

## Core Concepts

### Multi-Tenancy

ETIC uses a **shared database, shared schema** multi-tenancy approach:

- Single PostgreSQL database
- Each store (tenant) has a unique `storeId`
- Data isolation through `storeId` filtering in queries
- Row-Level Security (RLS) can be added for additional security

**Advantages:**
- Cost-effective (shared infrastructure)
- Easy maintenance and updates
- Simple data migrations

**Trade-offs:**
- Requires careful query filtering
- Noisy neighbor problem (can be mitigated with connection pooling)

### Authentication & Authorization

```
User → JWT Token → Authenticated Routes → Store Access Check
```

1. User authenticates with email/password or OAuth
2. JWT token issued with user ID and email
3. Token required for protected routes
4. Store access verified through `StoreUser` table
5. Role-based permissions (OWNER, ADMIN, STAFF)

### Data Flow

#### Product Creation Flow
```
1. Admin UI → Create Product Request
2. API → Validate Input (Zod schemas)
3. API → Check Store Access
4. API → Create Product in DB (Prisma)
5. API → Return Product Data
6. Admin UI → Update State
```

#### Order Processing Flow
```
1. Storefront → Add to Cart
2. Storefront → Checkout
3. Payment Gateway → Process Payment
4. Webhook → Confirm Payment
5. API → Create Order
6. API → Update Inventory
7. API → Send Confirmation Email
```

## Technology Stack

### Backend
- **Runtime:** Node.js 18+
- **Language:** TypeScript
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** PostgreSQL 14+
- **Cache:** Redis (optional)
- **Authentication:** JWT

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Custom + shadcn/ui
- **State Management:** Zustand + React Query
- **Animations:** Framer Motion

### DevOps
- **Monorepo:** Turborepo
- **Package Manager:** pnpm
- **Version Control:** Git
- **CI/CD:** GitHub Actions (planned)
- **Hosting:** Vercel/Railway (planned)

## Database Schema Design

### Key Tables

1. **User** - Platform users (store owners, staff)
2. **Store** - Tenant/store data
3. **StoreUser** - User-Store relationship with roles
4. **Product** - Product catalog
5. **ProductVariant** - Product variations (size, color, etc.)
6. **Category** - Hierarchical product categories
7. **Order** - Customer orders
8. **Customer** - Store customers
9. **Theme** - Storefront themes

### Relationships

- User → StoreUser (many-to-many through StoreUser)
- Store → Products (one-to-many)
- Product → ProductVariants (one-to-many)
- Category → Products (many-to-many)
- Store → Orders (one-to-many)
- Order → OrderItems (one-to-many)

## API Design

### RESTful Principles

- Standard HTTP methods (GET, POST, PATCH, DELETE)
- Resource-based URLs
- JSON request/response format
- Proper status codes

### Response Format

```typescript
{
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    page?: number
    limit?: number
    total?: number
  }
}
```

### Authentication

- Bearer token in Authorization header
- Token contains: user ID, email, expiry
- Tokens refresh automatically (planned)

## Security Measures

1. **Input Validation** - Zod schemas for all inputs
2. **SQL Injection Protection** - Prisma ORM parameterized queries
3. **XSS Protection** - Content Security Policy headers
4. **CSRF Protection** - Token-based (planned)
5. **Rate Limiting** - Express rate limit middleware
6. **Password Hashing** - bcrypt with salt rounds
7. **SSL/TLS** - HTTPS enforced in production
8. **CORS** - Configured allowed origins

## Performance Optimization

1. **Database Indexing** - Indexed frequently queried columns
2. **Connection Pooling** - Prisma connection pool
3. **Caching** - Redis for session/query caching
4. **Code Splitting** - Next.js automatic code splitting
5. **Image Optimization** - Next.js Image component
6. **API Response Caching** - Cache-Control headers

## Scalability Considerations

### Horizontal Scaling
- Stateless API servers (scale with load balancer)
- Shared PostgreSQL database (can be sharded later)
- Redis for distributed session storage

### Vertical Scaling
- Database can be scaled vertically initially
- Read replicas for heavy read workloads

### Future Improvements
- Microservices architecture for specific features
- Message queue (RabbitMQ/Redis) for async tasks
- CDN for static assets
- Multi-region deployment

## Monitoring & Logging

### Planned Integrations
- Error tracking: Sentry
- Analytics: Google Analytics, Mixpanel
- Logging: Winston + CloudWatch
- APM: New Relic or DataDog
- Uptime monitoring: UptimeRobot

## Deployment Strategy

### Environments
1. **Development** - Local development
2. **Staging** - Pre-production testing
3. **Production** - Live environment

### CI/CD Pipeline (Planned)
```
Git Push → Run Tests → Build → Deploy to Staging → Manual Approval → Deploy to Production
```

## Extensibility

### Plugin System (Future)
- Custom payment gateways
- Shipping providers
- Marketing integrations
- Custom themes

### Webhooks
- Order created/updated
- Payment received
- Inventory low
- Custom events

## Best Practices

1. **Code Quality** - ESLint, Prettier, TypeScript strict mode
2. **Testing** - Unit tests, integration tests, E2E tests
3. **Documentation** - Code comments, API docs, architecture docs
4. **Version Control** - Feature branches, pull requests, code review
5. **Security** - Regular dependency updates, security audits

---

Last updated: 2024
