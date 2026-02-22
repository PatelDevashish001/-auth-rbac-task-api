const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    const user = await User.create({ email, password });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
    const token = jwt.sign(
      {
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        subject: user._id.toString(),
        expiresIn
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        expiresIn,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    return next(error);
  }
};

const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: 'ADMIN' }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
    const token = jwt.sign(
      {
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        subject: user._id.toString(),
        expiresIn
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Admin login successful',
      data: {
        token,
        expiresIn,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  login,
  adminLogin
};
