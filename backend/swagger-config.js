const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fish TradeIt API',
      version: '1.0.0',
      description: 'API для торговой площадки скинами',
      contact: {
        name: 'Fish TradeIt Team',
        email: 'support@fishtradeit.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:4000/api/v1',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            steam_id: { type: 'string' },
            username: { type: 'string' },
            avatar: { type: 'string' },
            balance: { type: 'number' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Item: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            steam_item_id: { type: 'string' },
            name: { type: 'string' },
            type: { type: 'string' },
            rarity: { type: 'string' },
            image: { type: 'string' },
            price: { type: 'number' },
            market_hash_name: { type: 'string' },
            exterior: { type: 'string' },
            stattrak: { type: 'boolean' },
            tradeable: { type: 'boolean' },
            marketable: { type: 'boolean' }
          }
        },
        Trade: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            sender_id: { type: 'string', format: 'uuid' },
            recipient_id: { type: 'string', format: 'uuid' },
            status: { 
              type: 'string', 
              enum: ['pending', 'accepted', 'declined', 'cancelled', 'expired'] 
            },
            items_to_give: {
              type: 'array',
              items: { $ref: '#/components/schemas/Item' }
            },
            items_to_receive: {
              type: 'array',
              items: { $ref: '#/components/schemas/Item' }
            },
            total_value_give: { type: 'number' },
            total_value_receive: { type: 'number' },
            message: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            expires_at: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                code: { type: 'string' },
                message: { type: 'string' },
                details: { type: 'object' }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js', './server.js']
};

module.exports = swaggerJsdoc(options);
