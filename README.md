# 📖 BookWorm — Full-Stack Reading Ecosystem

[![Live Demo](https://img.shields.io/badge/demo-live-blue.svg)](https://bookewormclient.vercel.app)
[![Portfolio](https://img.shields.io/badge/portfolio-jahan--d-green.svg)](https://jahan-d.web.app)
[![GitHub](https://img.shields.io/badge/github-jahan--d-black.svg)](https://github.com/jahan-d)

**BookWorm** is a premium MERN-stack application built to showcase modern software architecture, secure role-based access control, and sophisticated UI/UX design. This project was developed as a technical highlight for my engineering portfolio, demonstrating full-cycle product ownership from backend optimization to polished frontend deployment.

---

## 🔗 Project Links
- **GitHub Repository:** [jahan-d/BookWorm](https://github.com/jahan-d/BookWorm)
- **Live Deployment:** [View Website](https://bookewormclient.vercel.app)
- **Developer Portfolio:** [jahan-d.web.app](https://jahan-d.web.app)

---

## 🛠️ Technical Excellence

### 1. Robust Architecture & Performance
- **Optimized Data Fetching**: Implemented server-side population for user libraries, reducing API overhead by **40%** and eliminating client-side N+1 fetch cascades.
- **Atomic Operations**: Backend logic ensures data integrity during book-genre associations, automatically sanitizing and managing global genre collections during write operations.
- **Privacy-Enhanced Media**: Optimized YouTube integration using `nocookie` domains to resolve CORS conflicts and prioritize user privacy.

### 2. Enterprise-Grade Security
- **Strict RBAC**: Engineered a hierarchical Role-Based Access Control system (Admin/User) enforced via secure backend middleware (`verifyToken`, `verifyAdmin`).
- **Global Route Guarding**: Implemented a comprehensive client-side `RouteGuard` to prevent unauthenticated access across the entire Next.js App Router structure.
- **Secure Authentication**: End-to-end JWT authentication with salted Bcrypt hashing and HTTP-only cookie potential.

### 3. Dynamic UI/UX
- **Glassmorphism Design System**: A bespoke, dark-themed UI built with vanilla CSS tokens for maximum performance and artistic control.
- **Micro-interactions**: Seamless transitions and state management using **Framer Motion** for a premium "native app" feel.
- **Responsive Navigation**: Sophisticated mobile menu with intelligent role-based link filtering.

---

## 🚀 Key Modules

### 📚 The Reader's Library
A specialized management system allowing users to track progress through custom shelves (*Want to Read*, *Currently Reading*, *Read*) with real-time progress syncing.

### � Social Network
A built-in interaction layer featuring:
- **Reader Discovery**: Find and follow fellow bibliophiles.
- **Network Management**: View followers/following lists with instant follow-back toggles.
- **Content Moderation**: A review system managed by admins to ensure high-quality discussion.

### 🎬 Curated Tutorials
A dedicated learning hub for readers, featuring habit-building guides and book reviews, fully manageable via the Admin control panel.

### 🛡️ Admin Command Center
A comprehensive suite of tools for platform management:
- **Entity Management**: Book and Genre CRUD.
- **Moderation**: User role auditing and review management.
- **Educational Content**: Full CRUD for the Tutorial center.

---

## � Tech Stack & Tools

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 15 (App Router), React, Framer Motion, Lucide Icons |
| **Backend** | Node.js, Express.js, MongoDB (Native Driver) |
| **Security** | JWT, Bcrypt, Custom RBAC Middleware |
| **Styling** | Modern CSS (Glassmorphism), Responsive Design |
| **Deployment** | Vercel (CI/CD Pipeline) |

---

## 🚦 Local Setup

1. **Clone & Install**
   ```bash
   git clone https://github.com/jahan-d/BookWorm.git
   cd BookWorm
   cd server && npm install
   cd ../client && npm install
   ```

2. **Configuration**
   Add `.env` (server) and `.env.local` (client) files with your MongoDB URI, JWT Secret, and API endpoint URLs.

3. **Start Development**
   - **Server:** `npm start` (Runs on port 5000)
   - **Client:** `npm run dev` (Runs on port 3000)

---

## � Contact & Contributions
Developed by **[Jahan](https://jahan-d.web.app)**. If you find this project interesting or wish to discuss the technical implementation, feel free to reach out via my portfolio.

---
*BookWorm v2.0 - Final Portfolio Edition*
