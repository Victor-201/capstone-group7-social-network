const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Comment = sequelize.define('Comments', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    post_id: {
      type: DataTypes.UUID,
      references: {
        model: 'posts',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: 'user_infos',
        key: 'id'
      }
    },
    content: {
      type: DataTypes.TEXT,
    },
    like_count: {
      type: DataTypes.INTEGER,
    },
    parent_comment_id: {
      type: DataTypes.UUID,
      references: {
        model: 'comments',
        key: 'id'
      },
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  }, {
    tableName: 'comments',
    timestamps: false,
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.UserInfo, { foreignKey: 'user_id' });
    Comment.belongsTo(models.Post, { foreignKey: 'post_id' });
    Comment.belongsTo(models.Comment, { foreignKey: 'parent_comment_id' });
  };

  return Comment;
};
