# # Secure Task Management API (JWT + Role-Based Access)

## Project Overview
This project provides a production-style REST API using Node.js, Express, MongoDB, and Mongoose with:
- JWT authentication
- Role-based access control (USER, ADMIN)
- Task CRUD with owner/admin permissions
- Swagger API documentation
- Minimal Vanilla JS frontend for API testing

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
```

## Prerequisites
- Node.js 18+
- MongoDB (local or hosted)

## Setup Instructions
1. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Create `.env` from template:
   ```bash
   cp .env.example .env
   ```
3. Update environment values in `.env`.

## MongoDB Setup
Use either:
- Local MongoDB: `mongodb://127.0.0.1:27017/rbac`
- MongoDB Atlas connection string

Make sure your URI is set in `MONGODB_URI`.

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
```

- `API_BASE_URL`: Public base URL used in Swagger docs (for Render, set this to your Render app URL).
- `CORS_ORIGIN`: Comma-separated allowed origins. In production, set it explicitly when your frontend is on a different domain.
- `ENABLE_SWAGGER`: Set to `false` to disable `/api-docs` in production.

## Run Backend
```bash
cd backend
npm run dev
```

The app serves:
- API base: `http://localhost:5000/api/v1`
- Frontend: `http://localhost:5000/`
- Swagger docs: `http://localhost:5000/api-docs`
