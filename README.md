# CampaignOS — Smart Campaign Management System

CampaignOS is a comprehensive, modern, AI-integrated management dashboard designed specifically for advertising agencies. It provides strategists with real-time campaign performance analytics, AI-assisted creative brief generation, centralized RESTful API backend, and instant Websocket-based condition alerts.

This repository serves as a finalized submission for the **Full-Stack Developer Assessment**.

## 🚀 Features & Assessment Checklist

### 1. Frontend Development ✅
- **Campaign Dashboard (React + Tailwind):** Fully responsive, performant interface leveraging React 19 hooks and complex `framer-motion` animations. Features Data Visualizations (`Recharts`), dynamic 6-metric KPI cards, client filtering, dark mode (persisted via `localStorage`), and robust mock-handling bridging to live metrics.
- **AI-Assisted Creative Brief Builder:** A 4-step wizard interface capturing robust campaign requirements. Validates user input and calls the external LLM-service to assemble creative copy, visual grammar, and dynamic budget allocation across platforms. Exports output natively as PDF using `jsPDF` + `html2canvas`.

### 2. Backend & System Architecture ✅
- **Campaign Management REST API (Node/Express):** Full CRUD for Campaign manipulation with robust Express validation middlewares. Securely guarded with standard JSON Web Token (`JWT`) header authentication and Express rate limiting (100 req/min). Features soft-delete mechanisms (`deleted_at`).
- **AI Content Generation Microservice:** Standalone modular Node.js service calling OpenAI models (`gpt-4o-mini` default). Implements proper RESTful fallback mechanisms (to ensure the dashboard works seamlessly when API rate-limits apply) and implements **SSE (Server-Sent Events)** streaming.
- **Real-Time Notification System (WebSockets):** Evaluates ongoing ad-pulse metrics centrally every 60 seconds. Automatically flags breached budget or collapsed CTR conditions to a secure `Socket.io` frontend connection alongside persisting logs to PostgreSQL. React UI gracefully lists, counts, and clears received events.

### 3. Database & Dev-Ops ✅
- **PostgreSQL Database:** Robust relational structure featuring schema indexing, UUID integration, array processing (`creative_content JSONB`), and standard constraint rules. Seeded automatically during orchestration build.
- **Containerization (Docker Compose):** Modular 4-container build architecture (`api`, `ai-service`, `notifications`, `postgres`). Instantly boots full production environment logic simultaneously.

### 4. Speed Tasks (Algorithms, Debugging, Optimization) ✅
Included within the codebase:
- **`Q1` Debug Express API:** `api/src/routes/debugged-campaigns.js` (SQL Injection fixed, missing async awaits solved, code standard improved).
- **`Q2` React Hook:** `client/src/hooks/useDebounce.js` (Custom hook with strict timeout logic).
- **`Q3` SQL Problem:** `api/src/db/queries/roas_top_5.sql` (Complex Top 5 ROAS query using PostgreSQL CTE logic).
- **`Q4` React Optimization:** `client/src/components/dashboard/OptimizedCampaignList.jsx` (Implementing strict `React.memo`, `useMemo`, and stable `useCallback` dependency mapping).
- **`Q5` Scaffolding Express Routes:** `api/src/routes/scaffolded-campaigns.js` (Complete bulletproof API utilizing standard validation tools and isolated async error-catching wrappers).

---

## 🛠️ Installation & Execution Guide

The platform is designed to boot automatically utilizing Docker orchestration. 

### Prerequisites
Make sure you have following dependencies installed:
- [Docker](https://www.docker.com/products/docker-desktop) and **Docker Compose**
- Node (v18+) if you wish to run the client separately.

### Environment Setup
1. Duplicate `.env.example` to `.env` in the root of the project.
2. Supply a valid `OPENAI_API_KEY` (Required for the Brief Builder LLM endpoints. If missing, the app will gracefully degrade to mocked local data).
3. Assign a `JWT_SECRET` for secure authentication token handling.

### Running the Ecosystem via Docker
From the project root directory, run:
```bash
docker compose up --build
```
*Note: Depending on your system, this may be `docker-compose up --build`.*
This builds and connects four isolated systems alongside importing the Database Schema directly.

The following backend services will automatically launch:
- **REST API Server:** http://localhost:3000
- **AI Microservice:** http://localhost:3001
- **WebSocket Server:** http://localhost:4000
- **Postgres Database:** localhost:5432 (User: `admin` | Password: `password`)

### Booting the Frontend UI
We intentionally keep the React client exterior so the evaluator can hot-reload the UI without navigating container volumes. 
Run these commands in a separate terminal:
```bash
cd client
npm install
npm run dev
```

### Alternative: Running Services Manually (Without Docker)
If you prefer not to use Docker, you can run all microservices locally using Node. You will need a local PostgreSQL database running, and you must apply `api/src/db/schema.sql` to your database manually. Then, update your `.env` with your `DATABASE_URL`.

Open **four separate terminal tabs** and boot each service:

**1. API Service (Port 3000):**
```bash
cd api
npm install
npm run dev
```

**2. AI Service (Port 3001):**
```bash
cd ai-service
npm install
npm run dev
```

**3. Notification WebSocket Server (Port 4000):**
```bash
cd notifications
npm install
npm run dev
```

**4. Frontend Client (Port 5173):**
```bash
cd client
npm install
npm run dev
```

The CampaignOS Dashboard is now fully operational at: **`http://localhost:5173`** ✨
