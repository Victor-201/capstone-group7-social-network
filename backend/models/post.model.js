const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Post = sequelize.define('Post', {
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
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    privacy: {
      type: DataTypes.ENUM('public', 'friends', 'private'),
      defaultValue: 'public'
    }
  }, {
    tableName: 'posts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Post.associate = (models) => {
    Post.belongsTo(models.User, { foreignKey: 'user_id', as: 'author' });
    Post.hasMany(models.Comment, { foreignKey: 'post_id', as: 'comments' });
    Post.hasMany(models.Like, { foreignKey: 'post_id', as: 'likes' });
    Post.hasMany(models.Media, { foreignKey: 'post_id', as: 'media' });
    Post.belongsToMany(models.Hashtag, { 
      through: 'post_hashtags', 
      foreignKey: 'post_id', 
      otherKey: 'hashtag_id',
      as: 'hashtags' 
    });
    Post.belongsToMany(models.User, { 
      through: 'saved_posts', 
      foreignKey: 'post_id', 
      otherKey: 'user_id',
      as: 'savedBy' 
    });
  };

  return Post;
};