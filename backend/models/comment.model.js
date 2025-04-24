const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Comment = sequelize.define('Comment', {
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
      allowNull: false
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'parent_id',
      references: {
        model: 'comments',
        key: 'id'
      }
    }
  }, {
    tableName: 'comments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.User, { foreignKey: 'user_id', as: 'author' });
    Comment.belongsTo(models.Post, { foreignKey: 'post_id', as: 'post' });
    Comment.belongsTo(models.Comment, { foreignKey: 'parent_id', as: 'parent' });
    Comment.hasMany(models.Comment, { foreignKey: 'parent_id', as: 'replies' });
    Comment.hasMany(models.Like, { foreignKey: 'comment_id', as: 'likes' });
  };

  return Comment;
};