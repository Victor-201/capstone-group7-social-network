const { Sequelize, Op } = require('sequelize');
require('dotenv').config();

// Cấu hình kết nối database
const sequelize = new Sequelize(
  process.env.DB_NAME || 'social_network',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: false, // Set true để debug SQL queries
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    timezone: '+07:00', // Timezone cho Việt Nam
    dialectOptions: {
      // Thêm tùy chọn để tránh lỗi datetime với giá trị '0000-00-00 00:00:00'
      dateStrings: true,
      typeCast: function (field, next) {
        if (field.type === 'DATETIME') {
          return field.string()
        }
        return next()
      }
    }
  }
);

// Kiểm tra kết nối
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Kết nối cơ sở dữ liệu thành công.');
    return true;
  } catch (error) {
    console.error('Không thể kết nối đến cơ sở dữ liệu:', error);
    return false;
  }
};

// Khởi tạo models
const initModels = () => {
  const models = {};
  
  // Import và khởi tạo model User
  models.User = require('../models/user.model')(sequelize);
  
  // Thêm các models khác ở đây
  
  return models;
};

// Đồng bộ database (Chỉ sử dụng trong môi trường development)
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('Database đã được đồng bộ hóa' + (force ? ' (Force)' : ''));
    return true;
  } catch (error) {
    console.error('Lỗi đồng bộ hóa database:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  Op,
  testConnection,
  initModels,
  syncDatabase
};