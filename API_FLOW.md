# API Flow Documentation

## Authentication Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │     │   Server    │     │  Database   │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                    │
       │  1. Register      │                    │
       │  POST /api/auth/register               │
       │  {username, password}                  │
       │──────────────────>│                    │
       │                   │                    │
       │                   │ 2. Hash password   │
       │                   │ (bcrypt)           │
       │                   │                    │
       │                   │ 3. Save user       │
       │                   │───────────────────>│
       │                   │                    │
       │ 4. Return user    │                    │
       │ {id, username}    │                    │
       │<──────────────────│                    │
       │                   │                    │
       │  5. Login         │                    │
       │  POST /api/auth/login                  │
       │  {username, password}                  │
       │──────────────────>│                    │
       │                   │                    │
       │                   │ 6. Verify          │
       │                   │ credentials        │
       │                   │<──────────────────>│
       │                   │                    │
       │ 7. JWT token      │                    │
       │ {token, user}     │                    │
       │<──────────────────│                    │
```

## Gadget Management Flow

### Create Gadget
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │     │   Server    │     │  Database   │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                    │
       │  POST /api/gadgets│                    │
       │  Bearer {token}   │                    │
       │  {name: "Pen"}    │                    │
       │──────────────────>│                    │
       │                   │                    │
       │                   │ 1. Verify JWT      │
       │                   │                    │
       │                   │ 2. Generate        │
       │                   │ codename           │
       │                   │                    │
       │                   │ 3. Create gadget   │
       │                   │───────────────────>│
       │                   │                    │
       │ 4. Return gadget  │                    │
       │ {id, name,        │                    │
       │  codename,        │                    │
       │  status}          │                    │
       │<──────────────────│                    │
```

### List Gadgets with Filtering
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │     │   Server    │     │  Database   │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                    │
       │  GET /api/gadgets?status=available     │
       │  Bearer {token}   │                    │
       │──────────────────>│                    │
       │                   │                    │
       │                   │ 1. Verify JWT      │
       │                   │                    │
       │                   │ 2. Query by status │
       │                   │───────────────────>│
       │                   │                    │
       │                   │ 3. Gadget list     │
       │                   │<───────────────────│
       │                   │                    │
       │                   │ 4. Add mission     │
       │                   │ probability        │
       │                   │                    │
       │ 5. Return gadgets │                    │
       │ [{gadget +        │                    │
       │   probability}]   │                    │
       │<──────────────────│                    │
```

### Update Gadget Status
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │     │   Server    │     │  Database   │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                    │
       │  PATCH /api/gadgets/{id}               │
       │  Bearer {token}   │                    │
       │  {status: "on_mission"}                │
       │──────────────────>│                    │
       │                   │                    │
       │                   │ 1. Verify JWT      │
       │                   │                    │
       │                   │ 2. Find gadget     │
       │                   │───────────────────>│
       │                   │                    │
       │                   │ 3. Update status   │
       │                   │───────────────────>│
       │                   │                    │
       │ 4. Return updated │                    │
       │ gadget            │                    │
       │<──────────────────│                    │
```

### Self-Destruct Flow (Two-Step Process)
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │     │   Server    │     │  Database   │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                    │
       │  Step 1: Request confirmation code     │
       │  POST /api/gadgets/{id}/self-destruct  │
       │  Bearer {token}   │                    │
       │  {}               │                    │
       │──────────────────>│                    │
       │                   │                    │
       │                   │ 1. Verify JWT      │
       │                   │                    │
       │                   │ 2. Check gadget    │
       │                   │───────────────────>│
       │                   │                    │
       │                   │ 3. Generate code   │
       │                   │ (10 chars)         │
       │                   │                    │
       │ 4. Return code    │                    │
       │ {confirmationCode,│                    │
       │  warning}         │                    │
       │<──────────────────│                    │
       │                   │                    │
       │  Step 2: Confirm destruction            │
       │  POST /api/gadgets/{id}/self-destruct  │
       │  Bearer {token}   │                    │
       │  {confirmationCode: "ABC123XYZ9"}      │
       │──────────────────>│                    │
       │                   │                    │
       │                   │ 5. Verify code     │
       │                   │                    │
       │                   │ 6. Update status   │
       │                   │ to DESTROYED       │
       │                   │───────────────────>│
       │                   │                    │
       │ 7. Confirmation    │                    │
       │ {message, gadget} │                    │
       │<──────────────────│                    │
```

## Status Transitions

```
   ┌─────────────┐
   │  AVAILABLE  │
   └──────┬──────┘
          │
          ├─────────────────┐
          │                 │
          ▼                 ▼
   ┌─────────────┐   ┌─────────────┐
   │ ON_MISSION  │   │DECOMMISSIONED│
   └──────┬──────┘   └─────────────┘
          │
          ▼
   ┌─────────────┐
   │  DESTROYED  │
   └─────────────┘
```

## Request/Response Examples

### Authentication
```json
// Register Request
POST /api/auth/register
{
  "username": "agent007",
  "password": "topsecret"
}

// Register Response
{
  "id": "uuid",
  "username": "agent007",
  "createdAt": "2025-01-20T10:00:00Z"
}

// Login Response
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "username": "agent007"
  }
}
```

### Gadget Operations
```json
// Create Gadget Request
POST /api/gadgets
Authorization: Bearer {token}
{
  "name": "Exploding Pen"
}

// Create Gadget Response
{
  "id": "uuid",
  "name": "Exploding Pen",
  "codename": "SilentWolf123",
  "status": "available",
  "createdAt": "2025-01-20T10:00:00Z"
}

// List Gadgets Response
GET /api/gadgets?status=available
[
  {
    "id": "uuid",
    "name": "Exploding Pen",
    "codename": "SilentWolf123",
    "status": "available",
    "missionSuccessProbability": 87.5,
    "createdAt": "2025-01-20T10:00:00Z"
  }
]

// Self-Destruct Step 1 Response
{
  "message": "Self-destruct sequence requires confirmation",
  "warning": "This action cannot be undone!",
  "confirmationCode": "ABC123XYZ9",
  "instructions": "Send a POST request with this confirmation code to proceed"
}

// Self-Destruct Step 2 Response
{
  "message": "Self-destruct sequence completed",
  "confirmationCode": "ABC123XYZ9",
  "gadget": {
    "id": "uuid",
    "name": "Exploding Pen",
    "status": "destroyed"
  },
  "timestamp": "2025-01-20T10:00:00Z"
}
```

## Error Responses

All errors follow this format:
```json
{
  "error": {
    "message": "Description of error",
    "statusCode": 400,
    "timestamp": "2025-01-20T10:00:00Z",
    "path": "/api/endpoint"
  }
}
```

Common status codes:
- 400: Bad Request (invalid input)
- 401: Unauthorized (missing/invalid token)
- 404: Not Found (resource doesn't exist)
- 409: Conflict (duplicate resource)
- 500: Internal Server Error