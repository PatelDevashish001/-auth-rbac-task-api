const express = require('express');
const { getAdminDashboard } = require('../controllers/adminController');
const authenticate = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: Admin-only endpoints
 */

/**
 * @swagger
 * /api/v1/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard stats (ADMIN only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Admin dashboard data fetched successfully
 *               data:
 *                 users:
 *                   total: 10
 *                 tasks:
 *                   total: 20
 *                   completed: 8
 *                   pending: 12
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/dashboard', authenticate, authorizeRoles('ADMIN'), getAdminDashboard);

module.exports = router;
