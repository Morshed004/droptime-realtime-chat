# ⚡ DropTime Chat

A cutting-edge, **Neo-brutalist** realtime chat application built with **Next.js 16**, **ElysiaJS**, and **Upstash**. Designed for privacy and speed, DropTime Chat features ephemeral, 2-participant rooms that self-destruct after 20 minutes.

![Project Preview](https://github.com/user-attachments/assets/placeholder) <!-- Replace with actual screenshot if available -->

## ✨ Features

- **🛡️ Secure Ephemeral Rooms**: Rooms are created with a 20-minute Time-To-Live (TTL). Once the timer hits zero, all data is purged from Redis.
- **👥 2-Participant Limit**: Enforced room capacity to ensure private, one-on-one transmissions.
- **🚀 Realtime Synchronization**: Instant message delivery and room destruction events powered by Upstash Realtime.
- **🎨 Neo-brutalist Design**: A bold, high-contrast UI featuring heavy borders, vibrant colors, and sharp shadows.
- **🔐 Token-Based Access**: Secure room entry managed via HTTP-only cookies and unique participant tokens.
- **🧬 Type-Safe API**: End-to-end type safety between the frontend and backend using Elysia and Eden Treaty.

## 🛠️ Tech Stack

- **Frontend**: [Next.js 16 (App Router)](https://nextjs.org/), [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) (Modern Neo-brutalism)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend**: [ElysiaJS](https://elysiajs.com/) (Integrated into Next.js via Route Handlers)
- **Database/Realtime**: [Upstash Redis](https://upstash.com/docs/redis/overall/getstarted) & [Upstash Realtime](https://upstash.com/docs/realtime/overall/getstarted)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest)
- **Validation**: [Zod](https://zod.dev/)

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <repository-url>
cd realtime-chat
```

### 2. Install dependencies
```bash
bun install
# or
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory and add your Upstash credentials:

```env
# Upstash Redis Configuration
UPSTASH_REDIS_REST_URL="your_upstash_redis_url"
UPSTASH_REDIS_REST_TOKEN="your_upstash_redis_token"

# App Configuration
STROAGE_KEY="username"
```

### 4. Run the development server
```bash
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to start a transmission.

## 🏗️ Project Structure

```text
├── app/
│   ├── api/             # ElysiaJS API Routes (Internal & Realtime)
│   ├── room/[roomId]/   # Realtime Chat Interface
│   └── page.tsx         # Landing Page (Room Creation)
├── components/          # Reusable UI Components
├── hooks/               # Custom React Hooks (User identity, state)
├── lib/                 # Core logic (Redis clients, Realtime config, Eden Treaty)
├── proxy.ts             # Room access middleware/logic
└── public/              # Static assets
```

## 🔒 Security & Performance

- **Participant Isolation**: Users are assigned a unique Nanoid token upon joining, stored in a secure cookie.
- **Automatic Cleanup**: Every message and room metadata entry is tied to the room's TTL in Redis, ensuring zero data persistence after expiration.
- **Lightweight Communication**: Realtime updates use a publish/subscribe model, minimizing overhead.
