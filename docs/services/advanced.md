---
sidebar_position: 4
title: Advanced Configuration
description: Production mode, IDE, build overrides, Dockerfile paths, branch creation, and base images.
---

# Advanced Configuration

This page covers advanced service configuration options available when creating and managing [Playgrounds](/core-concepts/playground).

## Production Mode

Dynamic services can be toggled between **Dev mode** (default) and **Production mode** on a per-service, per-Playground basis.

| Aspect | Dev Mode | Production Mode |
|--------|----------|-----------------|
| **Source code** | Mounted from Git clone | Not mounted — runs from a built image |
| **IDE** | code-server sidecar attached | No IDE |
| **Auto-sync** | git pull on clean branches | No sync — rebuild on new commits |
| **Image** | Base image from Dockerfile | Fully built image from BuildRecord |
| **Live reload** | Supported (framework-dependent) | Not applicable |

### When to Use Production Mode

- Front-end services that require a build step (e.g., React, Next.js)
- Services with long startup compilation (e.g., compiled languages)
- Simulating a production-like deployment
- CI/CD validation — verifying that the built image works correctly

### Build Process

When a service is in Production mode, the platform:

1. Detects new commits on the configured branch
2. Builds the Docker image using the service's Dockerfile on the Playroom
3. Stores a `BuildRecord` with the image reference
4. Uses the latest successful build image when starting the container

## Browser IDE (code-server)

Every dynamic service in Dev mode gets a browser-based IDE powered by [code-server](https://github.com/coder/code-server) (VS Code in the browser).

### IDE Access

| Field | Value |
|-------|-------|
| **URL** | `https://ide-{service_subdomain}.{root_domain}` |
| **Password** | Unique per service, auto-generated (visible in the Playground detail view) |

### IDE Capabilities

From the browser IDE, you can:

- Edit source code with full VS Code features (syntax highlighting, IntelliSense, extensions)
- **Commit** changes to the Git repository
- **Push** to remote
- **Pull** from remote
- Use the integrated terminal
- Install VS Code extensions

### IDE Availability

The IDE is available only when:
- The service type is **dynamic**
- The service is running in **Dev mode** (not Production mode)
- IDE is explicitly enabled for the service

## Start Command

The start command for a dynamic service in Dev mode is determined by the `command` field in your Docker Compose YAML. The source code is mounted at the configured **working directory** (`/app` by default), so your command runs against the live source.

```yaml
services:
  web:
    build: .
    command: bundle exec rails server -b 0.0.0.0
    working_dir: /app
```

## Dockerfile Path

Each dynamic service specifies the path to its Dockerfile within the repository. This is used for:

- **Production mode builds** — The Dockerfile defines how the image is built
- **Dev mode base image** — The Dockerfile determines the base image used in development

| Field | Default |
|-------|---------|
| **Dockerfile Path** | `Dockerfile` |

If your Dockerfile is in a subdirectory (e.g., `docker/Dockerfile.dev`), update this path accordingly.

## Branch Configuration

### Selecting a Branch

When creating a Playground, each dynamic service can use a different branch from its [Playzone](/core-concepts/playzone):

- **Default** — Uses the Playzone's default branch (typically `main`)
- **Custom** — Select any existing branch from the repository

### Creating a New Branch

You can create a new branch directly from the Playground creation form:

1. Enable **Create Branch** for the service
2. Specify the **base branch** to branch from
3. Enter the **new branch name**

The platform creates the branch on the remote host during Playground provisioning. This is useful for feature branches or per-developer workspaces.

## Base Image (Dynamic Services)

In Dev mode, the platform uses the image defined by the service's Dockerfile as the base. The source code is then mounted on top of this base image at the working directory.

This means your Dockerfile should define the runtime environment (language, dependencies, system packages), and the `command` in your Compose file determines what runs.

```dockerfile
FROM ruby:3.3
WORKDIR /app
RUN gem install bundler
COPY Gemfile Gemfile.lock ./
RUN bundle install
```

In Dev mode, the built image is used as the base, and the live source code from the Git branch is mounted at `/app`, replacing the `COPY` step with a live mount.

## Build Overrides

For advanced build customization, Playgrounds support **build overrides** — a YAML block that is merged into the Docker Compose build configuration at runtime.

```yaml
web:
  context: ./backend
  args:
    NODE_ENV: production
    BUNDLE_WITHOUT: development:test
```

Build overrides allow you to customize build arguments, context paths, and other build-time settings without modifying the Playspec.

## Logs

Every service provides real-time log streaming:

### Container Logs

Access individual container logs via:
- **Web UI** — Click on a service in the Playground detail view
- **API** — [`GET /api/playgrounds/:id/logs/:service`](/api/playgrounds#get-service-logs)

Logs are fetched directly from Docker and support tail-based pagination (default: 100 lines, max: 1000 lines).

### Playground Logs

Creation and lifecycle logs are streamed in real-time via WebSocket during Playground provisioning. These show the progress of each creation step (Traefik start, clone, build, compose up).
