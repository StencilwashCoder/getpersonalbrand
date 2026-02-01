# GetPersonalBrand

A web app that lets professionals create a branded personal website combining link-in-bio, about page, and portfolio into one tool.

## Features

- **3-in-1 Website**: Combine your links hub, bio page, and portfolio in one site
- **Drag-and-Drop Editor**: Build your page with blocks (Hero, About, Links, Portfolio, Contact, Divider)
- **Custom Domains**: Use your own domain or a free subdomain (username.getpersonalbrand.com)
- **Analytics Dashboard**: Track page views, link clicks, referrers, and devices
- **Templates**: Choose from Modern, Bold, or Classic templates
- **Theme Customization**: Custom colors, fonts, and styling

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js (email/password + Google OAuth)
- **Drag-and-Drop**: dnd-kit
- **Charts**: Recharts
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your database connection and auth secrets:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/getpersonalbrand"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   ```

4. Run database migrations:
   ```bash
   npx prisma db push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
src/
├── app/
│   ├── (app)/           # Dashboard routes (dashboard, editor, analytics, settings)
│   ├── (auth)/          # Auth routes (login, register)
│   ├── api/             # API routes
│   ├── onboarding/      # Onboarding wizard
│   └── s/               # Published site routes
├── components/
│   ├── blocks/          # Block components (Hero, About, Links, etc.)
│   ├── dashboard/       # Dashboard UI components
│   ├── editor/          # Page editor components
│   └── site/            # Published site renderer
├── lib/
│   ├── auth.ts          # NextAuth configuration
│   ├── prisma.ts        # Prisma client
│   └── templates.ts     # Site templates
└── types/
    └── blocks.ts        # Block type definitions
```

## Deployment

Deploy to Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Configure custom domains in Vercel project settings

For custom domain support, configure:
- Wildcard domain: `*.getpersonalbrand.com`
- App subdomain: `app.getpersonalbrand.com`

## License

MIT
