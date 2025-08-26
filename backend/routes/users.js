const express = require('express');
const { query } = require('express-validator');

const router = express.Router();
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  console.log('🔐 authenticateToken called');
  
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('❌ No token provided');
    return res.status(401).json({ 
      error: { 
        code: 'AUTH_REQUIRED',
        message: 'Authentication required' 
      } 
    });
  }

  // 👈 РЕАЛЬНАЯ ВАЛИДАЦИЯ JWT
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('❌ Token validation failed:', err.message);
      return res.status(403).json({ 
        error: { 
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired token' 
        } 
      });
    }
    
    console.log('✅ Token valid, user:', user);
    req.user = user;
    next();
  });
};

/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Поиск пользователей по никнейму
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: false
 *         schema:
 *           type: string
 *         description: Поисковый запрос (опциональный)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Количество результатов
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Смещение
 *     responses:
 *       200:
 *         description: Список пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       steam_id:
 *                         type: string
 *                       username:
 *                         type: string
 *                       avatar:
 *                         type: string
 *                       online:
 *                         type: boolean
 *                       last_seen:
 *                         type: string
 *                         format: date-time
 *                 total:
 *                   type: integer
 *       400:
 *         description: Ошибка валидации
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Требуется аутентификация
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/search', authenticateToken, [
  query('q').optional().isString(), // Изменено на optional()
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const { q, limit = 20, offset = 0 } = req.query;

    // Mock данные пользователей
    const mockUsers = [
      {
        id: 'user-1',
        steam_id: '76561198012345678',
        username: 'PlayerOne',
        avatar: 'https://i.pravatar.cc/150?img=18',
        online: true,
        last_seen: new Date().toISOString()
      },
      {
        id: 'user-2',
        steam_id: '76561198087654321',
        username: 'PlayerTwo',
        avatar: 'https://i.pravatar.cc/150?img=50',
        online: false,
        last_seen: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'user-3',
        steam_id: '76561198123456789',
        username: 'PlayerThree',
        avatar: 'https://i.pravatar.cc/150?img=70',
        online: true,
        last_seen: new Date().toISOString()
      }
    ];

    // Фильтрация по поисковому запросу (только если q передан)
    let filteredUsers = mockUsers;
    if (q && q.trim()) {
      filteredUsers = mockUsers.filter(user => 
        user.username.toLowerCase().includes(q.toLowerCase())
      );
    }

    // Пагинация
    const paginatedUsers = filteredUsers.slice(offset, offset + parseInt(limit));

    res.json({
      users: paginatedUsers,
      total: filteredUsers.length
    });
  } catch (error) {
    console.error('User search error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      }
    });
  }
});

/**
 * @swagger
 * /users/{user_id}:
 *   get:
 *     summary: Получение профиля пользователя
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Профиль пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 steam_id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 avatar:
 *                   type: string
 *                 balance:
 *                   type: number
 *                 online:
 *                   type: boolean
 *                 last_seen:
 *                   type: string
 *                   format: date-time
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 stats:
 *                   type: object
 *                   properties:
 *                     total_trades:
 *                       type: integer
 *                     successful_trades:
 *                       type: integer
 *                     items_count:
 *                       type: integer
 *       404:
 *         description: Пользователь не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:user_id', authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.params;

    // Mock данные пользователя
    const user = {
      id: user_id,
      steam_id: '76561198012345678',
      username: 'PlayerOne',
      avatar: 'https://i.pravatar.cc/150?img=44',
      balance: 1500,
      online: true,
      last_seen: new Date().toISOString(),
      created_at: new Date(Date.now() - 86400000 * 30).toISOString(), // 30 дней назад
      stats: {
        total_trades: 45,
        successful_trades: 42,
        items_count: 156
      }
    };

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      }
    });
  }
});

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Получение своего профиля
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Профиль текущего пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 steam_id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 avatar:
 *                   type: string
 *                 balance:
 *                   type: number
 *                 email:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 settings:
 *                   type: object
 *                   properties:
 *                     notifications:
 *                       type: boolean
 *                     trade_confirmations:
 *                       type: boolean
 *       401:
 *         description: Требуется аутентификация
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    // Mock данные текущего пользователя
    const user = {
      id: req.user.id,
      steam_id: req.user.steam_id,
      username: 'CurrentUser',
      avatar: 'https://i.pravatar.cc/150?img=40',
      balance: 2500,
      email: 'user@example.com',
      created_at: new Date(Date.now() - 86400000 * 60).toISOString(), // 60 дней назад
      settings: {
        notifications: true,
        trade_confirmations: true
      }
    };

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      }
    });
  }
});

module.exports = router;