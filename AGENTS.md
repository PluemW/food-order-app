<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Workspace guidance

- Type: Next.js 16 App Router app, bootstrapped from `create-next-app`.
- Key dependencies: `react` 19, `next` 16.2.2, `tailwindcss` v4, `typescript` 5.
- Run locally with `npm run dev`.
- Build with `npm run build`; lint with `npm run lint`.

## App structure

- `app/page.tsx`: home landing page.
- `app/menu/page.tsx`: client-side menu and cart experience.
- `app/orders/page.tsx`: kitchen dashboard with polling and order status updates.
- `app/components/CartSidebar.tsx`: cart UI overlay.
- `app/components/CheckoutModal.tsx`: checkout form and order submission.
- `app/api/orders/route.ts`: API route for `GET`, `POST`, and `PATCH` order handling.
- `lib/data.ts`: menu items, categories, order types, and shared helpers.

## Important conventions

- `app/menu/page.tsx` and `app/orders/page.tsx` are client components (`"use client"`).
- `app/api/orders/route.ts` uses in-memory state for orders; runtime restart clears state.
- Use the root alias `@/*` when importing local modules.
- Prefer modifying UI logic in `app/*` and shared data in `lib/data.ts`.
- Keep API semantics intact: `POST` creates orders, `GET` returns current orders, `PATCH` updates status.

## What to keep in mind

- This is a demo-style app; do not add persistent database layers unless the task specifically requires it.
- Avoid refactoring the core Next.js app router setup unless needed for a requested feature.
- Tailwind styles are applied directly through class names.
- The cart and checkout flow are client-side only.

## Suggested prompts

- "Improve the menu page UX for mobile devices." 
- "Add a new order status and update the kitchen dashboard to support it." 
- "Refactor the checkout modal to validate phone numbers for delivery orders."

<!-- END:nextjs-agent-rules -->
