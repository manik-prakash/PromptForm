# PromptForm

AI-powered form builder that turns natural language prompts into functional forms.

## Tech Stack

**Frontend:** Next.js 16, React 19, TailwindCSS, TypeScript  
**Backend:** Express.js, Prisma ORM, PostgreSQL, JWT Auth  
**AI:** OpenRouter API

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

### Backend (.env)
```
DATABASE_URL=postgresql://user:pass@localhost:5432/promptform
JWT_SECRET=your-secret-key
OPENROUTER_API_KEY=your-openrouter-key
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Features

- 🤖 Generate forms using natural language prompts
- 📝 Dynamic form rendering with validation
- 📊 View and export form submissions
- 🔐 JWT-based authentication
- 📱 Responsive design

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Create account |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| POST | /api/form/generate | Generate form schema |
| POST | /api/form/create | Save form |
| GET | /api/form/allforms | List user's forms |
| GET | /api/form/:id | Get form details |
| DELETE | /api/form/:id | Delete form |
| GET | /api/form/:id/public | Get public form |
| POST | /api/form/:id/submit | Submit form response |
| GET | /api/form/:id/submissions | Get submissions |

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Auth middleware
│   │   └── app.js       # Express server
│   └── prisma/          # Database schema
│
└── frontend/
    ├── app/             # Next.js pages
    ├── components/      # React components
    ├── context/         # Auth context
    └── types/           # TypeScript types
```

## License

MIT
