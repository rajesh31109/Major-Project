# 🏥 Student Health Digital Platform

A comprehensive digital health management system for students. This version is frontend-only and does not require backend or Supabase setup.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
cd frontend && npm install
```

### Local Development

```bash
cd frontend
npm run dev
```

**Access the application:**
- Frontend: http://localhost:8080
- Debug Page: http://localhost:8080/debug

## 🔐 Authentication & Credentials


## Features
- Admin Dashboard (UI only)
- Medical Officer Portal (UI only)
- Student Portal (UI only)
- PDF Export (UI only)
- Real-time Statistics (UI only)

## Project Structure

frontend/
├── src/
│   ├── pages/             # Page components
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   ├── config/            # App configuration
│   └── lib/               # Utilities
├── vite.config.ts
├── tailwind.config.ts

## Note
This project is now frontend-only. All backend integration, authentication, and credentials have been removed. The UI/UX is for demonstration purposes only.
3. Check backend logs for errors
4. Rebuild: `cd backend && npm run build`

### Login failed
1. Visit http://localhost:8080/debug
2. Check if backend health status shows ✅
3. Verify admin credentials
4. Check browser console for errors

## 📚 Documentation

- [System Architecture](ARCHITECTURE.md) - Detailed system design

## ⚖️ License

Proprietary - All rights reserved

---

**Status:** ✅ Production Ready
