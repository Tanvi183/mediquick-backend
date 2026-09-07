# 🏥 MediQuick Backend RESTful API (B7A6 Assignment)

A scalable, secure, and production-ready RESTful API for **MediQuick** (Medicine & Prescription Delivery Platform) built with **Node.js, Express.js, TypeScript, PostgreSQL, and Prisma ORM**.

---

## 🚀 Key Features

- 🛡️ **Role-Based Access Control (RBAC)**: 3 Distinct Roles (`ADMIN`, `PHARMACIST`, `CUSTOMER`).
- 🔐 **Authentication**: Email/Password + GCP Social Login + JWT Bearer tokens.
- ⚡ **Standardized JSON Responses**: Unified `{ success, message, data }` and `{ success, message, errors }`.
- 🔍 **Zod Schema Validation**: Strict type-safe request body & query validation middleware.
- 💳 **Stripe Payment Gateway**: Checkout sessions, webhook verification, and automated order status lifecycle.
- 🗄️ **PostgreSQL + Prisma ORM**: Relational schema, database indexing, and interactive ACID transactions.
- 📄 **20+ REST API Endpoints**: Full CRUD across Auth, Users, Categories, Medicines, Prescriptions, Orders, Payments, and Admin Analytics.

---

## 📦 Submission Details

```txt
Project Name    : MediQuick — Medicine & Prescription Delivery Platform Backend
Backend Repo    : https://github.com/your-username/mediquick-backend
Live API        : https://mediquick-api.vercel.app
API Docs        : https://documenter.getpostman.com/view/your-postman-doc
Demo Video      : https://drive.google.com/file/d/your-video-link/view
Admin Email     : admin@mediquick.com
Admin Password  : AdminPassword123!
```

---

## 🔑 Demo Test Credentials

| Role | Email | Password | Primary Permissions |
|---|---|---|---|
| **ADMIN** | `admin@mediquick.com` | `AdminPassword123!` | User management, pharmacy license approval, category management, platform analytics |
| **PHARMACIST** | `pharmacist@mediquick.com` | `PharmacistPassword123!` | Medicine inventory CRUD, prescription review queue, order fulfillment |
| **CUSTOMER** | `customer@mediquick.com` | `CustomerPassword123!` | Browse medicines, upload prescriptions, cart checkout, Stripe payment, order tracking |

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Validation**: Zod
- **Auth**: JWT (jsonwebtoken), bcryptjs, Google Auth Library
- **Payments**: Stripe API SDK

---

## 🏃 Local Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/mediquick-backend.git
   cd mediquick-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   ```bash
   cp .env.example .env
   ```

4. **Run Prisma Migrations & Seed Data**:
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```
