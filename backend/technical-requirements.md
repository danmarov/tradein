# Технические требования и рекомендации

## Архитектура системы

### Рекомендуемый стек:
- **Backend**: Node.js + Express.js / Fastify
- **Database**: PostgreSQL + Redis (для кэширования)
- **Authentication**: JWT + Steam OAuth
- **Real-time**: WebSocket (Socket.io)
- **File Storage**: AWS S3 / Cloudinary (для изображений)
- **Payment Processing**: Stripe, PayPal, Crypto APIs

### База данных

#### Основные таблицы:
```sql
-- Пользователи
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  steam_id VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) NOT NULL,
  avatar TEXT,
  email VARCHAR(255),
  balance DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Предметы инвентаря
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  steam_item_id VARCHAR(255) NOT NULL,
  name VARCHAR(500) NOT NULL,
  type VARCHAR(100),
  rarity VARCHAR(50),
  image TEXT,
  price DECIMAL(15,2),
  market_hash_name VARCHAR(500),
  exterior VARCHAR(50),
  stattrak BOOLEAN DEFAULT FALSE,
  tradeable BOOLEAN DEFAULT TRUE,
  marketable BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Торговые офферы
CREATE TABLE trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES users(id),
  recipient_id UUID REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'pending',
  message TEXT,
  total_value_give DECIMAL(15,2),
  total_value_receive DECIMAL(15,2),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Предметы в офферах
CREATE TABLE trade_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trade_id UUID REFERENCES trades(id),
  item_id UUID REFERENCES items(id),
  side VARCHAR(10) NOT NULL, -- 'give' или 'receive'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Транзакции
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type VARCHAR(50) NOT NULL, -- 'deposit', 'withdraw', 'trade'
  amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'pending',
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);


```

## Интеграция со Steam

### Steam Web API интеграция:
```javascript
// Пример интеграции с Steam API
const SteamAPI = require('steamapi');

const steam = new SteamAPI(process.env.STEAM_API_KEY);

// Получение инвентаря пользователя
async function getSteamInventory(steamId, appId = 730) { // 730 = CS2
  try {
    const inventory = await steam.getUserInventory(steamId, appId);
    return inventory;
  } catch (error) {
    console.error('Steam API error:', error);
    throw error;
  }
}

// Валидация Steam ticket
async function validateSteamTicket(ticket) {
  // Реализация валидации Steam ticket
}
```

### Синхронизация инвентаря:
- Периодическая синхронизация (каждые 5-10 минут)
- Webhook от Steam при изменениях
- Кэширование данных для оптимизации

## Безопасность

### Аутентификация и авторизация:
```javascript
// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: { code: 'AUTH_REQUIRED' } });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: { code: 'INVALID_TOKEN' } });
    }
    req.user = user;
    next();
  });
};
```

### Rate Limiting:
```javascript
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // максимум 100 запросов
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests'
    }
  }
});
```

### Валидация данных:
```javascript
const { body, validationResult } = require('express-validator');

const validateTradeOffer = [
  body('recipient_id').isUUID().notEmpty(),
  body('items_to_give').isArray().notEmpty(),
  body('items_to_receive').isArray().notEmpty(),
  body('message').optional().isString().isLength({ max: 500 }),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'Validation failed',
          details: errors.array()
        }
      });
    }
    next();
  }
];
```

## Оптимизация производительности

### Кэширование:
```javascript
const redis = require('redis');
const client = redis.createClient();

// Кэширование инвентаря
async function getCachedInventory(userId) {
  const cached = await client.get(`inventory:${userId}`);
  if (cached) {
    return JSON.parse(cached);
  }
  
  const inventory = await getInventoryFromDB(userId);
  await client.setex(`inventory:${userId}`, 300, JSON.stringify(inventory)); // 5 минут
  return inventory;
}
```

### Пагинация:
```javascript
const getPaginatedResults = async (query, page = 1, limit = 50) => {
  const offset = (page - 1) * limit;
  
  const [results, total] = await Promise.all([
    query.limit(limit).offset(offset),
    query.count()
  ]);
  
  return {
    data: results,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};
```

## Real-time функциональность

### WebSocket события:
```javascript
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  // Аутентификация пользователя
  socket.on('authenticate', async (token) => {
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = user.id;
      socket.join(`user:${user.id}`);
    } catch (error) {
      socket.disconnect();
    }
  });

  // Отключение
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


```

## Мониторинг и логирование

### Логирование:
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Middleware для логирования запросов
app.use((req, res, next) => {
  logger.info({
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});
```

### Метрики:
```javascript
const prometheus = require('prom-client');

// Счетчики для метрик
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

const activeTrades = new prometheus.Gauge({
  name: 'active_trades_total',
  help: 'Total number of active trades'
});
```

## Тестирование

### Unit тесты:
```javascript
const request = require('supertest');
const app = require('../app');

describe('Trade API', () => {
  test('should create trade offer', async () => {
    const response = await request(app)
      .post('/trades')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        recipient_id: 'user-uuid',
        items_to_give: ['item-uuid'],
        items_to_receive: ['item-uuid-2']
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
});
```

### Интеграционные тесты:
```javascript
describe('Steam Integration', () => {
  test('should sync inventory from Steam', async () => {
    const mockSteamInventory = [/* mock data */];
    jest.spyOn(steam, 'getUserInventory').mockResolvedValue(mockSteamInventory);
    
    const result = await syncInventory('steam-id');
    expect(result).toHaveLength(mockSteamInventory.length);
  });
});
```

## Деплой и CI/CD

### Docker конфигурация:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### GitHub Actions:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: npm test
      - name: Deploy to server
        run: |
          # Деплой скрипт
```

## Рекомендации по масштабированию

1. **Горизонтальное масштабирование**: Использование load balancer
2. **Микросервисы**: Разделение на отдельные сервисы (auth, trades, inventory)
3. **База данных**: Репликация для чтения, шардинг при необходимости
4. **Кэширование**: Redis cluster для высоких нагрузок
5. **CDN**: Для статических ресурсов и изображений
6. **Мониторинг**: Prometheus + Grafana для метрик
7. **Алерты**: Настройка уведомлений о критических ошибках
