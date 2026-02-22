# ThePantry — Backend

Flask REST API for the food rescue application. Serves JSON to the React frontend. No HTML rendering.

## Quick Start

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python src/app.py
```

## Live Server

Production: `http://17423-team03.s3d.cmu.edu`
Same endpoints as below — e.g. `http://17423-team03.s3d.cmu.edu/api/v1/donations`

Currently using SQLite in production. To switch to MySQL later:
```bash
export DATABASE_URL="mysql+pymysql://user:pass@localhost/the_pantry"
```

## Project Structure

```
backend/
├── pytest.ini
├── requirements.txt
├── src/
│   ├── app.py                          # App factory, wires services + blueprints
│   ├── config.py                       # Config / TestConfig
│   ├── extensions.py                   # Shared SQLAlchemy instance
│   ├── models/
│   │   ├── user.py                     # User table
│   │   ├── hold.py                     # Hold table + HoldStatus enum
│   │   └── pickup_history.py           # PickupHistory table
│   ├── services/
│   │   ├── inventory_service.py        # ABC + MockInventoryService (stub)
│   │   ├── hold_service.py             # Hold CRUD, double-booking prevention
│   │   ├── history_service.py          # Pickup record storage/retrieval
│   │   ├── user_service.py             # User creation/lookup
│   │   └── reservation_service.py      # Orchestrator
│   └── routes/
│       ├── donation_routes.py
│       ├── hold_routes.py
│       ├── history_routes.py
│       └── user_routes.py
└── tests/
    ├── conftest.py
    ├── test_donations.py
    ├── test_holds.py
    ├── test_history.py
    └── test_users.py
```

**Architecture:** Routes -> ReservationService (orchestrator) -> individual services -> models/DB. The `InventoryService` is an abstract base class; currently wired to `MockInventoryService` with hardcoded donation data.

## Running Tests

```bash
cd backend
pytest           # all tests
pytest -v        # verbose
pytest -x        # stop on first failure
```

Tests use in-memory SQLite (`TestConfig`) — no setup required.

---

## API Reference

Base URL: `http://localhost:5000`

All versioned endpoints use the `/api/v1` prefix. Requests and responses use `Content-Type: application/json`.

Error responses follow the shape: `{ "error": "<message>" }`

---

### Health

#### `GET /api/v1/health`

Server health check. No auth required.

**Response `200`**
```json
{ "status": "ok" }
```

---

### Users

#### `POST /api/v1/users`

Register a new user or retrieve an existing one by email (upsert).

**Request Body**

| Field | Type   | Required | Description        |
|-------|--------|----------|--------------------|
| email | string | yes      | Unique email       |
| name  | string | yes      | Display name       |

**Response `201` — User created**
```json
{
  "user": {
    "id": 1,
    "email": "alice@example.com",
    "name": "Alice",
    "createdAt": "2026-02-20T12:00:00"
  },
  "created": true
}
```

**Response `200` — Existing user returned**
```json
{
  "user": { "id": 1, "email": "alice@example.com", "name": "Alice", "createdAt": "..." },
  "created": false
}
```

**Response `400`** — Missing `email` or `name`.

---

#### `GET /api/v1/users/lookup`

Look up a user by email address.

**Query Parameters**

| Param | Type   | Required | Description              |
|-------|--------|----------|--------------------------|
| email | string | yes      | Email address to look up |

**Response `200`**
```json
{
  "id": 1,
  "email": "alice@example.com",
  "name": "Alice",
  "createdAt": "2026-02-20T12:00:00"
}
```

**Response `400`** — Missing `email` param.

**Response `404`** — No user with that email.

---

### Donations

#### `GET /api/v1/donations`

List donations. By default, held and completed donations are excluded. Pass `showAll=true` to include them with an `isHeld` flag.

**Query Parameters**

| Param   | Type  | Default | Description                                      |
|---------|-------|---------|--------------------------------------------------|
| lat     | float | 0       | Latitude of search center                        |
| lng     | float | 0       | Longitude of search center                       |
| radius  | float | 50      | Search radius in miles                           |
| showAll | string| false   | If `"true"`, include held donations with `isHeld` |

**Response `200` — Default (available only)**
```json
[
  {
    "id": "DON-001",
    "description": "Assorted fresh vegetables (carrots, broccoli, peppers)",
    "donationType": "Produce",
    "quantity": "~20 lbs",
    "donorName": "Pittsburgh Fresh Market",
    "donorContact": "412-555-0101",
    "lat": 40.4406,
    "lng": -79.9959,
    "address": "100 Market Square, Pittsburgh, PA 15222",
    "expiresAt": "2026-02-15T18:00:00Z",
    "isHeld": false
  }
]
```

**Response `200` — With `showAll=true`**

Same shape, but includes held donations with `"isHeld": true`.

> **Note:** Geo-filtering is not implemented in the mock. All donations are returned regardless of coordinates.

---

### Holds

#### `POST /api/v1/holds`

Reserve a donation for a user. Creates a 2-hour hold. Fails if the donation is already held or doesn't exist.

**Request Body**

| Field      | Type   | Required | Description               |
|------------|--------|----------|---------------------------|
| userId     | int    | yes      | ID of the reserving user  |
| donationId | string | yes      | ID of the donation        |

**Response `201`**
```json
{
  "success": true,
  "hold": {
    "id": 1,
    "userId": 1,
    "donationId": "DON-001",
    "status": "active",
    "createdAt": "2026-02-20T12:00:00",
    "expiresAt": "2026-02-20T14:00:00"
  },
  "donation": {
    "id": "DON-001",
    "description": "Assorted fresh vegetables (carrots, broccoli, peppers)",
    "donationType": "Produce",
    "quantity": "~20 lbs",
    "donorName": "Pittsburgh Fresh Market",
    "donorContact": "412-555-0101",
    "lat": 40.4406,
    "lng": -79.9959,
    "address": "100 Market Square, Pittsburgh, PA 15222",
    "expiresAt": "2026-02-15T18:00:00Z"
  }
}
```

**Response `400`** — Missing `userId` or `donationId`.

**Response `409`** — Donation already reserved, or donation ID not found.

---

#### `GET /api/v1/holds`

List holds for a user.

**Query Parameters**

| Param  | Type   | Default | Required | Description                           |
|--------|--------|---------|----------|---------------------------------------|
| userId | int    | —       | yes      | ID of the user                        |
| active | string | false   | no       | If `"true"`, return only active holds |

**Response `200`**
```json
[
  {
    "id": 1,
    "userId": 1,
    "donationId": "DON-001",
    "status": "active",
    "createdAt": "2026-02-20T12:00:00",
    "expiresAt": "2026-02-20T14:00:00"
  }
]
```

When `active=true`, expired holds (past `expiresAt`) are filtered out and lazily marked as `"expired"` in the database.

**Response `400`** — Missing `userId` param.

---

#### `DELETE /api/v1/holds/:holdId`

Cancel an active hold, returning the donation to the available pool.

**Path Parameters**

| Param  | Type | Description                    |
|--------|------|--------------------------------|
| holdId | int  | Primary key of the hold        |

**Response `200`**
```json
{
  "success": true,
  "hold": {
    "id": 1,
    "userId": 1,
    "donationId": "DON-001",
    "status": "cancelled",
    "createdAt": "2026-02-20T12:00:00",
    "expiresAt": "2026-02-20T14:00:00"
  }
}
```

**Response `404`** — Hold not found, already cancelled, completed, or expired.

---

#### `POST /api/v1/holds/:holdId/pickup`

Confirm a donation has been picked up. Completes the hold and creates a permanent `PickupHistory` record. The donation is permanently removed from the available pool.

**Path Parameters**

| Param  | Type | Description                    |
|--------|------|--------------------------------|
| holdId | int  | Primary key of the hold        |

**Response `200`**
```json
{
  "success": true,
  "record": {
    "id": 1,
    "userId": 1,
    "donationId": "DON-001",
    "donationDescription": "Assorted fresh vegetables (carrots, broccoli, peppers)",
    "donorContact": "412-555-0101",
    "pickupLocation": "100 Market Square, Pittsburgh, PA 15222",
    "completedAt": "2026-02-20T12:30:00"
  }
}
```

**Response `404`** — Hold not found, already cancelled, completed, or expired.

---

### History

#### `GET /api/v1/history`

Retrieve all completed pickups for a user, newest first.

**Query Parameters**

| Param  | Type | Required | Description   |
|--------|------|----------|---------------|
| userId | int  | yes      | ID of the user|

**Response `200`**
```json
[
  {
    "id": 1,
    "userId": 1,
    "donationId": "DON-001",
    "donationDescription": "Assorted fresh vegetables (carrots, broccoli, peppers)",
    "donorContact": "412-555-0101",
    "pickupLocation": "100 Market Square, Pittsburgh, PA 15222",
    "completedAt": "2026-02-20T12:30:00"
  }
]
```

Returns an empty array `[]` if the user has no pickups.

**Response `400`** — Missing `userId` param.

---

## Hold Lifecycle

```
active ──→ completed   (POST /api/v1/holds/:id/pickup)
  │    ──→ cancelled   (DELETE /api/v1/holds/:id)
  │    ──→ expired     (automatic after 2 hours)
```

| Status      | Donation available? | How it's set                                    |
|-------------|---------------------|-------------------------------------------------|
| `active`    | No                  | Created via `POST /api/v1/holds`                |
| `completed` | No (permanent)      | Confirmed via `POST /api/v1/holds/:id/pickup`   |
| `cancelled` | Yes                 | Cancelled via `DELETE /api/v1/holds/:id`         |
| `expired`   | Yes                 | Lazy expiration when queried after 2-hour window |

Status is an enum (`HoldStatus`) enforced at the database column level.