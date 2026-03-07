---
sidebar_position: 2
title: Playrooms
description: API-довідник для керування Playroom — віддаленими Docker-хостами.
---

# Playrooms API

Керування [Playroom](/core-concepts/playroom) — віддаленими Docker-хостами, на яких працюють ваші Playground.

## Ендпоінти

| Метод | Шлях | Скоуп | Опис |
|-------|------|-------|------|
| `GET` | `/api/playrooms` | `playrooms:read` | Список всіх Playroom |
| `GET` | `/api/playrooms/:id` | `playrooms:read` | Отримати один Playroom |
| `POST` | `/api/playrooms` | `playrooms:write` | Створити новий Playroom |
| `PATCH` | `/api/playrooms/:id` | `playrooms:write` | Оновити Playroom |
| `DELETE` | `/api/playrooms/:id` | `playrooms:delete` | Видалити Playroom |
| `POST` | `/api/playrooms/:id/generate_ssh_key` | `playrooms:manage` | Згенерувати SSH-ключ |
| `POST` | `/api/playrooms/:id/test_connection` | `playrooms:read` | Перевірити SSH та Docker зʼєднання |

---

### Список Playroom

```bash
GET /api/playrooms
```

**Відповідь:**

```json
[
  {
    "id": 1,
    "name": "Production Host",
    "status": "active",
    "host": "192.168.1.100",
    "port": 22,
    "user": "deploy",
    "tutorial": false,
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  }
]
```

---

### Отримати Playroom

```bash
GET /api/playrooms/:id
```

Повертає детальний вигляд, включаючи SSH-публічний ключ, домени та ACME email.

**Відповідь:**

```json
{
  "id": 1,
  "name": "Production Host",
  "status": "active",
  "host": "192.168.1.100",
  "port": 22,
  "user": "deploy",
  "tutorial": false,
  "ssh_public_key": "ssh-ed25519 AAAA...",
  "domains": ["dev.example.com", "staging.example.com"],
  "acme_email": "admin@example.com",
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-15T10:30:00Z"
}
```

---

### Створити Playroom

```bash
POST /api/playrooms
```

**Тіло запиту:**

```json
{
  "playroom": {
    "name": "My Server",
    "host": "192.168.1.100",
    "port": 22,
    "user": "deploy",
    "ssh_private_key": "-----BEGIN OPENSSH PRIVATE KEY-----\n...",
    "domains_input": "dev.example.com, staging.example.com",
    "acme_email": "admin@example.com",
    "status": "active"
  }
}
```

---

### Оновити Playroom

```bash
PATCH /api/playrooms/:id
```

Тіло аналогічне Create. Tutorial Playroom мають обмежені поля (тільки `name`, `domains_input` та `status`).

---

### Видалити Playroom

```bash
DELETE /api/playrooms/:id
```

Повертає `204 No Content` при успіху. Помилка `409 Conflict`, якщо Playroom має активні Playground або є tutorial Playroom.

---

### Згенерувати SSH-ключ

```bash
POST /api/playrooms/:id/generate_ssh_key
```

Генерує нову пару ключів ed25519. Повертає публічний ключ:

```json
{
  "public_key": "ssh-ed25519 AAAA... playroom-1@playgrounds.dev"
}
```

---

### Тест зʼєднання

```bash
POST /api/playrooms/:id/test_connection
```

Перевіряє SSH-зʼєднання, доступність Docker та доступ до директорій:

```json
{
  "success": true,
  "checks": {
    "ssh": { "success": true, "message": "SSH connection successful" },
    "docker": { "success": true, "message": "Docker available", "details": { "version": "24.0.7" } },
    "directories": { "success": true, "message": "Directory access verified" }
  }
}
```
