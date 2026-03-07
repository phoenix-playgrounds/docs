---
sidebar_position: 3
title: My Fleet
description: My Fleet is where you create, manage, and publish your own reusable environment templates.
---

# My Fleet

**My Fleet** is your personal template management dashboard. It lets you create, version, and publish reusable environment templates that can be shared with your team or the entire Playgrounds.dev community via [Stargate](/launch/stargate).

## Overview

My Fleet is accessible at `/my_fleet` in the application. From here you can:

- **Create** new templates with a name, description, category, and cover image
- **Edit** template metadata (name, description, category, image)
- **Manage versions** — Create new versions, toggle visibility, delete versions
- **Delete** templates you own (as long as they have no public versions in use)

## Template Management

### Creating a Template

1. Navigate to **My Fleet**
2. Click **New Template**
3. Provide a name, optional description, and category
4. Optionally upload a cover image (JPEG, PNG, SVG, or WebP — max 500 KB by default)

### Template Images

Cover images are displayed in the template gallery (Stargate and My Fleet). Supported formats:

| Format | Max Size |
|--------|----------|
| JPEG, PNG, WebP, SVG | Configurable (default **500 KB**) |

### Categories

Templates can be organized into categories (e.g., Web Frameworks, Databases, Full-Stack Starters). Categories are managed by platform administrators — to request a new category, contact **support@playgrounds.dev**.

Categories help users discover relevant templates in [Stargate](/launch/stargate).

## Version Management

Each template can have multiple **immutable versions**. Once a version is created, its template body cannot be modified — this guarantees that environments launched from a specific version always produce the same result.

### Creating a Version

1. Open a template from My Fleet
2. Click **New Version**
3. Provide the template body (YAML format — see [Templates](/launch/templates))
4. Submit — the version is automatically assigned the next sequential version number

### Visibility

Each version has its own visibility setting:

| Visibility | Description |
|------------|-------------|
| **Public** | Visible to all users in [Stargate](/launch/stargate) |
| **Private** | Visible only to the template owner |

You can toggle a version's visibility at any time using the **Toggle Public** action.

### Deleting Versions

Versions can be deleted individually. Deleting a version does not affect Playspecs or Playgrounds that were already created from it.
