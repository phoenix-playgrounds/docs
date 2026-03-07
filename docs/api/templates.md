---
sidebar_position: 7
title: Templates
description: API reference for managing Import Templates — reusable environment blueprints.
---

# Templates API

Manage [Import Templates](/launch/templates) — reusable, versioned environment blueprints that can be shared via [Stargate](/launch/stargate) or [My Fleet](/launch/my-fleet).

## Endpoints

| Method | Path | Scope | Description |
|--------|------|-------|-------------|
| `GET` | `/api/import_templates` | `import_templates:read` | List all templates |
| `GET` | `/api/import_templates/search?query=rails` | `import_templates:read` | Search templates |
| `GET` | `/api/import_templates/:id` | `import_templates:read` | Get a single template |
| `POST` | `/api/import_templates` | `import_templates:write` | Create a new template |
| `PATCH` | `/api/import_templates/:id` | `import_templates:write` | Update template metadata |
| `DELETE` | `/api/import_templates/:id` | `import_templates:write` | Delete a template |
| `GET` | `/api/import_templates/:id/versions` | `import_templates:read` | List template versions |
| `POST` | `/api/import_templates/:id/create_version` | `import_templates:write` | Create a new version |
| `DELETE` | `/api/import_templates/:id/destroy_version` | `import_templates:write` | Delete a version |
| `PATCH` | `/api/import_templates/:id/toggle_public` | `import_templates:write` | Toggle a version's public visibility |

---

### List Templates

```bash
GET /api/import_templates
```

---

### Search Templates

```bash
GET /api/import_templates/search?query=rails
```

Full-text search across template names and descriptions. Returns up to 10 results with fuzzy matching.

---

### Categories

Template categories are managed by platform administrators. You can **list** all available categories to use during template creation or search, but you cannot create, update, or delete categories through the API.

To request a new category, contact **support@playgrounds.dev**.

```bash
GET /api/template_categories
```

**Required scope:** `import_templates:read`

**Response:**

```json
[
  { "id": 1, "name": "Web Frameworks", "slug": "web-frameworks" },
  { "id": 2, "name": "Databases", "slug": "databases" },
  { "id": 3, "name": "Full-Stack Starters", "slug": "full-stack-starters" }
]
```

Use the returned `id` as `category_id` when creating or updating templates.

---

### Create Template

```bash
POST /api/import_templates
```

**Request body:**

```json
{
  "import_template": {
    "name": "Rails + PostgreSQL",
    "description": "Full-stack Rails application with PostgreSQL database",
    "category_id": 1
  }
}
```

---

### Create Version

```bash
POST /api/import_templates/:id/create_version
```

**Request body:**

```json
{
  "template_body": "playground-variables:\n  app_name:\n    name: \"Application Name\"\n    validation: \"/^[a-z][a-z0-9-]{2,30}$/\"\n\nservices:\n  web:\n    build: .\n    ports:\n      - \"3000:3000\"\n    environment:\n      APP_NAME: $$var__app_name\n  db:\n    image: postgres:16",
  "public": true
}
```

Versions are **immutable** — once created, the `template_body` cannot be changed. The version number is auto-assigned sequentially.

:::note Variable Validation
The platform validates that all `$$var__NAME` and `$$random__NAME` references in the template body are declared in the `playground-variables` section, and vice versa. Undeclared or unused variables will cause a validation error.
:::

---

### Toggle Public

```bash
PATCH /api/import_templates/:id/toggle_public
```

Toggles a version's `public` flag. Public versions are visible in [Stargate](/launch/stargate) for all users.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `version_id` | integer | The version to toggle |

---

### Delete Version

```bash
DELETE /api/import_templates/:id/destroy_version
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `version_id` | integer | The version to delete |

Deleting a version does not affect Playspecs or Playgrounds that were already created from it.
