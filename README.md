# MI6 Gadget Inventory API

A secure REST API for managing MI6's gadget inventory system with authentication and self-destruct capabilities.

## Features

- JWT-based authentication
- Gadget CRUD operations
- Two-step self-destruct mechanism
- Status tracking (available, on_mission, destroyed, decommissioned)
- Mission success probability calculation

## Tech Stack

- Node.js + TypeScript
- Express.js
- TypeORM + PostgreSQL
- JWT Authentication
- bcrypt for password hashing

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd MI-backend
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file
```env
PORT=5000
DATABASE_URL=<your_databaseurl>
JWT_SECRET=your_jwt_secret_key
```

4. Run the application
```bash
npm run dev
```

## API Endpoints

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "agent007",
  "password": "secretpassword"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "agent007",
  "password": "secretpassword"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "username": "agent007"
  }
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer {token}
```

### Gadgets (All require authentication)

#### List Gadgets
```http
GET /api/gadgets
Authorization: Bearer {token}

# Optional: Filter by status
GET /api/gadgets?status=available
```

#### Create Gadget
```http
POST /api/gadgets
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Exploding Pen"
}
```

#### Update Gadget
```http
PATCH /api/gadgets/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name",
  "status": "on_mission"
}
```

#### Delete (Decommission) Gadget
```http
DELETE /api/gadgets/{id}
Authorization: Bearer {token}
```

#### Self-Destruct Gadget

**Step 1: Get confirmation code**
```http
POST /api/gadgets/{id}/self-destruct
Authorization: Bearer {token}
Content-Type: application/json

{}
```

Response:
```json
{
  "message": "Self-destruct sequence requires confirmation",
  "warning": "This action cannot be undone!",
  "confirmationCode": "ABC123XYZ9",
  "instructions": "Send a POST request with this confirmation code to proceed"
}
```

**Step 2: Confirm destruction**
```http
POST /api/gadgets/{id}/self-destruct
Authorization: Bearer {token}
Content-Type: application/json

{
  "confirmationCode": "ABC123XYZ9"
}
```

## Gadget Status Types

- `available` - Ready for use
- `on_mission` - Currently deployed
- `destroyed` - Self-destructed
- `decommissioned` - Retired from service

## Project Structure

```
src/
├── config/
│   └── database.ts
├── controllers/
│   ├── authController.ts
│   └── gadgetController.ts
├── entities/
│   ├── Gadget.ts
│   └── User.ts
├── middleware/
│   ├── auth.ts
│   └── errorHandler.ts
├── routes/
│   ├── authRoutes.ts
│   └── gadgetRoutes.ts
├── types/
│   ├── auth.types.ts
│   └── gadget.types.ts
└── index.ts
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

## Error Handling

All errors return standardized JSON responses:
```json
{
  "error": {
    "message": "Error description",
    "statusCode": 400,
    "timestamp": "2025-07-20T07:16:39.763Z",
    "path": "/api/endpoint"
  }
}
```

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Protected routes require valid Bearer token
- Confirmation required for destructive actions
