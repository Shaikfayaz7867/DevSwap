# DevSwap

Production-ready full-stack developer platform combining:

- Tinder-style developer skill matching
- Learning content feed with markdown posts
- Real-time chat with typing + online presence
- PWA-ready Next.js web app

## Monorepo Structure

```txt
frontend/  -> Next.js App Router + TypeScript + Tailwind + Zustand + React Query
backend/   -> Node.js + Express + MongoDB + Socket.IO
```

---

## Features Implemented

### Landing Website
- Hero section with CTA
- Features and preview blocks
- Responsive layout
- SEO metadata + sitemap + robots
- Theme support (dark default + light toggle)

### Web App (PWA)
- `/onboarding` multi-step form (React Hook Form + Zod)
- `/home` swipe cards with drag gestures
- `/feed` post creation + feed + interactions
- `/matches` match list and presence
- `/chat` real-time conversation UI
- `/profile` editable profile + posts
- `/settings` theme + notifications
- `/explore` trending tags/users

### Auth & Security
- Email/password auth
- Google token login endpoint
- JWT auth middleware
- Input validation (Zod)
- Mongo sanitize + helmet + CORS + rate limiting

### Backend APIs
- Auth, users, onboarding, swipes, posts, matches, chat, notifications, explore, upload
- Mongoose models for Users/Matches/Messages/Posts/Comments/Notifications/Swipes
- Socket.IO event channels for chat + typing + presence

---

## Quick Start (after installing packages)

### 1) Backend

```bash
# from backend/
npm install
cp .env.example .env
npm run dev
```

### 2) Frontend

```bash
# from frontend/
npm install
cp .env.example .env.local
npm run dev
```

---

## Environment Variables

### backend/.env
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CLIENT_URL`
- `CLOUDINARY_*`
- `GOOGLE_CLIENT_ID`

### frontend/.env.local
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SOCKET_URL`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
- `NEXT_PUBLIC_APP_URL`

---

## Notes

- Google login requires a valid Google OAuth client and front-end token generation.
- Cloudinary upload requires cloud and upload preset/API configuration.
- PWA service worker is enabled in production build via `next-pwa`.
