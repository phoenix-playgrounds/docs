---
sidebar_position: 1
slug: /launch
title: Launch
description: Launch is the fastest way to create a new environment from a template or Docker Compose file.
---

# Launch

**Launch** is the quickest path from zero to a running environment. It combines the creation of a [Playspec](/core-concepts/playspec) and (optionally) a [Playground](/core-concepts/playground) into a single step.

## How It Works

Launch supports two workflows:

### 1. Import from Template

Browse templates from [Stargate](/launch/stargate) or [My Fleet](/launch/my-fleet), fill in any required variables, and click **Launch**. The platform:

1. Substitutes your variable values into the template
2. Creates a new Playspec from the resolved Docker Compose YAML
3. Classifies services automatically
4. Optionally creates a Playground immediately

### 2. Import from Docker Compose

Paste or load a `docker-compose.yml` file directly. The platform parses it, presents the detected services for classification (static vs dynamic), and creates a Playspec. You can then launch a Playground from it.

## API Launch

You can also launch environments programmatically through the [Launch API endpoint](/api/launch):

```bash
curl -X POST https://my.playgrounds.dev/api/launch \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-environment",
    "compose_yaml": "services:\n  web:\n    image: nginx\n    ports:\n      - \"80:80\"",
    "playroom_id": 1,
    "create_playground": true
  }'
```

This is particularly useful for CI/CD pipelines, automated testing, or scripted environment provisioning.

## What Gets Created

| Create Playground | Result |
|-------------------|--------|
| **Yes** | A new Playspec **and** a running Playground |
| **No** | A new Playspec only — you can create Playgrounds from it later |

## Template Variables

When importing from a template, the launch form displays fields for each declared [template variable](/launch/templates#variables). Variables can have:

- **Display names** — Human-readable labels
- **Validation rules** — Regex patterns that enforce input format
- **Auto-generated values** — Random values for variables like `$$random__NAME`
