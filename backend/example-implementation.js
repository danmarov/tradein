const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100,
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests'
    }
  }
});
app.use('/api/', apiLimiter);

// JWT Authentication middleware
const authenticateToken = (req, res, next) => {
  console.log('🔐 authenticateToken called');
  console.log('🔑 JWT_SECRET:', process.env.JWT_SECRET);
  
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  console.log('🎫 Received token:', token);
  console.log('🎫 Token length:', token?.length);

  if (!token) {
    console.log('❌ No token provided');
    return res.status(401).json({ 
      error: { 
        code: 'AUTH_REQUIRED',
        message: 'Authentication required' 
      } 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    console.log('🔍 JWT verify result:');
    console.log('  - Error:', err?.message || 'none');
    console.log('  - User:', user);
    
    if (err) {
      console.log('❌ Token verification failed');
      return res.status(403).json({ 
        error: { 
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired token' 
        } 
      });
    }
    
    console.log('✅ Token verification success');
    req.user = user;
    next();
  });
};

// Mock database functions (в реальном проекте используйте ORM)
const mockDB = {
  users: new Map(),
  items: new Map(),
  trades: new Map(),
  transactions: new Map()
};

// Auth routes
app.post('/api/auth/login', [
  body('steam_id').notEmpty().isString(),
  body('steam_ticket').notEmpty().isString()
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

    const { steam_id, steam_ticket } = req.body;

    // В реальном проекте здесь будет валидация Steam ticket
    // const isValidTicket = await validateSteamTicket(steam_ticket);
    // if (!isValidTicket) {
    //   return res.status(401).json({ error: { code: 'INVALID_STEAM_TICKET' } });
    // }

    // Поиск или создание пользователя
    let user = mockDB.users.get(steam_id);
    if (!user) {
      user = {
        id: `user_${Date.now()}`,
        steam_id,
        username: `User_${steam_id.slice(-6)}`,
        avatar: `https://avatars.steamstatic.com/${steam_id}`,
        balance: 0,
        created_at: new Date().toISOString()
      };
      mockDB.users.set(steam_id, user);
    }

    const access_token = jwt.sign(
      { id: user.id, steam_id: user.steam_id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const refresh_token = jwt.sign(
      { id: user.id, type: 'refresh' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      access_token,
      refresh_token,
      user: {
        id: user.id,
        steam_id: user.steam_id,
        username: user.username,
        avatar: user.avatar,
        balance: user.balance,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      }
    });
  }
});

// User routes
app.get('/api/users/search', authenticateToken, async (req, res) => {
  try {
    const { q, limit = 20, offset = 0 } = req.query;

    if (!q) {
      return res.status(400).json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'Search query is required'
        }
      });
    }

    // Поиск пользователей (в реальном проекте - SQL запрос)
    const users = Array.from(mockDB.users.values())
      .filter(user => user.username.toLowerCase().includes(q.toLowerCase()))
      .slice(offset, offset + parseInt(limit))
      .map(user => ({
        id: user.id,
        steam_id: user.steam_id,
        username: user.username,
        avatar: user.avatar,
        online: Math.random() > 0.5, // Mock online status
        last_seen: new Date().toISOString()
      }));

    res.json({
      users,
      total: users.length
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

app.get('/api/users/me', authenticateToken, async (req, res) => {
  try {
    const user = mockDB.users.get(req.user.steam_id);
    
    if (!user) {
      return res.status(404).json({
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    res.json({
      id: user.id,
      steam_id: user.steam_id,
      username: user.username,
      avatar: user.avatar,
      balance: user.balance,
      email: `user${user.id}@example.com`, // Mock email
      created_at: user.created_at,
      settings: {
        notifications: true,
        trade_confirmations: true
      }
    });
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

// Inventory routes
app.get('/api/inventory/:user_id', authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.params;
    const { page = 1, limit = 50, search, rarity, type, sort = 'name_asc' } = req.query;

    // В реальном проекте - SQL запрос с фильтрами и пагинацией
    let items = Array.from(mockDB.items.values())
      .filter(item => item.user_id === user_id);

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
      items: paginatedItems.map(item => ({
        id: item.id,
        steam_item_id: item.steam_item_id,
        name: item.name,
        type: item.type,
        rarity: item.rarity,
        image: item.image,
        price: item.price,
        market_hash_name: item.market_hash_name,
        exterior: item.exterior,
        stattrak: item.stattrak,
        tradeable: item.tradeable,
        marketable: item.marketable
      })),
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

// Trade routes
app.post('/api/trades', [
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

    // Проверка существования получателя
    const recipient = Array.from(mockDB.users.values())
      .find(user => user.id === recipient_id);
    
    if (!recipient) {
      return res.status(404).json({
        error: {
          code: 'USER_NOT_FOUND',
          message: 'Recipient not found'
        }
      });
    }

    // Проверка доступности предметов
    const senderItems = items_to_give.map(id => 
      Array.from(mockDB.items.values())
        .find(item => item.id === id && item.user_id === req.user.id)
    );

    const recipientItems = items_to_receive.map(id => 
      Array.from(mockDB.items.values())
        .find(item => item.id === id && item.user_id === recipient_id)
    );

    if (senderItems.some(item => !item)) {
      return res.status(400).json({
        error: {
          code: 'ITEM_NOT_FOUND',
          message: 'Some items to give not found or not owned'
        }
      });
    }

    if (recipientItems.some(item => !item)) {
      return res.status(400).json({
        error: {
          code: 'ITEM_NOT_FOUND',
          message: 'Some items to receive not found or not owned'
        }
      });
    }

    // Проверка tradeable статуса
    if (senderItems.some(item => !item.tradeable) || 
        recipientItems.some(item => !item.tradeable)) {
      return res.status(400).json({
        error: {
          code: 'ITEM_NOT_TRADEABLE',
          message: 'Some items are not tradeable'
        }
      });
    }

    // Создание оффера
    const trade = {
      id: `trade_${Date.now()}`,
      sender_id: req.user.id,
      recipient_id,
      status: 'pending',
      items_to_give: senderItems.map(item => ({
        id: item.id,
        name: item.name,
        image: item.image,
        price: item.price
      })),
      items_to_receive: recipientItems.map(item => ({
        id: item.id,
        name: item.name,
        image: item.image,
        price: item.price
      })),
      total_value_give: senderItems.reduce((sum, item) => sum + (item.price || 0), 0),
      total_value_receive: recipientItems.reduce((sum, item) => sum + (item.price || 0), 0),
      message: message || '',
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 часа
    };

    mockDB.trades.set(trade.id, trade);

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

app.get('/api/trades', authenticateToken, async (req, res) => {
  try {
    const { type = 'all', status, page = 1, limit = 20 } = req.query;

    let trades = Array.from(mockDB.trades.values());

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

    // Пагинация
    const offset = (page - 1) * limit;
    const paginatedTrades = trades.slice(offset, offset + parseInt(limit));

    // Получение данных пользователей
    const tradesWithUsers = paginatedTrades.map(trade => {
      const sender = mockDB.users.get(trade.sender_id);
      const recipient = mockDB.users.get(trade.recipient_id);
      
      return {
        id: trade.id,
        sender: {
          id: sender?.id,
          username: sender?.username,
          avatar: sender?.avatar
        },
        recipient: {
          id: recipient?.id,
          username: recipient?.username,
          avatar: recipient?.avatar
        },
        status: trade.status,
        items_to_give: trade.items_to_give,
        items_to_receive: trade.items_to_receive,
        total_value_give: trade.total_value_give,
        total_value_receive: trade.total_value_receive,
        message: trade.message,
        created_at: trade.created_at,
        updated_at: trade.updated_at || trade.created_at
      };
    });

    res.json({
      trades: tradesWithUsers,
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

app.post('/api/trades/:trade_id/accept', authenticateToken, async (req, res) => {
  try {
    const { trade_id } = req.params;
    const trade = mockDB.trades.get(trade_id);

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
    mockDB.trades.set(trade_id, trade);

    // Здесь должна быть логика обмена предметами
    // В реальном проекте это будет транзакция в БД

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

// Balance routes
app.get('/api/balance', authenticateToken, async (req, res) => {
  try {
    const user = mockDB.users.get(req.user.steam_id);
    
    res.json({
      balance: user?.balance || 0,
      currency: 'USD'
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      }
    });
  }
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
