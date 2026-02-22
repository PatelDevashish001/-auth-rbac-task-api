const express = require('express');
const { register, login } = require('../controllers/authController');
const validateRequest = require('../middlewares/validateRequest');
const { registerValidator, loginValidator } = require('../validators/authValidators');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: User registered successfully
 *               data:
 *                 user:
 *                   id: 65f1a9ab1234abcd5678ef90
 *                   email: user@example.com
 *                   role: USER
 *                   createdAt: 2026-01-01T10:00:00.000Z
 *       400:
 *         description: Validation failed
 *       409:
 *         description: User already exists
 */
router.post('/register', registerValidator, validateRequest, register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user and return JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Login successful
 *               data:
 *                 token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 expiresIn: 1h
 *                 user:
 *                   id: 65f1a9ab1234abcd5678ef90
 *                   email: user@example.com
 *                   role: USER
 *                   createdAt: 2026-01-01T10:00:00.000Z
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', loginValidator, validateRequest, login);

module.exports = router;
