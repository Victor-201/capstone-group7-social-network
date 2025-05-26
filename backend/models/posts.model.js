import { DataTypes } from 'sequelize';

const Post = (sequelize) => {
  const model = sequelize.define('Post', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
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

  model.associate = (models) => {
  model.belongsTo(models.UserInfo, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  model.belongsTo(models.Post, {
    foreignKey: 'shared_post_id',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });
  model.hasMany(models.PostMedia, {
    foreignKey: 'post_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  model.hasMany(models.Comment, {
    foreignKey: 'post_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  model.hasMany(models.Like, {
    foreignKey: 'post_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  model.hasMany(models.PostTag, {
    foreignKey: 'post_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};


  return model;
};

export default Post;