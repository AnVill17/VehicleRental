

# 🚗 Vehicle Rental Platform (Full-Stack)

A full-stack vehicle rental application where **users** can rent vehicles and **vendors (lenders)** can manage listings and approve or reject rental requests.
Built with a strong focus on **backend architecture, role-based access, and clean API design**, with a modern UI scaffolded using AI tools and fully integrated by hand.

---

## ✨ Features

### 👤 Authentication & Authorization

* User registration & login (JWT based)
* Access & refresh token mechanism
* Secure protected routes
* Role-based access (`user` / `vendor`)
* Vendor-only actions enforced on backend

### 🚘 Vehicle Management (Vendor)

* Add vehicle with image upload (Cloudinary)
* Update vehicle details
* Delete vehicle
* View all owned vehicles
* View rent history for a specific vehicle

### 📍 Location-Based Vehicle Discovery

* Vehicles stored with **GeoJSON coordinates**
* Fetch available vehicles within a radius
* Filter by:

  * Category (car / bike / luxury etc.)
  * Price
  * Distance
  * Rating
* Availability checked using overlapping rental time windows

### 📅 Rental Flow

* User requests vehicle rental (time-based)
* Vendor can:

  * Approve
  * Reject
* Rental statuses:

  * `pending`
  * `approved`
  * `rejected`
  * `cancelled`
  * `completed`

### 📊 User Rental Views

* **Current rents** (all statuses, filterable via query)
* **Previous rents** (completed rentals)
* Each rent includes vehicle details + status

### ⭐ Ratings

* Users can rate vehicles after completed rentals
* Vehicle rating updated incrementally

---

## 🧱 Tech Stack

### Backend

* **Node.js**
* **Express.js**
* **MongoDB + Mongoose**
* **JWT** (access & refresh tokens)
* **Multer** (file uploads)
* **Cloudinary** (image storage)

### Frontend

* **React + TypeScript**
* **Axios** (API communication)
* **Custom service layer** for backend APIs
* **AI-generated UI scaffold (Lovable.dev)**
  → All mock data replaced with real backend integration

---

## 🗂 Project Architecture

### Backend Structure

```
src/
├── controllers/
├── models/
├── routes/
├── middlewares/
├── utils/
└── index.js
```

### Frontend Structure

```
src/
├── components/
├── pages/
├── hooks/
├── services/        # API layer (axios)
├── types/
└── lib/
```

---

## 🔐 Role-Based Access Control

| Action                | User | Vendor |
| --------------------- | ---- | ------ |
| Browse vehicles       | ✅    | ✅      |
| Rent vehicle          | ✅    | ❌      |
| Add / manage vehicles | ❌    | ✅      |
| Approve / reject rent | ❌    | ✅      |
| View own rents        | ✅    | ✅      |

> **Note:** Role checks are enforced on the **backend**, not just the UI.

---

## 🌍 Location Handling

* Vehicles stored using MongoDB **2dsphere index**
* User location captured via latitude & longitude
* Distance calculated using `$geoNear`
* Availability excludes vehicles with overlapping approved or pending rents

---

## 🔄 API Highlights

### Get Available Vehicles

```
POST /rent/available
```

**Body**

```json
{
  "latitude": 23.42,
  "longitude": 85.44,
  "startTime": "2025-01-10T10:00:00Z",
  "endTime": "2025-01-10T18:00:00Z"
}
```

### Get User Current Rents

```
GET /rent/current
GET /rent/current?status=pending,approved
```

### Vendor Rent Requests

```
GET /rent/requests
```

---

## 🧠 Design Decisions (Important)

* **Backend-first approach**: Business logic and data consistency handled server-side
* **Aggregation pipelines** used for complex joins and filtering
* **Service layer on frontend** to mirror backend controllers
* **AI used for UI scaffolding only**, not for business logic
* Focus on **clean data flow, scalability, and maintainability**

---

## 🤖 Use of AI Tools (Transparency)

AI tools were used to:

* Scaffold modern UI components
* Speed up layout and styling

All of the following were implemented manually:

* API design
* Backend logic
* Authentication & authorization
* Role handling
* State management
* Axios service layer
* Error handling

---

## 🚀 Future Improvements

* Real-time chat using Socket.IO
* Pagination for vehicle listings
* Booking calendar UI
* Notifications for rent status updates
* Admin dashboard

---

## 🧪 How to Run Locally

```bash
# Backend
npm install
npm run dev

# Frontend
npm install
npm run dev
```

> Requires MongoDB, Cloudinary credentials, and environment variables.

---

## 📌 Final Note

This project was built to demonstrate **real-world backend architecture**, API design, and frontend integration — not just UI polish.
It reflects how modern full-stack applications are actually developed.

---

