---
sidebar_position: 2
title: Playrooms
description: API reference for managing Playrooms — remote Docker hosts.
---

# Playrooms API

Manage [Playrooms](/core-concepts/playroom) — the remote Docker hosts where your Playgrounds run.

## Endpoints

| Method | Path | Scope | Description |
|--------|------|-------|-------------|
| `GET` | `/api/playrooms` | `playrooms:read` | List all Playrooms |
| `GET` | `/api/playrooms/:id` | `playrooms:read` | Get a single Playroom |
| `POST` | `/api/playrooms` | `playrooms:write` | Create a new Playroom |
| `PATCH` | `/api/playrooms/:id` | `playrooms:write` | Update a Playroom |
| `DELETE` | `/api/playrooms/:id` | `playrooms:delete` | Delete a Playroom |
| `POST` | `/api/playrooms/:id/generate_ssh_key` | `playrooms:manage` | Generate an SSH key pair |
| `POST` | `/api/playrooms/:id/test_connection` | `playrooms:read` | Test SSH and Docker connectivity |

---

### List Playrooms

```bash
GET /api/playrooms
```

**Response:**

```json
[
  {
    "id": 1,
    "name": "Production Host",
    "status": "active",
    "host": "192.168.1.100",
    "port": 22,
    "user": "deploy",
    "tutorial": false,
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  }
]
```

---

### Get Playroom

```bash
GET /api/playrooms/:id
```

Returns a detailed view including SSH public key, domains, and ACME email.

**Response:**

```json
{
  "id": 1,
  "name": "Production Host",
  "status": "active",
  "host": "192.168.1.100",
  "port": 22,
  "user": "deploy",
  "tutorial": false,
  "ssh_public_key": "ssh-ed25519 AAAA...",
  "domains": ["dev.example.com", "staging.example.com"],
  "acme_email": "admin@example.com",
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-15T10:30:00Z"
}
```

---

### Create Playroom

```bash
POST /api/playrooms
```

**Request body:**

```json
{
  "playroom": {
    "name": "My Server",
    "host": "192.168.1.100",
    "port": 22,
    "user": "deploy",
    "ssh_private_key": "-----BEGIN OPENSSH PRIVATE KEY-----\n...",
    "domains_input": "dev.example.com, staging.example.com",
    "acme_email": "admin@example.com",
    "status": "active"
  }
}
```

---

### Update Playroom

```bash
PATCH /api/playrooms/:id
```

Same body as Create. Tutorial Playrooms have restricted fields (only `name`, `domains_input`, and `status`).

---

### Delete Playroom

```bash
DELETE /api/playrooms/:id
```

Returns `204 No Content` on success. Fails with `409 Conflict` if the Playroom has active Playgrounds or is a tutorial Playroom.

---

### Generate SSH Key

```bash
POST /api/playrooms/:id/generate_ssh_key
```

Generates a new ed25519 key pair. Returns the public key:

```json
{
  "public_key": "ssh-ed25519 AAAA... playroom-1@playgrounds.dev"
}
```

---

### Test Connection

```bash
POST /api/playrooms/:id/test_connection
```

Tests SSH connectivity, Docker availability, and directory access:

```json
{
  "success": true,
  "checks": {
    "ssh": { "success": true, "message": "SSH connection successful" },
    "docker": { "success": true, "message": "Docker available", "details": { "version": "24.0.7" } },
    "directories": { "success": true, "message": "Directory access verified" }
  }
}
```
