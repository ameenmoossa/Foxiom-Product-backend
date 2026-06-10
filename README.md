# Foxiom Product Hub — Backend

> Internal product management backend for Foxiom IT Solutions. Built with Node.js, Express, and MongoDB Atlas.

## 🚀 Tech Stack

- **Runtime:** Node.js + Express.js
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Auth:** JWT (Access Tokens) + Refresh Token flow
- **Security:** bcrypt password hashing, AES-256 field encryption
- **Access Control:** Role-Based Access Control (RBAC) — Admin / User
- **Email:** Nodemailer + Gmail SMTP (OTP-based forgot password)
- **Image Storage:** Base64 in MongoDB (no filesystem dependency)
- **Deployment:** Render

## 📁 Folder Structure

├── config/         # DB connection, env config
├── controllers/    # Route logic (auth, products, users)
├── middleware/     # JWT verify, role check, encryption
├── models/         # Mongoose schemas
├── routes/         # Express routers
├── utils/          # Helper functions (OTP, email, crypto)
├── seed.js         # Database seeder
└── server.js       # Entry point


## 🔐 Features

- JWT authentication with 30-minute inactivity auto-logout
- OTP-based forgot password via email
- AES-256 encryption on sensitive fields
- Admin: full CRUD on products, user management, archived product visibility
- User: view active products only
- Base64 image storage (persistent across Render cold starts)

## 🌐 Live

- **Backend API:** `https://foxiom-product-backend.onrender.com`
- **Frontend:** `https://foxiom-product.web.app`

## ⚙️ Environment Variables

```env
MONGO_URI=
JWT_SECRET=
REFRESH_SECRET=
EMAIL_USER=
EMAIL_PASS=
ENCRYPTION_KEY=
```

## 📦 Install & Run

```bash
npm install
npm run dev
```

---

Built by **Damon Dev** @ Foxiom IT Solutions
