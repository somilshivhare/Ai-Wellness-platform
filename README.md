# mindbridge-ai
AI-Based Mental Wellness Therapist Consultation Platform (MERN + AI + WebRTC + AWS)

## Frontend overview
The frontend is a React/Vite application located in the `frontend/` directory.
It implements the following core features described by the platform:

1. **Authentication** – login/signup (user, doctor, superadmin roles).
2. **Dashboard** – mood tracking chart and quick navigation.
3. **AI Chat Assistant** – real‑time conversational UI with mock AI responses.
4. **Mental Health Assessment** – multi‑step form collecting stress/anxiety data.
5. **Emotional Summary** – generated from assessment answers and recent chat.
6. **Therapist Booking** – browse therapists, choose timeslots, and generate room ID.
7. **Secure Video Consultation** – WebRTC page connects via room ID (already in backend).

A public landing page at `/` introduces MindBridge AI, lists core features, and provides clear calls to action. Auth pages are styled with brand colors and headers for a polished website-like login/signup experience.

Navigation and access control are handled with React Router; protected routes redirect to login when no token is present. UI styling is minimal but consistent using simple CSS in `src/index.css`.

### Running the frontend
```bash
cd frontend
npm install          # install dependencies (including chart.js)
npm run dev          # start development server (http://localhost:5173)
```