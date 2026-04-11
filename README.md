# 🚀 AI Hustle — AI-Powered Side Hustle Discovery Platform

> **Discover AI-powered side hustles and start earning today.**

AI Hustle is a production-grade full-stack MERN application that lists side hustle websites where users can discover earning opportunities. Users browse basic info publicly, but must sign up/login to access full details and external links.

## 🌐 Live Domain
- **Domain:** ai-hustle.ai

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite 8 |
| Styling | Tailwind CSS v4 + Custom Design System |
| Animations | Motion (Framer Motion) |
| Backend | Node.js + Express 5 |
| Database | MongoDB Atlas + Mongoose 9 |
| Auth | JWT + OTP-based Email Verification |
| State | React Context API |
| Forms | React Hook Form |
| Icons | Lucide React |
| Toasts | Sonner |

## 📁 Project Structure

```
SIdeHustle/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/        # Navbar, Footer
│   │   │   ├── sections/      # Landing page sections
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── PlatformCard.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── context/           # Auth & Theme providers
│   │   ├── pages/             # Route pages
│   │   ├── services/          # API service layer
│   │   ├── lib/               # Utilities
│   │   ├── index.css          # Global styles + Tailwind
│   │   ├── App.tsx            # Router + providers
│   │   └── main.tsx           # Entry point
│   ├── index.html             # SEO meta tags
│   └── vite.config.ts         # Vite + Tailwind + proxy
├── server/                    # Express Backend
│   ├── config/db.js           # MongoDB connection
│   ├── controllers/           # Auth & Platform handlers
│   ├── middleware/             # JWT auth + rate limiting
│   ├── models/                # User & Platform schemas
│   ├── routes/                # API routes
│   ├── utils/email.js         # OTP email utility
│   ├── seed.js                # Database seeder
│   └── index.js               # Server entry
├── .env.example               # Environment template
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone & Install

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment

```bash
# In /server, copy .env.example and configure
cp ../.env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### 3. Seed the Database

```bash
cd server
npm run seed
# ✅ Seeds 12 platforms with full details
```

### 4. Start Development

```bash
# Terminal 1 — Backend (port 5000)
cd server
npm run dev

# Terminal 2 — Frontend (port 5173)
cd client
npm run dev
```

### 5. Open Browser
Visit **http://localhost:5173**

## 📡 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/verify-otp` | Public | Verify email OTP |
| POST | `/api/auth/resend-otp` | Public | Resend OTP |
| POST | `/api/auth/login` | Public | Login with email/password |
| GET | `/api/auth/profile` | Protected | Get user profile |

### Platforms
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/platforms` | Public | List all platforms (basic info) |
| GET | `/api/platforms/:id` | Protected | Full platform details |
| POST | `/api/platforms/:id/bookmark` | Protected | Toggle bookmark |
| GET | `/api/platforms/bookmarks/list` | Protected | Get user bookmarks |

### Utility
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |

## 🎨 Features

### Landing Page
- ✅ Animated gradient hero section
- ✅ "About Us" with feature cards
- ✅ "Our Mission" with value cards
- ✅ "Founders" section
- ✅ Contact form
- ✅ Smooth scroll navigation

### Authentication
- ✅ OTP-based email verification
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Protected routes
- ✅ Auto-redirect unverified users

### Dashboard
- ✅ Platform cards with category icons
- ✅ Search with text filtering
- ✅ Category-based filtering
- ✅ Sort by rating, name, earning
- ✅ Grid/List view toggle
- ✅ Loading skeletons
- ✅ Empty state handling
- ✅ Bookmark functionality

### Platform Details
- ✅ Full description
- ✅ Numbered "How to Get Started" steps
- ✅ Pros & Cons lists
- ✅ External website link
- ✅ Bookmark toggle

### UI/UX
- ✅ Dark/Light mode (persisted)
- ✅ Glassmorphism navbar
- ✅ Smooth animations (Motion)
- ✅ Card hover effects
- ✅ Toast notifications (Sonner)
- ✅ Fully responsive
- ✅ Error boundaries
- ✅ Custom scrollbar

### Security & Performance
- ✅ Helmet security headers
- ✅ CORS configuration
- ✅ Rate limiting (auth + API)
- ✅ JWT token management
- ✅ SEO meta tags + Open Graph
- ✅ Google Fonts (Inter)

## 🔐 OTP Behavior

- **Development**: OTP is logged to the server console (no email sent)
- **Production**: Configure Gmail App Password in `.env` for real email delivery

## 📦 Seeded Platforms (12)

Outlier AI, Remotasks, Clickworker, Fiverr, Upwork, Swagbucks, UserTesting, Appen, Toloka, Teachable, Midjourney, GitHub Copilot Freelancing

## 🎯 Design System

| Element | Value |
|---------|-------|
| Primary | Indigo (#6366f1) |
| Accent | Cyan (#06b6d4) |
| Font | Inter (Google Fonts) |
| Border Radius | 12-16px (rounded-xl/2xl) |
| Dark BG | #0f0f23 |
| Card BG (Dark) | #1a1a3e |

---

Built with ❤️ by the AI Hustle Team
