const Notification = require('../models/Notification');

const createNotification = async ({ userId, type, title, body, data = {} }) => {
  return Notification.create({ userId, type, title, body, data });
};

module.exports = { createNotification };
