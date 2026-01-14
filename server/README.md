# ⚙️ BookWorm Backend — Node.js & Express API

This is the mission-control for the BookWorm ecosystem. It provides a secure, performant, and RESTful API that powers the entire reading tracking and social interaction platform.

---

## 🛠️ Technical Highlights

- **RESTful API Architecture**: Designed with a clean separation of concerns using the Controller-Model-Route pattern.
- **Native MongoDB Integration**: Utilizes the native MongoDB driver for high-performance data operations and flexible schema management.
- **Enterprise Security**:
  - **JWT Authentication**: Secure stateless authentication for all protected resources.
  - **Bcrypt Hashing**: Industry-standard password salting and hashing.
  - **RBAC (Role-Based Access Control)**: Granular permissions system to distinguish between standard users and platform administrators.
- **Optimized Data Aggregation**: Custom server-side population logic to serve complex user libraries in a single request, preventing client-side bottlenecks.
- **Security Middleware**: Centralized validation for tokens, administrative rights, and input sanitization.

---

## 📦 Key Directory Structure

- `/config`: Database connection logic and environment configuration.
- `/controllers`: Business logic for various modules (Books, Users, Tutorials, Reviews).
- `/models`: Database interaction layer and schema abstractions.
- `/routes`: Endpoint definitions and middleware orchestration.
- `/middleware`: Reusable logic for authentication and authorization (`verifyToken`, `verifyAdmin`).
- `index.js`: Main entry point and Express application configuration.

---

## 🚀 API Endpoint Overview

### 🔐 Auth & Users
- `POST /users/register` - User onboarding.
- `POST /users/login` - Secure session initiation.
- `GET /users/profile` - Authenticated user data.
- `GET /users/library` - Populated reading shelves.

### 📚 Books & Library
- `GET /books` - paginated book discovery.
- `POST /admin/books` - Protected entity creation.
- `PUT /books/progress` - Real-time reading log updates.

### 🎬 Tutorials
- `GET /tutorials` - Access to the curated learning hub.
- `POST /admin/tutorials` - Content management for administrators.

---

## 🚦 Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_signing_secret
   CLIENT_URL=http://localhost:3000
   ```

3. **Run Server**
   ```bash
   npm start
   ```
   The API will be available at [http://localhost:5000](http://localhost:5000).

---
*Powered by Node.js — Engineered for BookWorm*
