# Auth Service: Flow & Architecture

## Architecture

Requests pass through validation, authentication, and then the controller. Each layer has one job.

```mermaid
flowchart LR
    C[Client] --> R[Router]
    R --> V[Validator]
    V --> A[authenticate middleware]
    A --> CT[Controller]
    CT --> M[(MongoDB<br/>userModel)]
    CT --> U[utils<br/>token helpers]
```

| Layer | Responsibility |
| ----- | -------------- |
| Router | Maps endpoints to middleware and controllers |
| Validator | Checks request body shape (express-validator), returns 400 on failure |
| authenticate | Verifies the access token, attaches the payload to `req.user` |
| Controller | Business logic: register, login, refresh, getMe |
| utils | Create and verify access and refresh tokens |
| userModel | Persists the user and the current refresh token |

## Token Design

| Token | Lifetime | Stored in (client) | Stored in (server) | Purpose |
| ----- | -------- | ------------------ | ------------------ | ------- |
| Access token | Short | Memory / `Authorization: Bearer` header | Not stored | Authorize API requests |
| Refresh token | Long | `httpOnly` cookie | `userModel.refreshToken` | Get a new access token |

Both tokens carry `{ userId, role }`.

## Flows

### Register / Login

```mermaid
sequenceDiagram
    participant C as Client
    participant S as Server
    participant DB as MongoDB

    C->>S: POST /register or /login
    S->>S: Validate body
    S->>DB: Create user / find user
    S->>S: Hash or compare password (bcrypt)
    S->>S: Create access + refresh token
    S->>DB: Save refreshToken on user
    S-->>C: accessToken (body) + refreshToken (httpOnly cookie)
```

### Accessing a Protected Route

```mermaid
sequenceDiagram
    participant C as Client
    participant A as authenticate
    participant CT as Controller

    C->>A: GET /get-me (Authorization: Bearer token)
    A->>A: Verify access token
    alt valid
        A->>CT: req.user = { userId, role }
        CT-->>C: 200 data
    else missing / invalid / expired
        A-->>C: 401
    end
```

### Refresh with Rotation and Reuse Detection

```mermaid
sequenceDiagram
    participant C as Client
    participant S as Server
    participant DB as MongoDB

    C->>S: POST /refresh (refreshToken cookie)
    S->>S: Verify refresh token signature + expiry
    S->>DB: Find user by userId
    alt token matches stored token
        S->>S: Create new access + new refresh token
        S->>DB: Replace stored refreshToken
        S-->>C: new accessToken + new refreshToken cookie
    else mismatch (reuse detected)
        S->>DB: Set refreshToken = null
        S-->>C: 401, user must log in again
    end
```

**Why rotate?** Every refresh token is single-use. If an old token is replayed, it won't match the stored one, so the stored token is wiped and every session for that user is forced to log in again.

## Data Model

```mermaid
erDiagram
    USER {
        string email UK
        string name
        string passwordHash
        string role "user | seller"
        string refreshToken
        date createdAt
        date updatedAt
    }
```

## Folder Structure

```
src/
├── controllers/   register, login, refresh, getMe
├── middlewares/   validators, authenticate
├── models/        userModel
├── routes/        auth routes
└── utils/         create/read token helpers
```

## Error Handling Conventions

| Status | Meaning |
| ------ | ------- |
| 400 | Request body failed validation |
| 401 | Missing, invalid, or expired token; refresh token mismatch |
| 403 | Authenticated but role not allowed |
| 404 | User no longer exists |