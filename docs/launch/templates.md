---
sidebar_position: 4
title: Templates
description: Template format, variables, versions, and the template body YAML specification.
---

# Templates

Templates are reusable, versioned environment blueprints written in YAML. They define a Docker Compose configuration enriched with **template variables** — user-fillable placeholders that are substituted at launch time.

## Template Body Format

A template body is a standard YAML document with two parts:

1. **Docker Compose definition** — The `services`, `volumes`, `networks`, etc.
2. **Variable declarations** — A `playgrounds.dev` section with a nested `variables` block that declares all variables used in the template

### Example

```yaml
playgrounds.dev:
  variables:
    project_name:
      name: "Project Name"
      validation: "/^[a-z][a-z0-9-]{2,30}$/"
    db_password:
      name: "Database Password"
      validation: "/^.{8,}$/"

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: "postgres://app:$$var__db_password@db/$$var__project_name"

  db:
    image: postgres:16
    environment:
      POSTGRES_DB: $$var__project_name
      POSTGRES_PASSWORD: $$var__db_password
```

## Variables

Template variables are placeholders in the format `$$var__NAME` or `$$random__NAME` that are replaced with actual values when a user launches from the template.

### Variable Types

| Pattern | Description |
|---------|-------------|
| `$$var__NAME` | A user-supplied value — the launch form presents an input field |
| `$$random__NAME` | An auto-generated random value — no user input required |

### Variable Declarations

Every variable referenced in the template body **must** be declared in the `playgrounds.dev > variables` section, and every declared variable **must** be referenced at least once. The platform validates this consistency when creating a version.

Each variable declaration supports:

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Human-readable display name shown in the launch form |
| `validation` | No | A regex pattern (wrapped in `/` delimiters) for input validation |

### Validation

When a `validation` regex is specified, the launch form enforces it client-side. For example:

```yaml
playgrounds.dev:
  variables:
    app_name:
      name: "Application Name"
      validation: "/^[a-z][a-z0-9-]{2,30}$/"
```

This ensures the user enters a lowercase, hyphen-separated name between 3 and 31 characters.

## Immutable Versions

Template versions are **immutable by design**:

- Once created, a version's `template_body` cannot be changed
- This guarantees reproducibility — environments launched from version N always produce the same configuration
- To make changes, create a new version (N+1)

### Version Numbers

Version numbers are assigned automatically and sequentially (1, 2, 3, ...). You cannot control the version number — it is always the next integer after the highest existing version.

## Visibility

Each version has its own visibility setting:

| Visibility | Where it appears |
|------------|------------------|
| **Public** | [Stargate](/launch/stargate) — visible to all users |
| **Private** | [My Fleet](/launch/my-fleet) only — visible to the owner |

The latest public version is the one displayed in Stargate. Users can also browse all public versions of a template.

## Template Search

Templates are searchable via **full-text search** powered by PostgreSQL's `tsvector` and trigram similarity. Search matches against:

- Template name
- Template description
- Category name

Results combine exact matches with fuzzy matching for typo tolerance.
