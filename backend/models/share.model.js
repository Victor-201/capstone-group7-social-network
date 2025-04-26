const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Share = sequelize.define('Share', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'post_id',
      references: {
        model: 'posts',
        key: 'id'
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'content'
    },
    privacy: {
      type: DataTypes.ENUM('public', 'friends', 'private'),
      allowNull: false,
      defaultValue: 'public',
      field: 'privacy'
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    }
  }, {
    tableName: 'shares',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Share.associate = (models) => {
    Share.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Share.belongsTo(models.Post, { foreignKey: 'post_id', as: 'post' });
  };

  return Share;
};