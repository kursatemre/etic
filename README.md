# ETIC - E-Commerce SaaS Platform

Modern, powerful, and easy-to-use e-commerce platform. Built with Next.js, TypeScript, and PostgreSQL.

## 🚀 Features

- **Multi-tenant Architecture** - Each store has isolated data and settings
- **Unlimited Products & Traffic** - No limits on your growth
- **Multi-language & Multi-currency** - Sell globally
- **Secure Payments** - Integrated with Stripe, iyzico and more
- **Advanced Analytics** - Track your sales and customer behavior
- **Mobile Responsive** - Perfect on every device
- **Theme Engine** - Customizable storefront themes
- **7/24 Support** - We're always here to help

## 🏗️ Tech Stack

### Backend
- Node.js + TypeScript + Express
- PostgreSQL (Multi-tenant)
- Prisma ORM
- JWT Authentication
- Redis (Caching)

### Frontend
- Next.js 14+ (App Router)
- React + TypeScript
- Tailwind CSS
- Framer Motion
- Zustand / React Query

### Infrastructure
- Monorepo with Turborepo
- pnpm workspaces
- Docker support

## 📁 Project Structure

```
etic/
├── apps/
│   ├── web/          # Landing page (Marketing site)
│   ├── admin/        # Admin dashboard (Store management)
│   └── storefront/   # Customer storefront (Theme engine)
├── packages/
│   ├── database/     # Prisma schema & migrations
│   ├── ui/          # Shared UI components
│   ├── config/      # Shared configurations
│   └── types/       # Shared TypeScript types
└── services/
    ├── api/         # REST API
    └── webhooks/    # Payment & integration webhooks
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL 14+
- Redis (optional, for caching)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/etic.git
cd etic
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
# Database
cp packages/database/.env.example packages/database/.env
# API Service
cp services/api/.env.example services/api/.env
```

4. Update the `.env` files with your credentials

5. Generate Prisma Client:
```bash
pnpm db:generate
```

6. Push database schema:
```bash
pnpm db:push
```

### Development

Run all applications in development mode:
```bash
pnpm dev
```

This will start:
- Landing page: http://localhost:3000
- Admin panel: http://localhost:3002
- Storefront: http://localhost:3003
- API Server: http://localhost:3001

### Build

Build all applications:
```bash
pnpm build
```

## 📊 Database Schema

The platform uses a multi-tenant PostgreSQL database with the following main entities:

- **Users & Authentication** - User accounts, sessions, OAuth providers
- **Stores (Tenants)** - Store settings, plans, subscriptions
- **Products** - Products, variants, inventory
- **Categories & Collections** - Product organization
- **Orders** - Order management, transactions
- **Customers** - Customer profiles, addresses
- **Themes** - Storefront customization
- **Analytics** - Event tracking, reporting

## 🔧 Available Scripts

- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all apps
- `pnpm lint` - Lint all apps
- `pnpm format` - Format code with Prettier
- `pnpm db:generate` - Generate Prisma Client
- `pnpm db:push` - Push schema to database
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Open Prisma Studio

## 🎨 Customization

### Theme Colors

Edit `apps/web/tailwind.config.ts` to customize brand colors:

```typescript
colors: {
  primary: { ... },
  secondary: { ... },
}
```

## 📝 API Documentation

API runs on `http://localhost:3001`

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user

### Stores
- `POST /api/v1/stores` - Create store
- `GET /api/v1/stores` - List user's stores
- `GET /api/v1/stores/:id` - Get store details
- `PATCH /api/v1/stores/:id` - Update store
- `DELETE /api/v1/stores/:id` - Delete store

### Products
- `POST /api/v1/products/:storeId` - Create product
- `GET /api/v1/products/:storeId` - List products
- `GET /api/v1/products/:storeId/:id` - Get product
- `PATCH /api/v1/products/:storeId/:id` - Update product
- `DELETE /api/v1/products/:storeId/:id` - Delete product

[Full API documentation coming soon]

## 🚢 Deployment

### Database
1. Create a PostgreSQL database
2. Update `DATABASE_URL` in environment variables
3. Run migrations: `pnpm db:migrate`

### Applications
Build and deploy each application separately or use Docker.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

Inspired by platforms like Shopify, ikas, and other modern e-commerce solutions.

## 📞 Support

- Email: support@etic.com
- Documentation: https://docs.etic.com
- Community: https://community.etic.com

---

Made with ❤️ in Turkey