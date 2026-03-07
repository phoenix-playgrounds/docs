---
slug: /
sidebar_position: 1
title: Introduction
description: Welcome to Playgrounds.dev — instant cloud development environments powered by Docker Compose.
---

# Welcome to Playgrounds.dev

Playgrounds.dev gives your team **instant, isolated full-stack cloud environments** powered by Docker Compose. Connect your GitHub repository, define your stack, and launch a live environment — complete with browser-based IDE, unique subdomains, and automatic HTTPS — in seconds.

## How It Works

Every environment in Playgrounds.dev is built from four core concepts:

```
Playroom → Playzone → Playspec → Playground
  (host)     (repo)    (blueprint)  (running env)
```

| Concept | What It Is |
|---------|-----------|
| [**Playroom**](/core-concepts/playroom) | A remote Docker host where your environments run |
| [**Playzone**](/core-concepts/playzone) | A connected GitHub repository that provides source code |
| [**Playspec**](/core-concepts/playspec) | A blueprint that defines your environment's services and configuration |
| [**Playground**](/core-concepts/playground) | A live, running instance of a Playspec on a Playroom |

## What You Can Do

- **Launch environments instantly** — Spin up complete stacks from a Docker Compose file or a template
- **Edit code in the browser** — Every dynamic service gets a browser-based VS Code IDE
- **Share live previews** — Every service gets a unique HTTPS subdomain
- **Mix Dev and Production modes** — Mount source code for some services, use built images for others
- **Automate with the API** — Full REST API with scoped API keys for CI/CD integration
- **Publish reusable templates** — Share environment blueprints via Stargate or your own fleet

## Quick Links

| I want to... | Go to... |
|--------------|----------|
| Launch my first environment | [Launch](/launch) |
| Browse pre-built templates | [Stargate](/launch/stargate) |
| Understand core concepts | [Core Concepts](/core-concepts/playroom) |
| Configure services | [Services](/services/overview) |
| Use the REST API | [API Reference](/api/overview) |
| Create a reusable template | [Templates](/launch/templates) |
