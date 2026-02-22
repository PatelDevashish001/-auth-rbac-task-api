const User = require('../models/User');
const logger = require('../utils/logger');

const DEFAULT_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL;
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD;
const SHOULD_SEED_DEFAULT_ADMIN = process.env.SEED_DEFAULT_ADMIN === 'true';

const ensureDefaultAdminUser = async () => {
  if (!SHOULD_SEED_DEFAULT_ADMIN) {
    return;
  }

  if (!DEFAULT_ADMIN_EMAIL || !DEFAULT_ADMIN_PASSWORD) {
    throw new Error('SEED_DEFAULT_ADMIN=true requires DEFAULT_ADMIN_EMAIL and DEFAULT_ADMIN_PASSWORD');
  }

  const existingUser = await User.findOne({ email: DEFAULT_ADMIN_EMAIL }).select('+password');

  if (!existingUser) {
    await User.create({
      email: DEFAULT_ADMIN_EMAIL,
      password: DEFAULT_ADMIN_PASSWORD,
      role: 'ADMIN'
    });

    logger.warn('Default admin user created');
    return;
  }

  let hasChanges = false;

  if (existingUser.role !== 'ADMIN') {
    existingUser.role = 'ADMIN';
    hasChanges = true;
  }

  const hasDefaultPassword = await existingUser.comparePassword(DEFAULT_ADMIN_PASSWORD);
  if (!hasDefaultPassword) {
    existingUser.password = DEFAULT_ADMIN_PASSWORD;
    hasChanges = true;
  }

  if (hasChanges) {
    await existingUser.save();
    logger.warn('Default admin user credentials synchronized');
  }

};

module.exports = {
  ensureDefaultAdminUser
};
