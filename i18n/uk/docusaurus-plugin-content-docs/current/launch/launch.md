---
sidebar_position: 1
slug: /launch
title: Запуск
description: Launch — найшвидший спосіб створити нове середовище з шаблону або Docker Compose файлу.
---

# Запуск

**Launch** — найшвидший шлях від нуля до працюючого середовища. Він обʼєднує створення [Playspec](/core-concepts/playspec) та (опціонально) [Playground](/core-concepts/playground) в один крок.

## Як це працює

Launch підтримує два робочі процеси:

### 1. Імпорт з шаблону

Переглядайте шаблони з [Stargate](/launch/stargate) або [My Fleet](/launch/my-fleet), заповніть необхідні змінні та натисніть **Launch**. Платформа:

1. Підставляє ваші значення змінних у шаблон
2. Створює новий Playspec з результуючого Docker Compose YAML
3. Автоматично класифікує сервіси
4. Опціонально одразу створює Playground

### 2. Імпорт з Docker Compose

Вставте або завантажте `docker-compose.yml` файл напряму. Платформа парсить його, показує виявлені сервіси для класифікації (статичні vs динамічні) та створює Playspec. Потім ви можете запустити Playground з нього.

## API Launch

Ви також можете запускати середовища програмно через [Launch API ендпоінт](/api/launch):

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

Це особливо корисно для CI/CD пайплайнів, автоматизованого тестування або скриптового створення середовищ.

## Що створюється

| Створити Playground | Результат |
|--------------------|-----------|
| **Так** | Новий Playspec **та** запущений Playground |
| **Ні** | Тільки новий Playspec — Playground можна створити пізніше |

## Змінні шаблону

При імпорті з шаблону форма запуску показує поля для кожної оголошеної [змінної шаблону](/launch/templates#variables). Змінні можуть мати:

- **Назви для відображення** — Зрозумілі мітки
- **Правила валідації** — Regex-патерни для перевірки формату вводу
- **Автоматично згенеровані значення** — Випадкові значення для змінних типу `$$random__NAME`
