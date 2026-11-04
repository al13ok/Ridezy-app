<div align="center">
    <img src="Frontend/public/logo-Ridezy-green.png" height="100px" alt="Ridezy">
</div>

# Ridezy

A ride booking app (think Uber / Rapido) built with the MERN stack. There are two sides to it, a **rider** app and a **captain** (driver) app, and they talk to each other in real time over Socket.IO.

I built this to learn how a real-time app works end to end: auth, sockets, rooms, race conditions when two drivers accept the same ride, that kind of stuff.

## Try it

You don't need to sign up. On the login screen hit **"Try instantly as a demo rider"** (or the captain one on the captain login) and you're in.

| Role    | Email                        | Password          |
| ------- | ---------------------------- | ----------------- |
| Rider   | demo.rider@Ridezy-demo.com   | demopassword123   |
| Captain | aman.singh@Ridezy-demo.com   | demopassword123   |

Demo accounts can't change their password or profile since everyone shares them.

## What it does

**Rider**
- Sign up / log in, optional email verification
- Pick pickup and drop, see fare for bike, auto and car
- Book a ride, get matched with a nearby captain live
- Share a 6 digit PIN with the captain to start the trip
- Chat with the captain during the ride
- Ride history, edit profile, forgot / reset password

**Captain**
- Sign up with vehicle details (type, number, colour, capacity)
- Gets new ride requests in real time and can accept them
- Starts the ride only after entering the rider's PIN
- Live location updates, earnings and ride stats on the home screen

**Backend side**
- JWT auth for both roles, logout blacklists the token
- Socket events check the token, so nobody can pretend to be someone else
- Accepting a ride is atomic, two captains can't grab the same ride
- Rate limiting on login and mail routes
- Reset password links work only once

## Tech stack

<p align="center">
  <img src="https://skillicons.dev/icons?i=js,react,nodejs,express,mongo,tailwind,vercel,git,postman&perline=9" />
</p>

- **Frontend:** React 18, Vite, Tailwind CSS, React Router, React Hook Form, lucide icons, socket.io-client
- **Backend:** Node, Express, MongoDB (Mongoose), Socket.IO, Nodemailer, JWT, bcrypt
- **Hosting:** Vercel (frontend), Render (backend)

## Project structure

```
Ridezy/
├── Backend/
│   ├── config/        db connection, cors, demo account seeds
│   ├── controllers/
│   ├── middlewares/   auth, rate limit
│   ├── models/
│   ├── routes/
│   ├── services/      ride, map, mail
│   ├── templates/     email template
│   ├── socket.js
│   └── server.js
└── Frontend/
    └── src/
        ├── components/   shared UI (ui.jsx has most of the small pieces)
        ├── contexts/     user, captain, socket
        ├── hooks/
        ├── screens/
        └── utils/
```

## Running it locally

You need Node 18+ and a MongoDB database (local or Atlas).

**1. Backend**

```bash
cd Backend
npm install
```

Create `Backend/.env`:

```env
PORT=4000
ENVIRONMENT=development
MONGODB_DEV_URL=mongodb://127.0.0.1:27017/ridezy
MONGODB_PROD_URL=
JWT_SECRET=any-long-random-string
CLIENT_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173

# gmail + app password, used for verify / reset mails
MAIL_USER=
MAIL_PASS=

# optional
DEMO_MODE=true
AUTO_COMPLETE_RIDE=false
SERVER_URL=
RELOAD_INTERVAL=
```

```bash
npm run dev
```

Demo users and captains get seeded automatically on start.

**2. Frontend**

```bash
cd Frontend
npm install
```

Create `Frontend/.env`:

```env
VITE_SERVER_URL=http://localhost:4000
VITE_ENVIRONMENT=development
VITE_RIDE_TIMEOUT=90000
VITE_REQUIRE_EMAIL_VERIFICATION=false
```

```bash
npm run dev
```

Open http://localhost:5173. On desktop the app shows in a phone sized frame, it's meant to be used on mobile.

## Some notes

- `DEMO_MODE=true` makes a demo captain auto accept rides, so you can test the full rider flow alone. With `AUTO_COMPLETE_RIDE=true` the ride also moves to ongoing and completed by itself.
- Place suggestions and distance / time come from a small mock in `Backend/services/map.service.js` (a few Delhi NCR places) so it runs without a Google Maps key. The map itself is a Google Maps embed.
- `SERVER_URL` + `RELOAD_INTERVAL` ping the server every few minutes so Render's free tier doesn't put it to sleep.
- The rate limiter is in memory, fine for one instance. If this ever runs on more than one, it should move to Redis.

## Things I want to add

- Real Google Maps / Places API instead of the mock
- Payments
- Ratings for riders and captains
- Tests

## Author

Alok Chaudhary · [GitHub](https://github.com/al13ok)
