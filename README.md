# PromptForm

AI-powered form builder that turns natural language prompts into functional forms.

## Tech Stack

**Frontend:** Next.js 16, React 19, TailwindCSS, TypeScript
**Backend:** Express.js, Prisma ORM, PostgreSQL, JWT Auth
**AI:** OpenRouter API (free-tier models, with automatic fallback across models)

## Quick Start

### Backend
```bash
cd backend
npm install
npm run db:generate
npm run db:push
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (`.env`)
```
DATABASE_URL=postgresql://user:pass@localhost:5432/promptform
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
OPENROUTER_API_KEY=your-openrouter-key
```
See `backend/.env.example` for a template.

### Frontend (`.env`)
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```
Must be prefixed with `NEXT_PUBLIC_` — Next.js only exposes prefixed variables to client-side code, so an unprefixed `API_URL` silently breaks every request from the browser.

## Features

- 🤖 Generate forms using natural language prompts, with a fallback across multiple free OpenRouter models if one is rate-limited or unavailable
- ✏️ Manual field editor — add, remove, reorder, and edit generated fields (label, placeholder, type, required) before saving
- 📝 Dynamic form rendering with validation, supporting text, email, number, textarea, select, checkbox, radio, and date fields
- 📊 View submissions with a "submissions over the last 14 days" chart, and export them as JSON or CSV
- 🔐 JWT-based authentication, with rate limiting on auth and generation endpoints and `helmet` security headers
- 📱 Responsive design

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check |
| POST | /api/auth/signup | Create account |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| POST | /api/form/generate | Generate form schema (rate-limited) |
| POST | /api/form/create | Save form |
| GET | /api/form/allforms | List user's forms |
| GET | /api/form/:id | Get form details |
| DELETE | /api/form/:id | Delete form |
| GET | /api/form/:id/public | Get public form |
| POST | /api/form/:id/submit | Submit form response |
| GET | /api/form/:id/submissions | Get submissions |
| GET | /api/form/:id/export | Export submissions as JSON (add `?format=csv` for CSV) |

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Auth, validation, rate limiting, error handling
│   │   ├── services/    # LLM form-generation service
│   │   └── app.js       # Express server
│   └── prisma/          # Database schema
│
└── frontend/
    ├── app/             # Next.js pages
    ├── components/      # React components
    ├── context/         # Auth context
    └── types/           # TypeScript types
```
