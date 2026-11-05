# StayHealthy

StayHealthy is an online medical appointment booking platform built with **React** as the IBM Front-End Developer Capstone project. Patients can find doctors by speciality, book in-person appointments or instant online consultations, get notified about their bookings, review doctors and manage their profile.

## Features

- **Responsive Navbar** – Home, Appointments, Instant Consultation and Reviews links; shows *Welcome, Name* and a **Logout** button after login.
- **Sign Up & Login** – forms with client-side validation (role, name, 10-digit phone, email format, password length).
- **Find Doctor Search** – search doctors by speciality with a dropdown of suggestions.
- **Appointment Booking** – book an appointment (name, phone, date, time slot) and cancel it.
- **Instant Consultation** – book an immediate online consultation with an available doctor.
- **Notifications** – a pop-up with the latest appointment details that disappears when it is cancelled.
- **Reviews** – table of doctors with a feedback form (review text + star rating); the button is disabled after a review is submitted.
- **Profile** – view and edit your name and phone number.
- **SEO** – meta title, description, keywords and Open Graph tags in `index.html`.

## Tech stack

React 18 · React Router 6 · Vite · HTML5 · CSS3 · Git/GitHub

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build in /dist
npm run preview    # serve the production build
```

## Backend API

The `server/` folder contains a dependency-free Node.js authentication API (users stored in `server/users.json`, scrypt-hashed passwords, JWT-style token).

```bash
node server/index.js            # http://localhost:8181
```

| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/api/auth/register` | `{ role, name, email, phone, password }` |
| POST | `/api/auth/login` | `{ email, password }` |
| GET / PUT | `/api/auth/user` | `Authorization: Bearer <authtoken>` |

```bash
curl -X POST http://localhost:8181/api/auth/register -H "Content-Type: application/json" -d '{"role":"patient","name":"Nurdaulet","email":"nurdaulet@example.com","phone":"7766378394","password":"password123"}'
curl -X POST http://localhost:8181/api/auth/login -H "Content-Type: application/json" -d '{"email":"nurdaulet@example.com","password":"password123"}'
```

`Sign_Up.jsx` and `Login.jsx` call these endpoints. On the static deployed site (no backend) they fall back to browser storage so the demo keeps working.

## Project structure

```
server/            Node.js authentication API
design/            Module 1 layout mockups (navbar, sign up, login)
public/            static assets
screenshots/       screenshots for the capstone submission
src/
  components/      Navbar, Landing_Page, Sign_Up, Login, FindDoctorSearch,
                   AppointmentFormIC, ReportsLayout,
                   DoctorCard, AppointmentForm, BookingConsultation,
                   InstantConsultation, Notification, ReviewForm,
                   GiveReviews, ProfileCard
  data/            doctors list
  utils/           auth, appointments and reviews helpers
```

## Author

StayHealthy capstone project – IBM Front-End Developer Professional Certificate.
