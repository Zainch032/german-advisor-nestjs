# EduRoute

**AI-powered German University Admission Advisor** — helping Pakistani students navigate university applications, scholarships, visa requirements, and cost planning for studying in Germany.

🔗 **Live Demo:** [https://german-advisor.onrender.com/api-docs#/](https://german-advisor.onrender.com/api-docs#/)

> Note: hosted on Render's free tier — the app sleeps after 15 minutes of inactivity, so the first request may take 30-50 seconds to respond while it wakes up.

---

## 📖 Overview

Students applying to German universities have to piece together information from dozens of scattered sources — university websites, scholarship portals, visa requirement pages, and cost-of-living calculators. **EduRoute** brings all of that into a single AI-powered chat interface that can answer real questions instantly, backed by structured, accurate data — with specific attention to requirements for Pakistani applicants (HEC attestation, APS exemption, blocked account amounts).

---

## ✨ Features

- **AI Chatbot** — conversational interface for university, scholarship, cost, and visa questions
- **University Database** — rankings, tuition, admission requirements, deadlines
- **Scholarship Finder** — DAAD, HEC Overseas, Erasmus Mundus, and more, with amounts, deadlines, and eligibility
- **Cost of Living Calculator** — city-by-city monthly/yearly cost breakdowns across major German cities
- **CGPA to German Grade Converter** — converts Pakistani CGPA to the German 1.0–5.0 grading scale
- **Visa Timeline Guidance** — step-by-step visa process specific to Pakistani applicants
- **Email Delivery** — sends personalized results (shortlists, scholarship info) directly to a student's inbox
- **Auto-generated API Documentation** — full Swagger/OpenAPI docs for every endpoint
- **Error Monitoring** — real-time error tracking and alerting via Sentry.io

---

## 🏗️ Architecture

```
┌─────────────┐      ┌──────────────────┐      ┌─────────────────────┐
│   Client    │─────▶│  NestJS Backend   │─────▶│   n8n AI Agent       │
│ (Swagger UI)│      │                   │      │  (Google Gemini +    │
└─────────────┘      │  • Chat Module    │      │   tool orchestration)│
                      │  • Email Module   │      └─────────────────────┘
                      │  • Sentry Filter  │
                      │  • Swagger Docs   │      ┌─────────────────────┐
                      └──────────┬────────┘─────▶│   Resend (Email)     │
                                 │                └─────────────────────┘
                                 ▼
                      ┌──────────────────┐
                      │    Sentry.io      │
                      │ (Error Monitoring)│
                      └──────────────────┘
```

The NestJS backend exposes a clean REST API. The actual AI reasoning happens in an **n8n workflow**, where an AI Agent (powered by Google Gemini) has access to several tools:
- `university_database`
- `scholarship_finder`
- `cost_calculator`
- `calculate_german_grade`
- `visa_timeline`
- `eligibility_checker`
- `university_comparator`
- `live_web_search` (fallback for anything outside static data)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend framework | [NestJS](https://nestjs.com) (TypeScript) |
| AI orchestration | [n8n](https://n8n.io) (workflow automation) |
| AI model | Google Gemini |
| API documentation | Swagger / OpenAPI 3.0 (`@nestjs/swagger`) |
| Error monitoring | [Sentry.io](https://sentry.io) |
| Email delivery | [Resend](https://resend.com) |
| Validation | `class-validator`, `class-transformer` |
| Deployment | [Render](https://render.com) (free tier) |

---

## 📂 Project Structure

```
german-advisor-nestjs/
├── src/
│   ├── chat/
│   │   ├── chat.controller.ts      # POST /api/chat
│   │   ├── chat.service.ts         # Calls n8n webhook
│   │   ├── chat.module.ts
│   │   └── dto/send-message.dto.ts
│   ├── email/
│   │   ├── email.controller.ts     # POST /api/email/send
│   │   ├── email.service.ts        # Resend integration
│   │   ├── email.module.ts
│   │   └── dto/send-email.dto.ts
│   ├── common/
│   │   └── sentry-exception.filter.ts  # Global error → Sentry reporting
│   ├── app.module.ts
│   └── main.ts                     # Bootstraps app, Swagger, Sentry
├── .env.example
├── package.json
├── tsconfig.json
└── nest-cli.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- A running n8n instance with the EduRoute AI Agent workflow (webhook URL)
- A [Resend](https://resend.com) API key
- A [Sentry.io](https://sentry.io) project DSN

### Installation

```bash
git clone https://github.com/Zainch032/german-advisor-nestjs.git
cd german-advisor-nestjs
npm install
```

### Environment Setup

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```env
N8N_WEBHOOK_URL=https://your-n8n-instance/webhook/your-webhook-id
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM=onboarding@resend.dev
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
NODE_ENV=development
PORT=3000
```

### Run locally

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`, and Swagger docs at `http://localhost:3000/api-docs`.

### Build for production

```bash
npm run build
npm run start:prod
```

---

## 📡 API Endpoints

### `POST /api/chat`
Send a message to the AI admission advisor.

**Request body:**
```json
{
  "message": "Which university in Germany is best for Computer Science?",
  "sessionId": "user-session-123"
}
```

**Response:**
```json
{
  "reply": "TU Munich (TUM) is consistently ranked #1 in Germany for Computer Science..."
}
```

### `POST /api/email/send`
Send an email (e.g., a scholarship shortlist) via Resend.

**Request body:**
```json
{
  "to": "student@example.com",
  "subject": "Your German University Shortlist",
  "content": "Here is your personalized list of universities..."
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "data": { "id": "b79f3a61-31d7-4144-80e3-35ed1102ffb8" },
    "error": null
  }
}
```

Full interactive documentation for both endpoints is available live at:
**[https://german-advisor.onrender.com/api-docs#/](https://german-advisor.onrender.com/api-docs#/)**

---

## 🔍 Monitoring

All unhandled exceptions are captured by a global `SentryExceptionFilter` and reported to Sentry.io in real time, including full stack traces pointing to the exact source location — so issues in production are caught and diagnosed quickly rather than failing silently for end users.

---

## 🌍 Deployment

The app is deployed on **Render** (free tier) directly from this GitHub repository.

- **Build command:** `npm install && npm run build`
- **Start command:** `npm run start:prod`

Environment variables are configured in Render's dashboard, matching `.env.example`.

> Note: Render's free tier sleeps after 15 minutes of inactivity. The first request after idle time takes 30-50 seconds while the service wakes up.

---

## 📌 Notes for Pakistani Applicants

EduRoute is specifically tuned to surface details relevant to Pakistani students applying to Germany:
- Public university tuition is **free** (only a small semester fee applies)
- **HEC attestation** is required for degree/transcripts
- **APS is NOT required** for Pakistani applicants (unlike students from some other countries)
- A **blocked account of €11,208** is required for the student visa

---

## 👤 Author

**Muhammad Zain**
AI Automation Internship — Session 4 Assignment

---

## 📄 License

This project was built for educational/internship assignment purposes.
