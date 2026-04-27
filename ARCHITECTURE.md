# 🗺️ Frontend-Only Architecture & Setup Guide

## 📊 System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                   🌐 FRONTEND (React + Vite) (UI Only)       │
│                   Deployed on Vercel                         │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ React Components (UI/UX only, no backend)              │  │
│  │ ├─ LoginCard                                           │  │
│  │ ├─ StudentDashboard                                   │  │
│  │ ├─ AdminDashboard                                     │  │
│  │ └─ ... (your components)                              │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

All backend, database, and API logic has been removed. This project is now frontend-only for UI/UX demonstration.

---

## 🔐 Authentication Flow

```
User                Frontend              Backend              Database
  │                   │                    │                    │
  ├──────Register────>│                    │                    │
  │                   ├──POST /auth/register─>                   │
  │                   │                    ├──Hash Password──┐   │
  │                   │                    │                 │   │
  │                   │                    ├─Check if exists─┼───┤
  │                   │                    │                 │   │
  │                   │                    ├──Create record──┼──>│
  │                   │                    │                 │   │
  │                   │      (user+token)<─┼─────────────────┴───┤
  │                   │<──────(user+token)─┤                     │
  │                   │ Store token in localStorage              │
  │                   │                    │                    │
  │                   │                    │                    │
  ├────Login────────>│                    │                    │
  │                   ├──POST /auth/login──>                    │
  │                   │                    ├─Get user from DB──>│
  │                   │                    │<─────user─────────│
  │                   │                    ├─Compare passwords │
  │                   │                    │   (bcrypt.compare) │
  │                   │                    │<─Compare result───│
  │                   │                    ├─Generate JWT──┐   │
  │                   │      (user+token)<─┤               │   │
  │                   │<──────(user+token)─┤               │   │
  │                   │ Update localStorage token            │
  │                   │                    │                │
  │                   │                    │                │
  ├─Get Health        │                    │                │
  │ Records (Token)───>                    │                │
  │                   ├─GET /api/health-records───>         │
  │                   │ Header: Authorization: Bearer JWT   │
  │                   │                    ├─Verify JWT─┐   │
  │                   │                    │ (success)  │   │
  │                   │                    ├─Query DB──────>│
  │                   │                    │<─records───────│
  │                   │    (records)<──────┤                │
  │                   │<──────(records)────┤                │
  │ Display records    │                    │                │
  │                    │                    │                │
```

---

## 📝 Data Flow: Create Health Record

```
User fills form → Component handler → useHealthRecords hook → API Client
                                         ↓
                                    apiClient.createHealthRecord()
                                         ↓
                              POST http://localhost:3000/api/health-records
                              Headers: Authorization: Bearer <token>
                              Body: { recordType, description, date }
                                         ↓
                                  Backend Route Handler
                                         ↓
                              healthRecordController.createHealthRecord()
                                         ↓
                            Verify token (authMiddleware)
                                         ↓
                            Insert into health_records table
                                         ↓
                               Supabase PostgreSQL
                                         ↓
                              Return created record
                                         ↓
                            Update local records state
                                         ↓
                            Update Component UI
```

---

## 🚀 Deployment Architecture

```
GitHub Repository
├─ Main Branch
│  ├─ Frontend code (src/)
│  ├─ Backend code (backend/src)
│  ├─ vercel.json (Vercel config)
│  └─ backend/package.json
│
├─ Render
│  ├─ Deployment: Web Service
│  ├─ Build: npm install && npm run build (in backend/)
│  ├─ Start: node dist/index.js
│  ├─ URL: https://student-health-backend.onrender.com
│  └─ Env Vars:
│      ├─ SUPABASE_URL
│      ├─ SUPABASE_KEY
│      ├─ JWT_SECRET
│      ├─ FRONTEND_URL
│      └─ NODE_ENV=production
│
└─ Vercel
   ├─ Deployment: Frontend
   ├─ Build: npm run build
   ├─ Start: npm run preview
   ├─ URL: https://student-health-platform.vercel.app
   └─ Env Vars:
       └─ VITE_API_URL=https://student-health-backend.onrender.com
```

---

## 🔄 Request/Response Cycle

### Example: Login Request

**Frontend (Browser)**
```javascript
// useAuth hook
const response = await apiClient.login('user@example.com', 'password', 'student');
```

↓

**HTTP Request**
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password",
  "role": "student"
}
```

↓

**Backend Processing**
1. Route: `authRoutes.ts` → POST /api/auth/login
2. Controller: `authController.ts` → login()
3. Validation: Check email & password format
4. Database: Query `student_users` table
5. Security: Compare hashed password
6. Token: Generate JWT token
7. Response: Send user data + token

↓

**HTTP Response**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid-123",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "roll_number": "STU001",
      "department": "CS"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

↓

**Frontend Processing**
1. Extract token from response
2. Store in localStorage
3. Set user state
4. Redirect to dashboard
5. Token automatically added to all future requests

---

## 🔐 Security Layers

```
Layer 1: HTTPS Transport
└─ All data encrypted in transit

Layer 2: Input Validation
└─ Zod schema validation on backend

Layer 3: Authentication (JWT)
└─ Token verified on every protected request

Layer 4: Password Security
└─ bcrypt hashing with salt for storage

Layer 5: Database Security
└─ Prepared statements (Supabase)
└─ Row-level security policies
└─ Proper foreign keys & constraints

Layer 6: CORS
└─ Only allow requests from frontend URL

Layer 7: Environment Secrets
└─ Sensitive data in .env files
└─ Never commit secrets to git
```

---

## 📱 Component Integration Example

### Before (Static Data)
```typescript
// Hard-coded data
const students = [
  { id: 1, name: 'John', email: 'john@example.com' },
];
```

### After (Dynamic Data)
```typescript
import { useAuth, useHealthRecords } from '@/hooks/useApi';

function Dashboard() {
  const { user } = useAuth();
  const { records, fetchRecords } = useHealthRecords();
  
  useEffect(() => {
    fetchRecords(); // Fetch from backend
  }, []);
  
  return (
    <div>
      <h1>Welcome {user?.first_name}</h1>
      <h2>Your Health Records:</h2>
      {records.map(r => (
        <div key={r.id}>{r.description}</div>
      ))}
    </div>
  );
}
```

---

## ⏱️ Request Timeline (Approximate)

```
Browser              Network              Backend           Database
  │                    │                    │                  │
  ├──Make Request─────>│ (0-5ms)            │                  │
  │                    ├──Send to Backend──>│ (5-20ms)          │
  │                    │                    ├─Parse Request    │
  │                    │                    ├─Verify Token    │
  │                    │                    ├─Validate Data   │
  │                    │                    │                  │
  │                    │                    ├─Query Database──>│ (0-50ms)
  │                    │                    │<─Response────────┤
  │                    │                    │                  │
  │                    │                    ├─Prepare Response │
  │                    │<─Send Response────│ (5-20ms)         │
  │<──Response────────│ (0-5ms)            │                  │
  │                    │                    │                  │
  │ Process Response    │                    │                  │
  │ Update UI           │                    │                  │
  │                    │                    │                  │
  
  Total: ~50-150ms typical
```

---

## 🛠️ Environment Variables Reference

### Backend (.env)
```
PORT=3000                           # Server port
NODE_ENV=production                 # Environment
FRONTEND_URL=https://*.vercel.app   # CORS origin
SUPABASE_URL=https://*.supabase.co  # Database URL
SUPABASE_KEY=eyJh...                # Anon public key
JWT_SECRET=your-secret-key          # Token signing key
```

### Frontend (.env)
```
VITE_API_URL=https://*.onrender.com # Backend URL
```

---

## 📊 Scalability Considerations

```
Current Setup (Development)
├─ Single backend instance
├─ Supabase free tier
└─ Works for 1-10 concurrent users

Scale to Production
├─ Render auto-scaling
├─ Supabase pro tier
├─ Database connection pooling
├─ CDN for frontend (Vercel built-in)
├─ Rate limiting
├─ Caching strategies
└─ Monitors & alerts
```

---

This architecture is production-ready and scalable! 🚀
