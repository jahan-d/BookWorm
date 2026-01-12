# BookWorm - MERN Stack Reading Tracker

A professional, full-stack web application for tracking reading goals, managing book libraries, and social interaction between readers.

## 🚀 Features
- **Library Tracker**: Organize books into "Want to Read", "Currently Reading", and "Read" shelves.
- **Reading Progress**: Log pages read and visualize progress with dynamic bars.
- **Annual Goals**: Set and track yearly reading targets.
- **Social Feed**: Follow other readers and see their updates.
- **Admin Dashboard**: Comprehensive moderation tools for reviews, books, genres, and tutorials.
- **Production Ready**: JWT authentication, DB-backed role validation, and secure API structure.

## 🛠️ Tech Stack
- **Frontend**: Next.js 15, Tailwind CSS, Framer Motion, Lucide icons.
- **Backend**: Node.js, Express, MongoDB.
- **Auth**: Custom JWT with Bcrypt password hashing.
- **Deployment**: Optimized for Vercel.

## 📦 Project Structure
- `/client`: Next.js frontend application.
- `/server`: Express.js backend API.
- `/verify_api.bat`: Automated QA test suite.

## 🚦 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas account

### 2. Environment Variables
Create `.env` files in both `/client` and `/server` (refer to `deployment_guide.md` in the audit artifacts for details).

### 3. Installation
```bash
# Server
cd server && npm install

# Client
cd client && npm install
```

### 4. Running Locally
```bash
# Server
cd server && npm start

# Client
cd client && npm run dev
```

## 🛡️ Security & Privacy
- **Data Sanitization**: Internal fields and passwords never leak to the client.
- **Privacy**: User emails are sanitized in public review feeds.
- **RBAC**: Strict Role-Based Access Control via `verifyAdmin` middleware.

## 🏁 Production Status
The codebase has undergone a comprehensive Production-Grade Audit and is officially signed off for deployment.
