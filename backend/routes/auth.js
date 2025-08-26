const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Mock database
const mockDB = {
  users: new Map(),
  tokens: new Map()
};

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Вход через Steam OAuth
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - steam_id
 *               - steam_ticket
 *             properties:
 *               steam_id:
 *                 type: string
 *                 description: Steam ID пользователя
 *               steam_ticket:
 *                 type: string
 *                 description: Steam ticket для валидации
 *     responses:
 *       200:
 *         description: Успешная аутентификация
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                 refresh_token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Ошибка валидации
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Неверные учетные данные
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', [
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
        id: uuidv4(),
        steam_id,
        username: `User_${steam_id.slice(-6)}`,
        avatar: `https://i.pravatar.cc/150?img=52`,
        balance: 1000, // Начальный баланс для тестирования
        created_at: new Date().toISOString()
      };
      mockDB.users.set(steam_id, user);
    }

    const access_token = jwt.sign(
      { id: user.id, steam_id: user.steam_id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    const refresh_token = jwt.sign(
      { id: user.id, type: 'refresh' },
      process.env.JWT_SECRET || 'your-secret-key',
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

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Обновление токена
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refresh_token
 *             properties:
 *               refresh_token:
 *                 type: string
 *                 description: Refresh token для обновления access token
 *     responses:
 *       200:
 *         description: Токен успешно обновлен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                 refresh_token:
 *                   type: string
 *       401:
 *         description: Неверный refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/refresh', [
  body('refresh_token').notEmpty().isString()
], async (req, res) => {
  console.log("REF")
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

    const { refresh_token } = req.body;

    jwt.verify(refresh_token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
      if (err || decoded.type !== 'refresh') {
        return res.status(401).json({
          error: {
            code: 'INVALID_TOKEN',
            message: 'Invalid refresh token'
          }
        });
      }

      const access_token = jwt.sign(
        { id: decoded.id, steam_id: decoded.steam_id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      const new_refresh_token = jwt.sign(
        { id: decoded.id, type: 'refresh' },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      res.json({
        access_token,
        refresh_token: new_refresh_token
      });
    });
  } catch (error) {
    console.error('Refresh token error:', error);
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
 * /auth/steam-openid:
 *   post:
 *     summary: Вход через Steam OpenID
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - steamId
 *               - username
 *               - avatar
 *               - profileUrl
 *             properties:
 *               steamId:
 *                 type: string
 *                 description: Steam ID пользователя
 *               username:
 *                 type: string
 *                 description: Имя пользователя Steam
 *               avatar:
 *                 type: string
 *                 description: URL аватара пользователя
 *               profileUrl:
 *                 type: string
 *                 description: URL профиля Steam
 *     responses:
 *       200:
 *         description: Успешная аутентификация через Steam OpenID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                 refresh_token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 */
router.post('/steam-openid', [
  body('steamId').notEmpty().isString(),
  body('username').notEmpty().isString(),
  body('avatar').notEmpty().isString(),
  // body('profileUrl').notEmpty().isString()
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

    const { steamId, username, avatar, profileUrl } = req.body;

    // Поиск или создание пользователя в моковой БД
    let user = mockDB.users.get(steamId);
    if (!user) {
      // Создаем нового пользователя с данными от Steam
      user = {
        id: uuidv4(),
        steam_id: steamId,
        username: username,
        avatar: avatar,
        balance: 1000, // Начальный баланс для тестирования
        created_at: new Date().toISOString(),
        profile_url: profileUrl
      };
      mockDB.users.set(steamId, user);
    } else {
      // Обновляем данные существующего пользователя
      user.username = username;
      user.avatar = avatar;
      user.profile_url = profileUrl;
      mockDB.users.set(steamId, user);
    }

    // Генерируем токены
    const access_token = jwt.sign(
      { id: user.id, steam_id: user.steam_id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    const refresh_token = jwt.sign(
      { id: user.id, type: 'refresh' },
      process.env.JWT_SECRET || 'your-secret-key',
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
    console.error('Steam OpenID login error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      }
    });
  }
});


module.exports = { router, mockDB };
