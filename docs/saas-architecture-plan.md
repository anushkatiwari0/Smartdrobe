# SmartDrobe SaaS Architecture & Implementation Guide

## Objective
Convert the existing local SmartDrobe application into a production-ready, highly-scalable SaaS platform with persistent user accounts, cloud storage, and robust AI integration.

---

## 1. Technology Stack Selection
* **Frontend:** React + Tailwind CSS + Next.js (App Router)
* **Backend:** Python + FastAPI 
* **Database:** Supabase (PostgreSQL + Auth)
* **Image Storage:** Cloudinary
* **AI Engine:** Google Gemini (via Genkit)
* **Deployment:** Vercel (Frontend), Render/Railway (Backend)

---

## 2. Project Folder Structure
A clean, monorepo-friendly scalable structure:

```text
smartdrobe/
├── frontend/                  # Next.js React Application
│   ├── src/
│   │   ├── app/               # Next.js App Router (Pages & Layouts)
│   │   ├── components/        # Reusable UI components
│   │   ├── hooks/             # Custom React Hooks (e.g., useAuth, useCloset)
│   │   ├── lib/               # API clients (Axios/Fetch wrappers)
│   │   └── stores/            # Zustand state management
│   ├── package.json
│   └── tailwind.config.ts
├── backend/                   # Python FastAPI Application
│   ├── app/
│   │   ├── main.py            # FastAPI Application Entrypoint
│   │   ├── api/
│   │   │   ├── endpoints/     # Routers (auth.py, closet.py, ai.py)
│   │   │   └── dependencies.py# Auth and DB connections
│   │   ├── core/              # Config, Security (JWT hashing)
│   │   ├── models/            # SQLAlchemy / Pydantic models
│   │   └── services/          # Business logic (Cloudinary, Gemini API)
│   ├── requirements.txt
│   └── .env
└── README.md
```

---

## 3. Database Schema (PostgreSQL via Supabase)

### `users` table
* `id`: UUID (Primary Key)
* `email`: String (Unique)
* `password_hash`: String
* `created_at`: Timestamp
* `preferences`: JSONB (e.g., color preferences, style keywords)

### `wardrobe_items` table
* `id`: UUID (Primary Key)
* `user_id`: UUID (Foreign Key -> users.id)
* `image_url`: String (Cloudinary URL)
* `category`: String (e.g., 'Tops', 'Bottoms')
* `color`: String
* `weather_compatibility`: String (e.g., 'Cold', 'Warm')
* `created_at`: Timestamp

### `outfit_history` table
* `id`: UUID (Primary Key)
* `user_id`: UUID (Foreign Key -> users.id)
* `item_ids`: Array of UUIDs (Foreign Keys -> wardrobe_items.id)
* `occasion`: String
* `date_worn`: Timestamp
* `feedback`: Enum ('Loved it', 'Hated it')

---

## 4. API Architecture (FastAPI Examples)

### Authentication
* `POST /api/v1/auth/signup` - Creates user in Supabase.
* `POST /api/v1/auth/login` - Returns JWT Access Token.
* `POST /api/v1/auth/reset-password`

### Wardrobe Management
* `POST /api/v1/closet/upload` 
  *(Receives multipart/form-data. Backend uploads photo to Cloudinary, extracts URL, saves to `wardrobe_items`)*
* `GET /api/v1/closet/` - Returns all items for the authenticated user.
* `DELETE /api/v1/closet/{item_id}`

### AI Integration
* `POST /api/v1/ai/recommend`
  *(Accepts context like "Going to a wedding". Backend queries weather API, fetches user's `wardrobe_items`, and sends aggregate data to Gemini to return recommended item_ids).*
* `POST /api/v1/ai/save-outfit` - Logs output to `outfit_history`.

---

## 5. Security Best Practices
1. **JWT & Session:** Store JWT securely in HTTP-only cookies on the frontend to prevent XSS attacks. 
2. **Password Hashing:** Use `passlib` with `bcrypt` in FastAPI before throwing passwords to the database.
3. **CORS:** Explicitly whitelist the Vercel frontend URL in the FastAPI CORS middleware.
4. **Environment Variables:** Never commit `.env` files. Use Supabase/Render environment secrets for `DATABASE_URL`, `JWT_SECRET`, `GEMINI_API_KEY`, and `CLOUDINARY_URL`.

---

## 6. Setup & Deployment Commands

### Local Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Local Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Deployment Pipeline
1. **Database:** Create a Supabase Project. Execute the SQL Schema in the Supabase SQL editor.
2. **Backend (Render):** Link GitHub repo to Render as a "Web Service". Set build command to `pip install -r requirements.txt` and start command to `uvicorn app.main:app --host 0.0.0.0 --port $PORT`. Input environment variables.
3. **Frontend (Vercel):** Link GitHub repo to Vercel. Set the framework preset to Next.js. Add the `NEXT_PUBLIC_API_URL` pointing to the live Render backend URL.
