# Backend Developer Intern Assignment

## Project Overview
Production-style REST API using Node.js, Express, MongoDB, and Mongoose with:
- JWT authentication
- Role-based access control (USER, ADMIN)
- Task CRUD with owner/admin authorization
- Swagger API documentation
- Minimal Vanilla JS frontend served by Express

## Folder Structure
```text
/project-root
  /backend
    /src
      /controllers
      /routes
      /middlewares
      /models
      /validators
      /config
      app.js
      server.js
    .env.example
    README.md
  /frontend
    index.html
    dashboard.html
    styles.css
    app.js
  render.yaml
```

## Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

## Local Setup
1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Create env file:
   ```bash
   cp .env.example .env
   ```
3. Set environment variables.
4. Start development server:
   ```bash
   npm run dev
   ```

## MongoDB Setup
Use one of:
- Local: `mongodb://127.0.0.1:27017/backend_intern_assignment`
- Atlas connection string

## Environment Variables
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/backend_intern_assignment
JWT_SECRET=replace_with_strong_secret
JWT_EXPIRES_IN=1h
NODE_ENV=development
API_BASE_URL=http://localhost:5000
CORS_ORIGIN=
ENABLE_SWAGGER=true
LOG_LEVEL=info
LOG_HEALTHCHECKS=false
SEED_DEFAULT_ADMIN=false
DEFAULT_ADMIN_EMAIL=
DEFAULT_ADMIN_PASSWORD=
```

Notes:
- `API_BASE_URL`: Public base URL for Swagger server entry.
- `CORS_ORIGIN`: Comma-separated allowed origins. Keep empty for same-origin usage.
- `ENABLE_SWAGGER`: Set `false` to disable `/api-docs`.
- `LOG_LEVEL`: `error | warn | info | debug`.
- `LOG_HEALTHCHECKS`: Set `true` only if you want `/health` requests logged.
- `SEED_DEFAULT_ADMIN`: Set `true` to enable startup admin seeding.
- `DEFAULT_ADMIN_EMAIL`: Seeded admin email (required when seeding is enabled).
- `DEFAULT_ADMIN_PASSWORD`: Seeded admin password (required when seeding is enabled).

## Default Admin Login
- Admin credentials are private and must be configured only in your private `.env` or Render secret env vars.
- No admin credentials are exposed in frontend or committed docs.
- To auto-seed admin on startup:
  1. Set `SEED_DEFAULT_ADMIN=true`
  2. Set `DEFAULT_ADMIN_EMAIL` and `DEFAULT_ADMIN_PASSWORD`

## API Base URLs
- API base: `http://localhost:5000/api/v1`
- Frontend: `http://localhost:5000/`
- Swagger docs: `http://localhost:5000/api-docs`
- Health check: `http://localhost:5000/health`

## API Endpoints
### Auth
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/admin/login`

### Admin
- `GET /api/v1/admin/dashboard` (ADMIN only)

### Tasks
- `POST /api/v1/tasks` (authenticated)
- `GET /api/v1/tasks` (USER gets own tasks, ADMIN gets all)
- `PUT /api/v1/tasks/:id` (owner or ADMIN)
- `DELETE /api/v1/tasks/:id` (owner or ADMIN)

## Security Practices
- Password hashing with bcrypt
- JWT with expiration
- Validation/sanitization via express-validator
- Protected routes with auth middleware
- Role authorization middleware
- Global error handling with production-safe messages
- Environment-based configuration

## Logging (Fast Production Setup)
- Logs are structured JSON and written to stdout/stderr.
- Render automatically collects these logs under your service logs.
- Each API log includes: `requestId`, `method`, `path`, `statusCode`, and `durationMs`.
- Error logs include request context and stack trace in non-production.

## Render Deployment (Production)
This repo includes `render.yaml` for Blueprint deploy.

1. Push repository to GitHub/GitLab.
2. In Render, create a Blueprint service from the repo.
3. Set required env vars in Render:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `API_BASE_URL` (example: `https://your-service.onrender.com`)
4. Optional env vars:
   - `CORS_ORIGIN` (if frontend is on a different domain)
   - `ENABLE_SWAGGER` (`true`/`false`)
   - `LOG_LEVEL` (`info` recommended)
   - `LOG_HEALTHCHECKS` (`false` recommended)
   - `SEED_DEFAULT_ADMIN` (`true` only if you want startup seeding)
   - `DEFAULT_ADMIN_EMAIL`
   - `DEFAULT_ADMIN_PASSWORD`
5. Deploy.

`render.yaml` already defines:
- Build command: `cd backend && npm install`
- Start command: `cd backend && npm start`
- Health check path: `/health`

## Scalability Note
- Horizontal scaling: multiple stateless API instances
- Load balancer: distribute traffic across instances
- Redis caching (future): cache heavy reads and metadata
- Microservices possibility: split auth/tasks/admin domains as scale grows
