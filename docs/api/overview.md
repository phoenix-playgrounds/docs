---
sidebar_position: 1
title: Overview
description: Getting started with the Playgrounds.dev REST API — authentication, scopes, and error handling.
---

# API Overview

The Playgrounds.dev API is a RESTful JSON API that provides programmatic access to all platform resources. Use it to automate environment provisioning, integrate with CI/CD pipelines, or build custom tooling.

**Base URL:**

```
https://my.playgrounds.dev/api
```

## Authentication

The API supports two authentication methods:

### Bearer Token (API Key)

The recommended method for programmatic access. Include your API key in the `Authorization` header:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://my.playgrounds.dev/api/playrooms
```

### Session-Based

If you are already logged in to the web UI, the API accepts your session cookie. This is mainly useful for browser-based API exploration.

## API Keys

### Generating Keys

You can generate API keys from:

- **Web UI** — Navigate to your profile → API Keys
- **API** — `POST /api/keys`

Each key includes:

| Field | Description |
|-------|-------------|
| **Label** | A human-readable name for the key |
| **Client ID** | Public identifier in the format `pk_live_*` |
| **Token** | Secret token (shown only once at creation time) |
| **Scopes** | Permissions granted to this key |
| **Expires At** | Optional expiration date |

:::warning Token Security
The API token is shown **only once** when the key is created. Store it securely. If lost, delete the key and create a new one.
:::

### Scopes

Each API key has one or more scopes that control which resources and actions it can access:

| Scope | Description |
|-------|-------------|
| `playrooms:read` | List and view Playrooms |
| `playrooms:write` | Create and update Playrooms |
| `playrooms:delete` | Delete Playrooms |
| `playrooms:manage` | Full Playroom management (includes read, write, delete + SSH key operations) |
| `playzones:read` | List and view Playzones |
| `playzones:write` | Create, update, attach, and sync Playzones |
| `playzones:delete` | Delete Playzones |
| `playspecs:read` | List and view Playspecs |
| `playspecs:write` | Create and update Playspecs (including mounted files and registry credentials) |
| `playspecs:delete` | Delete Playspecs |
| `playgrounds:read` | List and view Playgrounds (including logs, compose, env metadata) |
| `playgrounds:write` | Create, recreate, and extend Playgrounds |
| `playgrounds:delete` | Delete (destroy) Playgrounds |
| `import_templates:read` | List and view import templates |
| `import_templates:write` | Create and update import templates |
| `launch:write` | Use the Launch endpoint |
| `keys:manage` | Create and delete API keys |

### Key Expiration

Keys can optionally have an expiration date. Expired keys are automatically rejected. Keys without an expiration date remain valid until explicitly deleted.

## Error Handling

All error responses follow a consistent format:

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Validation failed",
    "details": {
      "name": ["can't be blank"]
    }
  }
}
```

### Error Codes

| HTTP Status | Error Code | Description |
|-------------|-----------|-------------|
| `400` | `BAD_REQUEST` | Missing or invalid parameters |
| `401` | `UNAUTHORIZED` | Authentication required or failed |
| `403` | `FORBIDDEN` | Insufficient permissions or scope violation |
| `404` | `RESOURCE_NOT_FOUND` | The requested resource does not exist |
| `409` | `CONFLICT` | Resource state conflict (e.g., deleting a Playroom with active Playgrounds) |
| `422` | `VALIDATION_FAILED` | Request body failed validation |
| `422` | `LOCKED` | Resource is locked and cannot be modified |
| `422` | `INVALID_STATE` | The operation is not valid for the resource's current state |
| `422` | `QUOTA_EXCEEDED` | Account resource limit reached |

## Testing in the Browser

Since the API supports session-based authentication, you can test endpoints directly in your browser while logged in. Simply navigate to an API URL like:

```
https://my.playgrounds.dev/api/playrooms
```

The response will be JSON. Use the browser's developer tools or a tool like [jq](https://jqlang.github.io/jq/) for formatting.

## Pagination

The current API returns full result sets without pagination. For large collections, filter results using endpoint-specific query parameters.
