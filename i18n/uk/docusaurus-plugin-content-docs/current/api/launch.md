---
sidebar_position: 6
title: Launch
description: API-довідник для Launch ендпоінту — створення Playspec та Playground одним викликом.
---

# Launch API

Launch ендпоінт надає єдиний виклик для створення [Playspec](/core-concepts/playspec) — та, опціонально, одразу запущеного [Playground](/core-concepts/playground) — з Docker Compose YAML.

## Ендпоінт

| Метод | Шлях | Скоуп | Опис |
|-------|------|-------|------|
| `POST` | `/api/launch` | `launch:write` | Створити Playspec (та опціонально Playground) з Compose YAML |

---

### Створення через Launch

```bash
POST /api/launch
```

**Тіло запиту:**

```json
{
  "name": "my-environment",
  "compose_yaml": "services:\n  web:\n    image: nginx:latest\n    ports:\n      - \"80:80\"\n  db:\n    image: postgres:16\n    environment:\n      POSTGRES_PASSWORD: secret",
  "playroom_id": 1,
  "create_playground": true,
  "persist_volumes": false,
  "agent": "gemini"
}
```

**Параметри:**

| Параметр | Тип | Обовʼязковий | Опис |
|----------|-----|-------------|------|
| `name` | string | Так | Назва для створеного Playspec (та Playground) |
| `compose_yaml` | string | Так | Docker Compose YAML визначення |
| `playroom_id` | integer | Ні | Playroom для розгортання (обовʼязковий, якщо `create_playground` true) |
| `create_playground` | boolean | Ні | Чи створити та запустити Playground одразу (за замовчуванням: false) |
| `persist_volumes` | boolean | Ні | Увімкнути збереження томів на Playspec (за замовчуванням: false) |
| `agent` | string | Ні | Провайдер AI-агента (напр., `gemini`, `claude-code`) |

**Відповідь (201 Created):**

```json
{
  "playspecs_created": 42,
  "playground_id": 15,
  "playzones_created": [1, 2]
}
```

| Поле | Опис |
|------|------|
| `playspecs_created` | ID новоствореного Playspec |
| `playground_id` | ID Playground (присутній тільки якщо `create_playground` було true) |
| `playzones_created` | ID автоматично створених Playzone з Compose визначення |

## Як це працює

Launch ендпоінт оркеструє кілька операцій одним викликом:

1. **Парсить** Docker Compose YAML
2. **Автоматично створює Playzone** для `build`-сервісів, що посилаються на локальні Dockerfile (якщо репозиторій можна визначити)
3. **Створює Playspec** з наданим Compose YAML та автокласифікованими сервісами
4. **Опціонально створює Playground** на вказаному Playroom

Це ідеально для:

- **CI/CD пайплайнів** — Створюйте ефемерні середовища для превʼю pull request
- **CLI-інструментів** — Запускайте середовища з командного рядка одним API-викликом
- **Автоматизації** — Скриптуйте створення середовищ для демо, тестування або онбордингу

## Приклад: CI/CD превʼю середовище

```bash
curl -X POST https://my.playgrounds.dev/api/launch \
  -H "Authorization: Bearer $PLAYGROUNDS_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"pr-$PR_NUMBER\",
    \"compose_yaml\": \"$(cat docker-compose.yml)\",
    \"playroom_id\": $PLAYROOM_ID,
    \"create_playground\": true
  }"
```
