# 📅 Recommended 5-Day Timeline & Milestone Roadmap

⏱️ **Recommended Workload**: 5–8 hours per day.  
💡 **Pro Tip**: Consistency is key. Spread your work across all five days to avoid burnout, ensure deep understanding, and maintain a clean Git history. Do not leave everything for the final day!

---

## 🗓️ High-Level Overview

| Day | Focus Area | Expected Output |
|:---:|---|---|
| **Day 1** | **Planning & Database** | Requirements, ERD, Prisma schema, project setup, initial deployment, and API planning. |
| **Day 2** | **Auth & Core APIs** | JWT/Bearer Auth, RBAC middleware, user management, and foundational CRUD. |
| **Day 3** | **Business Logic & Validation** | Complete 20+ APIs, Zod validation, error handling, pagination, soft deletes, and transactions. |
| **Day 4** | **Payment & Testing** | Payment gateway integration (Stripe/SSLCommerz), webhooks, edge case testing, and Postman docs. |
| **Day 5** | **Deployment & Submission** | Production deployment, final QA, README polish, video recording, and submission. |

---

## 🟢 Day 1 — Planning, Architecture & Database
**Focus**: Laying a rock-solid foundation. A good schema prevents headaches later.

- [x] Select project & define core problem domain.
- [x] Define the 3 distinct roles (`ADMIN`, `PHARMACIST`, `CUSTOMER`) and map out their exact permissions.
- [x] Plan 20+ API endpoints and map them in `PROJECT_REQUIREMENTS.md` and `API_INTEGRATION.md`.
- [x] Identify core entities, relationships, constraints, and ERD.
- [x] Initialize Node.js, TypeScript, and Express.js project structure.
- [x] Configure PostgreSQL connection and set up Prisma ORM.
- [x] Create initial Prisma schema, run migrations, and write seed data script.
- [x] Initialize Git repository and make initial meaningful commit.
- [x] Set up initial deployment (Vercel/Render) and testing workflow.

---

## 🔵 Day 2 — Authentication & Core APIs
**Focus**: Securing the app and building the basic data flow.

- [ ] Implement User Registration and Login endpoints.
- [ ] Implement secure password hashing (`bcryptjs`).
- [ ] Generate and manage Bearer Tokens (JWT) & refresh tokens.
- [ ] Create Authentication and Role-Based Authorization (RBAC) middleware.
- [ ] Build User/Profile management APIs (`GET /users/me`, `PATCH /users/me`).
- [ ] Implement core CRUD APIs for primary resource (Medicines catalog).
- [ ] Create the initial Postman collection and test basic flows.

---

## 🟡 Day 3 — Business Logic, Validation & Advanced Features
**Focus**: Turning basic CRUD into a real application.

- [ ] Complete remaining APIs to reach the minimum 20 endpoints.
- [ ] Implement project-specific business workflows (Prescription review queue, order fulfillment status transitions).
- [ ] Add strict server-side validation using **Zod** on all POST/PATCH/PUT routes.
- [ ] Implement centralized error handling middleware with unified JSON responses.
- [ ] Add pagination (`?page=1&limit=10`), filtering, and sorting to GET list endpoints.
- [ ] Implement database transactions (`prisma.$transaction`) for order creation & inventory updates.
- [ ] Add database indexes for frequently queried fields (`email`, `status`, `categoryId`).
- [ ] Implement Soft Deletes (`deletedAt`) and Audit Logging.
- [ ] Integrate Redis (caching/rate-limiting) or Cloudinary file uploads where applicable.

---

## 🟠 Day 4 — Payment Integration & Rigorous Testing
**Focus**: Handling money securely and ensuring nothing breaks.

- [ ] Integrate real payment gateway (**Stripe**, **SSLCommerz**, or **bKash**).
- [ ] Build payment initiation endpoint (creating checkout session / payment intent).
- [ ] Implement secure webhook / callback handling to verify payment signatures and update order status.
- [ ] Build endpoints to track and retrieve payment status.
- [ ] Test all APIs across all 3 roles (verify 403 Forbidden for unauthorized roles).
- [ ] Test validation error responses, 401 Unauthorized, and 404 Not Found.
- [ ] Test concurrency edge cases (e.g., out-of-stock items).
- [ ] Finalize Postman Collection documentation with saved response examples.

---

## 🔴 Day 5 — Deployment, Final Polish & Submission
**Focus**: Going live and packaging the project for evaluators.

- [ ] Configure production environment variables securely on Vercel / Render.
- [ ] Deploy the backend API and connect the live PostgreSQL database.
- [ ] Verify all live APIs, authentication flows, role restrictions, and payment webhooks.
- [ ] Review Git history to ensure **20+ meaningful conventional commits**.
- [ ] Finalize `README.md` with all submission links, instructions, and credentials.
- [ ] Prepare dedicated Admin demo credentials in `test-credentials.txt`.
- [ ] Record and upload the **5–10 minute API walkthrough video**.
- [ ] Submit all required links in the assignment portal.

---

## 🎯 Daily Commitment & Testing Rule

> [!IMPORTANT]
> **Do not code for 40 hours on the last day.**  
> Make meaningful Git commits and test your deployment every single day after finishing coding. A steady, daily progression proves you built it yourself, catches integration bugs early, and ensures your live URL is always working and ready for evaluators.
