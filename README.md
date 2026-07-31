User Authentication & Subscription API

A modular Node.js and Express REST API built with MongoDB and Mongoose. The project provides user authentication, subscription-plan management, and user subscription workflows using a clean separation between models, controllers, routes, middleware, and configuration.

Features

Modular architecture: Separates database models, business logic, routes, middleware, and configuration.

User authentication: Supports account registration, login, protected routes, and role-based authorization.

Plan management: Allows administrators to create, view, update, and deactivate subscription plans.

Subscription management: Allows authenticated users to subscribe to a plan, view their current subscription and subscription history, update auto-renewal, and cancel a subscription.

Ownership protection: Ensures users can view or modify only their own subscription records.

Historical snapshots: Stores selected plan details on each subscription so previous records remain accurate when a plan changes.

Validation and error handling: Provides appropriate HTTP status codes and clear JSON responses.

RESTful routing: Uses organized resource-based endpoints that can scale as the application grows.

Project Structure

my-saas-app/
├── config/
│   └── database.js                 # MongoDB connection setup
├── controllers/
│   ├── UserController.js           # Registration, login, and user actions
│   ├── PlanController.js           # Subscription-plan business logic
│   └── SubscriptionController.js   # Subscription business logic
├── middleware/
│   └── authMiddleware.js           # Authentication and authorization checks
├── models/
│   ├── User.js                     # User schema and validation
│   ├── Plan.js                     # Subscription-plan schema
│   └── Subscription.js             # User subscription schema
├── routes/
│   ├── UserRoutes.js               # Authentication and user endpoints
│   ├── PlanRoutes.js               # Plan endpoints
│   └── SubscriptionRoutes.js       # Subscription endpoints
├── .env                            # Environment variables
├── .gitignore                      # Files excluded from Git
├── app.js                          # Express application and server setup
├── package.json                    # Dependencies and scripts
└── README.md                       # Project documentation

Subscription Flow

An authenticated user selects an active plan.

The API confirms that the plan exists and is available.

The API checks that the user does not already have a valid active subscription.

The subscription start and end dates are calculated from the plan's billing interval.

A subscription record is created with a snapshot of the selected plan.

The user can view, cancel, or update auto-renewal for that subscription.

At the current development stage, a subscription may be activated immediately for testing. When payment processing is added, the intended flow will be:

Select plan
→ Create pending subscription
→ Create pending invoice
→ Confirm payment
→ Mark invoice as paid
→ Activate subscription

API Endpoints

Authentication

Method

Endpoint

Access

Description

POST

/api/users/register

Public

Register a user

POST

/api/users/login

Public

Log in a user

POST

/api/users/logout

Authenticated

Log out the current user

Plans

Method

Endpoint

Access

Description

GET

/api/plans

Public

Get available plans

GET

/api/plans/:id

Public

Get one plan

POST

/api/plans

Admin

Create a plan

PATCH

/api/plans/:id

Admin

Update a plan

DELETE

/api/plans/:id

Admin

Deactivate a plan

Subscriptions

Method

Endpoint

Access

Description

POST

/api/subscriptions

Authenticated

Subscribe to a plan

GET

/api/subscriptions/current

Authenticated

Get the current active subscription

GET

/api/subscriptions/history

Authenticated

Get subscription history

PATCH

/api/subscriptions/:id/auto-renew

Authenticated

Turn auto-renewal on or off

PATCH

/api/subscriptions/:id/cancel

Authenticated

Cancel an active subscription

Getting Started

Prerequisites

Node.js

npm

local MongoDB

Installation

Clone the repository:

git clone <repository-url>
cd my-saas-app

Install the dependencies:

npm install

Create a .env file in the project root:

PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret

Start the development server:

npm run dev

If no development script is configured, use:

npm start

Example Subscription Request

POST /api/subscriptions
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "planId": "PLAN_ID",
  "autoRenew": false
}

Example success response:

{
  "success": true,
  "message": "Subscription created successfully",
  "data": {
    "user": "USER_ID",
    "plan": "PLAN_ID",
    "status": "active",
    "autoRenew": false
  }
}

Security Notes

Keep .env out of version control.

Use a strong JWT secret in production.

Protect private endpoints with authentication middleware.

Check both the subscription ID and authenticated user ID before updating a subscription.

Validate request data before saving it to MongoDB.

Do not activate paid subscriptions from frontend confirmation alone. A verified payment-provider webhook should activate them.

Planned Improvements

Add an Invoice model for individual billing and payment history.

Create pending invoices when users select paid plans.

Activate subscriptions only after verified payment.

Integrate a payment provider such as Paystack or Stripe.

Add subscription-access middleware for premium routes.

Add automated tests and API documentation.

License
