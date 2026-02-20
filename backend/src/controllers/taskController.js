const Task = require('../models/Task');

const canAccessTask = (task, authUser) => authUser.role === 'ADMIN' || task.user.toString() === authUser.id;

const createTask = async (req, res, next) => {
  try {
    const { title, description, completed } = req.body;

    const task = await Task.create({
      title,
      description,
      completed,
      user: req.user.id
    });

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task }
    });
  } catch (error) {
    return next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    let tasks;

    if (req.user.role === 'ADMIN') {
      tasks = await Task.find().sort({ createdAt: -1 }).populate('user', 'email role');
    } else {
      tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    }

    return res.status(200).json({
      success: true,
      data: { tasks }
    });
  } catch (error) {
    return next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    if (!canAccessTask(task, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to modify this task'
      });
    }

    const updatableFields = ['title', 'description', 'completed'];
    updatableFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        task[field] = req.body[field];
      }
    });

    await task.save();

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: { task }
    });
  } catch (error) {
    return next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    if (!canAccessTask(task, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to delete this task'
      });
    }

    await task.deleteOne();

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask
};
