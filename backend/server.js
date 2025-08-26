require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Импорт роутов
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const inventoryRoutes = require('./routes/inventory');
const tradeRoutes = require('./routes/trades');
const balanceRoutes = require('./routes/balance');

// Импорт Swagger конфигурации
const swaggerSpec = require('./swagger-config');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// // Rate limiting
// const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 минут
//   max: 100, // максимум 100 запросов
//   message: {
//     error: {
//       code: 'RATE_LIMIT_EXCEEDED',
//       message: 'Too many requests'
//     }
//   }
// });

// Применение rate limiting к API роутам
// app.use('/api/', apiLimiter);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Fish TradeIt API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    docExpansion: 'list',
    filter: true,
    showRequestHeaders: true,
    tryItOutEnabled: true
  }
}));

// API роуты
app.use('/api/v1/auth', authRoutes.router);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1/trades', tradeRoutes);
app.use('/api/v1/balance', balanceRoutes);

// Статистика платформы
/**
 * @swagger
 * /stats:
 *   get:
 *     summary: Получение статистики платформы
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Статистика платформы
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_users:
 *                   type: integer
 *                 total_trades:
 *                   type: integer
 *                 total_volume:
 *                   type: number
 *                 online_users:
 *                   type: integer
 *                 recent_trades:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       sender:
 *                         type: string
 *                       recipient:
 *                         type: string
 *                       value:
 *                         type: number
 *                       created_at:
 *                         type: string
 *                         format: date-time
 */
app.get('/api/v1/stats', (req, res) => {
  try {
    const stats = {
      total_users: 15420,
      total_trades: 45678,
      total_volume: 1250000.50,
      online_users: 342,
      recent_trades: [
        {
          id: 'trade-1',
          sender: 'PlayerOne',
          recipient: 'PlayerTwo',
          value: 250.00,
          created_at: new Date().toISOString()
        },
        {
          id: 'trade-2',
          sender: 'PlayerThree',
          recipient: 'PlayerFour',
          value: 1800.00,
          created_at: new Date(Date.now() - 300000).toISOString()
        }
      ]
    };

    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      }
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Fish TradeIt API',
    version: '1.0.0',
    documentation: '/api-docs',
    health: '/health'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found'
    }
  });
});


// для локальной разработки
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

// для Vercel
module.exports = app;
