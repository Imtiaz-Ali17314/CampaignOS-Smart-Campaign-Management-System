# Full-Stack Developer Assessment — Implementation Plan

> **Total Points Available: 100** | Target: Maximum score across all sections
> **Recommended Stack**: React 18 + Vite + Tailwind CSS | Node.js + Express | PostgreSQL | Socket.io | Docker

---

## 📁 Monorepo Structure

```
assessment/
├── client/                   # React Frontend (Tasks 1.1 & 1.2 + 2.3 notifications UI)
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/    # KPI cards, sidebar, chart, campaign table
│   │   │   ├── brief-builder/ # Multi-step form components
│   │   │   └── notifications/ # Bell icon, dropdown, badge
│   │   ├── hooks/            # Custom hooks (useDebounce, useDarkMode, etc.)
│   │   ├── data/
│   │   │   └── campaigns.json # Mock data (required by brief)
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   └── BriefBuilder.jsx
│   │   └── App.jsx
│   ├── tailwind.config.js
│   └── package.json
│
├── api/                      # Campaign Management REST API (Task 2.1)
│   ├── src/
│   │   ├── routes/           # campaigns.js, auth.js
│   │   ├── middleware/        # auth.js, rateLimit.js, validation.js
│   │   ├── db/
│   │   │   └── schema.sql    # PostgreSQL schema
│   │   └── index.js
│   ├── openapi.yaml          # OpenAPI spec for all endpoints
│   └── package.json
│
├── ai-service/               # AI Content Microservice (Task 2.2)
│   ├── src/
│   │   ├── routes/           # generate.js (copy, social, hashtags, health)
│   │   ├── services/         # llm.js (OpenAI client)
│   │   └── index.js
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── package.json
│
├── notifications/            # WebSocket Notification System (Task 2.3)
│   ├── src/
│   │   ├── alertEngine.js    # Threshold rule evaluation
│   │   ├── wsServer.js       # Socket.io server
│   │   └── db.js             # Alert history persistence
│   └── package.json
│
└── postman/
    └── assessment.postman_collection.json
```

---

## 🗂️ Phase-by-Phase Implementation Plan

### ⏱️ Recommended Build Order (Optimized for Scoring)

| Priority | Task | Points | Est. Time |
|----------|------|--------|-----------|
| 1st | Task 1.1 — Dashboard UI | 20 pts | 3–4 hrs |
| 2nd | Task 2.1 — Campaign API | 15 pts | 2–3 hrs |
| 3rd | Task 2.2 — AI Microservice | 10 pts | 2 hrs |
| 4th | Task 2.3 — Real-Time Notifications | 10 pts | 2 hrs |
| 5th | Task 1.2 — AI Brief Builder | 15 pts | 2–3 hrs |
| 6th | Section 3 — Speed Tasks | 30 pts | ~70 min |

---

## PHASE 1 — Task 1.1: Campaign Dashboard UI (20 pts)

### Setup
```bash
npm create vite@latest client -- --template react
cd client && npm install tailwindcss @tailwindcss/vite recharts react-router-dom date-fns
```

### Implementation Steps

#### 1. `campaigns.json` Mock Data
- Create `src/data/campaigns.json` following the exact schema from the brief
- Include 6–8 campaigns across 3–4 clients with varied statuses (`active`, `paused`, `completed`)
- Add a `dailyMetrics` array (30 entries) per campaign for the line chart

```json
{
  "campaigns": [
    {
      "id": "c001",
      "name": "Lumiere Summer Launch",
      "client": "Lumiere Skincare",
      "status": "active",
      "budget": 50000,
      "spend": 32450,
      "impressions": 2400000,
      "clicks": 48000,
      "conversions": 1200,
      "startDate": "2025-03-01",
      "endDate": "2025-03-31",
      "dailyMetrics": [/* 30 days of { date, impressions, clicks, spend } */]
    }
  ]
}
```

#### 2. Sidebar Navigation
- **Component**: `src/components/dashboard/Sidebar.jsx`
- Client list (grouped), campaign sub-list per client, Settings link
- Collapsible on smaller viewports (768px)
- Active state highlighting

#### 3. KPI Cards
- **Component**: `src/components/dashboard/KPICard.jsx`
- Display: Impressions, Clicks, CTR (clicks/impressions × 100), Conversions, Spend, ROAS (revenue/spend)
- Calculated fields (CTR, ROAS) computed from raw JSON values
- Animated number counter on load using `useEffect`

#### 4. Line Chart (Recharts)
- **Component**: `src/components/dashboard/PerformanceTrend.jsx`
- `LineChart` with multi-line support (Impressions, Clicks, Spend)
- Toggle lines on/off via legend click
- Responsive via `ResponsiveContainer`

#### 5. Campaign Table
- **Component**: `src/components/dashboard/CampaignTable.jsx`
- Sortable columns: click header to toggle asc/desc
- Filter input: debounced search on name/client
- Status badge: color-coded pill (green=active, yellow=paused, gray=completed)
- Pagination: 5 rows per page

#### 6. Date Range Picker
- **Component**: `src/components/dashboard/DateRangePicker.jsx`
- Preset buttons: Last 7d, Last 30d, Last 90d, Custom
- Custom range opens a simple from/to input
- Filters the `dailyMetrics` displayed in the chart

#### 7. Dark Mode Toggle
```js
// src/hooks/useDarkMode.js
const useDarkMode = () => {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);
  return [dark, setDark];
};
```
- Toggle button in header/topbar
- Use Tailwind's `dark:` variant classes throughout

#### 8. Responsive Breakpoints
- `1440px`: Full sidebar + content
- `1024px`: Collapsed sidebar (icon-only), 2-col KPI grid
- `768px`: Hidden sidebar (hamburger menu), 1-col KPI grid

---

## PHASE 2 — Task 2.1: Campaign Management REST API (15 pts)

### Setup
```bash
mkdir api && cd api
npm init -y
npm install express pg jsonwebtoken bcryptjs express-validator express-rate-limit cors dotenv helmet
npm install -D nodemon
```

### Database Schema (`src/db/schema.sql`)

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients table
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaigns table
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  name VARCHAR(255) NOT NULL,
  status VARCHAR(20) CHECK (status IN ('active', 'paused', 'completed', 'draft')) DEFAULT 'draft',
  budget NUMERIC(12,2) NOT NULL CHECK (budget > 0),
  spend NUMERIC(12,2) DEFAULT 0,
  impressions BIGINT DEFAULT 0,
  clicks BIGINT DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL  -- soft delete
);

-- Alert rules (for Task 2.3)
CREATE TABLE alert_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id),
  metric VARCHAR(50) NOT NULL,  -- 'ctr', 'spend_pct'
  operator VARCHAR(10) NOT NULL, -- 'lt', 'gt'
  threshold NUMERIC(10,4) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alert history (for Task 2.3)
CREATE TABLE alert_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id),
  rule_id UUID REFERENCES alert_rules(id),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  triggered_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_campaigns_client_id ON campaigns(client_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_deleted_at ON campaigns(deleted_at);
CREATE INDEX idx_alert_history_campaign ON alert_history(campaign_id);
```

### API Endpoints

#### `POST /auth/login`
- Validate email + password → `bcrypt.compare` → sign JWT (24h expiry)
- Return: `{ token, user: { id, email } }`

#### `GET /campaigns`
- Query params: `?status=active&client_id=xxx&sortBy=spend&order=desc&page=1&limit=10`
- WHERE `deleted_at IS NULL`
- Compute derived fields: `ctr`, `roas`, `spend_pct` in SELECT

#### `POST /campaigns`
- Validate: name (required), budget (> 0), status (enum), start/end dates
- Return 422 with field-level errors on validation failure

#### `GET /campaigns/:id`
- Full metrics including derived fields
- 404 if not found or soft-deleted

#### `PUT /campaigns/:id`
- Partial update (PATCH semantics via PUT acceptable)
- Re-validate changed fields

#### `DELETE /campaigns/:id`
- `UPDATE campaigns SET deleted_at = NOW() WHERE id = $1`
- Return 204 No Content

### Middleware
- **Auth**: `jwt.verify()` on `Authorization: Bearer <token>` header
- **Rate Limit**: `express-rate-limit` → 100 req/min per IP
- **Validation**: `express-validator` chains per route
- **Error Handler**: Central `(err, req, res, next)` middleware

### OpenAPI Spec (`openapi.yaml`)
- Full YAML spec with schemas, responses, security definitions
- Include example request/response bodies for each endpoint

---

## PHASE 3 — Task 2.2: AI Content Microservice (10 pts)

### Setup
```bash
mkdir ai-service && cd ai-service
npm init -y
npm install express openai uuid morgan dotenv
```

### Endpoints

#### `POST /generate/copy` — with SSE Streaming
```js
// Input: { product, tone, platform, word_limit }
// SSE streaming: res.setHeader('Content-Type', 'text/event-stream')
// Use openai.chat.completions.create({ stream: true, ... })
// Output stream: { headline, body, cta }
```

#### `POST /generate/social`
```js
// Input: { platform, campaign_goal, brand_voice }
// Output: { captions: ["caption1", ..., "caption5"] }
```

#### `POST /generate/hashtags`
```js
// Input: { content, industry }
// Output: { hashtags: ["#tag1", ..., "#tag10"] }
```

#### `GET /health`
```js
// Output: { status: "ok", model: "gpt-4o-mini", uptime: 12345, timestamp: "..." }
```

### Request/Response Logging Middleware
```js
// middleware/requestLogger.js
app.use((req, res, next) => {
  req.requestId = uuid.v4();
  res.setHeader('X-Request-Id', req.requestId);
  console.log(JSON.stringify({
    requestId: req.requestId,
    method: req.method,
    path: req.path,
    body: req.body,
    timestamp: new Date().toISOString()
  }));
  next();
});
```

### Dockerfile
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["node", "src/index.js"]
```

### docker-compose.yml
```yaml
version: '3.9'
services:
  ai-service:
    build: ./ai-service
    ports:
      - "3001:3001"
    env_file:
      - ./ai-service/.env
  api:
    build: ./api
    ports:
      - "3000:3000"
    env_file:
      - ./api/.env
    depends_on:
      - postgres
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: adplatform
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./api/src/db/schema.sql:/docker-entrypoint-initdb.d/schema.sql
volumes:
  pgdata:
```

---

## PHASE 4 — Task 2.3: Real-Time Notifications (10 pts)

### WebSocket Server (`wsServer.js`)
```js
const { Server } = require('socket.io');
// Attach to existing HTTP server
// Authenticate connections with JWT query param
// Rooms: join campaign-specific rooms (campaignId)
// Emit: 'alert' events to relevant rooms
```

### Alert Rule Engine (`alertEngine.js`)
```js
// Run on a setInterval (e.g., every 60 seconds)
// For each active campaign:
//   1. Fetch current metrics from DB
//   2. Compute CTR, spend_pct
//   3. Evaluate against alert_rules table
//   4. If threshold crossed: INSERT into alert_history + io.to(campaignId).emit('alert', {...})

const defaultRules = [
  { metric: 'ctr',       operator: 'lt', threshold: 0.01 }, // CTR < 1%
  { metric: 'spend_pct', operator: 'gt', threshold: 0.90 }, // Spend > 90% of budget
];
```

### Notification Center UI
- **Component**: `src/components/notifications/NotificationBell.jsx`
- Bell icon with unread count badge (red dot)
- Dropdown: list of recent alerts with timestamp
- Mark as read on click
- Connect to WS: `const socket = io(API_URL, { auth: { token } })`
- Listen for `'alert'` events, push to local state

---

## PHASE 5 — Task 1.2: AI Creative Brief Builder (15 pts)

### Multi-Step Form Architecture
```jsx
// src/components/brief-builder/BriefBuilder.jsx
const STEPS = ['Client Details', 'Campaign Objective', 'Creative Preferences', 'Review & Submit'];
const [step, setStep] = useState(0);
const [formData, setFormData] = useState({});
```

#### Step 1: Client Details
- Fields: `clientName`, `industry`, `website`, `keyCompetitors` (multi-input tags)
- Validation: required fields, valid URL format for website

#### Step 2: Campaign Objective
- Fields: `objective` (radio: awareness / consideration / conversion), `targetAudience` (textarea), `budget` (number)
- Validation: budget > 0

#### Step 3: Creative Preferences
- Fields: `tone` (select), `imageryStyle` (select), `colorDirection` (color picker), `dos` (textarea), `donts` (textarea)

#### Step 4: Review & Submit
- Read-only summary of all fields grouped by step
- "Submit to AI" button → POST to AI service or OpenAI directly

### AI Output Display (`BriefOutput.jsx`)
- Renders: Campaign Title, 3 Headlines, Tone Guide, Channels + Budget %, Visual Direction
- **Prompt Strategy** (forces structured JSON output):
  ```
  Return a JSON object with keys:
  - campaignTitle: string
  - headlines: [string, string, string]
  - toneGuide: string
  - channels: [{ name, budgetPct }]
  - visualDirection: string
  ```

### PDF Export
```bash
npm install jspdf html2canvas
```
```js
const exportPDF = async () => {
  const canvas = await html2canvas(document.getElementById('brief-output'));
  const pdf = new jsPDF('p', 'mm', 'a4');
  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
  pdf.save('creative-brief.pdf');
};
```

---

## PHASE 6 — Section 3: Speed Tasks (~70 min)

### Q1 — Debug Express API (20 min)

**Common bugs to find and fix:**
- SQL injection: use parameterized queries `$1, $2` instead of string concatenation
- Missing `await` on async DB calls
- Wrong HTTP status codes (e.g., returning 200 on create instead of 201)
- Missing error handling in async route (add `try/catch` or `asyncHandler`)

```js
// BUGGY (SQL injection + no await)
const result = db.query(`SELECT * FROM users WHERE id = '${req.params.id}'`);

// FIXED
const result = await db.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
```

### Q2 — `useDebounce` Hook (10 min)

```js
// src/hooks/useDebounce.js
import { useState, useEffect } from 'react';

const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer); // cleanup on value change
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;

// Usage in search component:
const debouncedSearch = useDebounce(searchInput, 300);
useEffect(() => { fetchResults(debouncedSearch); }, [debouncedSearch]);
```

### Q3 — Top 5 Campaigns by ROAS per Client (15 min)

```sql
-- ROAS = conversions / spend (simplified ratio)
WITH ranked_campaigns AS (
  SELECT
    c.id,
    c.name,
    cl.name AS client_name,
    ROUND(c.conversions::NUMERIC / NULLIF(c.spend, 0), 4) AS roas,
    ROW_NUMBER() OVER (
      PARTITION BY c.client_id
      ORDER BY (c.conversions::NUMERIC / NULLIF(c.spend, 0)) DESC
    ) AS rank
  FROM campaigns c
  JOIN clients cl ON cl.id = c.client_id
  WHERE
    c.deleted_at IS NULL
    AND c.start_date >= CURRENT_DATE - INTERVAL '30 days'
)
SELECT client_name, name, roas
FROM ranked_campaigns
WHERE rank <= 5
ORDER BY client_name, rank;
```

### Q4 — Optimize React Component (15 min)

**Common re-render issues to identify:**
- Object/array literals in JSX props (new reference each render) → `useMemo`
- Inline callback functions → `useCallback`
- Child component not memoized → `React.memo`
- Expensive computation in render body → `useMemo`

```jsx
// BEFORE (re-renders on every parent render)
const MyComponent = ({ data }) => {
  const processed = data.map(item => transform(item)); // recalculates every render
  return <ChildComponent items={processed} onClick={() => handleClick()} />;
};

// AFTER (optimized)
const MyComponent = ({ data }) => {
  const processed = useMemo(() => data.map(item => transform(item)), [data]);
  const handleClickMemo = useCallback(() => handleClick(), []);
  return <ChildComponent items={processed} onClick={handleClickMemo} />;
};

const ChildComponent = React.memo(({ items, onClick }) => { /* ... */ });
```

### Q5 — Scaffold Express CRUD with AI Tool (10 min)

Use this prompt with GitHub Copilot or Cursor:
```
Scaffold a complete Express.js CRUD route for a "campaigns" resource.
Include: Express Router, express-validator for input validation,
asyncHandler wrapper, PostgreSQL queries with parameterized inputs,
soft delete (deleted_at), JWT auth middleware, and
proper HTTP status codes (200, 201, 204, 404, 422, 500).
```

---

## 🎯 Scoring Strategy

| Task | Points | Key to Max Score |
|------|--------|-----------------|
| 1.1 Dashboard UI — Components | 15 | Dark mode, responsive at all 3 breakpoints, reusable components |
| 1.1 Dashboard UI — Data Viz | 5 | Recharts with multiple lines, date range filtering |
| 1.2 Brief Builder — Form UX | 10 | Per-step validation, smooth step transitions |
| 1.2 Brief Builder — AI + PDF | 5 | Structured AI JSON output + working jsPDF export |
| 2.1 Campaign API — REST + Auth | 10 | JWT, rate limiting, validation, correct status codes |
| 2.1 Campaign API — DB Schema | 5 | Indexes, constraints, soft delete, normalization |
| 2.2 AI Microservice — Architecture | 10 | Docker, SSE streaming, request IDs, env vars only |
| 2.3 Notifications — WebSocket | 10 | Socket.io, rule engine, UI bell + badge, DB persistence |
| Section 3 — Speed Tasks (×5) | 30 | Complete all 5; accuracy > speed |

---

## ✅ Pre-Submission Checklist

- [ ] `campaigns.json` data imported from file — no hardcoded data in JSX
- [ ] Dark mode persists in `localStorage` across page refreshes
- [ ] All 3 breakpoints (1440px, 1024px, 768px) tested and working
- [ ] JWT required on all campaign endpoints (401 on missing/invalid token)
- [ ] `deleted_at` field used for soft deletes (not hard DELETE)
- [ ] Rate limiter at 100 req/min per IP
- [ ] `schema.sql` is clean and runnable from scratch
- [ ] `openapi.yaml` covers all endpoints with schemas
- [ ] Dockerfile builds and `docker-compose up` works end-to-end
- [ ] AI API key is in `.env` only — never committed
- [ ] PDF export produces a readable, print-ready document
- [ ] WebSocket emits alerts when thresholds are crossed
- [ ] Alert history in DB and displayed in UI notification center

---

## 🔧 Environment Variables Reference

```env
# api/.env
DATABASE_URL=postgresql://admin:password@localhost:5432/adplatform
JWT_SECRET=your-256-bit-secret-here
PORT=3000

# ai-service/.env
OPENAI_API_KEY=sk-...
PORT=3001
MODEL=gpt-4o-mini

# client/.env
VITE_API_URL=http://localhost:3000
VITE_AI_SERVICE_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3000
```

---

> [!TIP]
> **Start with Task 1.1** — it's worth the most points (20), is self-contained, and produces a visible deliverable that impresses evaluators immediately. Then move to the API before connecting everything together.

> [!IMPORTANT]
> **Section 3 speed tasks** are worth 30 points total — nearly a third of the assessment. Don't skip them or leave them to the last minute. Q2 (useDebounce) and Q3 (SQL) can each be done cleanly in under 10 minutes if you know them well.

> [!WARNING]
> **Never hardcode your OpenAI/Anthropic API key** in source files. The evaluator will check for this. Use `.env` files and add `.env` to `.gitignore`.
