# API Спецификация - Торговая площадка скинами

## Общая информация

**Base URL:** `http://localhost:4000/api/v1`  
**Content-Type:** `application/json`  
**Authentication:** Bearer Token

## Аутентификация

### POST /auth/login
Вход через Steam OAuth

**Request:**
```json
{
  "steam_id": "string",
  "steam_ticket": "string"
}
```

**Response:**
```json
{
  "access_token": "string",
  "refresh_token": "string",
  "user": {
    "id": "string",
    "steam_id": "string",
    "username": "string",
    "avatar": "string",
    "balance": "number",
    "created_at": "string"
  }
}
```

### POST /auth/refresh
Обновление токена

**Request:**
```json
{
  "refresh_token": "string"
}
```

**Response:**
```json
{
  "access_token": "string",
  "refresh_token": "string"
}
```

## Пользователи

### GET /users/search
Поиск пользователей по никнейму

**Query Parameters:**
- `q` (string, required) - поисковый запрос
- `limit` (number, optional) - количество результатов (default: 20)
- `offset` (number, optional) - смещение (default: 0)

**Response:**
```json
{
  "users": [
    {
      "id": "string",
      "steam_id": "string",
      "username": "string",
      "avatar": "string",
      "online": "boolean",
      "last_seen": "string"
    }
  ],
  "total": "number"
}
```

### GET /users/{user_id}
Получение профиля пользователя

**Response:**
```json
{
  "id": "string",
  "steam_id": "string",
  "username": "string",
  "avatar": "string",
  "balance": "number",
  "online": "boolean",
  "last_seen": "string",
  "created_at": "string",
  "stats": {
    "total_trades": "number",
    "successful_trades": "number",
    "items_count": "number"
  }
}
```

### GET /users/me
Получение своего профиля

**Response:**
```json
{
  "id": "string",
  "steam_id": "string",
  "username": "string",
  "avatar": "string",
  "balance": "number",
  "email": "string",
  "created_at": "string",
  "settings": {
    "notifications": "boolean",
    "trade_confirmations": "boolean"
  }
}
```

## Инвентарь

### GET /inventory/{user_id}
Получение инвентаря пользователя

**Query Parameters:**
- `page` (number, optional) - номер страницы (default: 1)
- `limit` (number, optional) - количество предметов на странице (default: 50)
- `search` (string, optional) - поиск по названию предмета
- `rarity` (string, optional) - фильтр по редкости
- `type` (string, optional) - фильтр по типу предмета
- `sort` (string, optional) - сортировка (price_asc, price_desc, name_asc, name_desc)

**Response:**
```json
{
  "items": [
    {
      "id": "string",
      "steam_item_id": "string",
      "name": "string",
      "type": "string",
      "rarity": "string",
      "image": "string",
      "price": "number",
      "market_hash_name": "string",
      "exterior": "string",
      "stattrak": "boolean",
      "tradeable": "boolean",
      "marketable": "boolean"
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "pages": "number"
  }
}
```

### GET /inventory/me
Получение своего инвентаря

**Query Parameters:** (аналогично GET /inventory/{user_id})

## Торговля

### POST /trades
Создание торгового оффера

**Request:**
```json
{
  "recipient_id": "string",
  "items_to_give": ["string"], // массив ID предметов для отправки
  "items_to_receive": ["string"], // массив ID предметов для получения
  "message": "string" // опциональное сообщение
}
```

**Response:**
```json
{
  "id": "string",
  "sender_id": "string",
  "recipient_id": "string",
  "status": "string", // pending, accepted, declined, cancelled, expired
  "items_to_give": [
    {
      "id": "string",
      "name": "string",
      "image": "string",
      "price": "number"
    }
  ],
  "items_to_receive": [
    {
      "id": "string",
      "name": "string",
      "image": "string",
      "price": "number"
    }
  ],
  "total_value_give": "number",
  "total_value_receive": "number",
  "message": "string",
  "created_at": "string",
  "expires_at": "string"
}
```

### GET /trades
Получение истории торгов

**Query Parameters:**
- `type` (string, optional) - тип офферов (sent, received, all)
- `status` (string, optional) - статус оффера
- `page` (number, optional) - номер страницы
- `limit` (number, optional) - количество на странице

**Response:**
```json
{
  "trades": [
    {
      "id": "string",
      "sender": {
        "id": "string",
        "username": "string",
        "avatar": "string"
      },
      "recipient": {
        "id": "string",
        "username": "string",
        "avatar": "string"
      },
      "status": "string",
      "items_to_give": [
        {
          "id": "string",
          "name": "string",
          "image": "string",
          "price": "number"
        }
      ],
      "items_to_receive": [
        {
          "id": "string",
          "name": "string",
          "image": "string",
          "price": "number"
        }
      ],
      "total_value_give": "number",
      "total_value_receive": "number",
      "message": "string",
      "created_at": "string",
      "updated_at": "string"
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "pages": "number"
  }
}
```

### GET /trades/{trade_id}
Получение деталей оффера

**Response:**
```json
{
  "id": "string",
  "sender": {
    "id": "string",
    "username": "string",
    "avatar": "string"
  },
  "recipient": {
    "id": "string",
    "username": "string",
    "avatar": "string"
  },
  "status": "string",
  "items_to_give": [
    {
      "id": "string",
      "name": "string",
      "image": "string",
      "price": "number",
      "steam_item_id": "string"
    }
  ],
  "items_to_receive": [
    {
      "id": "string",
      "name": "string",
      "image": "string",
      "price": "number",
      "steam_item_id": "string"
    }
  ],
  "total_value_give": "number",
  "total_value_receive": "number",
  "message": "string",
  "created_at": "string",
  "updated_at": "string",
  "expires_at": "string"
}
```

### POST /trades/{trade_id}/accept
Принятие оффера

**Response:**
```json
{
  "success": "boolean",
  "message": "string"
}
```

### POST /trades/{trade_id}/decline
Отклонение оффера

**Request:**
```json
{
  "reason": "string" // опциональная причина
}
```

**Response:**
```json
{
  "success": "boolean",
  "message": "string"
}
```

### POST /trades/{trade_id}/cancel
Отмена оффера (только отправитель)

**Response:**
```json
{
  "success": "boolean",
  "message": "string"
}
```

## Финансы

### GET /balance
Получение баланса

**Response:**
```json
{
  "balance": "number",
  "currency": "string"
}
```

### POST /deposit
Создание депозита

**Request:**
```json
{
  "amount": "number",
  "payment_method": "string", // card, crypto, etc.
  "currency": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "amount": "number",
  "currency": "string",
  "payment_url": "string",
  "status": "string", // pending, completed, failed
  "created_at": "string"
}
```

### POST /withdraw
Создание вывода

**Request:**
```json
{
  "amount": "number",
  "payment_method": "string",
  "payment_details": {
    "card_number": "string", // или другие детали в зависимости от метода
    "crypto_address": "string"
  }
}
```

**Response:**
```json
{
  "id": "string",
  "amount": "number",
  "currency": "string",
  "status": "string", // pending, processing, completed, failed
  "created_at": "string"
}
```

### GET /transactions
История транзакций

**Query Parameters:**
- `type` (string, optional) - тип транзакции (deposit, withdraw, trade)
- `page` (number, optional)
- `limit` (number, optional)

**Response:**
```json
{
  "transactions": [
    {
      "id": "string",
      "type": "string",
      "amount": "number",
      "currency": "string",
      "status": "string",
      "description": "string",
      "created_at": "string"
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "pages": "number"
  }
}
```



## Статистика

### GET /stats
Получение статистики платформы

**Response:**
```json
{
  "total_users": "number",
  "total_trades": "number",
  "total_volume": "number",
  "online_users": "number",
  "recent_trades": [
    {
      "id": "string",
      "sender": "string",
      "recipient": "string",
      "value": "number",
      "created_at": "string"
    }
  ]
}
```

## Обработка ошибок

Все ошибки возвращаются в формате:

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object" // опционально
  }
}
```

### Коды ошибок:
- `AUTH_REQUIRED` - требуется аутентификация
- `INVALID_TOKEN` - недействительный токен
- `INSUFFICIENT_BALANCE` - недостаточно средств
- `ITEM_NOT_TRADEABLE` - предмет не доступен для торговли
- `TRADE_EXPIRED` - оффер истек
- `INVALID_REQUEST` - некорректный запрос
- `RATE_LIMIT_EXCEEDED` - превышен лимит запросов
- `INTERNAL_ERROR` - внутренняя ошибка сервера

## WebSocket события

Для real-time уведомлений:

```javascript
// Подключение
const ws = new WebSocket('ws://localhost:3000/ws');

// События:
// trade_offer_received - новый оффер
// trade_offer_updated - обновление оффера
// balance_updated - обновление баланса
```

## Дополнительные рекомендации

1. **Rate Limiting**: Ограничение запросов для предотвращения злоупотреблений
2. **Caching**: Кэширование инвентарей и статических данных
3. **Webhooks**: Для интеграции с внешними системами
4. **Аудит**: Логирование всех важных операций
5. **Валидация**: Строгая валидация всех входящих данных
6. **Безопасность**: HTTPS, CORS, защита от CSRF
