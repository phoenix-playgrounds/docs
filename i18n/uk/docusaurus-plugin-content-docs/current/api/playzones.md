---
sidebar_position: 3
title: Playzones
description: API-довідник для керування Playzone — підключеними GitHub-репозиторіями.
---

# Playzones API

Керування [Playzone](/core-concepts/playzone) — підключеними GitHub-репозиторіями, що надають вихідний код для ваших середовищ.

## Ендпоінти

| Метод | Шлях | Скоуп | Опис |
|-------|------|-------|------|
| `GET` | `/api/playzones` | `playzones:read` | Список всіх Playzone |
| `GET` | `/api/playzones/with_docker_compose` | `playzones:read` | Playzone з виявленим Compose-файлом |
| `GET` | `/api/playzones/:id` | `playzones:read` | Отримати один Playzone |
| `POST` | `/api/playzones` | `playzones:write` | Створити новий Playzone |
| `POST` | `/api/playzones/attach` | `playzones:write` | Підключити репозиторій через GitHub App |
| `PATCH` | `/api/playzones/:id` | `playzones:write` | Оновити Playzone |
| `DELETE` | `/api/playzones/:id` | `playzones:delete` | Видалити Playzone |
| `POST` | `/api/playzones/:id/sync` | `playzones:write` | Запустити синхронізацію (оновити гілки та Compose-файл) |
| `GET` | `/api/playzones/:id/branches` | `playzones:read` | Список гілок |
| `GET` | `/api/playzones/:id/env_defaults` | `playzones:read` | Отримати змінні за замовчуванням з `.env.example` |

---

### Список Playzone

```bash
GET /api/playzones
```

**Відповідь:**

```json
[
  {
    "id": 1,
    "name": "my-app",
    "github_url": "https://github.com/org/my-app",
    "private": false,
    "default_branch": "main",
    "status": "active",
    "last_synced_at": "2025-01-20T14:00:00Z",
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-20T14:00:00Z"
  }
]
```

---

### Підключити через GitHub App

```bash
POST /api/playzones/attach
```

Підключає репозиторій, виявлений через інтеграцію GitHub App. Якщо Playzone вже існує, він ділиться з гравцем, що запитує.

**Тіло запиту:**

```json
{
  "repo_full_name": "org/my-app"
}
```

---

### Створити Playzone

```bash
POST /api/playzones
```

**Тіло запиту:**

```json
{
  "playzone": {
    "name": "my-app",
    "github_url": "https://github.com/org/my-app",
    "default_branch": "main",
    "private": true,
    "credentials": "ghp_your_personal_access_token"
  }
}
```

:::note Приватні репозиторії
Приватні репозиторії вимагають або Personal Access Token у полі `credentials`, або активну інсталяцію GitHub App.
:::

---

### Список гілок

```bash
GET /api/playzones/:id/branches?query=feat&limit=20
```

**Параметри:**

| Параметр | Тип | За замовчуванням | Опис |
|----------|-----|-----------------|------|
| `query` | string | — | Фільтр гілок за назвою (нечутливий до регістру підрядок) |
| `limit` | integer | `20` | Максимальна кількість гілок (максимум: 50) |

**Відповідь:**

```json
{
  "branches": [
    { "name": "main", "default": true },
    { "name": "feature/auth", "default": false },
    { "name": "feature/api", "default": false }
  ]
}
```

---

### Отримати змінні за замовчуванням {#get-env-defaults}

```bash
GET /api/playzones/:id/env_defaults?branch=main&env_file_path=.env.example
```

Повертає розпарсені пари ключ-значення з файлу `.env.example` на вказаній гілці.

**Параметри:**

| Параметр | Тип | Обовʼязковий | Опис |
|----------|-----|-------------|------|
| `branch` | string | Так | Гілка для зчитування env-файлу |
| `env_file_path` | string | Ні | Нестандартний шлях до env-файлу (за замовчуванням: `.env.example`) |

**Відповідь:**

```json
{
  "defaults": {
    "DATABASE_URL": "postgres://localhost/dev",
    "RAILS_ENV": "development",
    "SECRET_KEY_BASE": "$$secret(64)"
  },
  "sensitive_keys": ["SECRET_KEY_BASE", "DATABASE_URL"]
}
```

---

### Синхронізувати Playzone

```bash
POST /api/playzones/:id/sync
```

Запускає асинхронну синхронізацію — оновлює індекс гілок та Docker Compose файл з GitHub.

```json
{
  "message": "Sync scheduled"
}
```
