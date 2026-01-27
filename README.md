# AdBrovz Backend API

Backend API for AdBrovz Private Limited - Service Booking Platform

## Overview

This is the backend API for the AdBrovz platform, supporting:
- **User App (AdBrovz)**: Service booking and management
- **Vendor App (AdBrovz Elite)**: Vendor onboarding and service delivery
- **Admin Panel**: Platform management and analytics

## Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Cache/Queue**: Redis with Bull
- **Authentication**: JWT + PIN-based
- **Payment**: Razorpay
- **Notifications**: Firebase Cloud Messaging
- **SMS**: SMS Country
- **Maps**: Google Maps API (GCP)
- **Hosting**: AWS

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── constants/       # Constants and enums
│   ├── controllers/     # Request handlers
│   ├── dtos/           # Data Transfer Objects
│   ├── database/       # Database migrations and seeders
│   ├── middlewares/    # Express middlewares
│   ├── models/         # Mongoose models
│   ├── modules/        # Feature modules
│   │   ├── auth/       # Authentication module
│   │   ├── user/       # User module
│   │   ├── admin/      # Admin module
│   │   ├── vendor/     # Vendor module
│   │   ├── booking/    # Booking module
│   │   ├── service/    # Service management
│   │   ├── notification/ # Notifications
│   │   └── payment/    # Payment processing
│   ├── routes/         # Route definitions
│   ├── services/       # Business logic services
│   ├── utils/          # Utility functions
│   ├── validators/     # Input validation
│   ├── workers/        # Background workers
│   ├── app.js          # Express app configuration
│   └── server.js       # Server entry point
├── tests/              # Test files
├── docs/               # Documentation
├── scripts/            # Deployment scripts
└── logs/               # Application logs
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- MongoDB >= 6.0
- Redis >= 7.0
- npm >= 9.0.0

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and configure:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your configuration values

5. Start MongoDB and Redis services

6. Run migrations:
   ```bash
   npm run migrate
   ```

7. Seed initial data (optional):
   ```bash
   npm run seed
   ```

8. Start development server:
   ```bash
   npm run dev
   ```

## API Documentation

See `docs/api.md` for detailed API documentation.

## Testing

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration
```

## Environment Variables

See `.env.example` for all available environment variables.

## License

Proprietary - AdBrovz Private Limited

## Company Information

- **CIN**: U74999KA2022PTC168833
- **GSTIN**: 29AAYCA0269L1ZW

