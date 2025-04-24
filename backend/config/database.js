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
  
  // Import và khởi tạo các models
  models.User = require('../models/user.model')(sequelize);
  models.Post = require('../models/post.model')(sequelize);
  models.Comment = require('../models/comment.model')(sequelize);
  models.Like = require('../models/like.model')(sequelize);
  models.Media = require('../models/media.model')(sequelize);
  models.Hashtag = require('../models/hashtag.model')(sequelize);
  models.Group = require('../models/group.model')(sequelize);
  
  // Tạo bảng trung gian cho many-to-many relationships
  const PostHashtag = sequelize.define('PostHashtag', {
    postId: {
      type: Sequelize.INTEGER,
      field: 'post_id',
      primaryKey: true,
      references: {
        model: 'posts',
        key: 'id'
      }
    },
    hashtagId: {
      type: Sequelize.INTEGER,
      field: 'hashtag_id',
      primaryKey: true,
      references: {
        model: 'hashtags',
        key: 'id'
      }
    }
  }, {
    tableName: 'post_hashtags',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  const SavedPost = sequelize.define('SavedPost', {
    userId: {
      type: Sequelize.INTEGER,
      field: 'user_id',
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    postId: {
      type: Sequelize.INTEGER,
      field: 'post_id',
      primaryKey: true,
      references: {
        model: 'posts',
        key: 'id'
      }
    }
  }, {
    tableName: 'saved_posts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
  models.PostHashtag = PostHashtag;
  models.SavedPost = SavedPost;
  
  // Thiết lập các associations (quan hệ) giữa các models
  Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });
  
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