---
sidebar_position: 5
title: Playgrounds
description: API-довідник для керування Playground — живими запущеними середовищами.
---

# Playgrounds API

Керування [Playground](/core-concepts/playground) — живими, запущеними екземплярами ваших блюпринтів середовищ.

## Ендпоінти

| Метод | Шлях | Скоуп | Опис |
|-------|------|-------|------|
| `GET` | `/api/playgrounds` | `playgrounds:read` | Список всіх Playground |
| `GET` | `/api/playgrounds/:id` | `playgrounds:read` | Отримати один Playground (детально) |
| `GET` | `/api/playgrounds/:id/status` | `playgrounds:read` | Отримати статус та стан сервісів у реальному часі |
| `POST` | `/api/playgrounds` | `playgrounds:write` | Створити новий Playground |
| `DELETE` | `/api/playgrounds/:id` | `playgrounds:delete` | Знищити Playground |
| `POST` | `/api/playgrounds/:id/recreate` | `playgrounds:write` | Пересоздати Playground |
| `POST` | `/api/playgrounds/:id/extend_expiration` | `playgrounds:write` | Продовжити TTL |
| `GET` | `/api/playgrounds/:id/compose` | `playgrounds:read` | Отримати згенерований Compose YAML |
| `GET` | `/api/playgrounds/:id/logs/:service` | `playgrounds:read` | Отримати логи сервісу |
| `GET` | `/api/playgrounds/:id/env_metadata` | `playgrounds:read` | Отримати зʼєднані змінні середовища з метаданими джерел |

---

### Список Playground

```bash
GET /api/playgrounds
```

**Відповідь:**

```json
[
  {
    "id": 1,
    "name": "feature-auth",
    "status": "running",
    "job_mode": false,
    "playspec_id": 1,
    "playspec_name": "My Web Stack",
    "service_branches": {
      "web": { "branch_name": "feature/auth" }
    },
    "expires_at": "2025-01-15T18:30:00Z",
    "created_at": "2025-01-15T10:30:00Z"
  }
]
```

---

### Отримати Playground (детально)

```bash
GET /api/playgrounds/:id
```

**Відповідь:**

```json
{
  "id": 1,
  "name": "feature-auth",
  "status": "running",
  "job_mode": false,
  "playspec_id": 1,
  "playspec_name": "My Web Stack",
  "compose_project": "pg-1-feature-auth",
  "service_branches": {
    "web": { "branch_name": "feature/auth" }
  },
  "env_overrides": {
    "DATABASE_URL": "postgres://db/myapp"
  },
  "expires_at": "2025-01-15T18:30:00Z",
  "time_remaining": 28800.0,
  "expiration_percentage": 0,
  "last_applied_at": "2025-01-15T10:31:00Z",
  "needs_recreation": false,
  "services": [
    { "name": "web", "status": "running", "health": "healthy", "running": true },
    { "name": "db", "status": "running", "health": null, "running": true }
  ],
  "created_at": "2025-01-15T10:30:00Z"
}
```

---

### Отримати статус

```bash
GET /api/playgrounds/:id/status
```

Легкий ендпоінт статусу — корисний для поллінгу під час створення:

```json
{
  "id": 1,
  "status": "in_progress",
  "job_mode": false,
  "creation_step": "image_build",
  "creation_step_label": "Building Images",
  "error_message": null,
  "error_step": null,
  "error_step_label": null,
  "needs_recreation": false,
  "services": [
    { "name": "web", "status": "stopped", "health": null, "running": false },
    { "name": "db", "status": "running", "health": null, "running": true }
  ]
}
```

---

### Створити Playground

```bash
POST /api/playgrounds
```

**Тіло запиту:**

```json
{
  "playground": {
    "name": "feature-auth",
    "playspec_id": 1,
    "playroom_id": 1,
    "job_mode": false,
    "env_overrides": {
      "DATABASE_URL": "postgres://db/myapp"
    },
    "service_subdomains": {
      "web": "feature-auth-web"
    },
    "services": {
      "web": {
        "git_config": {
          "branch_name": "feature/auth",
          "create_branch": false
        },
        "production": false
      }
    }
  }
}
```

**Ключові поля:**

| Поле | Опис |
|------|------|
| `env_overrides` | Глобальні перевизначення змінних середовища (застосовуються до всіх сервісів) |
| `service_subdomains` | Перевизначення субдоменів для кожного сервісу |
| `services.{name}.git_config.branch_name` | Гілка для динамічного сервісу |
| `services.{name}.git_config.create_branch` | Створити нову гілку з `base_branch_name` |
| `services.{name}.git_config.base_branch_name` | Базова гілка при створенні нової гілки |
| `services.{name}.production` | Запустити сервіс у production-режимі |
| `services.{name}.env_vars` | Перевизначення змінних середовища для конкретного сервісу |

---

### Знищити Playground

```bash
DELETE /api/playgrounds/:id
```

Знищує всі контейнери та ресурси. Повертає `204 No Content`.

---

### Пересоздати Playground

```bash
POST /api/playgrounds/:id/recreate
```

Знищує контейнери та перезапускає повний цикл конфігурації. Зберігає томи, якщо на Playspec увімкнено `persist_volumes`.

---

### Продовжити термін дії

```bash
POST /api/playgrounds/:id/extend_expiration
```

**Параметри:**

| Параметр | Тип | Опис |
|----------|-----|------|
| `duration_hours` | integer | Кількість годин для продовження (за замовчуванням: 8) |

**Відповідь:**

```json
{
  "id": 1,
  "expires_at": "2025-01-16T02:30:00Z",
  "time_remaining": 57600.0
}
```

---

### Отримати згенерований Compose

```bash
GET /api/playgrounds/:id/compose
```

Повертає фінальний Docker Compose YAML, згенерований платформою:

```json
{
  "compose_yaml": "services:\n  web:\n    ...",
  "compose_project": "pg-1-feature-auth"
}
```

---

### Отримати логи сервісу {#get-service-logs}

```bash
GET /api/playgrounds/:id/logs/:service?tail=100
```

**Параметри:**

| Параметр | Тип | За замовчуванням | Опис |
|----------|-----|-----------------|------|
| `tail` | integer | `100` | Кількість рядків (максимум: 1000) |

**Відповідь:**

```json
{
  "service": "web",
  "lines": [
    "=> Booting Puma",
    "=> Rails 8.0.0 application starting in development",
    "* Listening on http://0.0.0.0:3000"
  ],
  "source": "live"
}
```

Для завершених Playground у режимі job логи повертаються з кешу (`"source": "cached"`).

---

### Отримати метадані середовища {#get-environment-metadata}

```bash
GET /api/playgrounds/:id/env_metadata
```

Повертає повністю зʼєднані змінні середовища з відстеженням джерел:

```json
{
  "merged": {
    "DATABASE_URL": "postgres://db/myapp",
    "RAILS_ENV": "development",
    "PLAYGROUND_ID": "1"
  },
  "metadata": {
    "DATABASE_URL": { "value": "postgres://db/myapp", "source": "override" },
    "RAILS_ENV": { "value": "development", "source": "default" },
    "PLAYGROUND_ID": { "value": "1", "source": "system" }
  },
  "system_keys": ["PLAYGROUND_ID"],
  "generated_keys": ["SECRET_KEY_BASE"]
}
```
