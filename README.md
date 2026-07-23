# Backend - User Authentication & Subscription API

A modular, scalable Node.js and Express backend built with MongoDB/Mongoose, implementing clean architecture separating routes, controllers, and models.

## 🚀 Features
- **MVC Architecture:** Clean separation of concerns with dedicated models, controllers, and routes.
- **User Authentication Setup:** Secure schema design with validation rules for registration and login.
- **RESTful Routing:** Organized endpoint structure for scalability.

---

## 📂 Project Structure

```text
my-saas-app/
├── config/
│   └── database.js          # MongoDB connection setup
├── models/
│   └── User.js              # User Mongoose schema & validation
├── controllers/
│   └── UserController.js    # Business logic for user actions
├── routes/
│   └── UserRoutes.js        # API endpoints mapping
├── .env                     # Environment variables
├── app.js                   # Application entry point & server setup
└── package.json             # Project dependencies & scripts