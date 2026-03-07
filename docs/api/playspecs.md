---
sidebar_position: 4
title: Playspecs
description: API reference for managing Playspecs — environment blueprints.
---

# Playspecs API

Manage [Playspecs](/core-concepts/playspec) — blueprints that define your environment's services, configuration, and infrastructure.

## Endpoints

| Method | Path | Scope | Description |
|--------|------|-------|-------------|
| `GET` | `/api/playspecs` | `playspecs:read` | List all Playspecs |
| `GET` | `/api/playspecs/:id` | `playspecs:read` | Get a single Playspec |
| `POST` | `/api/playspecs` | `playspecs:write` | Create a new Playspec |
| `PATCH` | `/api/playspecs/:id` | `playspecs:write` | Update a Playspec (must be unlocked) |
| `DELETE` | `/api/playspecs/:id` | `playspecs:delete` | Delete a Playspec (must be unlocked) |
| `GET` | `/api/playspecs/:id/services` | `playspecs:read` | Get service definitions |
| `POST` | `/api/playspecs/validate_compose` | `playspecs:read` | Validate a Docker Compose YAML |
| `POST` | `/api/playspecs/:id/add_mounted_file` | `playspecs:write` | Add a mounted file |
| `PATCH` | `/api/playspecs/:id/update_mounted_file` | `playspecs:write` | Update a mounted file's configuration |
| `DELETE` | `/api/playspecs/:id/remove_mounted_file` | `playspecs:write` | Remove a mounted file |
| `POST` | `/api/playspecs/:id/add_registry_credential` | `playspecs:write` | Add a private registry credential |
| `DELETE` | `/api/playspecs/:id/remove_registry_credential` | `playspecs:write` | Remove a registry credential |

---

### List Playspecs

```bash
GET /api/playspecs
```

**Response:**

```json
[
  {
    "id": 1,
    "name": "My Web Stack",
    "description": "Rails + PostgreSQL + Redis",
    "locked": true,
    "persist_volumes": false,
    "playground_count": 2,
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  }
]
```

---

### Get Playspec (Detailed)

```bash
GET /api/playspecs/:id
```

Returns the full Playspec including services, mounted files, and registry credentials:

```json
{
  "id": 1,
  "name": "My Web Stack",
  "description": "Rails + PostgreSQL + Redis",
  "locked": false,
  "persist_volumes": false,
  "playground_count": 0,
  "services": [
    {
      "name": "web",
      "type": "dynamic",
      "playzone_id": 1,
      "dockerfile_path": "Dockerfile",
      "env_file_path": ".env.example",
      "workdir": "/app",
      "exposure": {
        "enabled": true,
        "port": 3000,
        "subdomain": "web",
        "visibility": "external"
      }
    },
    {
      "name": "db",
      "type": "static",
      "image": "postgres:16",
      "exposure": {
        "enabled": false
      }
    }
  ],
  "mounted_files": [],
  "credentials": [],
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-15T10:30:00Z"
}
```

---

### Create Playspec

```bash
POST /api/playspecs
```

**Request body:**

```json
{
  "playspec": {
    "name": "My Web Stack",
    "description": "Rails + PostgreSQL + Redis",
    "base_compose_yaml": "services:\n  web:\n    build: .\n    ports:\n      - \"3000:3000\"\n  db:\n    image: postgres:16",
    "persist_volumes": false,
    "services": [
      {
        "name": "web",
        "type": "dynamic",
        "playzone_id": 1,
        "dockerfile_path": "Dockerfile",
        "env_file_path": ".env.example",
        "workdir": "/app",
        "exposure": { "enabled": true, "port": 3000, "subdomain": "web", "visibility": "external" }
      },
      {
        "name": "db",
        "type": "static",
        "image": "postgres:16",
        "exposure": { "enabled": false }
      }
    ]
  }
}
```

:::warning Locked Playspecs
A Playspec becomes locked when any Playground references it. Locked Playspecs cannot be updated or deleted. See [Locked Status](/core-concepts/playspec#locked-status).
:::

---

### Validate Compose

```bash
POST /api/playspecs/validate_compose
```

Validates a Docker Compose YAML without creating a Playspec.

**Request body:**

```json
{
  "compose_yaml": "services:\n  web:\n    build: .\n    ports:\n      - \"3000:3000\""
}
```

**Response:**

```json
{
  "valid": true,
  "services": [
    { "name": "web", "ports": ["3000:3000"] }
  ],
  "errors": [],
  "warnings": []
}
```

---

### Add Mounted File

```bash
POST /api/playspecs/:id/add_mounted_file
# Content-Type: multipart/form-data
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file` | file | Yes | File to upload |
| `mount_path` | string | Yes | Absolute path inside the container |
| `target_services[]` | array | No | Services that receive the mount (all if empty) |
| `readonly` | boolean | No | Whether the mount is read-only (default: `true`) |

---

### Add Registry Credential

```bash
POST /api/playspecs/:id/add_registry_credential
```

**Request body:**

```json
{
  "registry_type": "docker_hub",
  "registry_url": "https://index.docker.io/v1/",
  "username": "myuser",
  "secret": "mypassword"
}
```
