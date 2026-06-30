# The Grid: Research Collaboration Platform

A platform for graduate students, postdocs, and faculty to discover collaborators and manage research projects.

## Live

| Service  | URL |
|----------|-----|
| Frontend | https://researchcolab.netlify.app |
| API Docs (Swagger) | https://researchcolab-backend.onrender.com/swagger/index.html |

> The backend runs on Render's free tier and sleeps after 15 minutes of inactivity. The first request after a sleep period may take 30-60 seconds to respond.

## Tech Stack

| Layer    | Technology |
|----------|------------|
| Frontend | Angular 19, Angular Material 3, TypeScript |
| Backend  | Go, Gin, GORM |
| Database | PostgreSQL (Render free tier) |
| Hosting  | Netlify (frontend), Render (backend) |

## Features

- Register and log in with JWT-based authentication
- Create and manage research projects
- Invite collaborators by email
- Accept or reject collaboration invitations
- Edit your researcher profile (bio, skills, affiliation, GitHub)
- Browse all public projects

## Local Development

### Prerequisites

- Node.js 18+ and npm
- Go 1.21+
- Git

### Clone

```bash
git clone https://github.com/Ghost-13302/ResearchColab.git
cd ResearchColab
```

### Frontend

```bash
cd frontend/SE_Project
npm install
npm start
```

App runs at http://localhost:4200. By default it points to the deployed backend at `https://researchcolab-backend.onrender.com`. To use a local backend instead, edit `src/environments/environment.ts` and set `apiUrl` to `http://localhost:8080`.

### Backend

```bash
cd backend
go mod tidy
go run main.go
```

Without a `DATABASE_URL` environment variable the backend falls back to a local SQLite file (`backend/users.db`). To use PostgreSQL locally, set `DATABASE_URL` to a valid Postgres connection string before running.

Swagger UI is available at http://localhost:8080/swagger/index.html.

## Project Structure

```
ResearchColab/
├── frontend/SE_Project/   Angular 19 app
│   └── src/app/           Components, services, routing
├── backend/               Go + Gin API
│   ├── controllers/       Route handlers
│   ├── models/            GORM models
│   ├── database/          DB init and migrations
│   └── utils/             JWT and helpers
├── render.yaml            Render Blueprint (backend + Postgres)
└── netlify.toml           Netlify build config (frontend)
```

## Team

| Name | Role |
|------|------|
| Gianfranco Cortes-Arroyo | Back-end |
| Sri Vaishnavi Borusu | Back-end |
| Bo-Hao Wang | Front-end |
| Sanket Jadhao | Front-end |
