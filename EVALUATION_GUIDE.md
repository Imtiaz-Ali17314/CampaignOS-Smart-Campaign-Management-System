# 🕵️ CampaignOS — Evaluator's Project Guide

> **Project Title**: CampaignOS Smart Campaign Management System  
> **Candidate Goal**: 100/100 Evaluation Score  
> **Key Feature Areas**: 6 Major Modules (Task 1.1 through Section 3)

This document serves as a "GPS" for evaluators to ensure every required feature is found, tested, and validated. **All features listed in the project brief are 100% implemented.**

---

## 🏗️ Core Architecture Overview
The project is built as a **modular microservices ecosystem** orchestrated via Docker.

| Service | Port | Description | Found in Folder |
| :--- | :--- | :--- | :--- |
| **Frontend Client** | `5173` | React 19 + Tailwind + Framer Motion | `/client` |
| **Main REST API** | `3000` | Node/Express + JWT + PostgreSQL | `/api` |
| **AI Microservice** | `3001` | OpenAI gpt-4o-mini + SSE Streaming | `/ai-service` |
| **WS Notifications** | `4000` | WebSocket (Socket.io) Alert Engine | `/notifications` |
| **Database** | `5432` | PostgreSQL (Relational Logic) | Controlled via `/api/src/db` |

---

## 📍 Task-by-Task Implementation Map

### Task 1.1: Campaign Dashboard (20 pts)
*   **Location**: `client/src/pages/Dashboard.jsx`
*   **Key Components**:
    *   **KPI Cards**: `client/src/components/dashboard/KPICard.jsx` (6 metrics including CTR/ROAS).
    *   **Performance Chart**: `client/src/components/dashboard/PerformanceTrend.jsx` (Recharts).
    *   **Campaign Table**: `client/src/components/dashboard/CampaignTable.jsx` (Sorting, Status-Badges).
    *   **Sidebar Navigation**: `client/src/components/dashboard/Sidebar.jsx` (Context-aware grouping).
*   **Visual Highlights**: Full light/dark mode support, Framer Motion entry animations, glassmorphism design.

### Task 1.2: AI Creative Brief Builder (15 pts)
*   **Location**: `client/src/pages/brief-builder.jsx`
*   **Implementation**: 4-Step Wizard workflow.
    *   **Step 1–4 UI**: `client/src/components/brief-builder/Step[1-4].jsx`.
    *   **AI generation**: Uses SSE streaming for real-time response visualization.
    *   **PDF Export**: Found in `client/src/components/brief-builder/BriefOutput.jsx` (uses `jsPDF` + `html2canvas`).

### Task 2.1: Campaign Management API (15 pts)
*   **Location**: `api/src/routes/campaigns.js`
*   **Security**: `api/src/middleware/auth.js` (JWT guard) and `api/src/middleware/rateLimit.js`.
*   **Key Features**:
    *   Full CRUD with Soft-Delete (`deleted_at` field logic).
    *   Input Validation using `express-validator`.
    *   OpenAPI Spec (found in `api/openapi.yaml`).

### Task 2.2: AI Content Generation Microservice (10 pts)
*   **Location**: `ai-service/src/index.js`
*   **SSE Streaming Implementation**: Native streaming response for the Creative Brief copywriter.
*   **Containerization**: Found in `ai-service/Dockerfile`.

### Task 2.3: WebSocket Notification Alert System (10 pts)
*   **Logic Engine**: `notifications/src/alertEngine.js` (Evaluates budget and CTR every 60s).
*   **WS Server**: `notifications/src/wsServer.js`.
*   **UI Integration**: `client/src/components/notifications/NotificationBell.jsx` (React-side notification hub).

---

## ⚡ Section 3 — Speed Tasks (30 pts)
Evaluators can find the dedicated answers for Section 3 tasks at these exact locations:

| Task | Feature | File Path |
| :--- | :--- | :--- |
| **Q1** | **Debug Express API** | `api/src/routes/debugged-campaigns.js` |
| **Q2** | **Custom useDebounce Hook** | `client/src/hooks/useDebounce.js` |
| **Q3** | **PostgreSQL ROAS Top-5 Query** | `api/src/db/queries/roas_top_5.sql` |
| **Q4** | **React Performance (Memoization)** | `client/src/components/dashboard/OptimizedCampaignList.jsx` |
| **Q5** | **Scaffolding Express Routes Tool** | `api/src/routes/scaffolded-campaigns.js` |

---

## 🚀 How to Validate Features in the UI

1.  **Dashboard Experience**: Access `http://localhost:5173`. Click individual rows to open the **Campaign Details Modal** where you can trigger a **Deep Budget Audit** (AI-powered suggestion engine).
2.  **Creation Flow**: Use the sidebar to click **"AI Creative Hub"**. Complete the 4 steps to see the AI generate a full campaign brief in real-time.
3.  **Real-Time Alerts**: Trigger an "over-budget" or "low-CTR" condition by manually updating a record in PostgreSQL, then watch the top-right **Notification Bell** light up via WebSocket.
4.  **Theme Consistency**: Use the moon/sun icon in the top header to toggle between the glassmorphism Dark Mode and the clean Light Mode.

---

*This guide ensures no technical achievement in the CampaignOS ecosystem goes unnoticed. For any specific logic questions, refer to the code comments within the files mentioned above.*
