---
sidebar_position: 3
title: Networking
description: How services are exposed via subdomains, visibility settings, and internal communication.
---

# Networking

Every service in a Playground can be configured for network access. The platform handles subdomain routing, TLS termination, and access control automatically through [Traefik](https://traefik.io/).

## Subdomain Routing

Each exposed service gets its own HTTPS subdomain under the Playroom's root domain:

```
https://{subdomain}.{root_domain}
```

For example, if your Playroom's root domain is `dev.example.com`:

| Service | Subdomain | URL |
|---------|-----------|-----|
| `web` | `web` | `https://web.dev.example.com` |
| `api` | `api` | `https://api.dev.example.com` |
| `admin` | `admin-panel` | `https://admin-panel.dev.example.com` |

### Apex Domain Routing

Use the special subdomain `@` to route the **root domain** itself to a service:

| Subdomain | URL |
|-----------|-----|
| `@` | `https://dev.example.com` |

### Subdomain Defaults and Overrides

- **Default subdomain** is defined on the [Playspec](/core-concepts/playspec) (typically the service name)
- **Subdomain overrides** can be set per [Playground](/core-concepts/playground), which is essential when multiple Playgrounds share the same Playroom

:::warning Subdomain Conflicts
Two Playgrounds on the same Playroom cannot use the same subdomain. Always override subdomains when running multiple Playgrounds from the same Playspec on a single Playroom.
:::

## Visibility: Internal vs External

Each exposed service has a visibility setting that controls access:

| Visibility | Access Control | Use For |
|------------|---------------|---------|
| **External** | Publicly accessible — no authentication required | User-facing apps, APIs, static sites |
| **Internal** | Protected by HTTP Basic Auth | IDEs, admin panels, databases, internal tools |

### HTTP Basic Auth (Internal Services)

Internal services are protected with HTTP Basic Auth:

| Credential | Value |
|------------|-------|
| **Username** | `playground` |
| **Password** | Auto-generated per Playground (visible in the Playground detail view) |

The authentication is enforced by Traefik's `playroom-auth` middleware. You only need the credentials when accessing an internal service URL in a browser — service-to-service communication within the Docker network is unaffected.

## Internal Communication (Docker Networking)

Services within the same Playground communicate using standard **Docker Compose networking**. Use the **service name** as the hostname:

```yaml
services:
  web:
    environment:
      DATABASE_URL: postgres://user:pass@db:5432/myapp
      REDIS_URL: redis://redis:6379

  db:
    image: postgres:16

  redis:
    image: redis:7
```

In this example, the `web` service connects to `db` and `redis` by their service names on Docker's internal network. No special configuration is needed — the platform creates an isolated network for each Playground.

### Network Isolation

Each Playground has its own internal Docker network. Services from different Playgrounds **cannot** communicate with each other, even if they run on the same Playroom. All Playgrounds share the Playroom's Traefik network for ingress routing only.

## Port Mapping

The port specified in a service's exposure configuration determines **which container port** Traefik routes to:

| Field | Description |
|-------|-------------|
| **Exposure Port** | The port inside the container that handles HTTP traffic (e.g., `3000`, `8080`) |

The platform configures Traefik to forward HTTPS (443) traffic to the specified container port. You do not need to handle TLS in your application — Traefik terminates TLS at the edge.

### Custom Port Mappings

For services that need to expose non-HTTP ports (e.g., WebSocket servers on a different port), you can define port mappings in the Docker Compose YAML. These ports are managed through standard Docker Compose port publishing.

## IDE Subdomains

Dynamic services in [Dev mode](/services/overview#dev-mode-default) automatically get a browser-based IDE (code-server) at:

```
https://ide-{service_subdomain}.{root_domain}
```

For example, if the `web` service has subdomain `web` on `dev.example.com`, the IDE is at `https://ide-web.dev.example.com`. IDE subdomains are always **internal** (protected by a per-service IDE password).
