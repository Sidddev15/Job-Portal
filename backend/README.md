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



