const express = require('express');
const { query } = require('express-validator');

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
  req.user = { id: 'demo-user-id', steam_id: 'demo-steam-id' };
  next();
};

/**
 * @swagger
 * /inventory/{user_id}:
 *   get:
 *     summary: Получение инвентаря пользователя
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID пользователя
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
 *           default: 50
 *         description: Количество предметов на странице
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Поиск по названию предмета
 *       - in: query
 *         name: rarity
 *         schema:
 *           type: string
 *           enum: [Consumer Grade, Industrial Grade, Mil-Spec Grade, Restricted, Classified, Covert, Contraband]
 *         description: Фильтр по редкости
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [Rifle, SMG, Sniper Rifle, Shotgun, Pistol, Knife, Gloves, Other]
 *         description: Фильтр по типу предмета
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price_asc, price_desc, name_asc, name_desc]
 *           default: name_asc
 *         description: Сортировка
 *     responses:
 *       200:
 *         description: Инвентарь пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Item'
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
router.get('/:user_id', authenticateToken, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString(),
  query('rarity').optional().isString(),
  query('type').optional().isString(),
  query('sort').optional().isIn(['price_asc', 'price_desc', 'name_asc', 'name_desc'])
], async (req, res) => {
  try {
    const { user_id } = req.params;
    const { page = 1, limit = 50, search, rarity, type, sort = 'name_asc' } = req.query;

    // Mock данные инвентаря
    const mockItems = [
      {
        id: 'item-1',
        steam_item_id: '1234567890',
        name: 'AK-47 | Redline',
        type: 'Rifle',
        rarity: 'Classified',
        image: 'https://cdn.tradeit.gg/csgo%2FAWP%20-%20Printstream%20(Field-Tested)_182x182.webp',
        price: 45.50,
        market_hash_name: 'AK-47 | Redline (Field-Tested)',
        exterior: 'Field-Tested',
        stattrak: false,
        tradeable: true,
        marketable: true
      },
      {
        id: 'item-2',
        steam_item_id: '1234567891',
        name: 'AWP | Dragon Lore',
        type: 'Sniper Rifle',
        rarity: 'Covert',
        image: 'https://cdn.tradeit.gg/csgo%2FAWP%20-%20Printstream%20(Field-Tested)_182x182.webp',
        price: 2500.00,
        market_hash_name: 'AWP | Dragon Lore (Factory New)',
        exterior: 'Factory New',
        stattrak: false,
        tradeable: true,
        marketable: true
      },
      {
        id: 'item-3',
        steam_item_id: '1234567892',
        name: 'M4A4 | Howl',
        type: 'Rifle',
        rarity: 'Contraband',
        image: 'https://cdn.tradeit.gg/csgo%2FAWP%20-%20Printstream%20(Field-Tested)_182x182.webp',
        price: 1800.00,
        market_hash_name: 'M4A4 | Howl (Minimal Wear)',
        exterior: 'Minimal Wear',
        stattrak: true,
        tradeable: true,
        marketable: true
      },
      {
        id: 'item-4',
        steam_item_id: '1234567893',
        name: 'Karambit | Fade',
        type: 'Knife',
        rarity: 'Covert',
        image: 'https://cdn.tradeit.gg/csgo%2FAWP%20-%20Printstream%20(Field-Tested)_182x182.webp',
        price: 850.00,
        market_hash_name: 'Karambit | Fade (Factory New)',
        exterior: 'Factory New',
        stattrak: false,
        tradeable: true,
        marketable: true
      },
      {
        id: 'item-5',
        steam_item_id: '1234567894',
        name: 'USP-S | Kill Confirmed',
        type: 'Pistol',
        rarity: 'Classified',
        image: 'https://cdn.tradeit.gg/csgo%2FAWP%20-%20Printstream%20(Field-Tested)_182x182.webp',
        price: 12.50,
        market_hash_name: 'USP-S | Kill Confirmed (Field-Tested)',
        exterior: 'Field-Tested',
        stattrak: false,
        tradeable: true,
        marketable: true
      }
    ];

    let items = mockItems;

    // Применение фильтров
    if (search) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (rarity) {
      items = items.filter(item => item.rarity === rarity);
    }

    if (type) {
      items = items.filter(item => item.type === type);
    }

    // Сортировка
    items.sort((a, b) => {
      switch (sort) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    // Пагинация
    const offset = (page - 1) * limit;
    const paginatedItems = items.slice(offset, offset + parseInt(limit));

    res.json({
      items: paginatedItems,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: items.length,
        pages: Math.ceil(items.length / limit)
      }
    });
  } catch (error) {
    console.error('Get inventory error:', error);
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
 * /inventory/me:
 *   get:
 *     summary: Получение своего инвентаря
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *           default: 50
 *         description: Количество предметов на странице
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Поиск по названию предмета
 *       - in: query
 *         name: rarity
 *         schema:
 *           type: string
 *         description: Фильтр по редкости
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Фильтр по типу предмета
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Сортировка
 *     responses:
 *       200:
 *         description: Свой инвентарь
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Item'
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
router.get('/me', authenticateToken, async (req, res) => {
  try {
    // Используем тот же код, что и для получения инвентаря другого пользователя
    // но с ID текущего пользователя
    req.params.user_id = req.user.id;
    
    // Вызываем обработчик для получения инвентаря
    const originalUrl = req.url;
    req.url = `/${req.user.id}${req.url}`;
    
    // Рекурсивно вызываем тот же роут
    router.handle(req, res, () => {});
  } catch (error) {
    console.error('Get my inventory error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      }
    });
  }
});

module.exports = router;
