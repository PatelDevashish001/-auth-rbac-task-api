const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

const apiBaseUrl =
  process.env.API_BASE_URL ||
  process.env.RENDER_EXTERNAL_URL ||
  `http://localhost:${process.env.PORT || 5000}`;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Backend Developer Intern API',
      version: '1.0.0',
      description: 'REST API with JWT auth, role-based access control, and task management'
    },
    servers: [
      {
        url: apiBaseUrl,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Local development server'
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
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com'
            },
            password: {
              type: 'string',
              minLength: 6,
              example: 'SecurePass123'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com'
            },
            password: {
              type: 'string',
              example: 'SecurePass123'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '65f1a9ab1234abcd5678ef90'
            },
            email: {
              type: 'string',
              example: 'user@example.com'
            },
            role: {
              type: 'string',
              enum: ['USER', 'ADMIN'],
              example: 'USER'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        TaskCreateRequest: {
          type: 'object',
          required: ['title'],
          properties: {
            title: {
              type: 'string',
              example: 'Finish assignment'
            },
            description: {
              type: 'string',
              example: 'Implement auth and task CRUD'
            },
            completed: {
              type: 'boolean',
              example: false
            }
          }
        },
        TaskUpdateRequest: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              example: 'Updated task title'
            },
            description: {
              type: 'string',
              example: 'Updated description'
            },
            completed: {
              type: 'boolean',
              example: true
            }
          }
        },
        Task: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '65f1a9ab1234abcd5678ef91'
            },
            title: {
              type: 'string',
              example: 'Finish assignment'
            },
            description: {
              type: 'string',
              example: 'Implement auth and task CRUD'
            },
            completed: {
              type: 'boolean',
              example: false
            },
            user: {
              oneOf: [
                { type: 'string', example: '65f1a9ab1234abcd5678ef90' },
                {
                  type: 'object',
                  properties: {
                    _id: { type: 'string' },
                    email: { type: 'string' },
                    role: { type: 'string', enum: ['USER', 'ADMIN'] }
                  }
                }
              ]
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Invalid credentials'
            }
          }
        }
      }
    }
  },
  apis: [path.join(__dirname, '../routes/*.js')]
};

module.exports = swaggerJsdoc(options);
