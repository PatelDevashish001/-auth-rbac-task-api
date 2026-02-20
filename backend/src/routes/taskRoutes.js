const express = require('express');
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const authenticate = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const {
  taskIdValidator,
  createTaskValidator,
  updateTaskValidator
} = require('../validators/taskValidators');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Tasks
 *     description: Task management endpoints
 */

/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     summary: Create a task (authenticated)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskCreateRequest'
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Task created successfully
 *               data:
 *                 task:
 *                   _id: 65f1a9ab1234abcd5678ef91
 *                   title: Finish assignment
 *                   description: Implement auth and tasks
 *                   completed: false
 *                   user: 65f1a9ab1234abcd5678ef90
 *                   createdAt: 2026-01-01T10:00:00.000Z
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, createTaskValidator, validateRequest, createTask);

/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     summary: Get tasks (USER gets own tasks, ADMIN gets all)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tasks fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 tasks: []
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, getTasks);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   put:
 *     summary: Update a task (owner or ADMIN)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskUpdateRequest'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Task not found
 */
router.put(
  '/:id',
  authenticate,
  taskIdValidator,
  updateTaskValidator,
  validateRequest,
  updateTask
);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   delete:
 *     summary: Delete a task (owner or ADMIN)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       204:
 *         description: Task deleted
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Task not found
 */
router.delete('/:id', authenticate, taskIdValidator, validateRequest, deleteTask);

module.exports = router;
