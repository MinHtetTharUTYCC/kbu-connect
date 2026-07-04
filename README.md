# KBU Connect

A dating and social discovery platform for KBU students. Swipe, match, chat.

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router)
- **Language:** TypeScript
- **UI:** [shadcn/ui](https://ui.shadcn.com) + Radix UI + Tailwind CSS v4
- **State:** [TanStack React Query](https://tanstack.com/query/latest) + [TanStack React Form](https://tanstack.com/form/latest)
- **Validation:** [Zod](https://zod.dev)
- **Linting:** [Biome](https://biomejs.dev)
- **Compiler:** React Compiler (enabled)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Setup

```bash
pnpm install
```

Copy the env file and set your API URL:

```bash
cp .env.example .env
```

```env
NEXT_PUBLIC_API_URL=https://your-api-url.com
```

### Development

```bash
pnpm dev
```

App runs on [http://localhost:3001](http://localhost:3001).

### Build & Start

```bash
pnpm build
pnpm start
```

### Lint & Format

```bash
pnpm lint
pnpm format
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/    # Authentication
│   └── (web)/           # Main app
│       ├── chat/        # Conversations & messaging
│       ├── discover/    # Swipe feed
│       ├── matches/     # Match list
│       ├── profile/     # User profile view/edit
│       ├── profilesetup/# Onboarding flow
│       └── notification/# Notifications
├── components/          # Shared UI components
├── hooks/               # Custom React hooks
└── lib/                 # Utilities, API clients
```

## Features

- Email-based magic link authentication
- Profile setup with preferences (faculty, nationality, age range, interests)
- Discovery feed with swipe-to-like/dislike
- Real-time chat with shoutouts
- Match management with unmatch/block/report
- Admin panel (user management, stats, audit logs, ban/unban)

## API

API json: https://.../api/json
API swagger UI: https://.../api/docs
