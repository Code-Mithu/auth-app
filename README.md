# Auth App

A complete authentication system built with Next.js 15 and Supabase.

## Features

- User registration with email verification
- Login with email/password
- Password reset functionality
- Protected routes with middleware
- User profile management
- Session persistence
- RLS (Row Level Security) policies

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **Auth**: @supabase/ssr for server-side auth

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── auth/callback/route.ts  # OAuth callback handler
│   ├── dashboard/page.tsx       # Protected dashboard
│   ├── forgot-password/page.tsx # Password reset form
│   ├── login/page.tsx           # Login page
│   ├── register/page.tsx        # Registration page
│   ├── reset-password/page.tsx  # Reset password form
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page (redirects)
│   └── globals.css               # Global styles
├── components/
│   ├── LogoutButton.tsx         # Sign out button
│   ├── ProfileCard.tsx          # User profile display
│   └── Providers.tsx            # Auth provider wrapper
├── contexts/
│   └── AuthContext.tsx          # Authentication context
├── utils/supabase/
│   ├── client.ts                # Browser client
│   ├── server.ts                # Server client
│   └── middleware.ts            # Auth middleware helpers
├── middleware.ts                # Route protection
└── supabase/migrations/         # Database migrations
```

## Authentication Flow

1. **Register**: Create account with email and password
2. **Login**: Sign in with credentials
3. **Session**: Maintained via HTTP-only cookies
4. **Protected Routes**: Middleware checks session
5. **Logout**: Clear session and redirect to login

## License

MIT
