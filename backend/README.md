# JOB PORTAL APP
## Folder Architecture (Backend + Frontend)
### Backend (Node.js + Express + MongoDB)
Here’s a scalable folder structure that’s “enterprise ready” but also beginner friendly:

    jobboardx-backend/
    │
    ├── src/
    │   ├── config/           # DB, environment, and app configs
    │   ├── controllers/      # Request handlers per resource
    │   ├── models/           # Mongoose schemas
    │   ├── middlewares/      # Auth, error, logger, etc.
    │   ├── routes/           # API routes (split by role)
    │   ├── utils/            # Helper functions (JWT, validators)
    │   ├── services/         # Business logic, email, file upload
    │   └── app.js            # Express app setup
    │
    ├── tests/                # Jest/Supertest for API testing
    ├── .env                  # Environment variables
    ├── .gitignore
    ├── package.json
    ├── README.md
    └── server.js             # Entry point


### Frontend (React)
You want clean separation by “feature” or “domain”—no more giant folders!

    jobboardx-frontend/
    │
    ├── public/
    ├── src/
    │   ├── api/                # Axios configs, API utils
    │   ├── auth/               # Context, login hooks, guards
    │   ├── components/         # Reusable components (Button, Modal, etc.)
    │   ├── features/
    │   │   ├── jobs/           # Job listing, job details, post/edit job
    │   │   ├── users/          # Login, register, profile, resume upload
    │   │   ├── admin/          # Analytics, manage users/jobs
    │   │   ├── recruiter/      # Post job, manage applicants
    │   │   └── candidate/      # My applications, bookmarks
    │   ├── hooks/              # Custom hooks (useAuth, useJobs, etc.)
    │   ├── layouts/            # Dashboard, Public, Auth layouts
    │   ├── pages/              # Route entry points
    │   ├── utils/              # Helpers (date, string, JWT)
    │   ├── App.js
    │   └── index.js
    │
    ├── .env
    ├── .gitignore
    ├── package.json
    ├── README.md



 ## Layers Overview (CSR Pattern)

    Client (React/Angular)
    ↓
    Router Layer → (Validates URL & calls controller)
    ↓
    Controller Layer → (Receives req/res, calls service)
    ↓
    Service Layer → (Business logic, caching, token handling, etc.)
    ↓
    Repository Layer → (Talks to DB only)
    ↓
    Database (MongoDB)


## 🔍 Explanation of Each Layer
| Layer          | Location                    | Responsibility                                                               |
| -------------- | --------------------------- | ---------------------------------------------------------------------------- |
| **Route**      | `src/routes/`               | Maps URLs to controllers. E.g. `GET /users` → `userController.getAllUsers()` |
| **Controller** | `src/controllers/`          | Parses request, sends to service, returns response                           |
| **Service**    | `src/services/`             | Handles business logic (e.g., caching, calculating totals, token generation) |
| **Repository** | `src/repositories/`         | Contains DB logic only — Mongoose, SQL, etc.                                 |
| **Model**      | `src/models/`               | Mongoose schemas or SQL definitions                                          |
| **Config**     | `src/config/redisClient.js` | External setup: DB connections, Redis setup                                  |
| **Middleware** | `src/middlewares/`          | Reusable functions: auth, rate limiter, error handler, etc.                  |
| **Utils**      | `src/utils/`                | Utility logic like formatting, encryption, email sender                      |


## TL;DR Diagram

    [Route] ──> [Controller] ──> [Service] ──> [Repository] ──> [Database]
                          ↘︎   |
                         RedisClient


> Service layer is where logic lives, like:

- "Should I fetch from Redis?"
- "Should I generate a new token?"
- "Should I send an email?"

> Controller is just the delivery boy — it takes the request and passes it to the service.
