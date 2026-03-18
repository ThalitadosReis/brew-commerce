# Brew Commerce

A modern coffee e-commerce storefront built with Next.js App Router, custom JWT authentication, and MongoDB. Ships a polished marketing site, a full shopping experience (collection, product detail, cart, and Stripe checkout), and a protected admin console for managing orders and products.

## Live Preview
https://brew-commerce.vercel.app/

## Tech Stack
- **Next.js 15** · React · TypeScript
- **MongoDB** (Mongoose) · custom JWT auth (bcryptjs)
- **Stripe** checkout
- **Nodemailer** contact form
- **Tailwind CSS** · Framer Motion · Phosphor Icons

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/collection` | Product catalog with search and filters |
| `/collection/[id]` | Product detail with size selector and similar products |
| `/contact` | Contact form + location |
| `/about` | Brand story, team, and values |
| `/success` | Post-checkout confirmation |
| `/admin` | Admin console (overview, orders, products) |
| `/admin-login` | Admin login |

## Admin Access
The admin console is protected by JWT. Seed the database to create a default admin account:
```bash
npm run seed
```

## Getting Started
```bash
npm install
npm run dev
```

## Environment Variables
Create a `.env.local` file at the project root:
```
# Database
MONGODB_URI=

# Auth
JWT_SECRET=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Email (Nodemailer)
EMAIL_HOST=
EMAIL_PORT=
EMAIL_SECURE=
EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM=
EMAIL_TO=
```

## Scripts
```bash
npm run dev      # local dev server
npm run build    # production build
npm run start    # run built app
npm run lint     # lint & typecheck
npm run seed     # seed database with admin user and sample products
```
