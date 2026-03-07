---
sidebar_position: 2
title: Environment Variables
description: How environment variables are layered and merged across defaults, overrides, and system values.
---

# Environment Variables

Playgrounds.dev uses a **three-layer merge system** for environment variables. Understanding this merge order is essential for configuring your services correctly.

## Merge Order

Environment variables are resolved in this order, with later layers overriding earlier ones:

```
Default → Global Override → Service Override → System
```

| Layer | Source | Can Override? |
|-------|--------|---------------|
| **Default** | Parsed from the `.env.example` file in the repository (specified by `env_file_path` on the Playspec) | ✅ Yes |
| **Global Override** | Set at Playground creation time — applies to **all** services | ✅ Yes |
| **Service Override** | Set at Playground creation time — applies to a **specific** service only | ✅ Yes |
| **System** | Injected by the platform automatically | ❌ No — always takes precedence |

### Example

Given this configuration:

```
# .env.example (Default)
DATABASE_URL=postgres://localhost/dev
RAILS_ENV=development
PORT=3000

# Global Override
DATABASE_URL=postgres://db/myapp
SECRET_KEY_BASE=abc123

# Service Override (web)
PORT=8080

# System
PLAYGROUND_ID=42
```

The final resolved variables for the `web` service would be:

| Variable | Value | Source |
|----------|-------|--------|
| `DATABASE_URL` | `postgres://db/myapp` | Global Override |
| `RAILS_ENV` | `development` | Default |
| `PORT` | `8080` | Service Override |
| `SECRET_KEY_BASE` | `abc123` | Global Override |
| `PLAYGROUND_ID` | `42` | System |

## Default Variables

Default variables are loaded from the `.env.example` file (or whatever path is configured in `env_file_path`) in the repository at the selected branch. The platform reads this file when the Playground is created and uses it as the base layer.

:::tip Viewing Defaults
You can preview the default variables for any branch via the API: [`GET /api/playzones/:id/env_defaults?branch=main`](/api/playzones#get-env-defaults)
:::

## Override Variables

Overrides are set when creating or updating a Playground:

### Global Overrides

Apply to **all services** in the Playground. Set via the `env_overrides` field when creating a Playground.

### Service Overrides

Apply to a **specific service** only. Set via the `services.{name}.env_vars` field when creating a Playground.

Service overrides take precedence over global overrides for the same variable key.

## System Variables

System variables are **injected automatically** by the platform and cannot be overridden by users. These are generated from the Playspec's service `environment` configuration (e.g., service discovery URLs, platform-internal values).

## Auto-Generated Secrets

The platform supports automatic secret generation using the `$$secret(N)` pattern in your `.env.example` file, where `N` is the number of hex characters to generate:

```env
SECRET_KEY_BASE=$$secret(64)
JWT_SECRET=$$secret(32)
```

When a Playground is created, each `$$secret(N)` placeholder is replaced with a cryptographically random hex string of the specified length. Generated secrets are:

- Stored per Playground
- Persistent across session (they don't change unless explicitly regenerated)
- Masked in the UI for sensitive keys

### Regenerating Secrets

You can regenerate any auto-generated secret from the Playground's environment variables panel or via the API. The new value takes effect on the next Playground recreation.

## Sensitive Key Detection

The platform automatically detects sensitive variables (passwords, secrets, tokens, API keys) based on common naming patterns and masks their values in the UI. Keys matching patterns like `*PASSWORD*`, `*SECRET*`, `*TOKEN*`, `*KEY*` are treated as sensitive.

## Viewing Environment Metadata

The [Environment Metadata API](/api/playgrounds#get-environment-metadata) returns the final merged variables along with metadata indicating the **source** of each value (default, override, or system). This is useful for debugging configuration issues.
