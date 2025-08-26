const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Middleware для аутентификации
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      error: { 
        code: 'AUTH_REQUIRED',
        message: 'Authentication required' 
      } 
    });
  }

  // В реальном проекте здесь будет валидация JWT
  req.user = { id: 'demo-user-id', steam_id: 'demo-steam-id', username: 'DemoUser' };
  next();
};

// Mock database для торгов
const mockTrades = new Map();

/**
 * @swagger
 * /trades:
 *   post:
 *     summary: Создание торгового оффера
 *     tags: [Trades]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipient_id
 *               - items_to_give
 *               - items_to_receive
 *             properties:
 *               recipient_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID получателя оффера
 *               items_to_give:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Массив ID предметов для отправки
 *               items_to_receive:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Массив ID предметов для получения
 *               message:
 *                 type: string
 *                 maxLength: 500
 *                 description: Опциональное сообщение
 *     responses:
 *       201:
 *         description: Оффер успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trade'
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
 *       404:
 *         description: Пользователь или предметы не найдены
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', [
  authenticateToken,
  body('recipient_id').notEmpty().isString(),
  body('items_to_give').isArray().notEmpty(),
  body('items_to_receive').isArray().notEmpty(),
  body('message').optional().isString().isLength({ max: 500 })
], async (req, res) => {
  try {
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

    const { recipient_id, items_to_give, items_to_receive, message } = req.body;

    // Mock данные предметов
    const mockItems = {
      'item-1': {
        id: 'item-1',
        name: 'AK-47 | Redline',
        image: 'https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_ak47_cu_ak47_redline_light_large.png',
        price: 45.50
      },
      'item-2': {
        id: 'item-2',
        name: 'AWP | Dragon Lore',
        image: 'https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_awp_cu_awp_dragon_lore_light_large.png',
        price: 2500.00
      },
      'item-3': {
        id: 'item-3',
        name: 'M4A4 | Howl',
        image: 'https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_m4a1_cu_m4a4_howl_light_large.png',
        price: 1800.00
      }
    };

    // Проверка существования предметов
    const senderItems = items_to_give.map(id => mockItems[id]).filter(Boolean);
    const recipientItems = items_to_receive.map(id => mockItems[id]).filter(Boolean);

    if (senderItems.length !== items_to_give.length) {
      return res.status(400).json({
        error: {
          code: 'ITEM_NOT_FOUND',
          message: 'Some items to give not found'
        }
      });
    }

    if (recipientItems.length !== items_to_receive.length) {
      return res.status(400).json({
        error: {
          code: 'ITEM_NOT_FOUND',
          message: 'Some items to receive not found'
        }
      });
    }

    // Создание оффера
    const trade = {
      id: uuidv4(),
      sender_id: req.user.id,
      recipient_id,
      status: 'pending',
      items_to_give: senderItems,
      items_to_receive: recipientItems,
      total_value_give: senderItems.reduce((sum, item) => sum + (item.price || 0), 0),
      total_value_receive: recipientItems.reduce((sum, item) => sum + (item.price || 0), 0),
      message: message || '',
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 часа
    };

    mockTrades.set(trade.id, trade);

    res.status(201).json(trade);
  } catch (error) {
    console.error('Create trade error:', error);
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
 * /trades:
 *   get:
 *     summary: Получение истории торгов
 *     tags: [Trades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [sent, received, all]
 *           default: all
 *         description: Тип офферов
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, accepted, declined, cancelled, expired]
 *         description: Статус оффера
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Номер страницы
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Количество на странице
 *     responses:
 *       200:
 *         description: История торгов
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 trades:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       sender:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           username:
 *                             type: string
 *                           avatar:
 *                             type: string
 *                       recipient:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           username:
 *                             type: string
 *                           avatar:
 *                             type: string
 *                       status:
 *                         type: string
 *                       items_to_give:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Item'
 *                       items_to_receive:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Item'
 *                       total_value_give:
 *                         type: number
 *                       total_value_receive:
 *                         type: number
 *                       message:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       401:
 *         description: Требуется аутентификация
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', authenticateToken, [
  query('type').optional().isIn(['sent', 'received', 'all']),
  query('status').optional().isIn(['pending', 'accepted', 'declined', 'cancelled', 'expired']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const { type = 'all', status, page = 1, limit = 20 } = req.query;

    // Mock данные торгов
    const mockTradesData = [
      {
        id: 'trade-1',
        sender_id: 'user-1',
        recipient_id: 'user-2',
        status: 'pending',
        items_to_give: [
          {
            id: 'item-1',
            name: 'AK-47 | Redline',
            image: 'https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_ak47_cu_ak47_redline_light_large.png',
            price: 45.50
          }
        ],
        items_to_receive: [
          {
            id: 'item-2',
            name: 'AWP | Dragon Lore',
            image: 'https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_awp_cu_awp_dragon_lore_light_large.png',
            price: 2500.00
          }
        ],
        total_value_give: 45.50,
        total_value_receive: 2500.00,
        message: 'Trade offer for Dragon Lore',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'trade-2',
        sender_id: 'user-2',
        recipient_id: 'user-1',
        status: 'accepted',
        items_to_give: [
          {
            id: 'item-3',
            name: 'M4A4 | Howl',
            image: 'https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_m4a1_cu_m4a4_howl_light_large.png',
            price: 1800.00
          }
        ],
        items_to_receive: [
          {
            id: 'item-4',
            name: 'Karambit | Fade',
            image: 'https://steamcdn-a.akamaihd.net/apps/730/icons/econ/default_generated/weapon_knife_karambit_cu_karambit_fade_light_large.png',
            price: 850.00
          }
        ],
        total_value_give: 1800.00,
        total_value_receive: 850.00,
        message: 'Accepted trade',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString()
      }
    ];

    let trades = mockTradesData;

    // Фильтрация по типу
    if (type === 'sent') {
      trades = trades.filter(trade => trade.sender_id === req.user.id);
    } else if (type === 'received') {
      trades = trades.filter(trade => trade.recipient_id === req.user.id);
    }

    // Фильтрация по статусу
    if (status) {
      trades = trades.filter(trade => trade.status === status);
    }

    // Mock данные пользователей
    const mockUsers = {
      'user-1': { id: 'user-1', username: 'PlayerOne', avatar: 'https://avatars.steamstatic.com/76561198012345678' },
      'user-2': { id: 'user-2', username: 'PlayerTwo', avatar: 'https://avatars.steamstatic.com/76561198087654321' }
    };

    // Добавление данных пользователей
    const tradesWithUsers = trades.map(trade => ({
      id: trade.id,
      sender: mockUsers[trade.sender_id] || { id: trade.sender_id, username: 'Unknown', avatar: '' },
      recipient: mockUsers[trade.recipient_id] || { id: trade.recipient_id, username: 'Unknown', avatar: '' },
      status: trade.status,
      items_to_give: trade.items_to_give,
      items_to_receive: trade.items_to_receive,
      total_value_give: trade.total_value_give,
      total_value_receive: trade.total_value_receive,
      message: trade.message,
      created_at: trade.created_at,
      updated_at: trade.updated_at
    }));

    // Пагинация
    const offset = (page - 1) * limit;
    const paginatedTrades = tradesWithUsers.slice(offset, offset + parseInt(limit));

    res.json({
      trades: paginatedTrades,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: trades.length,
        pages: Math.ceil(trades.length / limit)
      }
    });
  } catch (error) {
    console.error('Get trades error:', error);
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
 * /trades/{trade_id}/accept:
 *   post:
 *     summary: Принятие оффера
 *     tags: [Trades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trade_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID торгового оффера
 *     responses:
 *       200:
 *         description: Оффер успешно принят
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
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
 *       403:
 *         description: Нет прав для принятия оффера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Оффер не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:trade_id/accept', authenticateToken, async (req, res) => {
  try {
    const { trade_id } = req.params;
    const trade = mockTrades.get(trade_id);

    if (!trade) {
      return res.status(404).json({
        error: {
          code: 'TRADE_NOT_FOUND',
          message: 'Trade not found'
        }
      });
    }

    if (trade.recipient_id !== req.user.id) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You can only accept trades sent to you'
        }
      });
    }

    if (trade.status !== 'pending') {
      return res.status(400).json({
        error: {
          code: 'INVALID_TRADE_STATUS',
          message: 'Trade is not in pending status'
        }
      });
    }

    // Обновление статуса
    trade.status = 'accepted';
    trade.updated_at = new Date().toISOString();
    mockTrades.set(trade_id, trade);

    res.json({
      success: true,
      message: 'Trade accepted successfully'
    });
  } catch (error) {
    console.error('Accept trade error:', error);
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
 * /trades/{trade_id}/decline:
 *   post:
 *     summary: Отклонение оффера
 *     tags: [Trades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trade_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID торгового оффера
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Опциональная причина отклонения
 *     responses:
 *       200:
 *         description: Оффер успешно отклонен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Требуется аутентификация
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Нет прав для отклонения оффера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Оффер не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:trade_id/decline', authenticateToken, async (req, res) => {
  try {
    const { trade_id } = req.params;
    const { reason } = req.body;
    const trade = mockTrades.get(trade_id);

    if (!trade) {
      return res.status(404).json({
        error: {
          code: 'TRADE_NOT_FOUND',
          message: 'Trade not found'
        }
      });
    }

    if (trade.recipient_id !== req.user.id) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You can only decline trades sent to you'
        }
      });
    }

    if (trade.status !== 'pending') {
      return res.status(400).json({
        error: {
          code: 'INVALID_TRADE_STATUS',
          message: 'Trade is not in pending status'
        }
      });
    }

    // Обновление статуса
    trade.status = 'declined';
    trade.updated_at = new Date().toISOString();
    mockTrades.set(trade_id, trade);

    res.json({
      success: true,
      message: 'Trade declined successfully'
    });
  } catch (error) {
    console.error('Decline trade error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      }
    });
  }
});

module.exports = router;
