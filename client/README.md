# 🖥️ BookWorm Frontend — Next.js 15 App

This is the client-side application for the BookWorm ecosystem. It is a high-performance, responsive web application built with a focus on modern design patterns, accessibility, and efficient state management.

---

## 🛠️ Technical Highlights

- **Next.js 15 App Router**: Leveraging the latest React Server Components (RSC) and streaming architectures for faster page loads.
- **Glassmorphism UI**: A bespoke design system implemented with vanilla CSS, focusing on visual depth, modern typography, and a premium dark-themed aesthetic.
- **Framer Motion Animations**: used to create smooth micro-interactions, layout transitions, and interactive components like the mobile menu and book progress bars.
- **Context-API State Management**: Centralized handling for authentication, user preferences, and cross-component state synchronization.
- **Optimistic UI Updates**: Implemented in critical areas like the "Currently Reading" progress tracking to ensure an instantaneous user experience.

---

## 📦 Key Directory Structure

- `src/app`: Contains the routing structure using the Next.js App Router (Library, Dashboard, Tutorials, etc.).
- `src/components`:
  - `auth/`: High-order components like `RouteGuard` for global access control.
  - `layout/`: Global UI elements like the responsive `Navbar` and `Footer`.
  - `library/`: Feature-specific components for book management.
  - `ui/`: Reusable, atomic UI components (Buttons, Modals, Cards).
- `src/services`: API abstraction layers using Axios for standardized backend communication.
- `src/context`: Global providers for application state.

---

## 🚦 Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

3. **Run Dev Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🏁 Build & Deployment

- **Production Build**: `npm run build`
- **Deployment**: Integrated with Vercel for continuous deployment and edge-based delivery.

---
*Built for the BookWorm Portfolio Showcase*
