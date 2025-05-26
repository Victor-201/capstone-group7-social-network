import { DataTypes } from 'sequelize';

const Comment = (sequelize) => {
  const model = sequelize.define('Comment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    post_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
    },
    like_count: {
      type: DataTypes.INTEGER,
    },
    parent_comment_id: {
      type: DataTypes.UUID,
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

  model.associate = (models) => {
    model.belongsTo(models.UserInfo, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    model.belongsTo(models.Post, {
      foreignKey: 'post_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    model.belongsTo(models.Comment, {
      foreignKey: 'parent_comment_id',
      as: 'ParentComment',
      onDelete: 'SET NULL', // hoặc CASCADE nếu muốn xóa tất cả comment con
      onUpdate: 'CASCADE',
    });

    model.hasMany(models.Comment, {
      foreignKey: 'parent_comment_id',
      as: 'Replies',
      onDelete: 'CASCADE', // đảm bảo nếu comment cha bị xóa thì reply cũng bị xóa
      onUpdate: 'CASCADE',
    });
  };
  return model;
}
export default Comment;