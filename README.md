# Genpact-Onboarding-Portal
A central hub that gives new interns all the resources they need for a smooth start

## Sprint 1 Frontend Scope

This React UI covers:

- US-01: Required software, installation guides, and setup requirements
- US-02: Mandatory Week 1 training dashboard
- US-03: Searchable directory for support contacts and mentors

## Folder Structure

```text
src/
  api/
    onboardingApi.js
  data/
    mockData.js
  features/
    contacts/
      ContactDirectory.jsx
      ContactDirectory.css
    tools/
      ToolsList.jsx
      ToolsList.css
    training/
      TrainingDashboard.jsx
      TrainingDashboard.css
  styles/
    global.css
  App.jsx
  main.jsx
```

## Mock API Layer

The frontend already calls future backend-style endpoints:

- `GET /api/tools`
- `GET /api/courses`
- `GET /api/contacts`

Until the FastAPI backend is ready, failed requests automatically use mock fallback data from `src/data/mockData.js`.

## Run Locally

```bash
npm install
npm run dev
```

If the backend runs on a separate host later, create a `.env` file:

```bash
VITE_API_BASE_URL=http://localhost:8000
```
