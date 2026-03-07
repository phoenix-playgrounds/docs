---
sidebar_position: 2
title: Playzone
description: A Playzone is a connected GitHub repository that provides source code for your environments.
---

# Playzone

A **Playzone** is a connected GitHub repository. It provides source code that gets mounted into your dynamic services, enabling live editing through the browser-based IDE.

## Overview

When you create a Playzone, you link a GitHub repository to the platform. The system indexes branches, detects Docker Compose files, and makes the repository available for use in [Playspecs](/core-concepts/playspec).

:::info GitHub Only
Playgrounds.dev currently supports **GitHub** repositories only. Support for other Git providers is planned for the future.
:::

## Configuration

| Field | Description |
|-------|-------------|
| **Name** | A human-readable label for this Playzone |
| **GitHub URL** | The full URL of the repository (e.g., `https://github.com/org/repo`) |
| **Default Branch** | The branch used by default when creating Playgrounds (e.g., `main`) |
| **Private** | Whether the repository is private |
| **Credentials** | Personal Access Token for private repositories (if not using GitHub App) |

## GitHub App Integration

The recommended way to connect repositories is through the **Playgrounds.dev GitHub App**. Once installed on your GitHub organization or personal account, the app provides:

- **Automatic authentication** — No need to manage Personal Access Tokens
- **Repository discovery** — Browse and attach repositories directly from the UI
- **Webhook integration** — Receive push notifications for automatic sync
- **Fork detection** — The system tracks forked repositories and their parent

To connect a repository via the GitHub App, use the **Attach** action — the platform will discover the repository, determine its default branch, and set up the Playzone automatically.

### Personal Access Token (Alternative)

If you prefer not to install the GitHub App, you can provide a Personal Access Token (PAT) in the **Credentials** field. This is required for private repositories that are not accessible through the GitHub App.

## Branch Management

The platform automatically indexes all branches in your repository. Branches are:

- **Fetched on creation** — Initial branch list is populated when the Playzone is created
- **Periodically synced** — The platform refreshes the branch index on a regular schedule
- **Searchable** — Use the branch typeahead when creating Playgrounds to find branches quickly

### Per-Branch Isolation

Each [Playground](/core-concepts/playground) checks out a specific branch of the repository. This means:

- **Same repository, different branches** — Multiple Playgrounds can use the same Playzone but different branches
- **Same branch, different Playgrounds** — Each Playground gets its own independent clone of the branch
- **Different Playzones** — A single Playground can reference multiple Playzones if its Playspec defines services from different repositories

## Docker Compose Detection

When a Playzone is created or synced, the platform automatically looks for `docker-compose.yml` or `docker-compose.yaml` in the repository root on the default branch. If found, this Compose file is stored on the Playzone and can be used as a starting point when creating a [Playspec](/core-concepts/playspec).

## Periodic Sync

The platform periodically syncs Playzones to:

- Refresh the branch index
- Update the stored Docker Compose file
- Detect new commits for [Production mode](/services/advanced#production-mode) builds

## Deletion Rules

A Playzone cannot be deleted while it is referenced by any Playspec. You must first remove or update the referencing Playspecs before deleting the Playzone.

## Resource Limits

| Limit | Value |
|-------|-------|
| Maximum Playzones per account | **20** |
