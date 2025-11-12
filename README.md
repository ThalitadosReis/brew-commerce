# Brew Commerce

Modern coffee storefront built with Next.js App Router, Clerk auth, and MongoDB. The app ships a polished marketing site, a customer shopping experience (including collection, product, checkout, and profile), and an admin console for managing orders, products, and analytics.

## Demo
- Production: https://brew-commerce.vercel.app/

## Tech Stack
- Next.js 15 · React · TypeScript
- Clerk authentication · MongoDB (Mongoose)
- Tailwind-style utility classes
- Stripe checkout + Nodemailer contact

## Getting Started
```bash
npm install
npm run dev
```

Required env vars (`.env.local`):
```
MONGODB_URI=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM=
```

## Scripts
- `npm run dev` – local dev server
- `npm run lint` – lint & typecheck
- `npm run build` – production build
- `npm run start` – run the built app
