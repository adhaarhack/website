# Aadhaar Insights Dashboard

## Overview

This is an analytics dashboard application for visualizing Aadhaar enrollment and update statistics across India. The application displays KPI metrics, state-wise performance breakdowns, and time-series trends through interactive charts. It supports multiple Indian languages for localization.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state and caching
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Charts**: Recharts for data visualization (bar charts, line charts, pie charts)
- **Animations**: Framer Motion for smooth transitions and entry animations
- **Build Tool**: Vite with React plugin

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful endpoints under `/api` prefix
- **Development**: Vite middleware integration for HMR during development

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with Zod integration for schema validation
- **Schema Location**: `shared/schema.ts` contains table definitions for enrollments, demographic updates, and biometric updates
- **Migrations**: Drizzle Kit with migrations output to `./migrations`

### Project Structure
```
├── client/           # React frontend application
│   └── src/
│       ├── components/   # UI components (shadcn/ui + custom)
│       ├── hooks/        # Custom React hooks
│       ├── lib/          # Utilities and query client
│       └── pages/        # Route pages
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Database access layer
│   └── db.ts         # Database connection
└── shared/           # Shared code between client/server
    ├── schema.ts     # Drizzle table definitions
    └── routes.ts     # API route contracts with Zod schemas
```

### Key Design Decisions
1. **Monorepo Structure**: Client and server share TypeScript types and schemas through the `shared/` directory
2. **Type-Safe API**: Route definitions in `shared/routes.ts` include Zod schemas for response validation
3. **Storage Pattern**: Abstract `IStorage` interface in `server/storage.ts` enables potential swapping of data sources
4. **CSS Variables**: Theme customization through CSS variables in `client/src/index.css`
5. **Internationalization**: Built-in translation support for 8 Indian languages stored in `client/src/lib/translations.ts`

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **connect-pg-simple**: Session storage for PostgreSQL

### UI Component Libraries
- **Radix UI**: Headless component primitives (dialogs, dropdowns, tooltips, etc.)
- **shadcn/ui**: Pre-styled component collection built on Radix

### Data & Validation
- **Zod**: Runtime type validation and schema definitions
- **drizzle-zod**: Integration between Drizzle schemas and Zod

### Build & Development
- **Vite**: Frontend bundler with HMR
- **esbuild**: Server bundling for production
- **tsx**: TypeScript execution for development

### Fonts
- Google Fonts: Inter (body), Outfit (display), DM Sans, Fira Code, Geist Mono