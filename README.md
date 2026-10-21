# PS5 – Clinic Appointment & Patient Visit System

A MERN web app where patients book doctor appointments and the clinic's admin/receptionist manages doctors, visits, notes and a dashboard.

> **AI use disclosure:** The source code of this project was written with the help of an AI assistant (Claude by Anthropic), with permission from the course instructor.

**Live links:** Frontend – _add Vercel URL_ · Backend – _add Render URL_

## Features

- Patient registration and login (JWT, passwords hashed with bcrypt)
- Admin/receptionist login with role-based access (frontend and backend)
- Patient profile with age, gender and phone
- Doctor CRUD: name, specialization, consultation fee, available days, start/end time, slot duration
- Search doctors by name/specialization and filter by specialization
- Doctor detail page with date picker and slot booking
- Slots generated from the doctor's working hours
- Backend rules: no duplicate booking (same doctor + date + slot), no past dates or past times, no booking on the doctor's off days, only real slots
- Status workflow: Booked → Checked-In → Completed, or Booked → Cancelled
- Patients can cancel only their own Booked appointments, and only before the appointment time
- Admin adds diagnosis and prescription notes to Completed appointments
- Patient visit history with notes
- Dashboard: today's appointments, totals, cancellations, consultation revenue (Completed only) and doctor-wise counts

## Tech stack

React (Vite) · React Router · native fetch · Node.js · Express · MongoDB Atlas · Mongoose · JWT · bcryptjs

React concepts used: functional components, props, useState, useEffect, React Router and conditional rendering.

## Folder structure

```
ps5-clinic-appointment/
├── server/
│   ├── config/db.js
│   ├── models/          User, Doctor, Appointment
│   ├── controllers/     auth, doctor, appointment, dashboard
│   ├── routes/          auth, doctor, appointment, dashboard
│   ├── middleware/      authMiddleware (protect, adminOnly, patientOnly), errorMiddleware
│   ├── utils/timeHelpers.js   slot generation, dates, clinic time zone
│   ├── seed.js          creates the first admin + sample doctors
│   └── app.js
└── client/
    └── src/
        ├── api/         apiClient + fetch functions
        ├── components/  Navbar, ProtectedRoute, DoctorCard, DoctorForm, ...
        ├── pages/       Home, Login, Register, Doctors, DoctorDetail, ...
        ├── App.jsx      routes + logged-in user state
        └── main.jsx
```

## Run locally

**1. Backend**

```bash
cd server
npm install
cp .env.example .env      # then put your Atlas URI and a JWT secret in .env
npm run seed              # creates admin account + 4 sample doctors (run once)
npm run dev               # http://localhost:5050/api/health
```

**2. Frontend** (new terminal)

```bash
cd client
npm install
cp .env.example .env
npm run dev               # http://localhost:5173
```

Admin login after seeding: the `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `server/.env` (default `admin@clinic.com` / `admin123` – change it before deploying).

## Environment variables

| Folder | Variable | Purpose |
| --- | --- | --- |
| server | `PORT` | API port (Render sets it automatically) |
| server | `MONGO_URI` | MongoDB Atlas connection string |
| server | `JWT_SECRET` | Secret used to sign login tokens |
| server | `CLIENT_URL` | Frontend URL allowed by CORS (comma-separate several) |
| server | `CLINIC_TIMEZONE` | Optional, default `Asia/Kolkata` – used for "today" and "now" |
| server | `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Used only by `npm run seed` |
| client | `VITE_API_URL` | Backend URL ending in `/api` |

## API endpoints

| Method | URL | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Register a patient |
| POST | `/api/auth/login` | Public | Login (patient/admin) |
| GET / PUT | `/api/auth/me` | Logged in | View / update profile |
| GET | `/api/doctors?search=&specialization=` | Public | List, search, filter |
| GET | `/api/doctors/specializations` | Public | Specialization list |
| GET | `/api/doctors/:id` | Public | Doctor details |
| GET | `/api/doctors/:id/slots?date=YYYY-MM-DD` | Logged in | Slots for a date |
| POST / PUT / DELETE | `/api/doctors`, `/api/doctors/:id` | Admin | Doctor CRUD |
| POST | `/api/appointments` | Patient | Book |
| GET | `/api/appointments/my` | Patient | Visit history |
| GET | `/api/appointments?date=&status=&doctor=` | Admin | All appointments |
| PATCH | `/api/appointments/:id/cancel` | Owner patient / admin | Cancel |
| PATCH | `/api/appointments/:id/status` | Admin | Check in / complete / cancel |
| PATCH | `/api/appointments/:id/notes` | Admin | Diagnosis + prescription |
| GET | `/api/dashboard` | Admin | Dashboard stats |

Status codes: 200 OK · 201 created · 400 invalid input or broken rule · 401 not logged in · 403 wrong role · 404 not found · 409 duplicate · 500 server error.

## Deployment

**Backend on Render**
1. Push the repo to GitHub (check that `.env` and `node_modules` are not committed).
2. MongoDB Atlas → Network Access → allow `0.0.0.0/0`.
3. Render → New Web Service → Root Directory `server`, Build `npm install`, Start `npm start`.
4. Add `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (your Vercel URL) in Render's Environment tab.
5. Run the seed once locally against the same Atlas database (or from Render's shell).
6. Open `https://<your-app>.onrender.com/api/health`.

**Frontend on Vercel**
1. Vercel → New Project → same repo → Root Directory `client`, framework Vite.
2. Add `VITE_API_URL` = `https://<your-app>.onrender.com/api`.
3. `client/vercel.json` already rewrites all paths to `index.html`, so refreshing `/doctors/123` works.
4. Update `CLIENT_URL` on Render to the Vercel URL and redeploy.

## Testing checklist

- Register with an existing email → 409
- Patient token on `POST /api/doctors` → 403
- Book a past date / doctor's off day / random time like `10:15` → 400
- Book the same slot twice → 409; cancel it → slot becomes free again
- Cancel someone else's appointment → 403; cancel after its time → 400
- Booked → Completed directly → 400; notes on a Booked appointment → 400
- Dashboard revenue counts only Completed appointments
