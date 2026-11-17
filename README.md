# Festify — Free Event Management & E-Ticket Platform

**Festify** is a full-stack web application designed to streamline campus and community event discovery, participant registration, instant E-Ticket generation, and organizer management. Built with **Node.js, Express, MongoDB, and EJS**, Festify delivers real-time seat quota tracking, persistent session authentication, and a clean, responsive user interface.

---

## ✨ Key Features

### 🎟️ Participant Experience
* **Event Catalog & Detail View:** Browse active and closed events with comprehensive schedules, location details (On-site with Google Maps link or Online meeting access), guest stars, and participant benefits.
* **Real-Time Seat Quota Tracking:** Live seat capacity indicators (`registeredCount` / `maxSeats`) prevent overbooking and automatically reflect available spots.
* **Instant E-Ticket & Check-In Code:** Upon registration, participants receive a unique check-in ticket code accessible anytime in the **Acara Saya (My Events)** dashboard via an interactive E-Ticket modal.
* **Self-Service Registration Cancellation:** Participants can cancel their registration directly from the E-Ticket modal via AJAX, immediately releasing their seat back into the event's available quota.
* **Role-Aware Navigation & UX:** Sticky navigation bar tailored to user roles, animated hero call-to-action, and a persistent floating back button for effortless navigation.

### 🛠️ Organizer / Admin Dashboard
* **Event Lifecycle Management:** Create, edit, and close event registrations with poster and organizer logo uploads (`multer`), dynamic categories, guest star line-ups, and participant benefits.
* **Registrant Management:** View detailed participant rosters (`registrantList` with DataTables support) and remove registrations with automatic seat quota synchronization.
* **Layered Input Validation:** Strict front-end HTML5 constraints paired with server-side validation rules across authentication, registration, and event creation/update routes.

### 🔐 Authentication & Security
* **Persistent Session Store:** Powered by `express-session` backed by MongoDB (`connect-mongodb-session`), ensuring active logins persist across server restarts.
* **Role-Based Access Control (RBAC):** Dedicated authentication flows and route guards separating regular participants from event administrators.

---

## 🧰 Tech Stack

* **Backend:** Node.js, Express.js
* **Database & ODM:** MongoDB, Mongoose
* **Templating Engine:** EJS (Embedded JavaScript)
* **Authentication & Sessions:** `express-session`, `connect-mongodb-session`, `bcryptjs`
* **File Uploads:** `multer`
* **Frontend Styling & Scripts:** Vanilla CSS3 (Custom Properties & Animations), Vanilla JavaScript (Fetch API / AJAX)

---

## 📂 Project Structure

```text
ProjectUTS-BackEnd-Festify/
├── models/
│   ├── event.js            # Event schema & seat tracking fields
│   ├── registration.js     # Participant registration & ticket code schema
│   └── user.js             # User credentials & role schema
├── routes/
│   ├── admin.js            # Admin dashboard, event CRUD & registrant deletion
│   ├── auth.js             # User/Admin login, registration & logout
│   └── event.js            # Landing page, event details, registration & cancellation
├── server/
│   └── server.js           # Express app entry point, MongoDB & session configuration
├── style/                  # Modular CSS files (global, landing, admin, myEvent, etc.)
├── js/                     # Client-side scripts (dynamic form fields, interactions)
├── uploads/                # Uploaded event posters & organizer logos
├── views/
│   ├── partials/           # Reusable navbar & footer templates
│   └── *.ejs               # Page templates (landing, eventDetail, myEvents, admin, etc.)
├── .env                    # Environment variables (ignored in Git)
└── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [MongoDB](https://www.mongodb.com/) (Local MongoDB Compass/Server or MongoDB Atlas URI)

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone [https://github.com/reinmark1/ProjectUTS-BackEnd-Festify.git](https://github.com/reinmark1/ProjectUTS-BackEnd-Festify.git)
cd ProjectUTS-BackEnd-Festify
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and configure the following variables:
```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/festify
SESSION_SECRET=your_super_secret_session_key
```

### 4. Run the Application
Start the development server:
```bash
npm run dev
```
Open your browser and visit: **`http://localhost:3000`**

---

## 🔑 Demo Admin Access

To test the **Organizer / Admin Dashboard** without manual database role configuration, navigate to `/loginAdmin` and log in using the demo admin key:

* **Admin Access Key:** `abc123superkey`
* 
---
