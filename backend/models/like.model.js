const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Like = sequelize.define('Like', {
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
      allowNull: true,
      field: 'post_id',
      references: {
        model: 'posts',
        key: 'id'
      }
    },
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'comment_id',
      references: {
        model: 'comments',
        key: 'id'
      }
    }
  }, {
    tableName: 'likes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false  // Tắt updatedAt vì không có cột này trong database
  });

  Like.associate = (models) => {
    Like.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Like.belongsTo(models.Post, { foreignKey: 'post_id', as: 'post' });
    Like.belongsTo(models.Comment, { foreignKey: 'comment_id', as: 'comment' });
  };

  return Like;
};