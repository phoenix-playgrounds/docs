---
sidebar_position: 7
title: Шаблони
description: API-довідник для керування імпорт-шаблонами — багаторазовими блюпринтами середовищ.
---

# Templates API

Керування [імпорт-шаблонами](/launch/templates) — багаторазовими, версіонованими блюпринтами середовищ, якими можна ділитися через [Stargate](/launch/stargate) або [My Fleet](/launch/my-fleet).

## Ендпоінти

| Метод | Шлях | Скоуп | Опис |
|-------|------|-------|------|
| `GET` | `/api/import_templates` | `import_templates:read` | Список всіх шаблонів |
| `GET` | `/api/import_templates/search?query=rails` | `import_templates:read` | Пошук шаблонів |
| `GET` | `/api/import_templates/:id` | `import_templates:read` | Отримати один шаблон |
| `POST` | `/api/import_templates` | `import_templates:write` | Створити новий шаблон |
| `PATCH` | `/api/import_templates/:id` | `import_templates:write` | Оновити метадані шаблону |
| `DELETE` | `/api/import_templates/:id` | `import_templates:write` | Видалити шаблон |
| `GET` | `/api/import_templates/:id/versions` | `import_templates:read` | Список версій шаблону |
| `POST` | `/api/import_templates/:id/create_version` | `import_templates:write` | Створити нову версію |
| `DELETE` | `/api/import_templates/:id/destroy_version` | `import_templates:write` | Видалити версію |
| `PATCH` | `/api/import_templates/:id/toggle_public` | `import_templates:write` | Перемкнути публічну видимість версії |

---

### Список шаблонів

```bash
GET /api/import_templates
```

---

### Пошук шаблонів

```bash
GET /api/import_templates/search?query=rails
```

Повнотекстовий пошук за назвами та описами шаблонів. Повертає до 10 результатів з нечітким збігом.

---

### Категорії

Категорії шаблонів керуються адміністраторами платформи. Ви можете **переглядати** всі доступні категорії для використання при створенні або пошуку шаблонів, але не можете створювати, оновлювати або видаляти категорії через API.

Для запиту нової категорії зверніться на **support@playgrounds.dev**.

```bash
GET /api/template_categories
```

**Необхідний скоуп:** `import_templates:read`

**Відповідь:**

```json
[
  { "id": 1, "name": "Web Frameworks", "slug": "web-frameworks" },
  { "id": 2, "name": "Databases", "slug": "databases" },
  { "id": 3, "name": "Full-Stack Starters", "slug": "full-stack-starters" }
]
```

Використовуйте отриманий `id` як `category_id` при створенні або оновленні шаблонів.

---

### Створити шаблон

```bash
POST /api/import_templates
```

**Тіло запиту:**

```json
{
  "import_template": {
    "name": "Rails + PostgreSQL",
    "description": "Full-stack Rails application with PostgreSQL database",
    "category_id": 1
  }
}
```

---

### Створити версію

```bash
POST /api/import_templates/:id/create_version
```

**Тіло запиту:**

```json
{
  "template_body": "playground-variables:\n  app_name:\n    name: \"Application Name\"\n    validation: \"/^[a-z][a-z0-9-]{2,30}$/\"\n\nservices:\n  web:\n    build: .\n    ports:\n      - \"3000:3000\"\n    environment:\n      APP_NAME: $$var__app_name\n  db:\n    image: postgres:16",
  "public": true
}
```

Версії **незмінні** — після створення `template_body` не може бути змінене. Номер версії присвоюється автоматично послідовно.

:::note Валідація змінних
Платформа перевіряє, що всі посилання `$$var__NAME` та `$$random__NAME` у тілі шаблону оголошені в секції `playground-variables`, і навпаки. Неоголошені або невикористані змінні спричинять помилку валідації.
:::

---

### Перемкнути публічність

```bash
PATCH /api/import_templates/:id/toggle_public
```

Перемикає прапорець `public` версії. Публічні версії видимі у [Stargate](/launch/stargate) для всіх користувачів.

**Параметри:**

| Параметр | Тип | Опис |
|----------|-----|------|
| `version_id` | integer | Версія для перемикання |

---

### Видалити версію

```bash
DELETE /api/import_templates/:id/destroy_version
```

**Параметри:**

| Параметр | Тип | Опис |
|----------|-----|------|
| `version_id` | integer | Версія для видалення |

Видалення версії не впливає на Playspec або Playground, які вже були створені з неї.
