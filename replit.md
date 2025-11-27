# EventHub - Event Management Admin Dashboard

## Overview

EventHub is a comprehensive event management platform with an admin dashboard for managing events, orders, subscriptions, finances, and user communications. The application provides a full-featured interface for event organizers to track revenue, manage bookings, process payments through an integrated wallet system, handle customer support tickets, and communicate with users through a messaging system.

The platform is built as a modern web application with a professional Material Design-inspired interface featuring a sidebar navigation system, data-rich dashboards with charts and analytics, and responsive layouts that work across desktop and mobile devices.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React with TypeScript for type-safe component development
- Vite as the build tool and development server with HMR support
- Wouter for client-side routing (lightweight React Router alternative)
- TanStack Query (React Query) for server state management and data fetching

**UI Component System**
- shadcn/ui components built on Radix UI primitives for accessible, customizable components
- Tailwind CSS for utility-first styling with a custom design system
- CSS custom properties for theming (light/dark mode support via ThemeProvider)
- "New York" style variant of shadcn/ui components
- Custom color palette with blue as the primary accent color
- Recharts for data visualization (charts, graphs)

**Design Patterns**
- Component-based architecture with reusable UI components in `/client/src/components/ui`
- Custom hooks for shared logic (use-mobile, use-toast, use-theme)
- Form handling with React Hook Form and Zod schema validation
- Path aliases configured for clean imports (@/, @shared/, @assets/)

**Key Features**
- Dashboard with overview cards, revenue charts, and activity feeds
- Two-panel messaging interface with conversation list and chat view
- Wallet system with transaction history and balance management
- Order management with filtering, pagination, and detailed views
- Support ticket system with collapsible ticket threads
- Loan application and tracking interface
- Subscription plan management with tiered pricing
- Profile management with avatar upload
- Password update with strength indicators
- Account deletion flow with confirmation

### Backend Architecture

**Server Framework**
- Express.js as the HTTP server framework
- Node.js with ES modules (type: "module")
- TypeScript for type safety across the stack
- HTTP server creation via Node's built-in `http` module

**API Design**
- RESTful API structure with routes in `/server/routes.ts`
- JSON request/response format
- Request logging middleware with timestamps and duration tracking
- Raw body buffering for webhook support (Stripe, etc.)

**Data Layer**
- Storage abstraction interface (IStorage) for database operations
- In-memory storage implementation for development (can be swapped for database)
- CRUD operations for: users, events, orders, conversations, messages, transactions, tickets, loans, subscriptions
- Dashboard statistics aggregation

**Build & Deployment**
- esbuild for server-side bundling with selective dependency bundling
- Vite for client-side bundling and optimization
- Production build outputs to `/dist` directory
- Static file serving in production mode

### Data Storage Solutions

**Database System**
- PostgreSQL as the primary database (via Neon serverless)
- Drizzle ORM for type-safe database queries and migrations
- Schema definition in `/shared/schema.ts` using Drizzle's type system
- Schema-to-Zod validation with drizzle-zod for runtime validation

**Database Schema**
The application defines these core entities:
- **Users**: Authentication, profiles, roles
- **Events**: Event metadata, categories, capacity, pricing
- **Orders**: User bookings, payment status, order details
- **Conversations & Messages**: Real-time messaging between users and admins
- **Transactions**: Financial operations, wallet credits/debits
- **Tickets**: Support ticket system with responses
- **Loans**: Loan applications and approval tracking
- **Subscriptions**: Subscription plans and user subscriptions
- **Activities**: System-wide activity feed

**Migration Strategy**
- Drizzle Kit for schema migrations
- Migration files stored in `/migrations` directory
- `db:push` command for development schema synchronization

### External Dependencies

**Third-Party UI Libraries**
- Radix UI component primitives (accordion, dialog, dropdown, popover, tooltip, etc.)
- Recharts for data visualization and charting
- date-fns for date formatting and manipulation
- Embla Carousel for carousel/slider functionality
- cmdk for command palette interfaces
- Lucide React for icon system

**Database & Backend Services**
- @neondatabase/serverless for PostgreSQL connections
- Drizzle ORM and Drizzle Kit for database management
- connect-pg-simple for PostgreSQL session storage (when using sessions)

**Development Tools**
- @replit/vite-plugin-runtime-error-modal for error overlay in Replit
- @replit/vite-plugin-cartographer for code mapping
- @replit/vite-plugin-dev-banner for development indicators
- tsx for TypeScript execution in development

**Validation & Forms**
- Zod for runtime schema validation
- React Hook Form with @hookform/resolvers for form management
- zod-validation-error for user-friendly validation messages

**Utilities**
- clsx and tailwind-merge (via cn utility) for className management
- class-variance-authority for variant-based component styling
- nanoid for unique ID generation

**Potential Future Integrations** (based on dependencies)
- Passport.js and passport-local for authentication
- express-session with memorystore or connect-pg-simple for session management
- express-rate-limit for API rate limiting
- Stripe for payment processing
- Nodemailer for email notifications
- Multer for file uploads
- WebSocket (ws) for real-time features
- OpenAI or Google Generative AI for AI features