import { DataTypes } from 'sequelize';

const PostTag = (sequelize) => {
  const model = sequelize.define('PostTag', {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    post_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'PostTags',
    timestamps: false,
  });

  model.associate = (models) => {

  model.belongsTo(models.Post, {
    foreignKey: 'post_id',
    as: 'post',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  model.belongsTo(models.UserInfo, {
    foreignKey: 'user_id',
    as: 'user',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};
  return model;
};

export default PostTag;
