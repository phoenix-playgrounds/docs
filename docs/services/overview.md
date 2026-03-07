---
sidebar_position: 1
title: Overview
description: Understanding the two types of services in a Playspec — static and dynamic.
---

# Services Overview

Every [Playspec](/core-concepts/playspec) defines one or more **services** — the individual containers that make up your development environment. Services are classified into two types that determine how they are built, run, and managed.

## Service Types

### Static Services

A **static service** runs a pre-built Docker image without any source code mounting or IDE integration.

| Feature | Static Service |
|---------|---------------|
| Source code mounting | ❌ No |
| Browser IDE | ❌ No |
| Auto-sync (git pull) | ❌ No |
| Production mode toggle | ❌ No |
| Requires a Playzone | ❌ No |

**Use for:** Databases, caches, message brokers, and other infrastructure components that run unchanged Docker images.

**Examples:** `postgres:16`, `redis:7`, `rabbitmq:3-management`, `elasticsearch:8`

### Dynamic Services

A **dynamic service** is backed by source code from a [Playzone](/core-concepts/playzone). It supports two runtime modes:

#### Dev Mode (Default)

| Feature | Dev Mode |
|---------|----------|
| Source code mounting | ✅ Yes — code is mounted into the container at the configured working directory |
| Browser IDE | ✅ Yes — a [code-server](https://github.com/coder/code-server) sidecar is attached |
| Auto-sync (git pull) | ✅ Yes — Playguard pulls new commits when the working tree is clean |
| Git operations | ✅ Yes — commit, push, pull directly from the browser IDE |

#### Production Mode

| Feature | Production Mode |
|---------|----------------|
| Source code mounting | ❌ No — the service runs from a built Docker image |
| Browser IDE | ❌ No |
| Auto-sync (git pull) | ❌ No |
| Automatic rebuild | ✅ Yes — Playguard triggers a rebuild when new commits are detected |

See [Advanced Configuration](/services/advanced#production-mode) for details on toggling production mode.

## Service Classification Flow

When you provide a Docker Compose YAML to create a Playspec, the platform:

1. **Parses** the YAML and extracts all service definitions
2. **Presents** each service for classification
3. **Requires** you to mark each service as either `static` or `dynamic`
4. **Validates** dynamic services have a linked Playzone, Dockerfile path, and working directory
5. **Validates** static services have an image specified

## Container Mapping

The platform maps each service name in your Compose YAML to a Docker container. The resulting containers follow Docker Compose naming conventions under the [Playground's compose project name](/core-concepts/playground#compose-project-name):

```
{compose_project}_{service_name}_1
```

For example, a service named `web` in a Playground with project `pg-42-my-app` would run as `pg-42-my-app_web_1`.

Services communicate with each other using standard Docker Compose networking — use the **service name** as the hostname for internal communication (e.g., `db`, `redis`, `web`).
