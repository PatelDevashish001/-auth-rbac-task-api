const Task = require('../models/Task');
const User = require('../models/User');

const getAdminDashboard = async (req, res, next) => {
  try {
    const [totalUsers, totalTasks, completedTasks] = await Promise.all([
      User.countDocuments(),
      Task.countDocuments(),
      Task.countDocuments({ completed: true })
    ]);

    return res.status(200).json({
      success: true,
      message: 'Admin dashboard data fetched successfully',
      data: {
        users: {
          total: totalUsers
        },
        tasks: {
          total: totalTasks,
          completed: completedTasks,
          pending: totalTasks - completedTasks
        }
      }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAdminDashboard
};
