# Repurpose Exercise

A full-stack application with GraphQL backend and Vue.js frontend for creating and managing blog posts.

## Prerequisites

- **Node.js**: v22 (use `nvm use 22` to switch to Node.js v22)
- **pnpm**: v9.15.4 or higher

## Project Structure

- `backend/` - NestJS GraphQL API server
- `frontend/` - Vue.js 3 application with TypeScript

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd repurpose-exercise
   ```

2. Install dependencies for both backend and frontend:
   ```bash
   # Install backend dependencies
   cd backend
   pnpm install
   
   # Install frontend dependencies
   cd ../frontend
   pnpm install
   ```

3. **Set up the database (Required for first-time setup):**
   ```bash
   cd backend
   pnpm db:generate
   pnpm db:migrate
   ```
   > **Note:** The SQLite database file must be created and migrated before starting the backend server, otherwise the system won't work.

## Running the Application

### Development Mode

1. **Start the backend server:**
   ```bash
   cd backend
   pnpm start:dev
   ```
   The backend GraphQL API will be available at `http://localhost:4000/graphql`

2. **Start the frontend development server:**
   ```bash
   cd frontend
   pnpm dev
   ```
   The frontend application will be available at `http://localhost:5173`

### Production Mode

1. **Build and start the backend:**
   ```bash
   cd backend
   pnpm build
   pnpm start:prod
   ```

2. **Build the frontend:**
   ```bash
   cd frontend
   pnpm build
   pnpm preview
   ```

## Available Scripts

### Backend Scripts
- `pnpm start:dev` - Start development server with hot reload
- `pnpm start:prod` - Start production server
- `pnpm build` - Build the application
- `pnpm test` - Run tests
- `pnpm lint` - Run linting
- `pnpm db:generate` - Generate database migrations
- `pnpm db:migrate` - Run database migrations
- `pnpm db:push` - Push schema changes to database

### Frontend Scripts
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build

## Technology Stack

### Backend
- NestJS - Node.js framework
- GraphQL with Apollo Server
- SQLite with Drizzle ORM
- JWT Authentication
- TypeScript

### Frontend
- Vue.js 3 with Composition API
- TypeScript
- Apollo Client for GraphQL
- Vue Router
- Tailwind CSS
- Vite build tool

## Sample Credentials

For testing purposes, you can use these sample user accounts:

```
Username: user1
Email: user1@example.com
Password: password

Username: user2
Email: user2@example.com
Password: password
```

## Features

- User authentication and authorization
- Create, read, update, and delete blog posts
- Real-time GraphQL subscriptions
- Responsive UI with Tailwind CSS
- Type-safe development with TypeScript