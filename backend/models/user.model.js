const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 50]
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    fullName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'full_name'
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '/images/default-avatar.png'
    },
    coverImage: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'cover_image'
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'bio'
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'location'
    },
    workplace: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'workplace'
    },
    education: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'education'
    },
    relationship: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'relationship'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active'
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      allowNull: false,
      defaultValue: 'user'
    }
  }, {
    tableName: 'users',
    timestamps: false,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });

  User.associate = (models) => {
    // Posts
    User.hasMany(models.Post, { foreignKey: 'user_id', as: 'posts' });
    
    // Comments
    User.hasMany(models.Comment, { foreignKey: 'user_id', as: 'comments' });
    
    // Likes
    User.hasMany(models.Like, { foreignKey: 'user_id', as: 'likes' });
    
    // Groups
    User.hasMany(models.Group, { foreignKey: 'creator_id', as: 'createdGroups' });
    User.belongsToMany(models.Group, { 
      through: 'group_members',
      foreignKey: 'user_id',
      otherKey: 'group_id',
      as: 'groups' 
    });
    
    // Friendships
    User.belongsToMany(models.User, {
      through: models.Friendship,
      as: 'friends',
      foreignKey: 'user_id_1',
      otherKey: 'user_id_2'
    });

    User.belongsToMany(models.User, {
      through: models.Friendship,
      as: 'friendsOf',
      foreignKey: 'user_id_2',
      otherKey: 'user_id_1'
    });

    // Followers
    User.belongsToMany(models.User, {
      through: models.Follower,
      as: 'followers',
      foreignKey: 'followed_id',
      otherKey: 'follower_id'
    });

    User.belongsToMany(models.User, {
      through: models.Follower,
      as: 'following',
      foreignKey: 'follower_id',
      otherKey: 'followed_id'
    });

    // Saved posts
    User.belongsToMany(models.Post, { 
      through: 'saved_posts', 
      foreignKey: 'user_id', 
      otherKey: 'post_id',
      as: 'savedPosts' 
    });
  };

  User.prototype.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };

  return User;
};