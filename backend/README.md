# Fish TradeIt API

API для торговой площадки скинами с полной документацией Swagger.

## 🚀 Быстрый старт

### Установка зависимостей

```bash
npm install
```

### Запуск сервера

```bash
# Режим разработки (с автоперезагрузкой)
npm run dev

# Продакшн режим
npm start
```

### Доступные URL

- **API Documentation**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health
- **API Base URL**: http://localhost:3000/api/v1

## 📚 API Endpoints

### Аутентификация
- `POST /auth/login` - Вход через Steam OAuth
- `POST /auth/refresh` - Обновление токена

### Пользователи
- `GET /users/search` - Поиск пользователей
- `GET /users/{user_id}` - Профиль пользователя
- `GET /users/me` - Свой профиль

### Инвентарь
- `GET /inventory/{user_id}` - Инвентарь пользователя
- `GET /inventory/me` - Свой инвентарь

### Торговля
- `POST /trades` - Создание оффера
- `GET /trades` - История торгов
- `POST /trades/{trade_id}/accept` - Принятие оффера
- `POST /trades/{trade_id}/decline` - Отклонение оффера

### Баланс
- `GET /balance` - Получение баланса
- `POST /deposit` - Создание депозита
- `POST /withdraw` - Создание вывода
- `GET /transactions` - История транзакций

### Статистика
- `GET /stats` - Статистика платформы

## 🔧 Тестирование API

### 1. Аутентификация

```bash
# Вход в систему
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "steam_id": "76561198012345678",
    "steam_ticket": "demo-ticket"
  }'
```

### 2. Поиск пользователей

```bash
# Поиск пользователей (требует токен)
curl -X GET "http://localhost:3000/api/v1/users/search?q=Player" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Получение инвентаря

```bash
# Инвентарь пользователя
curl -X GET "http://localhost:3000/api/v1/inventory/user-1?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Создание торгового оффера

```bash
# Создание оффера
curl -X POST http://localhost:3000/api/v1/trades \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "recipient_id": "user-2",
    "items_to_give": ["item-1"],
    "items_to_receive": ["item-2"],
    "message": "Trade offer"
  }'
```

## 🛠️ Структура проекта

```
├── server.js              # Основной сервер
├── swagger-config.js      # Конфигурация Swagger
├── package.json           # Зависимости
├── routes/                # Роуты API
│   ├── auth.js           # Аутентификация
│   ├── users.js          # Пользователи
│   ├── inventory.js      # Инвентарь
│   ├── trades.js         # Торговля
│   └── balance.js        # Баланс
├── api-specification.md   # Спецификация API
├── technical-requirements.md # Технические требования
└── example-implementation.js # Пример реализации
```

## 🔐 Аутентификация

API использует JWT токены для аутентификации. Для доступа к защищенным эндпоинтам необходимо:

1. Получить токен через `/auth/login`
2. Передавать токен в заголовке `Authorization: Bearer <token>`

## 📊 Mock данные

Сервер использует mock данные для демонстрации:

### Пользователи
- PlayerOne, PlayerTwo, PlayerThree

### Предметы
- AK-47 | Redline ($45.50)
- AWP | Dragon Lore ($2500.00)
- M4A4 | Howl ($1800.00)
- Karambit | Fade ($850.00)
- USP-S | Kill Confirmed ($12.50)

### Торговые офферы
- Примеры активных и завершенных сделок

## 🚨 Обработка ошибок

Все ошибки возвращаются в едином формате:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Описание ошибки",
    "details": {}
  }
}
```

### Коды ошибок:
- `AUTH_REQUIRED` - требуется аутентификация
- `INVALID_TOKEN` - недействительный токен
- `INVALID_REQUEST` - некорректный запрос
- `ITEM_NOT_FOUND` - предмет не найден
- `INSUFFICIENT_BALANCE` - недостаточно средств
- `RATE_LIMIT_EXCEEDED` - превышен лимит запросов
- `INTERNAL_ERROR` - внутренняя ошибка сервера

## 🔄 Rate Limiting

API ограничивает количество запросов:
- 100 запросов за 15 минут на IP адрес
- При превышении лимита возвращается ошибка `RATE_LIMIT_EXCEEDED`

## 🧪 Тестирование

```bash
# Запуск тестов
npm test
```

## 📝 Логирование

Сервер логирует:
- Все HTTP запросы
- Ошибки валидации
- Внутренние ошибки

## 🔧 Конфигурация

Переменные окружения:
- `PORT` - порт сервера (по умолчанию 3000)
- `JWT_SECRET` - секретный ключ для JWT (по умолчанию 'your-secret-key')

## 📈 Мониторинг

- Health check: `GET /health`
- Статистика: `GET /api/v1/stats`

## 🤝 Разработка

### Добавление новых эндпоинтов

1. Создайте новый файл в папке `routes/`
2. Добавьте Swagger документацию
3. Подключите роут в `server.js`
4. Обновите документацию

### Структура роута

```javascript
/**
 * @swagger
 * /your-endpoint:
 *   get:
 *     summary: Описание эндпоинта
 *     tags: [YourTag]
 *     responses:
 *       200:
 *         description: Успешный ответ
 */
router.get('/your-endpoint', authenticateToken, async (req, res) => {
  // Ваш код
});
```

## 📄 Лицензия

MIT License
