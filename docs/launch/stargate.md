---
sidebar_position: 2
title: Stargate
description: Stargate is the public gallery of instant-launch templates for common development stacks.
---

# Stargate

**Stargate** is the public collection of instant-launch application templates. It provides a curated gallery of development stacks that you can deploy with a single click.

## Overview

Stargate lists all publicly available [templates](/launch/templates) — pre-configured environment blueprints created by the Playgrounds.dev team and community. Each template includes everything needed to run a complete stack: Docker Compose configuration, service classification, and variable definitions.

## Browsing Templates

Templates are organized by **category** (e.g., Web Frameworks, Databases, Full-Stack Starters). You can:

- **Browse by category** — Filter the gallery by technology or use case
- **Search** — Full-text search across template names and descriptions
- **Preview** — View the template's Docker Compose definition and variables before launching

## Launching from Stargate

1. Browse or search for a template
2. Click on a template to view its details
3. Fill in any required variables (e.g., project name, database password)
4. Select a [Playroom](/core-concepts/playroom) for deployment
5. Click **Launch**

The platform creates a [Playspec](/core-concepts/playspec) from the template and (if you choose) immediately provisions a [Playground](/core-concepts/playground).

## Creating Templates for Stargate

To publish a template to Stargate:

1. Create a template in [My Fleet](/launch/my-fleet)
2. Create a version with the template body
3. Set the version's visibility to **Public**

Public versions are discoverable by all users through Stargate. See [Templates](/launch/templates) for the full template format and variable system.
