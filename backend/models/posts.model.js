const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Post = sequelize.define('Post', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: 'user_infos',
        key: 'id'
      }
    },
    content: {
      type: DataTypes.STRING(3000),
    },
    access_modifier: {
      type: DataTypes.ENUM('public', 'private', 'friends'),
    },
    like_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    shared_post_id: {
      type: DataTypes.UUID,
      references: {
        model: 'posts',
        key: 'id'
      },
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  }, {
    tableName: 'posts',
    timestamps: false,
  });

  Post.associate = (models) => {
    Post.belongsTo(models.UserInfos, { foreignKey: 'user_id' });
    Post.belongsTo(models.Post, { foreignKey: 'shared_post_id' });
    Post.hasMany(models.PostMedia, { foreignKey: 'post_id' });
    Post.hasMany(models.Comment, { foreignKey: 'post_id' });
    Post.hasMany(models.Like, { foreignKey: 'post_id' });
  };

  return Post;
};
