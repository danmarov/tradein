const express = require('express');
const { body, validationResult } = require('express-validator');

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
 * /balance:
 *   get:
 *     summary: Получение баланса
 *     tags: [Balance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Баланс пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balance:
 *                   type: number
 *                 currency:
 *                   type: string
 *       401:
 *         description: Требуется аутентификация
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', authenticateToken, async (req, res) => {
 try {
   const randomBalance = Math.floor(Math.random() * 10000 * 100) / 100;
   
   const balance = {
     balance: randomBalance,
     currency: 'USD'
   };

   res.json(balance);
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

/**
 * @swagger
 * /deposit:
 *   post:
 *     summary: Создание депозита
 *     tags: [Balance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - payment_method
 *               - currency
 *             properties:
 *               amount:
 *                 type: number
 *                 minimum: 1
 *                 description: Сумма депозита
 *               payment_method:
 *                 type: string
 *                 enum: [card, crypto, paypal]
 *                 description: Способ оплаты
 *               currency:
 *                 type: string
 *                 enum: [USD, EUR, RUB]
 *                 description: Валюта
 *     responses:
 *       200:
 *         description: Депозит создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 amount:
 *                   type: number
 *                 currency:
 *                   type: string
 *                 payment_url:
 *                   type: string
 *                 status:
 *                   type: string
 *                   enum: [pending, completed, failed]
 *                 created_at:
 *                   type: string
 *                   format: date-time
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
router.post('/deposit', [
  authenticateToken,
  body('amount').isFloat({ min: 1 }),
  body('payment_method').isIn(['card', 'crypto', 'paypal']),
  body('currency').isIn(['USD', 'EUR', 'RUB'])
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

    const { amount, payment_method, currency } = req.body;

    // Mock создание депозита
    const deposit = {
      id: `deposit_${Date.now()}`,
      amount,
      currency,
      payment_url: `https://payment-gateway.com/pay/${Date.now()}`,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    res.json(deposit);
  } catch (error) {
    console.error('Create deposit error:', error);
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
 * /withdraw:
 *   post:
 *     summary: Создание вывода
 *     tags: [Balance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - payment_method
 *               - payment_details
 *             properties:
 *               amount:
 *                 type: number
 *                 minimum: 1
 *                 description: Сумма вывода
 *               payment_method:
 *                 type: string
 *                 enum: [card, crypto, paypal]
 *                 description: Способ вывода
 *               payment_details:
 *                 type: object
 *                 properties:
 *                   card_number:
 *                     type: string
 *                     description: Номер карты (для card)
 *                   crypto_address:
 *                     type: string
 *                     description: Крипто адрес (для crypto)
 *                   paypal_email:
 *                     type: string
 *                     format: email
 *                     description: PayPal email (для paypal)
 *     responses:
 *       200:
 *         description: Вывод создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 amount:
 *                   type: number
 *                 currency:
 *                   type: string
 *                 status:
 *                   type: string
 *                   enum: [pending, processing, completed, failed]
 *                 created_at:
 *                   type: string
 *                   format: date-time
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
 *       402:
 *         description: Недостаточно средств
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/withdraw', [
  authenticateToken,
  body('amount').isFloat({ min: 1 }),
  body('payment_method').isIn(['card', 'crypto', 'paypal']),
  body('payment_details').isObject()
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

    const { amount, payment_method, payment_details } = req.body;

    // Проверка баланса (mock)
    const currentBalance = 2500.75;
    if (amount > currentBalance) {
      return res.status(402).json({
        error: {
          code: 'INSUFFICIENT_BALANCE',
          message: 'Insufficient balance'
        }
      });
    }

    // Mock создание вывода
    const withdraw = {
      id: `withdraw_${Date.now()}`,
      amount,
      currency: 'USD',
      status: 'pending',
      created_at: new Date().toISOString()
    };

    res.json(withdraw);
  } catch (error) {
    console.error('Create withdraw error:', error);
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
 * /transactions:
 *   get:
 *     summary: История транзакций
 *     tags: [Balance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [deposit, withdraw, trade]
 *         description: Тип транзакции
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
 *         description: История транзакций
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       type:
 *                         type: string
 *                       amount:
 *                         type: number
 *                       currency:
 *                         type: string
 *                       status:
 *                         type: string
 *                       description:
 *                         type: string
 *                       created_at:
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
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;

    // Mock данные транзакций
    const mockTransactions = [
      {
        id: 'trans-1',
        type: 'deposit',
        amount: 100.00,
        currency: 'USD',
        status: 'completed',
        description: 'Card deposit',
        created_at: new Date().toISOString()
      },
      {
        id: 'trans-2',
        type: 'withdraw',
        amount: 50.00,
        currency: 'USD',
        status: 'completed',
        description: 'PayPal withdrawal',
        created_at: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'trans-3',
        type: 'trade',
        amount: 25.50,
        currency: 'USD',
        status: 'completed',
        description: 'Trade with PlayerOne',
        created_at: new Date(Date.now() - 172800000).toISOString()
      }
    ];

    let transactions = mockTransactions;

    // Фильтрация по типу
    if (type) {
      transactions = transactions.filter(trans => trans.type === type);
    }

    // Пагинация
    const offset = (page - 1) * limit;
    const paginatedTransactions = transactions.slice(offset, offset + parseInt(limit));

    res.json({
      transactions: paginatedTransactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: transactions.length,
        pages: Math.ceil(transactions.length / limit)
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      }
    });
  }
});

module.exports = router;
