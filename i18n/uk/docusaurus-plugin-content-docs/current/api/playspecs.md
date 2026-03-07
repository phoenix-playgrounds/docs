---
sidebar_position: 4
title: Playspecs
description: API-довідник для керування Playspec — блюпринтами середовищ.
---

# Playspecs API

Керування [Playspec](/core-concepts/playspec) — блюпринтами, що визначають сервіси, конфігурацію та інфраструктуру вашого середовища.

## Ендпоінти

| Метод | Шлях | Скоуп | Опис |
|-------|------|-------|------|
| `GET` | `/api/playspecs` | `playspecs:read` | Список всіх Playspec |
| `GET` | `/api/playspecs/:id` | `playspecs:read` | Отримати один Playspec |
| `POST` | `/api/playspecs` | `playspecs:write` | Створити новий Playspec |
| `PATCH` | `/api/playspecs/:id` | `playspecs:write` | Оновити Playspec (повинен бути розблокований) |
| `DELETE` | `/api/playspecs/:id` | `playspecs:delete` | Видалити Playspec (повинен бути розблокований) |
| `GET` | `/api/playspecs/:id/services` | `playspecs:read` | Отримати визначення сервісів |
| `POST` | `/api/playspecs/validate_compose` | `playspecs:read` | Валідувати Docker Compose YAML |
| `POST` | `/api/playspecs/:id/add_mounted_file` | `playspecs:write` | Додати монтований файл |
| `PATCH` | `/api/playspecs/:id/update_mounted_file` | `playspecs:write` | Оновити конфігурацію монтованого файлу |
| `DELETE` | `/api/playspecs/:id/remove_mounted_file` | `playspecs:write` | Видалити монтований файл |
| `POST` | `/api/playspecs/:id/add_registry_credential` | `playspecs:write` | Додати облікові дані приватного реєстру |
| `DELETE` | `/api/playspecs/:id/remove_registry_credential` | `playspecs:write` | Видалити облікові дані реєстру |

---

### Список Playspec

```bash
GET /api/playspecs
```

**Відповідь:**

```json
[
  {
    "id": 1,
    "name": "My Web Stack",
    "description": "Rails + PostgreSQL + Redis",
    "locked": true,
    "persist_volumes": false,
    "playground_count": 2,
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  }
]
```

---

### Отримати Playspec (детально)

```bash
GET /api/playspecs/:id
```

Повертає повний Playspec, включаючи сервіси, монтовані файли та облікові дані реєстрів:

```json
{
  "id": 1,
  "name": "My Web Stack",
  "description": "Rails + PostgreSQL + Redis",
  "locked": false,
  "persist_volumes": false,
  "playground_count": 0,
  "services": [
    {
      "name": "web",
      "type": "dynamic",
      "playzone_id": 1,
      "dockerfile_path": "Dockerfile",
      "env_file_path": ".env.example",
      "workdir": "/app",
      "exposure": {
        "enabled": true,
        "port": 3000,
        "subdomain": "web",
        "visibility": "external"
      }
    },
    {
      "name": "db",
      "type": "static",
      "image": "postgres:16",
      "exposure": {
        "enabled": false
      }
    }
  ],
  "mounted_files": [],
  "credentials": [],
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-15T10:30:00Z"
}
```

---

### Створити Playspec

```bash
POST /api/playspecs
```

**Тіло запиту:**

```json
{
  "playspec": {
    "name": "My Web Stack",
    "description": "Rails + PostgreSQL + Redis",
    "base_compose_yaml": "services:\n  web:\n    build: .\n    ports:\n      - \"3000:3000\"\n  db:\n    image: postgres:16",
    "persist_volumes": false,
    "services": [
      {
        "name": "web",
        "type": "dynamic",
        "playzone_id": 1,
        "dockerfile_path": "Dockerfile",
        "env_file_path": ".env.example",
        "workdir": "/app",
        "exposure": { "enabled": true, "port": 3000, "subdomain": "web", "visibility": "external" }
      },
      {
        "name": "db",
        "type": "static",
        "image": "postgres:16",
        "exposure": { "enabled": false }
      }
    ]
  }
}
```

:::warning Заблоковані Playspec
Playspec стає заблокованим, коли на нього посилається будь-який Playground. Заблоковані Playspec не можуть бути оновлені або видалені. Див. [Заблокований статус](/core-concepts/playspec#locked-status).
:::

---

### Валідація Compose

```bash
POST /api/playspecs/validate_compose
```

Валідує Docker Compose YAML без створення Playspec.

**Тіло запиту:**

```json
{
  "compose_yaml": "services:\n  web:\n    build: .\n    ports:\n      - \"3000:3000\""
}
```

**Відповідь:**

```json
{
  "valid": true,
  "services": [
    { "name": "web", "ports": ["3000:3000"] }
  ],
  "errors": [],
  "warnings": []
}
```

---

### Додати монтований файл

```bash
POST /api/playspecs/:id/add_mounted_file
# Content-Type: multipart/form-data
```

**Параметри:**

| Параметр | Тип | Обовʼязковий | Опис |
|----------|-----|-------------|------|
| `file` | file | Так | Файл для завантаження |
| `mount_path` | string | Так | Абсолютний шлях всередині контейнера |
| `target_services[]` | array | Ні | Сервіси, що отримують монтування (всі, якщо порожньо) |
| `readonly` | boolean | Ні | Чи є монтування тільки для читання (за замовчуванням: `true`) |

---

### Додати облікові дані реєстру

```bash
POST /api/playspecs/:id/add_registry_credential
```

**Тіло запиту:**

```json
{
  "registry_type": "docker_hub",
  "registry_url": "https://index.docker.io/v1/",
  "username": "myuser",
  "secret": "mypassword"
}
```
