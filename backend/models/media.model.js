const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Media = sequelize.define('Media', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'post_id',
      references: {
        model: 'posts',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    mediaUrl: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'media_url'  // Tên cột thực tế trong database
    },
    type: {
      type: DataTypes.ENUM('image', 'video', 'audio', 'document'),
      allowNull: false,
      defaultValue: 'image'
    }
  }, {
    tableName: 'media',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false  // Không có cột updated_at trong SQL
  });

  Media.associate = (models) => {
    Media.belongsTo(models.Post, { foreignKey: 'post_id', as: 'post' });
    Media.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return Media;
};