---
sidebar_position: 5
title: Playgrounds
description: API reference for managing Playgrounds — live running environments.
---

# Playgrounds API

Manage [Playgrounds](/core-concepts/playground) — live, running instances of your environment blueprints.

## Endpoints

| Method | Path | Scope | Description |
|--------|------|-------|-------------|
| `GET` | `/api/playgrounds` | `playgrounds:read` | List all Playgrounds |
| `GET` | `/api/playgrounds/:id` | `playgrounds:read` | Get a single Playground (detailed) |
| `GET` | `/api/playgrounds/:id/status` | `playgrounds:read` | Get real-time status and service health |
| `POST` | `/api/playgrounds` | `playgrounds:write` | Create a new Playground |
| `DELETE` | `/api/playgrounds/:id` | `playgrounds:delete` | Destroy a Playground |
| `POST` | `/api/playgrounds/:id/recreate` | `playgrounds:write` | Recreate a Playground |
| `POST` | `/api/playgrounds/:id/extend_expiration` | `playgrounds:write` | Extend the TTL |
| `GET` | `/api/playgrounds/:id/compose` | `playgrounds:read` | Get the generated Compose YAML |
| `GET` | `/api/playgrounds/:id/logs/:service` | `playgrounds:read` | Get service logs |
| `GET` | `/api/playgrounds/:id/env_metadata` | `playgrounds:read` | Get merged environment variables with source metadata |

---

### List Playgrounds

```bash
GET /api/playgrounds
```

**Response:**

```json
[
  {
    "id": 1,
    "name": "feature-auth",
    "status": "running",
    "job_mode": false,
    "playspec_id": 1,
    "playspec_name": "My Web Stack",
    "service_branches": {
      "web": { "branch_name": "feature/auth" }
    },
    "expires_at": "2025-01-15T18:30:00Z",
    "created_at": "2025-01-15T10:30:00Z"
  }
]
```

---

### Get Playground (Detailed)

```bash
GET /api/playgrounds/:id
```

**Response:**

```json
{
  "id": 1,
  "name": "feature-auth",
  "status": "running",
  "job_mode": false,
  "playspec_id": 1,
  "playspec_name": "My Web Stack",
  "compose_project": "pg-1-feature-auth",
  "service_branches": {
    "web": { "branch_name": "feature/auth" }
  },
  "env_overrides": {
    "DATABASE_URL": "postgres://db/myapp"
  },
  "expires_at": "2025-01-15T18:30:00Z",
  "time_remaining": 28800.0,
  "expiration_percentage": 0,
  "last_applied_at": "2025-01-15T10:31:00Z",
  "needs_recreation": false,
  "services": [
    { "name": "web", "status": "running", "health": "healthy", "running": true },
    { "name": "db", "status": "running", "health": null, "running": true }
  ],
  "created_at": "2025-01-15T10:30:00Z"
}
```

---

### Get Status

```bash
GET /api/playgrounds/:id/status
```

Lightweight status endpoint — useful for polling during creation:

```json
{
  "id": 1,
  "status": "in_progress",
  "job_mode": false,
  "creation_step": "image_build",
  "creation_step_label": "Building Images",
  "error_message": null,
  "error_step": null,
  "error_step_label": null,
  "needs_recreation": false,
  "services": [
    { "name": "web", "status": "stopped", "health": null, "running": false },
    { "name": "db", "status": "running", "health": null, "running": true }
  ]
}
```

---

### Create Playground

```bash
POST /api/playgrounds
```

**Request body:**

```json
{
  "playground": {
    "name": "feature-auth",
    "playspec_id": 1,
    "playroom_id": 1,
    "job_mode": false,
    "env_overrides": {
      "DATABASE_URL": "postgres://db/myapp"
    },
    "service_subdomains": {
      "web": "feature-auth-web"
    },
    "services": {
      "web": {
        "git_config": {
          "branch_name": "feature/auth",
          "create_branch": false
        },
        "production": false
      }
    }
  }
}
```

**Key fields:**

| Field | Description |
|-------|-------------|
| `env_overrides` | Global environment variable overrides (applied to all services) |
| `service_subdomains` | Per-service subdomain overrides |
| `services.{name}.git_config.branch_name` | Branch to use for a dynamic service |
| `services.{name}.git_config.create_branch` | Create a new branch from `base_branch_name` |
| `services.{name}.git_config.base_branch_name` | Base branch when creating a new branch |
| `services.{name}.production` | Run this service in production mode |
| `services.{name}.env_vars` | Per-service environment variable overrides |

---

### Destroy Playground

```bash
DELETE /api/playgrounds/:id
```

Destroys all containers and resources. Returns `204 No Content`.

---

### Recreate Playground

```bash
POST /api/playgrounds/:id/recreate
```

Destroys containers and re-runs the full provisioning pipeline. Preserves volumes if the Playspec has `persist_volumes` enabled.

---

### Extend Expiration

```bash
POST /api/playgrounds/:id/extend_expiration
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `duration_hours` | integer | Hours to extend by (default: 8) |

**Response:**

```json
{
  "id": 1,
  "expires_at": "2025-01-16T02:30:00Z",
  "time_remaining": 57600.0
}
```

---

### Get Generated Compose

```bash
GET /api/playgrounds/:id/compose
```

Returns the final Docker Compose YAML generated by the platform:

```json
{
  "compose_yaml": "services:\n  web:\n    ...",
  "compose_project": "pg-1-feature-auth"
}
```

---

### Get Service Logs

```bash
GET /api/playgrounds/:id/logs/:service?tail=100
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `tail` | integer | `100` | Number of lines to return (max: 1000) |

**Response:**

```json
{
  "service": "web",
  "lines": [
    "=> Booting Puma",
    "=> Rails 8.0.0 application starting in development",
    "* Listening on http://0.0.0.0:3000"
  ],
  "source": "live"
}
```

For completed job-mode Playgrounds, logs are returned from cache (`"source": "cached"`).

---

### Get Environment Metadata

```bash
GET /api/playgrounds/:id/env_metadata
```

Returns the fully merged environment variables with source tracking:

```json
{
  "merged": {
    "DATABASE_URL": "postgres://db/myapp",
    "RAILS_ENV": "development",
    "PLAYGROUND_ID": "1"
  },
  "metadata": {
    "DATABASE_URL": { "value": "postgres://db/myapp", "source": "override" },
    "RAILS_ENV": { "value": "development", "source": "default" },
    "PLAYGROUND_ID": { "value": "1", "source": "system" }
  },
  "system_keys": ["PLAYGROUND_ID"],
  "generated_keys": ["SECRET_KEY_BASE"]
}
```
