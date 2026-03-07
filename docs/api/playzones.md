---
sidebar_position: 3
title: Playzones
description: API reference for managing Playzones — connected GitHub repositories.
---

# Playzones API

Manage [Playzones](/core-concepts/playzone) — connected GitHub repositories that provide source code for your environments.

## Endpoints

| Method | Path | Scope | Description |
|--------|------|-------|-------------|
| `GET` | `/api/playzones` | `playzones:read` | List all Playzones |
| `GET` | `/api/playzones/with_docker_compose` | `playzones:read` | List Playzones that have a detected Compose file |
| `GET` | `/api/playzones/:id` | `playzones:read` | Get a single Playzone |
| `POST` | `/api/playzones` | `playzones:write` | Create a new Playzone |
| `POST` | `/api/playzones/attach` | `playzones:write` | Attach a repository via GitHub App |
| `PATCH` | `/api/playzones/:id` | `playzones:write` | Update a Playzone |
| `DELETE` | `/api/playzones/:id` | `playzones:delete` | Delete a Playzone |
| `POST` | `/api/playzones/:id/sync` | `playzones:write` | Trigger a sync (refresh branches and Compose file) |
| `GET` | `/api/playzones/:id/branches` | `playzones:read` | List branches |
| `GET` | `/api/playzones/:id/env_defaults` | `playzones:read` | Get default env variables from `.env.example` |

---

### List Playzones

```bash
GET /api/playzones
```

**Response:**

```json
[
  {
    "id": 1,
    "name": "my-app",
    "github_url": "https://github.com/org/my-app",
    "private": false,
    "default_branch": "main",
    "status": "active",
    "last_synced_at": "2025-01-20T14:00:00Z",
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-20T14:00:00Z"
  }
]
```

---

### Attach via GitHub App

```bash
POST /api/playzones/attach
```

Attach a repository discovered through the GitHub App integration. If the Playzone already exists, it is shared with the requesting player.

**Request body:**

```json
{
  "repo_full_name": "org/my-app"
}
```

---

### Create Playzone

```bash
POST /api/playzones
```

**Request body:**

```json
{
  "playzone": {
    "name": "my-app",
    "github_url": "https://github.com/org/my-app",
    "default_branch": "main",
    "private": true,
    "credentials": "ghp_your_personal_access_token"
  }
}
```

:::note Private Repositories
Private repositories require either a Personal Access Token in the `credentials` field or an active GitHub App installation.
:::

---

### List Branches

```bash
GET /api/playzones/:id/branches?query=feat&limit=20
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | string | — | Filter branches by name (case-insensitive substring match) |
| `limit` | integer | `20` | Maximum number of branches to return (max: 50) |

**Response:**

```json
{
  "branches": [
    { "name": "main", "default": true },
    { "name": "feature/auth", "default": false },
    { "name": "feature/api", "default": false }
  ]
}
```

---

### Get Env Defaults

```bash
GET /api/playzones/:id/env_defaults?branch=main&env_file_path=.env.example
```

Returns the parsed key-value pairs from the `.env.example` file on the specified branch.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `branch` | string | Yes | The branch to read the env file from |
| `env_file_path` | string | No | Custom path to the env file (default: `.env.example`) |

**Response:**

```json
{
  "defaults": {
    "DATABASE_URL": "postgres://localhost/dev",
    "RAILS_ENV": "development",
    "SECRET_KEY_BASE": "$$secret(64)"
  },
  "sensitive_keys": ["SECRET_KEY_BASE", "DATABASE_URL"]
}
```

---

### Sync Playzone

```bash
POST /api/playzones/:id/sync
```

Triggers an asynchronous sync — refreshes the branch index and Docker Compose file from GitHub.

```json
{
  "message": "Sync scheduled"
}
```
