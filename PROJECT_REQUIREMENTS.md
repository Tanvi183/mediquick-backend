# 📋 B7A6 Backend Project Requirements & API Guidelines

> **💡 Note**: Read these carefully. Follow this guideline to ensure your project meets all evaluation criteria for the B7A6 Backend Project Assignment.

---

## 🛠️ Tech Stack Specification

| Category | Technology | Purpose |
|---|---|---|
| **Runtime & Framework** | **Node.js, TypeScript, Express.js** | REST API development with strict compile-time type safety |
| **Database & ORM** | **PostgreSQL + Prisma** | Relational database with relation management, indexing, and transactions |
| **Validation** | **Zod / Joi** | Strict API-level input validation (body, query, params) |
| **Linting & Formatting** | **ESLint / Prettier / Biome / oxlint** | Code quality, consistency, and automated formatting |
| **Caching & State** | **Redis (Optional/Recommended)** | Caching, temporary session state, or rate limiting |
| **Authentication** | **Custom JWT / Better Auth / Clerk** | Email/Password + Social Login (GCP) + Bearer Token Header |
| **Email (Optional)** | **Nodemailer / Resend** | Transactional emails and order/status notifications |
| **File Storage** | **Multer & Cloudinary** | Secure prescription/image file upload and cloud storage |
| **Payments** | **Stripe / SSLCommerz / bKash** | Real payment processing, checkout sessions & webhook status tracking |
| **Documentation** | **Postman / Swagger** | Complete interactive API collection with environment variables |
| **Deployment** | **Vercel (Serverless Functions) / Render** | Production backend API deployment with live PostgreSQL DB |

---

## 🎯 Core Project Rules

1. **3 Fixed Roles**:
   - Each project must have **3 fixed primary roles** (e.g., `ADMIN`, `PHARMACIST` / `PROVIDER`, `CUSTOMER`).
   - Role permissions must be strictly defined and enforced using RBAC middleware.
2. **Payment Integration (MANDATORY)**:
   - Must integrate **Stripe**, **SSLCommerz**, or **bKash**.
   - Must securely handle payment session creation, success/cancellation callbacks, webhook verification, and DB status update.
   - *Simulated/fake payments (Cash on Delivery, Pay Later) or manual status updates are NOT accepted.*
3. **No Frontend Required**:
   - This is a backend-focused assignment. All functionality must be demonstrated via **Postman**, **Thunder Client**, or **Swagger**.
4. **Security & Protection**:
   - Hash passwords securely with `bcryptjs`.
   - Protect private routes with Bearer JWT middleware.
   - Implement **Rate Limiting** (`express-rate-limit`) to prevent abuse and DDoS.
   - Implement security headers with `helmet` and configure **CORS** properly.
5. **Performance & Concurrency**:
   - Database indexing on frequently queried columns (`email`, `status`, `categoryId`, `createdAt`).
   - Efficient Prisma queries (using `select` to omit password hashes).
   - Use **Database Transactions** (`prisma.$transaction`) to handle concurrency and prevent race conditions (e.g., stock deduction during order checkout).
6. **Modern Data Practices**:
   - **Soft Deletes**: Implement `deletedAt` timestamp on core resources instead of hard deleting records.
   - **Audit Logs / Activity Tracking**: Record critical administrative actions (e.g., who changed a role or verified a pharmacy license).

---

## ⚙️ Minimum 20 APIs Requirement

Each project must implement and document at least **20 meaningful API endpoints** representing real business logic.

### 📐 API Technical Requirements:
- **API Versioning**: All routes prefixed with version identifier (e.g., `/api/v1/...`).
- **Standardized JSON Response Format**:
  - **Success Response**:
    ```json
    {
      "success": true,
      "message": "Operation successful",
      "data": {}
    }
    ```
  - **Error Response**:
    ```json
    {
      "success": false,
      "message": "Something went wrong",
      "errors": []
    }
    ```
- **Authentication & Authorization**: Bearer Token (`Authorization: Bearer <jwt_token>`) and RBAC guards.
- **Validation & Error Handling**: Server-side Zod schemas with structured field error messages.
- **Advanced Data Fetching**:
  - Pagination on list endpoints (`?page=1&limit=10`).
  - Filtering & Sorting (`?status=active&sortBy=createdAt&sortOrder=desc`).
  - Search functionality (`?search=keyword` or `/search?q=keyword`).
- **Soft Deletes & Audit Logs**: Deletion endpoints set `deletedAt: new Date()`.

---

## 🗺️ 20+ API Endpoints Breakdown (MediQuick Reference)

### 1. 🔐 Authentication (3 APIs)
- `POST   /api/v1/auth/register` — Register new Customer or Pharmacist (Zod validated)
- `POST   /api/v1/auth/login` — Email/Password login returning JWT Bearer token
- `POST   /api/v1/auth/refresh-token` — Refresh expired access token

### 2. 👤 User & Profile Management (2 APIs)
- `GET    /api/v1/users/me` — Get current authenticated user profile & role
- `PATCH  /api/v1/users/me` — Update user profile details (Name, phone, avatar)

### 3. 💊 Core Medicine Catalog & Categories (6 APIs)
- `POST   /api/v1/medicines` — Add new medicine listing [Pharmacist/Admin]
- `GET    /api/v1/medicines` — List medicines (?page=1&limit=10&categoryId=...&sortBy=price) [Public]
- `GET    /api/v1/medicines/search` — Full-text search medicines by name or generic name [Public]
- `GET    /api/v1/medicines/:id` — Get single medicine specification [Public]
- `PATCH  /api/v1/medicines/:id` — Update pricing, stock, or details [Pharmacist/Admin]
- `DELETE /api/v1/medicines/:id` — Soft delete medicine (sets `deletedAt`) [Pharmacist/Admin]

### 4. 📄 Prescription Management (4 APIs)
- `POST   /api/v1/prescriptions` — Upload prescription file with notes [Customer]
- `GET    /api/v1/prescriptions/my` — List customer uploaded prescriptions [Customer]
- `GET    /api/v1/prescriptions/pending` — Queue of prescriptions awaiting review [Pharmacist/Admin]
- `PATCH  /api/v1/prescriptions/:id/status` — Approve or Reject prescription with dosage notes [Pharmacist]

### 5. 📦 Orders & Business Workflows (4 APIs)
- `POST   /api/v1/orders` — Create order with items in ACID transaction [Customer]
- `GET    /api/v1/orders/my-orders` — Get paginated customer order history [Customer]
- `GET    /api/v1/orders/:id` — Get detailed order invoice & status timeline [Customer/Pharmacist/Admin]
- `PATCH  /api/v1/orders/:id/status` — Status transition (Processing ➔ Packed ➔ Dispatched ➔ Delivered) [Pharmacist/Admin]

### 6. 💳 Payment Integration (3 APIs)
- `POST   /api/v1/payments/initiate-checkout` — Create Stripe checkout session for order [Customer]
- `POST   /api/v1/payments/webhook` — Secure Stripe webhook endpoint verifying payment success [Public/Stripe]
- `GET    /api/v1/payments/:id` — Retrieve payment status & transaction details [Customer/Admin]

### 7. 👑 Admin Operations & Analytics (3 APIs)
- `GET    /api/v1/admin/users` — List all users with role filtering & pagination [Admin]
- `PATCH  /api/v1/admin/users/:id/role` — Change user role or ban/activate account [Admin]
- `GET    /api/v1/admin/dashboard-stats` — Platform-wide revenue, order volume, and activity analytics [Admin]
- `GET    /api/v1/admin/audit-logs` — System audit trail for security & compliance [Admin]

---

## 📊 Marks Distribution (100% Total)

| # | Category | Weight | Details |
|:---:|---|:---:|---|
| **1** | **API Design & Documentation** | **15%** | RESTful design, endpoint structure, Postman/Swagger docs |
| **2** | **Database Design & Schema** | **15%** | Prisma schema, relationships, constraints, migrations, seed data |
| **3** | **Authentication & Authorization** | **15%** | Auth (Email + GCP), 3 roles, JWT handling, protected routes |
| **4** | **Core Functionality & Business Logic** | **20%** | 20+ APIs, workflows, status transitions, role-based operations |
| **5** | **Error Handling & Validation** | **10%** | Zod input validation, structured error responses, 404/401 handling |
| **6** | **Payment Integration** | **10%** | Stripe/SSLCommerz/bKash integration, payment verification, status tracking |
| **7** | **Performance & Code Quality** | **5%** | Indexing, Prisma transactions, modular architecture, clean code |
| **8** | **Deployment** | **5%** | Working production API, environment configuration, DB connection |
| **9** | **Commit History** | **2%** | 20 meaningful backend commits |
| **10** | **Video Explanation** | **3%** | 5–10 minute API walkthrough |
