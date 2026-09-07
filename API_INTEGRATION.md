# 🔌 MediQuick — API Integration & Endpoint Mapping

This document maps all frontend components and routes in MediQuick to the backend REST API endpoints.

---

## 🛡️ Authentication & User Profile APIs

| Component / Page | Method | Endpoint | Description | Role Access |
|---|:---:|---|---|:---:|
| `components/auth/LoginForm` | POST | `/api/v1/auth/login` | Authenticate user & return JWT token | Public |
| `components/auth/RegisterForm` | POST | `/api/v1/auth/register` | Register new customer or pharmacist | Public |
| `components/auth/UserProfile` | GET | `/api/v1/auth/me` | Get authenticated user profile & role | All Roles |
| `components/auth/UserProfile` | PATCH | `/api/v1/users/profile` | Update name, avatar, and contact info | All Roles |
| `components/auth/AddressBook` | GET/POST | `/api/v1/users/addresses` | Manage saved shipping addresses | Customer |

---

## 💊 Medicine Catalog & Categories

| Component / Page | Method | Endpoint | Description | Role Access |
|---|:---:|---|---|:---:|
| `app/medicines/page` | GET | `/api/v1/medicines` | List medicines with search, category & pagination | Public |
| `app/medicines/[id]/page` | GET | `/api/v1/medicines/:id` | Get detailed medicine specification | Public |
| `components/medicines/CategoryList` | GET | `/api/v1/categories` | Fetch all medicine therapeutic categories | Public |
| `app/pharmacist/medicines/new` | POST | `/api/v1/medicines` | Add new medicine listing with stock & price | Pharmacist |
| `app/pharmacist/medicines/[id]` | PATCH | `/api/v1/medicines/:id` | Update medicine details, stock or pricing | Pharmacist |
| `app/pharmacist/medicines/page` | DELETE | `/api/v1/medicines/:id` | Remove or archive medicine from store | Pharmacist |

---

## 📄 Prescription Verification APIs

| Component / Page | Method | Endpoint | Description | Role Access |
|---|:---:|---|---|:---:|
| `components/prescriptions/Upload` | POST | `/api/v1/prescriptions` | Upload doctor prescription (file + notes) | Customer |
| `app/customer/prescriptions/page` | GET | `/api/v1/prescriptions/my` | List customer prescription history & status | Customer |
| `app/pharmacist/prescriptions` | GET | `/api/v1/prescriptions/pending` | View pending prescriptions queue | Pharmacist |
| `components/prescriptions/ReviewModal`| PATCH | `/api/v1/prescriptions/:id/status`| Approve/Reject prescription with notes | Pharmacist |

---

## 💳 Orders & Stripe Payment Gateway APIs

| Component / Page | Method | Endpoint | Description | Role Access |
|---|:---:|---|---|:---:|
| `components/checkout/CheckoutButton` | POST | `/api/v1/orders/create-checkout` | Create Stripe checkout session & order | Customer |
| `app/checkout/success/page` | GET | `/api/v1/orders/verify-session` | Verify Stripe session & confirm payment | Customer |
| `app/customer/orders/page` | GET | `/api/v1/orders/my-orders` | List customer past and active orders | Customer |
| `app/customer/orders/[id]/page` | GET | `/api/v1/orders/:id` | Get single order details & tracking status | Customer, Admin |
| `app/pharmacist/orders/page` | GET | `/api/v1/orders/pharmacy` | List orders assigned to this pharmacy | Pharmacist |
| `app/pharmacist/orders/[id]` | PATCH | `/api/v1/orders/:id/status` | Update order status (Packed/Dispatched) | Pharmacist |

---

## 👑 Administrator & Analytics APIs

| Component / Page | Method | Endpoint | Description | Role Access |
|---|:---:|---|---|:---:|
| `app/admin/dashboard/page` | GET | `/api/v1/admin/analytics` | Get total revenue, order count, user stats | Admin |
| `app/admin/users/page` | GET | `/api/v1/admin/users` | List all registered users with role filter | Admin |
| `app/admin/users/page` | PATCH | `/api/v1/admin/users/:id/status`| Activate / Deactivate user account | Admin |
| `app/admin/pharmacists/page` | PATCH | `/api/v1/admin/pharmacists/:id/verify`| Approve or reject pharmacist license | Admin |
| `app/admin/categories/page` | POST/PATCH | `/api/v1/admin/categories` | Create or update global categories | Admin |
