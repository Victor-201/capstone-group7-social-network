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
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'group_id',
      references: {
        model: 'groups',
        key: 'id'
      }
    }
  }, {
    tableName: 'posts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Post.associate = (models) => {
    Post.belongsTo(models.User, { foreignKey: 'user_id', as: 'author' });
    
    // Only associate with Group if it exists in models
    if (models.Group) {
      Post.belongsTo(models.Group, { foreignKey: 'group_id', as: 'group' });
    }
    
    Post.hasMany(models.Comment, { foreignKey: 'post_id', as: 'comments' });
    Post.hasMany(models.Like, { foreignKey: 'post_id', as: 'likes' });
    Post.hasMany(models.Media, { foreignKey: 'post_id', as: 'media' });
    
    if (models.Hashtag) {
      Post.belongsToMany(models.Hashtag, { 
        through: 'post_hashtags', 
        foreignKey: 'post_id', 
        otherKey: 'hashtag_id',
        as: 'hashtags' 
      });
    }
    
    Post.belongsToMany(models.User, { 
      through: 'saved_posts', 
      foreignKey: 'post_id', 
      otherKey: 'user_id',
      as: 'savedBy' 
    });
  };

  return Post;
};